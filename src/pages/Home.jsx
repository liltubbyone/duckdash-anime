import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import RaceTrack from "@/components/duck-race/RaceTrack";
import MassRaceTrack from "@/components/duck-race/MassRaceTrack";
import BuyInModal from "@/components/duck-race/BuyInModal";
import AdminPanel from "@/components/duck-race/AdminPanel";
import RaceHistory from "@/components/duck-race/RaceHistory";
import WinnerOverlay from "@/components/duck-race/WinnerOverlay";
import Leaderboard from "@/components/duck-race/Leaderboard";
import DuckSprite, { AVAILABLE_COLORS } from "@/components/duck-race/DuckSprite";
import { Users, Zap, UserCircle, Sparkles } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [currentRace, setCurrentRace] = useState(null);
  const [entries, setEntries] = useState([]);
  const [allRaces, setAllRaces] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Race animation state
  const [isRacing, setIsRacing] = useState(false);
  const [progresses, setProgresses] = useState({});
  const [winnerEntry, setWinnerEntry] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [massRanked, setMassRanked] = useState([]);
  const animFrameRef = useRef(null);
  const speedsRef = useRef({});

  // Modal state
  const [buyInModal, setBuyInModal] = useState({ open: false, lane: null });

  // Load data
  const loadData = useCallback(async () => {
    const [races, entries, me] = await Promise.all([
      base44.entities.DuckRace.list("-created_date", 20),
      base44.entities.RaceEntry.list("-created_date", 100),
      base44.auth.me(),
    ]);

    setAllRaces(races);
    setAllEntries(entries);
    setUser(me);

    // Find current active race (waiting or racing)
    const active = races.find(r => r.status === "waiting" || r.status === "racing");
    setCurrentRace(active || null);
    if (active) {
      setEntries(entries.filter(e => e.race_id === active.id));
    } else {
      setEntries([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Payment redirect feedback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success") {
      toast({ title: "Payment successful! 🦆", description: "Your duck has joined the race." });
    } else if (payment === "cancelled") {
      toast({ title: "Payment cancelled", description: "Your buy-in was not completed.", variant: "destructive" });
    }
    if (payment) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubRace = base44.entities.DuckRace.subscribe((event) => {
      if (event.type === "create" || event.type === "update") {
        loadData();
      }
    });
    const unsubEntry = base44.entities.RaceEntry.subscribe((event) => {
      if (event.type === "create" || event.type === "update") {
        loadData();
      }
    });
    return () => { unsubRace(); unsubEntry(); };
  }, [loadData]);

  // Auto-start when all lanes filled (standard races only)
  useEffect(() => {
    if (
      currentRace &&
      !currentRace.is_mass_race &&
      currentRace.status === "waiting" &&
      entries.length >= currentRace.total_lanes &&
      !isRacing
    ) {
      setTimeout(() => startRaceAnimation(), 1000);
    }
  }, [entries.length, currentRace?.status]);

  const isAdmin = user?.role === "admin";

  // Buy in handler
  const handleBuyIn = (laneNumber) => {
    if (!currentRace || currentRace.status !== "waiting") return;
    if (entries.find(e => e.lane_number === laneNumber)) return;
    setBuyInModal({ open: true, lane: laneNumber });
  };

  const confirmBuyIn = async ({ playerName, duckName, duckColor, hat, glasses, clothes }) => {
    // Stripe checkout cannot run inside the builder preview iframe
    if (window.self !== window.top) {
      toast({
        title: "Checkout unavailable in preview",
        description: "Payments work only from the published app. Open the app in a new tab to buy in.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await base44.functions.invoke("create-checkout", {
        race_id: currentRace.id,
        preferred_lane: buyInModal.lane,
        player_name: playerName,
        duck_name: duckName,
        duck_color: duckColor,
        hat,
        glasses,
        clothes,
        user_id: user?.id,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast({
          title: "Checkout failed",
          description: res.data?.error || "Could not start checkout.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Checkout failed",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Race animation
  const startRaceAnimation = async () => {
    if (isRacing || entries.length < 2) return;

    setIsRacing(true);
    await base44.entities.DuckRace.update(currentRace.id, {
      status: "racing",
      race_started_at: new Date().toISOString(),
    });

    // Dynamic speed animation: each duck's speed fluctuates randomly every frame,
    // so positions shift constantly and the winner stays unpredictable until the end.
    // The first duck to actually cross the finish line wins.
    const durationMs = Math.max(3, currentRace.race_duration || 10) * 1000;
    const baseSpeed = 100 / durationMs;

    const localProgress = {};
    const speedState = {}; // tracks each duck's current fluctuating speed
    entries.forEach(e => {
      localProgress[e.lane_number] = 0;
      speedState[e.lane_number] = baseSpeed;
    });
    setProgresses({ ...localProgress });

    let lastTime = performance.now();
    let winner = null;

    const animate = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      entries.forEach(e => {
        // Occasionally change each duck's speed multiplier for surges / slowdowns
        if (Math.random() < 0.08) {
          speedState[e.lane_number] = baseSpeed * (0.4 + Math.random() * 1.3);
        }
        const speed = speedState[e.lane_number];
        localProgress[e.lane_number] = Math.min(100, Math.max(0, localProgress[e.lane_number] + speed * dt));
      });

      setProgresses({ ...localProgress });

      // First duck to cross the finish line is the winner
      if (!winner) {
        const crossed = entries.find(e => localProgress[e.lane_number] >= 100);
        if (crossed) winner = crossed;
      }

      if (winner) {
        finishRace(winner);
      } else {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const finishRace = async (winner) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setWinnerEntry(winner);
    setTimeout(() => setShowWinner(true), 800);

    await Promise.all([
      base44.entities.DuckRace.update(currentRace.id, {
        status: "finished",
        winner_lane: winner.lane_number,
        race_finished_at: new Date().toISOString(),
      }),
      base44.entities.RaceEntry.update(winner.id, { is_winner: true }),
    ]);

    setIsRacing(false);
    await loadData();
  };

  // Admin: create new race
  const handleNewRace = async (buyInAmount, totalLanes, duration, opts = {}) => {
    // Mark any existing waiting/racing races as finished
    if (currentRace && currentRace.status !== "finished") {
      await base44.entities.DuckRace.update(currentRace.id, { status: "finished" });
    }

    const newRace = await base44.entities.DuckRace.create({
      status: "waiting",
      total_lanes: opts.isMassRace ? (opts.participants?.length || 0) : totalLanes,
      buy_in_amount: buyInAmount,
      race_duration: duration,
      is_mass_race: opts.isMassRace || false,
      participants: opts.isMassRace ? opts.participants : [],
    });

    setProgresses({});
    setWinnerEntry(null);
    setShowWinner(false);
    setIsRacing(false);
    setMassRanked([]);
    await loadData();
  };

  // Mass race: start (sets status to racing; the canvas component runs the animation)
  const handleMassRaceStart = async () => {
    setIsRacing(true);
    await base44.entities.DuckRace.update(currentRace.id, {
      status: "racing",
      race_started_at: new Date().toISOString(),
    });
  };

  // Mass race: live positions reported by the canvas for the leaderboard
  const handleMassRacePositions = useCallback((top) => {
    setMassRanked(
      top.map(t => ({
        name: t.name,
        color: AVAILABLE_COLORS[t.colorIndex % AVAILABLE_COLORS.length],
        progress: (t.progress || 0) * 100,
      }))
    );
  }, []);

  // Mass race: finish (called by MassRaceTrack when a duck crosses the line)
  const handleMassRaceFinish = async (winnerName) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setWinnerEntry({ duck_name: winnerName, duck_color: "gold", lane_number: 0, player_name: winnerName });
    setTimeout(() => setShowWinner(true), 800);
    await base44.entities.DuckRace.update(currentRace.id, {
      status: "finished",
      winner_name: winnerName,
      race_finished_at: new Date().toISOString(),
    });
    setIsRacing(false);
    await loadData();
  };

  // Admin: manually start
  const handleStartRace = () => {
    if (entries.length >= 2) startRaceAnimation();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <DuckSprite color="gold" size={80} isRacing />
          <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const filledLanes = entries.length;
  const totalLanes = currentRace?.total_lanes || 6;
  const takenColors = entries.map(e => e.duck_color);
  const prizePool = filledLanes * (currentRace?.buy_in_amount || 0);

  // Live leaderboard ranking
  const rankedEntries = currentRace?.is_mass_race
    ? massRanked
    : [...entries]
        .sort((a, b) => (progresses[b.lane_number] || 0) - (progresses[a.lane_number] || 0))
        .map(e => ({
          name: e.duck_name,
          color: e.duck_color,
          progress: progresses[e.lane_number] || 0,
          hat: e.hat,
          glasses: e.glasses,
          clothes: e.clothes,
        }));
  const showLeaderboard = currentRace && rankedEntries.length > 0 && (isRacing || currentRace.status === "waiting");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.2 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Cherry blossom petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute text-pink-300/30 animate-float-down"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
              fontSize: `${12 + Math.random() * 14}px`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Profile link */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Link
            to="/customize"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white text-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Customize</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white text-sm transition-all"
          >
            <UserCircle className="w-4 h-4" />
            <span className="hidden sm:inline">My Profile</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <DuckSprite color="gold" size={48} />
            <h1 className="text-4xl md:text-6xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400">
              DUCK RACE
            </h1>
            <DuckSprite color="pink" size={48} />
          </div>
          <p className="text-white/40 text-sm tracking-[0.3em] uppercase">
            アヒルレース · Pick your duck · Win the race
          </p>
        </div>

        {/* Status bar */}
        {currentRace && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-sky-400" />
              <span className="text-white/80 text-sm">
                {currentRace.is_mass_race
                  ? `${currentRace.participants?.length || 0} Ducks`
                  : `${filledLanes}/${totalLanes} Ducks`}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-yellow-400">💰</span>
              <span className="text-white/80 text-sm">${currentRace.buy_in_amount} Buy-in</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-bold">${prizePool} Prize Pool</span>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              currentRace.status === "waiting"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : currentRace.status === "racing"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse"
                  : "bg-white/10 text-white/50 border border-white/10"
            }`}>
              {currentRace.status === "waiting"
                ? currentRace.is_mass_race ? "Ready to Race" : "Open for Buy-in"
                : currentRace.status === "racing" ? "Racing!" : "Finished"}
            </div>
          </div>
        )}

        {/* Live leaderboard */}
        {showLeaderboard && (
          <div className="mb-6">
            <Leaderboard ranked={rankedEntries} />
          </div>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Track */}
          <div>
            {currentRace ? (
              currentRace.is_mass_race ? (
                <MassRaceTrack
                  race={currentRace}
                  isRacing={isRacing}
                  onStart={handleMassRaceStart}
                  onFinish={handleMassRaceFinish}
                  onPositionsUpdate={handleMassRacePositions}
                />
              ) : (
                <RaceTrack
                  race={currentRace}
                  entries={entries}
                  progresses={progresses}
                  isRacing={isRacing}
                  winnerLane={currentRace.winner_lane}
                  onBuyIn={handleBuyIn}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <DuckSprite color="blue" size={100} />
                <h2 className="text-white/80 text-xl font-bold mt-4">No Active Race</h2>
                <p className="text-white/40 mt-2">
                  {isAdmin ? "Create a new race to get started!" : "Waiting for the admin to start a new race..."}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {isAdmin && (
              <AdminPanel
                race={currentRace}
                entriesCount={filledLanes}
                onStartRace={handleStartRace}
                onNewRace={handleNewRace}
                isRacing={isRacing}
              />
            )}
            <RaceHistory races={allRaces} allEntries={allEntries} />
          </div>
        </div>
      </div>

      {/* Buy-in modal */}
      <BuyInModal
        open={buyInModal.open}
        onClose={() => setBuyInModal({ open: false, lane: null })}
        laneNumber={buyInModal.lane}
        buyInAmount={currentRace?.buy_in_amount || 10}
        takenColors={takenColors}
        defaultName={user?.full_name || ""}
        defaultLoadout={user}
        onConfirm={confirmBuyIn}
      />

      {/* Winner overlay */}
      <WinnerOverlay
        winner={showWinner ? winnerEntry : null}
        onClose={() => setShowWinner(false)}
      />
    </div>
  );
}
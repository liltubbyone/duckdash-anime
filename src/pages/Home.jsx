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
import RacePreviewSlides from "@/components/duck-race/RacePreviewSlides";
import SocialShare from "@/components/duck-race/SocialShare";
import DuckSprite, { AVAILABLE_COLORS } from "@/components/duck-race/DuckSprite";
import { Users, Zap, UserCircle, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Home() {
  const { toast } = useToast();
  const [allRaces, setAllRaces] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRaceId, setSelectedRaceId] = useState(null);

  // Animation state for the currently selected race
  const [isRacing, setIsRacing] = useState(false);
  const [progresses, setProgresses] = useState({});
  const [winnerEntry, setWinnerEntry] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [massRanked, setMassRanked] = useState([]);
  const animFrameRef = useRef(null);
  const speedsRef = useRef({});
  const isRacingRef = useRef(false);

  // Modal state
  const [buyInModal, setBuyInModal] = useState({ open: false, lane: null });

  const loadData = useCallback(async () => {
    const [races, entries, me] = await Promise.all([
      base44.entities.DuckRace.list("-created_date", 50),
      base44.entities.RaceEntry.list("-created_date", 200),
      base44.auth.me(),
    ]);
    setAllRaces(races);
    setAllEntries(entries);
    setUser(me);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

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

  // Pre-select a race opened from a shared link (?race=<id>)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("race");
    if (shared) setSelectedRaceId(shared);
  }, []);

  // Cancel the animation loop if the user navigates away mid-race
  useEffect(() => {
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubRace = base44.entities.DuckRace.subscribe((event) => {
      if (event.type === "create" || event.type === "update") loadData();
    });
    const unsubEntry = base44.entities.RaceEntry.subscribe((event) => {
      if (event.type === "create" || event.type === "update") loadData();
    });
    return () => { unsubRace(); unsubEntry(); };
  }, [loadData]);

  // Derived: active races + the one being viewed + its entries
  const activeRaces = allRaces.filter(r => r.status === "waiting" || r.status === "racing");
  const currentRace = activeRaces.find(r => r.id === selectedRaceId) || activeRaces[0] || null;
  const entries = currentRace ? allEntries.filter(e => e.race_id === currentRace.id) : [];

  const isAdmin = user?.role === "admin";

  const resetAnimState = useCallback(() => {
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    isRacingRef.current = false;
    setIsRacing(false);
    setProgresses({});
    setMassRanked([]);
  }, []);

  // Select a race from the preview slides
  const handleSelectRace = (id) => {
    if (id === selectedRaceId) return;
    resetAnimState();
    setWinnerEntry(null);
    setShowWinner(false);
    setSelectedRaceId(id);
  };

  // Buy in handler
  const handleBuyIn = (laneNumber) => {
    if (!currentRace || currentRace.status !== "waiting") return;
    const dpl = currentRace.ducks_per_lane || 1;
    const count = entries.filter(e => e.lane_number === laneNumber).length;
    if (count >= dpl) return;
    setBuyInModal({ open: true, lane: laneNumber });
  };

  const confirmBuyIn = async ({ playerName, duckName, duckColor, hat, glasses, clothes, lane: chosenLane }) => {
    if (!currentRace) return;
    // Free race ($0 buy-in): skip checkout and add the duck directly
    if (!currentRace.buy_in_amount || currentRace.buy_in_amount <= 0) {
      try {
        let lane;
        if (currentRace.is_mass_race) {
          lane = 0;
        } else {
          const dpl = currentRace.ducks_per_lane || 1;
          const laneCount = {};
          entries.forEach(e => { laneCount[e.lane_number] = (laneCount[e.lane_number] || 0) + 1; });
          const hasRoom = (l) => (laneCount[l] || 0) < dpl;
          lane = chosenLane || buyInModal.lane;
          if (!lane || !hasRoom(lane)) {
            lane = 1;
            while (!hasRoom(lane) && lane <= currentRace.total_lanes) lane++;
          }
        }
        await base44.entities.RaceEntry.create({
          race_id: currentRace.id,
          lane_number: lane,
          player_name: playerName,
          duck_name: duckName,
          duck_color: duckColor,
          hat,
          glasses,
          clothes,
          user_id: user?.id,
          is_winner: false,
        });
        setBuyInModal({ open: false, lane: null });
        toast({ title: "You're in! 🦆", description: "Your duck has joined the race." });
      } catch (e) {
        toast({ title: "Could not join", description: e.message, variant: "destructive" });
      }
      return;
    }
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
        preferred_lane: currentRace.is_mass_race ? 0 : (chosenLane || buyInModal.lane),
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
        toast({ title: "Checkout failed", description: res.data?.error || "Could not start checkout.", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Checkout failed", description: e.message || "Please try again.", variant: "destructive" });
    }
  };

  // Race animation (lane mode)
  const startRaceAnimation = async (race = currentRace, raceEntries = entries) => {
    if (!race || isRacingRef.current || raceEntries.length < 2) return;

    isRacingRef.current = true;
    setIsRacing(true);
    await base44.entities.DuckRace.update(race.id, {
      status: "racing",
      race_started_at: new Date().toISOString(),
    });
    notifyRaceStart(race);

    const durationMs = Math.max(3, race.race_duration || 10) * 1000;
    const baseSpeed = 100 / durationMs;

    const localProgress = {};
    const speedState = {};
    raceEntries.forEach(e => {
      localProgress[e.id] = 0;
      speedState[e.id] = baseSpeed;
    });
    setProgresses({ ...localProgress });

    let lastTime = performance.now();
    let lastStateUpdate = 0;
    let winner = null;

    const animate = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      raceEntries.forEach(e => {
        if (Math.random() < 0.08) {
          speedState[e.id] = baseSpeed * (0.4 + Math.random() * 1.3);
        }
        localProgress[e.id] = Math.min(100, Math.max(0, localProgress[e.id] + speedState[e.id] * dt));
      });

      if (now - lastStateUpdate > 33) {
        setProgresses({ ...localProgress });
        lastStateUpdate = now;
      }

      if (!winner) {
        const crossed = raceEntries.find(e => localProgress[e.id] >= 100);
        if (crossed) winner = crossed;
      }

      if (winner) {
        setProgresses({ ...localProgress });
        finishRace(winner, race);
      } else {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const finishRace = async (winner, race = currentRace) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    isRacingRef.current = false;

    setWinnerEntry(winner);
    setTimeout(() => setShowWinner(true), 800);

    await Promise.all([
      base44.entities.DuckRace.update(race.id, {
        status: "finished",
        winner_lane: winner.lane_number,
        race_finished_at: new Date().toISOString(),
      }),
      base44.entities.RaceEntry.update(winner.id, { is_winner: true }),
    ]);

    setIsRacing(false);
    await loadData();
  };

  // Admin: create a new race (existing races stay open so several can run at once)
  const handleNewRace = async (buyInAmount, totalLanes, duration, opts = {}) => {
    const newRace = await base44.entities.DuckRace.create({
      status: "waiting",
      total_lanes: totalLanes,
      buy_in_amount: buyInAmount,
      race_duration: duration,
      is_mass_race: opts.isMassRace || false,
      participants: [],
      ducks_per_lane: opts.ducks_per_lane || 1,
      auto_start: opts.auto_start !== false,
      race_name: opts.race_name || "",
      prize_name: opts.prize_name || "",
      prize_image: opts.prize_image || "",
    });

    resetAnimState();
    setWinnerEntry(null);
    setShowWinner(false);
    setSelectedRaceId(newRace.id);
    await loadData();
  };

  // Mass race: start
  const handleMassRaceStart = async (race = currentRace) => {
    if (!race) return;
    isRacingRef.current = true;
    setIsRacing(true);
    await base44.entities.DuckRace.update(race.id, {
      status: "racing",
      race_started_at: new Date().toISOString(),
    });
    notifyRaceStart(race);
  };

  const handleMassRacePositions = useCallback((top) => {
    setMassRanked(
      top.map(t => ({ name: t.name, hex: t.hex, progress: (t.progress || 0) * 100 }))
    );
  }, []);

  const handleMassRaceFinish = async (winner) => {
    const winnerName = winner?.name || winner;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    isRacingRef.current = false;
    setWinnerEntry({ duck_name: winnerName, duck_hex: winner?.hex, duck_color: "gold", lane_number: 0, player_name: winner?.player_name || winnerName, hat: winner?.hat, glasses: winner?.glasses, clothes: winner?.clothes });
    setTimeout(() => setShowWinner(true), 800);
    await base44.entities.DuckRace.update(currentRace.id, {
      status: "finished",
      winner_name: winnerName,
      race_finished_at: new Date().toISOString(),
    });
    setIsRacing(false);
    await loadData();
  };

  // Email all participants that their race is starting (fire-and-forget)
  const notifyRaceStart = (race) => {
    if (!race) return;
    base44.functions.invoke("notify-race-start", { race_id: race.id }).catch(() => {});
  };

  // Admin: manually start any race (even before it's full) — from the preview slides or the panel
  const handleStartRace = async (raceId) => {
    const race = allRaces.find(r => r.id === raceId);
    if (!race) return;
    const raceEntries = allEntries.filter(e => e.race_id === raceId);
    if (raceEntries.length < 2) {
      toast({ title: "Need at least 2 ducks to start", variant: "destructive" });
      return;
    }
    if (selectedRaceId !== raceId) {
      resetAnimState();
      setWinnerEntry(null);
      setShowWinner(false);
      setSelectedRaceId(raceId);
    }
    if (race.is_mass_race) {
      await handleMassRaceStart(race);
    } else {
      await startRaceAnimation(race, raceEntries);
    }
  };

  // Auto-start the selected race when all spots are filled (unless admin set manual start)
  useEffect(() => {
    if (!currentRace || isRacing || currentRace.status !== "waiting") return;
    if (currentRace.auto_start === false) return;
    const capacity = currentRace.is_mass_race
      ? currentRace.total_lanes || 0
      : currentRace.total_lanes * (currentRace.ducks_per_lane || 1);
    if (capacity >= 2 && entries.length >= capacity) {
      if (currentRace.is_mass_race) {
        setTimeout(() => handleMassRaceStart(), 1000);
      } else {
        setTimeout(() => startRaceAnimation(), 1000);
      }
    }
  }, [currentRace?.id, currentRace?.status, entries.length, isRacing]);

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
  const takenColors = currentRace?.is_mass_race ? [] : entries.map(e => e.duck_color);
  const prizePool = filledLanes * (currentRace?.buy_in_amount || 0);
  const availableLanes = (() => {
    if (!currentRace || currentRace.is_mass_race) return [];
    const dpl = currentRace.ducks_per_lane || 1;
    const laneCount = {};
    entries.forEach(e => { laneCount[e.lane_number] = (laneCount[e.lane_number] || 0) + 1; });
    const list = [];
    for (let l = 1; l <= totalLanes; l++) {
      if ((laneCount[l] || 0) < dpl) list.push(l);
    }
    return list;
  })();

  const rankedEntries = currentRace?.is_mass_race
    ? massRanked
    : [...entries]
        .sort((a, b) => (progresses[b.id] || 0) - (progresses[a.id] || 0))
        .map(e => ({
          name: e.duck_name,
          color: e.duck_color,
          progress: progresses[e.id] || 0,
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

        {/* Preview slides (shown when several races are open at once) */}
        {activeRaces.length >= 2 && (
          <RacePreviewSlides
            races={activeRaces}
            allEntries={allEntries}
            selectedRaceId={currentRace?.id}
            onSelect={handleSelectRace}
            isAdmin={isAdmin}
            onStartRace={handleStartRace}
          />
        )}

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

        {/* Race name & prize */}
        {currentRace && (currentRace.race_name || currentRace.prize_name || currentRace.prize_image) && (
          <div className="flex items-center justify-center gap-3 mb-6">
            {currentRace.prize_image && (
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-yellow-500/40 shadow-lg shadow-yellow-500/10">
                <Image src={currentRace.prize_image} fittingType="fill" className="w-full h-full" />
              </div>
            )}
            <div className="text-center">
              {currentRace.race_name && (
                <p className="text-white font-bold text-lg">{currentRace.race_name}</p>
              )}
              {currentRace.prize_name && (
                <p className="text-yellow-300 text-sm">🏆 {currentRace.prize_name}</p>
              )}
            </div>
          </div>
        )}

        {/* Invite friends to fill empty lanes */}
        {currentRace && currentRace.status === "waiting" && (
          <div className="flex justify-center mb-6">
            <SocialShare raceId={currentRace.id} raceName={currentRace.race_name} />
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
                  entries={entries}
                  isRacing={isRacing}
                  isAdmin={isAdmin}
                  autoStart={currentRace.auto_start !== false}
                  onStart={handleMassRaceStart}
                  onJoin={() => setBuyInModal({ open: true, lane: null })}
                  onFinish={handleMassRaceFinish}
                  onPositionsUpdate={handleMassRacePositions}
                />
              ) : (
                <RaceTrack
                  race={currentRace}
                  entries={entries}
                  progresses={progresses}
                  isRacing={isRacing}
                  winnerEntryId={winnerEntry?.id || entries.find(e => e.is_winner)?.id}
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
                onStartRace={() => currentRace && handleStartRace(currentRace.id)}
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
        buyInAmount={currentRace?.buy_in_amount ?? 0}
        takenColors={takenColors}
        availableLanes={availableLanes}
        totalLanes={totalLanes}
        isMassRace={currentRace?.is_mass_race}
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
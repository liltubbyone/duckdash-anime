import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trophy, ArrowLeft, Users } from "lucide-react";
import LobbyBanner from "@/components/lobby/LobbyBanner";
import ParticipantGrid from "@/components/lobby/ParticipantGrid";
import HostPanel from "@/components/lobby/HostPanel";
import StartConfirmDialog, { CancelRaceDialog } from "@/components/lobby/StartConfirmDialog";
import CountdownOverlay from "@/components/lobby/CountdownOverlay";
import BuyInModal from "@/components/duck-race/BuyInModal";
import { raceCapacity, raceStatusKey } from "@/lib/raceView";
import DuckSprite from "@/components/duck-race/DuckSprite";

export default function RaceLobby() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [race, setRace] = useState(null);
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [buyIn, setBuyIn] = useState({ open: false, lane: null });
  const startingRef = useRef(false);

  const loadData = useCallback(async () => {
    try {
      const [races, ents, me] = await Promise.all([
        base44.entities.DuckRace.filter({ id: raceId }),
        base44.entities.RaceEntry.filter({ race_id: raceId }),
        base44.auth.me().catch(() => null),
      ]);
      setRace(races[0] || null);
      setEntries(ents);
      setUser(me);
    } catch (e) {
      /* keep lobby visible */
    } finally {
      setLoading(false);
    }
  }, [raceId]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const unsubRace = base44.entities.DuckRace.subscribe(() => loadData());
    const unsubEntry = base44.entities.RaceEntry.subscribe(() => loadData());
    return () => { unsubRace(); unsubEntry(); };
  }, [loadData]);

  // When the race goes live (and we're not the host mid-countdown), go watch it.
  useEffect(() => {
    if (!race || startingRef.current) return;
    if (race.status === "racing") navigate(`/?race=${race.id}`);
  }, [race?.status, race?.id, navigate]);

  const capacity = race ? raceCapacity(race) : 0;
  const entryCount = entries.length;
  const statusKey = race ? raceStatusKey(race, entryCount) : "finished";
  const isHost = user?.role === "admin";
  const joinedEntry = entries.find((e) => e.user_id === user?.id);
  const canJoin = race?.status === "waiting" && entryCount < capacity && !joinedEntry;
  const canLeave = !!joinedEntry && race?.status === "waiting";
  const canStart = isHost && entryCount >= 2 && race?.status === "waiting";

  const availableLanes = (() => {
    if (!race || race.is_mass_race) return [];
    const dpl = race.ducks_per_lane || 1;
    const laneCount = {};
    entries.forEach((e) => { laneCount[e.lane_number] = (laneCount[e.lane_number] || 0) + 1; });
    const list = [];
    for (let l = 1; l <= (race.total_lanes || 6); l++) if ((laneCount[l] || 0) < dpl) list.push(l);
    return list;
  })();
  const takenColors = race?.is_mass_race ? [] : entries.map((e) => e.duck_color);

  const handleStartConfirm = async () => {
    setConfirmOpen(false);
    if (!race || entryCount < 2) return;
    startingRef.current = true;
    setStarting(true);
    try {
      await base44.entities.DuckRace.update(race.id, { status: "racing", race_started_at: new Date().toISOString() });
      base44.functions.invoke("notify-race-start", { race_id: race.id }).catch(() => {});
      setCountdown(true);
    } catch (e) {
      toast({ title: "Could not start race", description: e.message, variant: "destructive" });
      startingRef.current = false;
      setStarting(false);
    }
  };

  const handleCountdownDone = () => {
    setCountdown(false);
    navigate(`/?race=${race.id}&start=1`);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/?race=${race.id}`;
    try { await navigator.clipboard.writeText(url); } catch {}
    toast({ title: "Race link copied", description: "Share it to fill the grid." });
  };

  const handleCancel = async () => {
    setCancelOpen(false);
    try {
      await base44.entities.RaceEntry.deleteMany({ race_id: race.id });
      await base44.entities.DuckRace.delete(race.id);
      toast({ title: "Race cancelled" });
      navigate("/");
    } catch (e) {
      toast({ title: "Could not cancel", description: e.message, variant: "destructive" });
    }
  };

  const handleLeave = async () => {
    if (!joinedEntry) return;
    try {
      await base44.entities.RaceEntry.delete(joinedEntry.id);
      toast({ title: "You left the race" });
    } catch (e) {
      toast({ title: "Could not leave", description: e.message, variant: "destructive" });
    }
  };

  const confirmBuyIn = async ({ playerName, duckName, duckColor, hat, glasses, clothes, lane: chosenLane }) => {
    if (!race) return;
    if (!race.buy_in_amount || race.buy_in_amount <= 0) {
      try {
        let lane;
        if (race.is_mass_race) {
          lane = 0;
        } else {
          const dpl = race.ducks_per_lane || 1;
          const laneCount = {};
          entries.forEach((e) => { laneCount[e.lane_number] = (laneCount[e.lane_number] || 0) + 1; });
          const hasRoom = (l) => (laneCount[l] || 0) < dpl;
          lane = chosenLane || buyIn.lane;
          if (!lane || !hasRoom(lane)) { lane = 1; while (!hasRoom(lane) && lane <= race.total_lanes) lane++; }
        }
        await base44.entities.RaceEntry.create({ race_id: race.id, lane_number: lane, player_name: playerName, duck_name: duckName, duck_color: duckColor, hat, glasses, clothes, user_id: user?.id, is_winner: false });
        setBuyIn({ open: false, lane: null });
        toast({ title: "You're in! 🦆", description: "Your duck has joined the grid." });
      } catch (e) {
        toast({ title: "Could not join", description: e.message, variant: "destructive" });
      }
      return;
    }
    if (window.self !== window.top) {
      toast({ title: "Checkout unavailable in preview", description: "Open the published app to buy in.", variant: "destructive" });
      return;
    }
    try {
      const res = await base44.functions.invoke("create-checkout", { race_id: race.id, preferred_lane: race.is_mass_race ? 0 : (chosenLane || buyIn.lane), player_name: playerName, duck_name: duckName, duck_color: duckColor, hat, glasses, clothes, user_id: user?.id });
      if (res.data?.url) window.location.href = res.data.url;
      else toast({ title: "Checkout failed", description: res.data?.error || "Could not start checkout.", variant: "destructive" });
    } catch (e) {
      toast({ title: "Checkout failed", description: e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-6 h-6 text-brand-cyan animate-spin" /></div>;
  }

  if (!race) {
    return (
      <div className="text-center py-32">
        <DuckSprite color="blue" size={80} />
        <h1 className="text-xl font-bold text-white mt-4">Race not found</h1>
        <button onClick={() => navigate("/")} className="mt-5 text-brand-cyan font-semibold hover:underline">Back to dashboard</button>
      </div>
    );
  }

  // Finished state
  if (race.status === "finished") {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-brand-yellow/15 flex items-center justify-center mx-auto">
          <Trophy className="w-9 h-9 text-brand-yellow" />
        </div>
        <h1 className="text-2xl font-bold text-white mt-5">{race.race_name || "Race"} has finished</h1>
        <p className="text-slate-400 mt-2">The flock has crossed the finish line.</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => navigate(`/?race=${race.id}`)} className="h-11 px-6 rounded-[11px] bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold">View Results</button>
          <button onClick={() => navigate("/")} className="h-11 px-6 rounded-[11px] bg-white/[0.05] border border-white/10 text-slate-200 font-semibold">Dashboard</button>
        </div>
      </div>
    );
  }

  const empty = entryCount === 0;

  return (
    <div className="max-w-[1240px] mx-auto space-y-5">
      <button onClick={() => navigate("/")} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </button>

      <LobbyBanner
        race={race}
        entryCount={entryCount}
        capacity={capacity}
        statusKey={statusKey}
        canEdit={isHost}
        canLeave={canLeave}
        onEdit={() => navigate(`/?race=${race.id}`)}
        onShare={handleShare}
        onLeave={handleLeave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Participant grid */}
        <div className="duck-card p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-cyan" /> Starting Grid
            </h2>
            <span className="text-[12px] text-slate-400">{entryCount}/{capacity} racers</span>
          </div>

          {empty ? (
            <div className="text-center py-12">
              <DuckSprite color="gold" size={72} />
              <p className="text-white font-semibold mt-3">Your flock is waiting</p>
              <p className="text-slate-400 text-[13px] mt-1 max-w-xs mx-auto">Share the race link to fill the grid.</p>
              <button onClick={handleShare} className="mt-4 h-10 px-5 rounded-[10px] bg-white/[0.06] border border-white/10 text-[13px] font-semibold text-white hover:bg-white/[0.1] transition-all">Copy Invite Link</button>
            </div>
          ) : (
            <ParticipantGrid race={race} entries={entries} currentUser={user} />
          )}
        </div>

        {/* Host / info panel */}
        <div className="lg:sticky lg:top-6 h-fit">
          <HostPanel
            race={race}
            entryCount={entryCount}
            capacity={capacity}
            statusKey={statusKey}
            isHost={isHost}
            canStart={canStart}
            canJoin={canJoin}
            starting={starting}
            onStart={() => setConfirmOpen(true)}
            onCancel={() => setCancelOpen(true)}
            onShare={handleShare}
            onJoin={() => setBuyIn({ open: true, lane: null })}
          />
        </div>
      </div>

      <StartConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} race={race} entryCount={entryCount} onConfirm={handleStartConfirm} />
      <CancelRaceDialog open={cancelOpen} onOpenChange={setCancelOpen} race={race} onConfirm={handleCancel} />
      <CountdownOverlay active={countdown} onDone={handleCountdownDone} />

      <BuyInModal
        open={buyIn.open}
        onClose={() => setBuyIn({ open: false, lane: null })}
        laneNumber={buyIn.lane}
        buyInAmount={race?.buy_in_amount ?? 0}
        takenColors={takenColors}
        availableLanes={availableLanes}
        totalLanes={race?.total_lanes || 6}
        isMassRace={race?.is_mass_race}
        defaultName={user?.full_name || ""}
        defaultLoadout={user}
        onConfirm={confirmBuyIn}
      />
    </div>
  );
}
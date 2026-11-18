import React from "react";
import { Play, Trophy, Timer, Flag, Users, Zap, Share2, AlertTriangle, Loader2 } from "lucide-react";
import RaceStatusBadge from "@/components/shell/RaceStatusBadge";

export default function HostPanel({
  race,
  entryCount,
  capacity,
  statusKey,
  isHost,
  canStart,
  canJoin,
  starting,
  onStart,
  onCancel,
  onShare,
  onJoin,
}) {
  const isAuto = race.auto_start !== false;
  const startDisabled = !canStart || starting;
  const waiting = race.status === "waiting";

  return (
    <div className="duck-card-elevated panel-accent p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[11.5px] font-bold text-white uppercase tracking-[0.12em] flex items-center gap-2">
          <Flag className="w-4 h-4 text-brand-lime" /> {isHost ? "Host Controls" : "Race Info"}
        </h3>
        <RaceStatusBadge statusKey={statusKey} />
      </div>

      <div className="space-y-2.5">
        <Row icon={Users} label="Racers" value={`${entryCount}/${capacity}`} />
        <Row icon={Zap} label="Mode" value={race.is_mass_race ? "Mass" : "Lanes"} />
        <Row icon={Timer} label="Duration" value={`${race.race_duration}s`} />
        <Row icon={Flag} label="Start" value={isAuto ? "Auto (when full)" : "Manual"} />
        <Row icon={Trophy} label="Prize" value={race.prize_name || (race.buy_in_amount > 0 ? `$${race.buy_in_amount} entry` : "Free entry")} />
      </div>

      <button onClick={onShare} className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.05] border border-white/12 text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-200 hover:bg-white/[0.1] transition-all">
        <Share2 className="w-3.5 h-3.5" /> Copy Invite Link
      </button>

      {/* Auto-start condition */}
      {waiting && isAuto && (
        <div className="rounded-xl bg-brand-cyan/[0.07] border border-brand-cyan/25 px-4 py-3 text-[12px] text-slate-200">
          Starts automatically when <span className="score-num font-bold text-white">{capacity}/{capacity}</span> racers join.
        </div>
      )}

      {/* Host: manual start */}
      {isHost && waiting && !isAuto && (
        <>
          <button
            onClick={onStart}
            disabled={startDisabled}
            className="cta-esports w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-[11.5px] uppercase tracking-[0.14em] hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" strokeWidth={3} />}
            {starting ? "Starting…" : "Start Race"}
          </button>
          {!canStart && (
            <p className="text-[11px] text-slate-500 text-center">Need at least 2 racers to start.</p>
          )}
        </>
      )}

      {/* Participant: join */}
      {!isHost && canJoin && (
        <button
          onClick={onJoin}
          className="cta-esports w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-[11.5px] uppercase tracking-[0.14em] hover:-translate-y-[1px]"
        >
          Join Race{race.buy_in_amount > 0 ? ` · $${race.buy_in_amount}` : ""}
        </button>
      )}

      {/* Danger zone */}
      {isHost && waiting && (
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={onCancel}
            className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-lg bg-brand-red/10 border border-brand-red/20 text-[10.5px] font-bold uppercase tracking-[0.1em] text-brand-red hover:bg-brand-red/20 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Cancel Race
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <span className="text-[13px] font-semibold text-white truncate max-w-[58%] text-right">{value}</span>
    </div>
  );
}
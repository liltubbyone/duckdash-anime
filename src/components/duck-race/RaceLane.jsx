import React from "react";
import { Ticket } from "lucide-react";
import DuckSprite from "./DuckSprite";

const POSITION_LABELS = ["🥇", "🥈", "🥉"];

export default function RaceLane({ laneNumber, entries = [], progresses = {}, entryRank = {}, ducksPerLane = 1, isRacing, winnerEntryId, isLeaderLane, onBuyIn }) {
  const n = entries.length;
  const hasRoom = n < ducksPerLane;
  const showBuyIn = !isRacing && hasRoom;
  const duckSize = n <= 1 ? 52 : n === 2 ? 36 : n === 3 ? 28 : 22;
  const stepY = duckSize + 4;
  const laneHasWinner = entries.some(e => e.id === winnerEntryId);
  const single = entries[0];

  return (
    <div className={`relative w-full h-20 md:h-24 rounded-lg overflow-hidden border transition-all duration-300 ${
      laneHasWinner
        ? "border-brand-lime/70 ring-1 ring-brand-lime/40 shadow-[0_0_38px_-16px_hsl(var(--accent-lime)/0.85)]"
        : isLeaderLane
          ? "border-brand-cyan/50 ring-1 ring-brand-cyan/20"
          : "border-white/[0.07]"
    }`}>
      {/* Arena water lane */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, hsl(var(--surface-1)) 0%, hsl(var(--surface-2)) 52%, hsl(var(--surface-1)) 100%)",
        }}
      />
      <div
        className="absolute inset-0 animate-wave-slow opacity-[0.13]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100'%3E%3Cpath fill='%23ffffff' fill-opacity='0.5' d='M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,100 L0,100 Z'%3E%3C/path%3E%3C/svg%3E\")",
          backgroundSize: "400px 100%",
          backgroundRepeat: "repeat-x",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Lane number */}
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-md border border-white/10 bg-black/40 flex items-center justify-center">
        <span className="score-num text-[11px] text-slate-300">{laneNumber}</span>
      </div>

      {/* Finish line */}
      <div
        className="absolute right-12 top-0 bottom-0 w-1.5 opacity-60"
        style={{
          background:
            "repeating-linear-gradient(0deg, hsl(var(--accent-lime)) 0px, hsl(var(--accent-lime)) 4px, transparent 4px, transparent 8px)",
        }}
      />

      {/* Ducks (stacked vertically, each moves independently) */}
      {entries.map((entry, i) => {
        const prog = progresses[entry.id] || 0;
        const isWinner = entry.id === winnerEntryId;
        const rank = entryRank[entry.id];
        const showRank = isRacing && rank;
        return (
          <div
            key={entry.id}
            className="absolute z-10"
            style={{
              left: `${Math.min(8 + prog * 0.82, 90)}%`,
              top: "50%",
              transform: `translateY(calc(-50% + ${(i - (n - 1) / 2) * stepY}px))`,
            }}
          >
            <div className="relative">
              <DuckSprite color={entry.duck_color} hexColor={entry.duck_hex} size={duckSize} isRacing={isRacing} hat={entry.hat} glasses={entry.glasses} clothes={entry.clothes} />
              {showRank && (
                <div className="absolute -top-2 -left-2 score-num text-[11px] text-brand-lime drop-shadow">
                  {POSITION_LABELS[rank - 1] || `#${rank}`}
                </div>
              )}
              {isWinner && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg animate-bounce">👑</div>
              )}
            </div>
          </div>
        );
      })}

      {/* Empty lane: full-width buy-in (single-duck case) */}
      {n === 0 && showBuyIn && (
        <button
          onClick={onBuyIn}
          className="absolute inset-0 z-10 flex items-center justify-center hover:bg-brand-lime/[0.05] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2 px-3.5 h-9 rounded-lg border border-white/12 bg-white/[0.04] backdrop-blur-sm group-hover:border-brand-lime/45 group-hover:bg-brand-lime/10 transition-colors">
            <Ticket className="w-3.5 h-3.5 text-brand-lime" />
            <span className="t-label text-slate-400 group-hover:text-white">Buy In</span>
          </div>
        </button>
      )}

      {/* Occupied lane with room: compact join button */}
      {n > 0 && showBuyIn && (
        <button
          onClick={onBuyIn}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 h-7 rounded-md border border-white/12 bg-black/40 backdrop-blur-sm hover:border-brand-lime/45 hover:bg-brand-lime/10 transition-colors"
        >
          <span className="t-label text-slate-400">+ Join</span>
        </button>
      )}

      {/* Player name tag (single duck per lane preserves original display) */}
      {n === 1 && single && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          <div className={`px-2 py-1 rounded-md text-[10.5px] font-bold uppercase tracking-[0.08em] truncate max-w-[80px] border ${
            single.id === winnerEntryId
              ? "bg-brand-lime text-black border-brand-lime"
              : isLeaderLane
                ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/40"
                : "bg-black/45 backdrop-blur-sm text-slate-300 border-white/10"
          }`}>
            {single.duck_name}
          </div>
        </div>
      )}

      {/* Capacity indicator */}
      {ducksPerLane > 1 && (
        <div className="absolute top-1.5 right-1.5 z-20 score-num text-[10px] text-slate-500">
          {n}/{ducksPerLane}
        </div>
      )}
    </div>
  );
}
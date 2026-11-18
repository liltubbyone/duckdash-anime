import React from "react";
import { Crown } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";

export default function ParticipantTile({ entry, isCurrentUser, isHost, size = 56 }) {
  return (
    <div
      className={`relative rounded-xl p-2.5 flex flex-col items-center gap-1 border transition-all ${
        isCurrentUser
          ? "border-brand-lime/50 bg-brand-lime/[0.07] shadow-[0_0_20px_-8px_hsl(var(--accent-lime)/0.7)]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]"
      }`}
    >
      {isHost && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-yellow text-black flex items-center justify-center shadow-md shadow-brand-yellow/30">
          <Crown className="w-3 h-3" strokeWidth={2.6} />
        </span>
      )}
      <div className="rounded-full bg-gradient-to-b from-white/[0.06] to-transparent p-0.5">
        <DuckSprite
          color={entry?.duck_color || "gold"}
          size={size}
          hat={entry?.hat}
          glasses={entry?.glasses}
          clothes={entry?.clothes}
        />
      </div>
      <p className="text-[11px] font-semibold text-white truncate max-w-full">{entry?.duck_name || entry?.player_name || "Racer"}</p>
      <p className="text-[10px] text-slate-500 truncate max-w-full">{entry?.player_name || ""}</p>
      {isCurrentUser && <span className="text-[9px] font-bold text-brand-lime tracking-[0.14em]">YOU</span>}
    </div>
  );
}

export function EmptySlot({ label = "Open Slot" }) {
  return (
    <div className="rounded-xl p-2.5 flex flex-col items-center gap-1 border border-dashed border-white/[0.1] bg-white/[0.01]">
      <div className="rounded-full w-[60px] h-[60px] flex items-center justify-center text-slate-600">
        <span className="w-6 h-6 rounded-full border border-dashed border-slate-700" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600">{label}</p>
    </div>
  );
}
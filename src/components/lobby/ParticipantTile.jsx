import React from "react";
import { Crown } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";

export default function ParticipantTile({ entry, isCurrentUser, isHost, size = 56 }) {
  return (
    <div
      className={`relative rounded-[14px] p-2.5 flex flex-col items-center gap-1 border transition-all ${
        isCurrentUser
          ? "border-brand-cyan bg-brand-cyan/[0.06] ring-1 ring-brand-cyan/30"
          : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >
      {isHost && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-yellow text-black flex items-center justify-center">
          <Crown className="w-3 h-3" strokeWidth={2.4} />
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
      <p className="text-[10px] text-slate-400 truncate max-w-full">{entry?.player_name || ""}</p>
      {isCurrentUser && <span className="text-[9px] font-bold text-brand-cyan tracking-wide">YOU</span>}
    </div>
  );
}

export function EmptySlot({ label = "Open Slot" }) {
  return (
    <div className="rounded-[14px] p-2.5 flex flex-col items-center gap-1 border border-dashed border-white/[0.1] bg-white/[0.01]">
      <div className="rounded-full w-[60px] h-[60px] flex items-center justify-center text-slate-600">
        <span className="w-6 h-6 rounded-full border border-dashed border-slate-600" />
      </div>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}
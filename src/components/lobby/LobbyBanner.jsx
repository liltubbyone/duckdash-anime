import React from "react";
import { Pencil, Share2, LogOut } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import RaceStatusBadge from "@/components/shell/RaceStatusBadge";
import { environmentById } from "@/lib/raceArt";

export default function LobbyBanner({ race, entryCount, capacity, statusKey, canEdit, canLeave, onEdit, onShare, onLeave }) {
  const env = environmentById(race.theme);

  return (
    <div className="relative h-[160px] sm:h-[200px] lg:h-[220px] rounded-[20px] overflow-hidden border border-white/[0.14]">
      {/* Artwork */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(120% 100% at 72% 28%, ${env.palette[0]}50, transparent 60%),` +
            `radial-gradient(110% 90% at 25% 85%, ${env.palette[1]}35, transparent 55%),` +
            `linear-gradient(125deg, #0a1330, #04081a)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(228_42%_3%/0.94)] via-[hsl(228_42%_3%/0.55)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute right-4 sm:right-8 bottom-0 opacity-90">
        <DuckSprite color={env.duck} size={120} />
      </div>

      {/* HUD corners */}
      <span className="absolute top-3 left-3 w-3 h-3 border-l border-t border-brand-lime/40" />
      <span className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-brand-lime/40" />

      <div className="relative z-10 h-full flex flex-col justify-center max-w-[64%] px-5 lg:px-7">
        <div className="flex items-center gap-2 mb-2">
          <RaceStatusBadge statusKey={statusKey} />
          <span className="chip">
            {race.is_mass_race ? "Mass" : "Lanes"} · {entryCount}/{capacity}
          </span>
        </div>
        <h1 className="t-display text-white leading-[0.95] truncate">
          {race.race_name || "Untitled Race"}
        </h1>
        {race.prize_name && (
          <p className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-brand-yellow mt-2 truncate">
            Prize · {race.prize_name}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        {canEdit && (
          <button onClick={onEdit} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[hsl(226_38%_6%/0.75)] border border-white/15 text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-100 hover:bg-white/[0.12] backdrop-blur-md transition-all">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        )}
        <button onClick={onShare} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[hsl(226_38%_6%/0.75)] border border-white/15 text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-100 hover:bg-white/[0.12] backdrop-blur-md transition-all">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
        {canLeave && (
          <button onClick={onLeave} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand-red/15 border border-brand-red/25 text-[10.5px] font-bold uppercase tracking-[0.1em] text-brand-red hover:bg-brand-red/25 backdrop-blur-md transition-all">
            <LogOut className="w-3.5 h-3.5" /> Leave
          </button>
        )}
      </div>
    </div>
  );
}
import React from "react";
import { Pencil, Share2, LogOut } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import RaceStatusBadge from "@/components/shell/RaceStatusBadge";
import { environmentById } from "@/lib/raceArt";

export default function LobbyBanner({ race, entryCount, capacity, statusKey, canEdit, canLeave, onEdit, onShare, onLeave }) {
  const env = environmentById(race.theme);

  return (
    <div className="relative h-[150px] sm:h-[190px] lg:h-[210px] rounded-[18px] overflow-hidden border border-white/[0.16]">
      {/* Artwork */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(120% 100% at 72% 28%, ${env.palette[0]}50, transparent 60%),` +
            `radial-gradient(110% 90% at 25% 85%, ${env.palette[1]}35, transparent 55%),` +
            `linear-gradient(125deg, #0a1330, #050a1c)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(2,7,22,0.92)] via-[rgba(2,7,22,0.5)] to-transparent" />
      <div className="absolute right-4 sm:right-8 bottom-0 opacity-90">
        <DuckSprite color={env.duck} size={120} />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center max-w-[64%] px-5 lg:px-7">
        <div className="flex items-center gap-2 mb-1.5">
          <RaceStatusBadge statusKey={statusKey} />
          <span className="text-[11px] text-slate-300/80">{race.is_mass_race ? "Mass" : "Lanes"} · {entryCount}/{capacity} racers</span>
        </div>
        <h1 className="text-[20px] sm:text-[26px] lg:text-[30px] font-extrabold text-white tracking-tight leading-tight truncate">
          {race.race_name || "Untitled Race"}
        </h1>
        {race.prize_name && <p className="text-[12px] text-brand-yellow mt-1 truncate">🏆 {race.prize_name}</p>}
      </div>

      {/* Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        {canEdit && (
          <button onClick={onEdit} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[rgba(9,17,38,0.7)] border border-white/15 text-[12px] font-semibold text-slate-100 hover:bg-[rgba(22,33,67,0.85)] backdrop-blur-sm transition-all">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        )}
        <button onClick={onShare} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[rgba(9,17,38,0.7)] border border-white/15 text-[12px] font-semibold text-slate-100 hover:bg-[rgba(22,33,67,0.85)] backdrop-blur-sm transition-all">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
        {canLeave && (
          <button onClick={onLeave} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-brand-red/15 border border-brand-red/25 text-[12px] font-semibold text-brand-red hover:bg-brand-red/25 backdrop-blur-sm transition-all">
            <LogOut className="w-3.5 h-3.5" /> Leave
          </button>
        )}
      </div>
    </div>
  );
}
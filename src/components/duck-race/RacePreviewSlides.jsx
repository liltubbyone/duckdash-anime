import React from "react";
import { Image } from "@/components/ui/image";
import DuckSprite from "./DuckSprite";
import { Users, Zap, Play, Trash2 } from "lucide-react";

export default function RacePreviewSlides({ races, allEntries, selectedRaceId, onSelect, isAdmin, onStartRace, onDeleteRace }) {
  if (!races || races.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Active Races · tap to view & buy in</p>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {races.map(race => {
          const count = allEntries.filter(e => e.race_id === race.id).length;
          const capacity = race.is_mass_race
            ? (race.total_lanes || 0)
            : (race.total_lanes || 0) * (race.ducks_per_lane || 1);
          const selected = race.id === selectedRaceId;
          const prizePool = count * (race.buy_in_amount || 0);
          const canStart = isAdmin && race.status === "waiting" && count >= 2;

          return (
            <div
              key={race.id}
              onClick={() => onSelect(race.id)}
              className={`relative shrink-0 w-56 snap-start cursor-pointer text-left rounded-2xl overflow-hidden border transition-all ${
                selected ? "border-yellow-400/60 ring-2 ring-yellow-400/40" : "border-white/10 hover:border-white/30"
              } bg-gradient-to-b from-slate-800/80 to-slate-900/80`}
            >
              <div className="h-24 w-full bg-slate-950/60 relative">
                {race.prize_image ? (
                  <Image src={race.prize_image} fittingType="fill" className="w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <DuckSprite color="gold" size={56} />
                  </div>
                )}
                {isAdmin && onDeleteRace && (
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm("Delete this race and its entries?")) onDeleteRace(race.id); }}
                    className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white/80 hover:bg-red-500/70 flex items-center justify-center z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  race.status === "waiting" ? "bg-green-500/25 text-green-300" : "bg-orange-500/25 text-orange-300"
                }`}>
                  {race.status === "waiting" ? "Open" : "Racing"}
                </div>
              </div>
              <div className="p-3 space-y-1">
                <p className="text-white font-bold text-sm truncate">
                  {race.race_name || (race.is_mass_race ? "Mass Race" : "Duck Race")}
                </p>
                {race.prize_name && <p className="text-yellow-300 text-xs truncate">🏆 {race.prize_name}</p>}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-white/60 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" /> {count}/{capacity || "?"}
                  </span>
                  <span className="text-yellow-300 text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> ${prizePool}
                  </span>
                </div>
                {canStart && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onStartRace(race.id); }}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-green-500/20 text-green-300 border border-green-500/40 text-xs font-bold hover:bg-green-500/30"
                  >
                    <Play className="w-3 h-3" /> Start Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
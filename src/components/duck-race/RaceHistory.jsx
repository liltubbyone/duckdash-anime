import React from "react";
import { Trophy } from "lucide-react";
import DuckSprite from "./DuckSprite";
import moment from "moment";

export default function RaceHistory({ races, allEntries }) {
  const finishedRaces = races
    .filter(r => r.status === "finished")
    .sort((a, b) => new Date(b.race_finished_at) - new Date(a.race_finished_at))
    .slice(0, 5);

  if (finishedRaces.length === 0) return null;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-2 text-white/90 mb-4">
        <Trophy className="w-4 h-4 text-yellow-400" />
        <h3 className="font-bold text-sm uppercase tracking-wider">Race History</h3>
      </div>

      <div className="space-y-2">
        {finishedRaces.map(race => {
          const winner = allEntries.find(e => e.race_id === race.id && e.is_winner);
          const entryCount = allEntries.filter(e => e.race_id === race.id).length;
          return (
            <div key={race.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              {winner && <DuckSprite color={winner.duck_color} size={32} />}
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm font-medium truncate">
                  {winner?.duck_name || "Unknown"} <span className="text-white/40">won!</span>
                </p>
                <p className="text-white/40 text-xs">
                  {entryCount} racers · ${race.buy_in_amount} buy-in
                </p>
              </div>
              <span className="text-white/30 text-xs shrink-0">
                {moment(race.race_finished_at).fromNow()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
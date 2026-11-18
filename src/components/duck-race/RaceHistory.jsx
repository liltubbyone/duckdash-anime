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
    <div className="duck-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-3.5 h-3.5 text-brand-lime" />
        <h3 className="t-label text-slate-400">Race History</h3>
      </div>

      <div className="space-y-1.5">
        {finishedRaces.map(race => {
          const winner = allEntries.find(e => e.race_id === race.id && e.is_winner);
          const entryCount = allEntries.filter(e => e.race_id === race.id).length;
          return (
            <div key={race.id} className="flex items-center gap-3 p-2 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-colors">
              {winner && <DuckSprite color={winner.duck_color} size={30} />}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white/90 truncate">
                  {winner?.duck_name || "Unknown"} <span className="font-normal text-slate-500">took it</span>
                </p>
                <p className="t-meta text-slate-500">
                  <span className="score-num text-slate-400">{entryCount}</span> racers ·{" "}
                  <span className="score-num text-brand-yellow/80">${race.buy_in_amount}</span> buy-in
                </p>
              </div>
              <span className="t-meta text-slate-600 shrink-0">
                {moment(race.race_finished_at).fromNow()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import React from "react";
import RaceLane from "./RaceLane";

export default function RaceTrack({ race, entries, progresses, isRacing, winnerEntryId, onBuyIn }) {
  const totalLanes = race?.total_lanes || 6;
  const ducksPerLane = race?.ducks_per_lane || 1;
  const lanes = Array.from({ length: totalLanes }, (_, i) => i + 1);

  // Rank entries by independent progress (supports multiple ducks per lane)
  const ranked = [...entries].sort((a, b) => (progresses[b.id] || 0) - (progresses[a.id] || 0));
  const entryRank = {};
  ranked.forEach((e, idx) => { entryRank[e.id] = idx + 1; });
  const leaderEntry = isRacing && !winnerEntryId && ranked.length > 0 ? ranked[0] : null;
  const leaderLane = leaderEntry?.lane_number || null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Track header */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
          <span className="t-label text-slate-500">Start</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="t-label text-slate-500">Finish</span>
          <span
            className="w-2.5 h-3.5 opacity-70"
            style={{
              background:
                "repeating-linear-gradient(0deg, hsl(var(--text-primary)) 0px, hsl(var(--text-primary)) 2px, transparent 2px, transparent 4px)",
            }}
          />
        </div>
      </div>

      {/* Lanes */}
      <div className="space-y-1.5">
        {lanes.map(laneNum => {
          const laneEntries = entries.filter(e => e.lane_number === laneNum);
          return (
            <RaceLane
              key={laneNum}
              laneNumber={laneNum}
              entries={laneEntries}
              progresses={progresses}
              entryRank={entryRank}
              ducksPerLane={ducksPerLane}
              isRacing={isRacing}
              winnerEntryId={winnerEntryId}
              isLeaderLane={leaderLane === laneNum}
              onBuyIn={() => onBuyIn(laneNum)}
            />
          );
        })}
      </div>
    </div>
  );
}
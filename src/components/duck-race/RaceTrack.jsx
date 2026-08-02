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
    <div className="w-full max-w-4xl mx-auto space-y-2">
      {/* Track header */}
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/70 text-xs uppercase tracking-widest font-medium">Start</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs uppercase tracking-widest font-medium">Finish</span>
          <div className="w-3 h-3 rounded-full bg-red-400" />
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
import React from "react";
import RaceLane from "./RaceLane";

const POSITION_LABELS = ["🥇", "🥈", "🥉"];

export default function RaceTrack({ race, entries, progresses, isRacing, winnerLane, onBuyIn }) {
  const totalLanes = race?.total_lanes || 6;
  const lanes = Array.from({ length: totalLanes }, (_, i) => i + 1);

  // Compute live ranking of filled lanes by progress (descending)
  const ranked = [...entries]
    .sort((a, b) => (progresses[b.lane_number] || 0) - (progresses[a.lane_number] || 0));
  const laneRank = {};
  ranked.forEach((e, idx) => { laneRank[e.lane_number] = idx + 1; });
  const leaderLane = isRacing && !winnerLane && ranked.length > 0 ? ranked[0].lane_number : null;

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
          const entry = entries.find(e => e.lane_number === laneNum);
          return (
            <RaceLane
              key={laneNum}
              laneNumber={laneNum}
              entry={entry}
              progress={progresses[laneNum] || 0}
              isRacing={isRacing}
              isWinner={winnerLane === laneNum}
              isLeader={leaderLane === laneNum}
              position={laneRank[laneNum]}
              onBuyIn={() => onBuyIn(laneNum)}
            />
          );
        })}
      </div>
    </div>
  );
}
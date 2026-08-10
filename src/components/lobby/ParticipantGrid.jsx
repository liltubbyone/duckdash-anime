import React from "react";
import ParticipantTile, { EmptySlot } from "./ParticipantTile";

export default function ParticipantGrid({ race, entries, currentUser }) {
  const isMass = race.is_mass_race;
  const capacity = isMass ? race.total_lanes || 0 : (race.total_lanes || 0) * (race.ducks_per_lane || 1);
  const hostId = race.created_by_id;

  if (isMass) {
    const visible = Math.min(entries.length, 48);
    const shown = entries.slice(0, visible);
    const emptySlots = Math.max(0, Math.min(capacity, 48) - shown.length);
    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {shown.map((e) => (
            <ParticipantTile key={e.id} entry={e} isCurrentUser={e.user_id === currentUser?.id} isHost={e.user_id === hostId} />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => <EmptySlot key={`e${i}`} />)}
        </div>
        {entries.length > visible && (
          <p className="text-center text-[12px] text-slate-500 mt-3">
            +{entries.length - visible} more · {entries.length}/{capacity} racers joined
          </p>
        )}
        {entries.length <= visible && capacity > 0 && (
          <p className="text-center text-[12px] text-slate-500 mt-3">{entries.length}/{capacity} racers joined</p>
        )}
      </div>
    );
  }

  // Lane mode: organize by lane
  const lanes = race.total_lanes || 6;
  const dpl = race.ducks_per_lane || 1;
  return (
    <div className="space-y-3">
      {Array.from({ length: lanes }).map((_, laneIdx) => {
        const laneNum = laneIdx + 1;
        const laneEntries = entries.filter((e) => e.lane_number === laneNum);
        const empties = Math.max(0, dpl - laneEntries.length);
        return (
          <div key={laneNum} className="flex items-center gap-3">
            <div className="shrink-0 w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[12px] font-bold text-slate-300">
              {laneNum}
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {laneEntries.map((e) => (
                <ParticipantTile key={e.id} entry={e} isCurrentUser={e.user_id === currentUser?.id} isHost={e.user_id === hostId} size={48} />
              ))}
              {Array.from({ length: empties }).map((_, i) => <EmptySlot key={`e${laneNum}-${i}`} label="Open" />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
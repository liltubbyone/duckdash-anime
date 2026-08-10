import React from "react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import RaceStatusBadge from "@/components/shell/RaceStatusBadge";

const GRADIENTS = [
  "linear-gradient(135deg,#1e2a55,#0d1630)",
  "linear-gradient(135deg,#2a1e55,#0d1630)",
  "linear-gradient(135deg,#1e3a55,#0d1630)",
  "linear-gradient(135deg,#551e3a,#0d1630)",
  "linear-gradient(135deg,#1e5540,#0d1630)",
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

const COLORS = ["gold", "cyan", "pink", "green", "purple"];

export default function MobileRaceCard({ row, onSelect, onJoin, onWatch }) {
  const grad = GRADIENTS[hash(row.id || row.name) % GRADIENTS.length];
  const dc = COLORS[hash(row.id || row.name) % COLORS.length];
  const action = row.canWatch ? "Watch" : row.canJoin ? "Join" : null;

  return (
    <div
      onClick={() => onSelect(row.id)}
      className="duck-card p-3.5 cursor-pointer transition-all duration-200 hover:-translate-y-[1px] hover:border-white/[0.16]"
    >
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 rounded-[10px] overflow-hidden flex items-center justify-center"
          style={{ width: 46, height: 46, background: grad }}
        >
          <DuckSprite color={dc} size={28} />
        </div>
        <p className="t-card-title text-white truncate flex-1">{row.name}</p>
        <RaceStatusBadge statusKey={row.statusKey} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <Meta label="Mode" value={row.mode} />
        <Meta label="Racers" value={`${row.participantCount}/${row.capacity}`} />
        <Meta label="Prize" value={row.prizeName || (row.entryAmount > 0 ? `$${row.entryAmount}` : "—")} />
      </div>

      {action && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            row.canWatch ? onWatch(row.id) : onJoin(row.id);
          }}
          className="mt-3 w-full h-9 rounded-[9px] bg-gradient-to-r from-brand-pink to-brand-purple text-white text-[13px] font-semibold hover:brightness-110 transition-all"
        >
          {row.canWatch ? "Watch Race" : "Join Race"}
        </button>
      )}
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div className="rounded-[9px] bg-white/[0.03] py-1.5 px-1">
      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-[12px] text-slate-200 font-medium truncate">{value}</p>
    </div>
  );
}
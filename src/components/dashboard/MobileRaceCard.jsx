import React from "react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import RaceStatusBadge from "@/components/shell/RaceStatusBadge";

const GRADIENTS = [
  "linear-gradient(135deg,#16224d,#080d1f)",
  "linear-gradient(135deg,#231650,#080d1f)",
  "linear-gradient(135deg,#123348,#080d1f)",
  "linear-gradient(135deg,#451332,#080d1f)",
  "linear-gradient(135deg,#123f31,#080d1f)",
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
      className="duck-card relative overflow-hidden p-3.5 cursor-pointer transition-all duration-200 hover:-translate-y-[1px]"
    >
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center border border-white/[0.08]"
          style={{ width: 46, height: 46, background: grad }}
        >
          <DuckSprite color={dc} size={28} />
        </div>
        <p className="text-[14px] font-semibold text-white truncate flex-1">{row.name}</p>
        <RaceStatusBadge statusKey={row.statusKey} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <Meta label="Mode" value={row.mode} />
        <Meta label="Racers" value={`${row.participantCount}/${row.capacity}`} mono />
        <Meta label="Prize" value={row.prizeName || (row.entryAmount > 0 ? `$${row.entryAmount}` : "—")} />
      </div>

      {action && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            row.canWatch ? onWatch(row.id) : onJoin(row.id);
          }}
          className="cta-esports mt-3 w-full h-9 rounded-lg text-[11px] uppercase tracking-[0.12em]"
        >
          {row.canWatch ? "Watch Race" : "Join Race"}
        </button>
      )}
    </div>
  );
}

function Meta({ label, value, mono }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] py-1.5 px-1">
      <p className="text-[9px] text-slate-600 uppercase tracking-[0.12em] font-bold">{label}</p>
      <p className={`text-[12px] text-slate-200 font-semibold truncate ${mono ? "score-num" : ""}`}>{value}</p>
    </div>
  );
}
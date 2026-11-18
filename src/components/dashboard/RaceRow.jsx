import React from "react";
import { ChevronRight } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import RaceStatusBadge from "@/components/shell/RaceStatusBadge";
import { timeAgo } from "@/lib/raceView";

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

function ModePill({ mode }) {
  const mass = mode === "Mass";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] border ${
        mass
          ? "bg-brand-cyan/12 text-brand-cyan border-brand-cyan/30"
          : "bg-brand-purple/12 text-brand-purple border-brand-purple/30"
      }`}
    >
      {mode}
    </span>
  );
}

function Thumb({ row, size = 36 }) {
  const grad = GRADIENTS[hash(row.id || row.name) % GRADIENTS.length];
  const colors = ["gold", "cyan", "pink", "green", "purple"];
  const dc = colors[hash(row.id || row.name) % colors.length];
  return (
    <div
      className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center border border-white/[0.08]"
      style={{ width: size, height: size, background: grad }}
    >
      <DuckSprite color={dc} size={Math.round(size * 0.62)} />
    </div>
  );
}

export default function RaceRow({ row, onSelect }) {
  return (
    <tr
      onClick={() => onSelect(row.id)}
      className="group cursor-pointer border-b border-white/[0.05] transition-colors hover:bg-brand-lime/[0.04]"
    >
      <td className="py-3 pr-3">
        <div className="flex items-center gap-3 min-w-0">
          <Thumb row={row} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-white truncate">{row.name}</p>
            <p className="t-meta text-slate-500 truncate">
              {row.finishedAt ? `Finished ${timeAgo(row.finishedAt)}` : row.mode}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-3"><ModePill mode={row.mode} /></td>
      <td className="py-3 pr-3">
        <span className="score-num text-[13px] text-slate-200">
          {row.participantCount}
          <span className="text-slate-600">/{row.capacity}</span>
        </span>
      </td>
      <td className="py-3 pr-3 max-w-[180px]">
        <span className="text-[13px] text-slate-300 truncate block">
          {row.prizeName || (row.entryAmount > 0 ? `$${row.entryAmount} entry` : "—")}
        </span>
      </td>
      <td className="py-3 pr-3"><RaceStatusBadge statusKey={row.statusKey} /></td>
      <td className="py-3">
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-lime transition-colors" />
      </td>
    </tr>
  );
}
import React from "react";
import { ChevronRight } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import RaceStatusBadge from "@/components/shell/RaceStatusBadge";
import { timeAgo } from "@/lib/raceView";

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

function ModePill({ mode }) {
  const mass = mode === "Mass";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
        mass
          ? "bg-brand-blue/15 text-brand-blue border-brand-blue/30"
          : "bg-brand-purple/15 text-brand-purple border-brand-purple/30"
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
      className="shrink-0 rounded-[9px] overflow-hidden flex items-center justify-center"
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
      className="cursor-pointer border-b border-white/[0.05] transition-colors hover:bg-white/[0.04] hover:[&_td]:bg-white/[0.04]"
    >
      <td className="py-3 pr-3">
        <div className="flex items-center gap-3 min-w-0">
          <Thumb row={row} />
          <div className="min-w-0">
            <p className="t-card-title text-white truncate">{row.name}</p>
            <p className="t-meta text-slate-500">{row.finishedAt ? `Finished ${timeAgo(row.finishedAt)}` : row.mode}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-3"><ModePill mode={row.mode} /></td>
      <td className="py-3 pr-3">
        <span className="text-sm text-slate-300 tabular-nums">{row.participantCount}/{row.capacity}</span>
      </td>
      <td className="py-3 pr-3 max-w-[180px]">
        <span className="text-sm text-slate-300 truncate block">{row.prizeName || (row.entryAmount > 0 ? `$${row.entryAmount} entry` : "—")}</span>
      </td>
      <td className="py-3 pr-3"><RaceStatusBadge statusKey={row.statusKey} /></td>
      <td className="py-3"><ChevronRight className="w-4 h-4 text-slate-600" /></td>
    </tr>
  );
}
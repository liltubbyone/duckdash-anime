import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import DuckSprite from "@/components/duck-race/DuckSprite";

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

export default function SidebarRaceCard({ race }) {
  const grad = GRADIENTS[hash(race.id || race.name) % GRADIENTS.length];
  return (
    <div className="group flex items-center gap-3 rounded-[13px] border border-white/[0.07] p-2.5 bg-gradient-to-b from-surface-2 to-surface-1 transition-all duration-200 hover:-translate-y-[1px] hover:border-white/[0.16] cursor-pointer">
      <div
        className="relative w-[54px] h-[54px] rounded-[9px] overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: grad }}
      >
        <DuckSprite color={["gold", "cyan", "pink", "green", "purple"][hash(race.id || race.name) % 5]} size={30} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-white truncate">{race.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Users className="w-3 h-3 text-slate-500" />
          <span className="text-[11px] text-slate-400 tabular-nums">{race.count}/{race.cap}</span>
          <span className="text-[11px] text-slate-500">·</span>
          <span
            className={cn(
              "text-[11px] font-medium",
              race.status === "racing" ? "text-brand-green" : "text-slate-400"
            )}
          >
            {race.status === "racing" ? "Racing now..." : "Open for buy-in"}
          </span>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import DuckSprite from "@/components/duck-race/DuckSprite";

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

export default function SidebarRaceCard({ race }) {
  const grad = GRADIENTS[hash(race.id || race.name) % GRADIENTS.length];
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.07] p-2.5 bg-white/[0.02] transition-all duration-200 hover:-translate-y-[1px] hover:border-brand-lime/25 hover:bg-white/[0.05] cursor-pointer">
      <div
        className="relative w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-white/[0.08]"
        style={{ background: grad }}
      >
        <DuckSprite color={["gold", "cyan", "pink", "green", "purple"][hash(race.id || race.name) % 5]} size={28} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-white truncate">{race.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Users className="w-3 h-3 text-slate-600" />
          <span className="score-num text-[11px] text-slate-400">{race.count}/{race.cap}</span>
          <span className="text-[11px] text-slate-600">·</span>
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.08em]",
              race.status === "racing" ? "text-brand-lime" : "text-slate-500"
            )}
          >
            {race.status === "racing" ? "Racing" : "Open"}
          </span>
        </div>
      </div>
    </div>
  );
}
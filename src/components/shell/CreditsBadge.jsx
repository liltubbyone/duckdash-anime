import React from "react";
import { Coins } from "lucide-react";

export default function CreditsBadge({ credits }) {
  return (
    <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-surface-2/80 border border-white/10 backdrop-blur-md">
      <Coins className="w-4 h-4 text-brand-yellow" strokeWidth={2.2} />
      <span className="score-num text-[14px] text-white">{credits ?? 0}</span>
      <span className="t-label text-slate-500 hidden sm:inline">Credits</span>
    </div>
  );
}
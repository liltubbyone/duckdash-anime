import React from "react";
import { Coins } from "lucide-react";

export default function CreditsBadge({ credits }) {
  return (
    <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-surface-2 border border-white/10">
      <Coins className="w-4 h-4 text-brand-yellow" />
      <span className="text-sm font-semibold text-white tabular-nums">{credits ?? 0}</span>
      <span className="text-xs text-slate-400 hidden sm:inline">Credits</span>
    </div>
  );
}
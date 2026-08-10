import React from "react";
import { cn } from "@/lib/utils";

export default function RaceStatusBadge({ status, className }) {
  const map = {
    racing: { label: "LIVE", cls: "bg-brand-green/15 text-brand-green border-brand-green/30" },
    waiting: { label: "STARTING", cls: "bg-brand-blue/15 text-brand-blue border-brand-blue/30" },
    full: { label: "FULL", cls: "bg-brand-yellow/15 text-brand-yellow border-brand-yellow/30" },
    finished: { label: "FINISHED", cls: "bg-white/10 text-slate-400 border-white/15" },
  };
  const s = map[status] || map.finished;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        s.cls,
        status === "racing" && "animate-live-pulse",
        className
      )}
    >
      {status === "racing" && <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />}
      {s.label}
    </span>
  );
}
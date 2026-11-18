import React from "react";
import { cn } from "@/lib/utils";

const MAP = {
  live: { label: "LIVE", cls: "bg-brand-lime/12 text-brand-lime border-brand-lime/35" },
  starting: { label: "STARTING", cls: "bg-brand-cyan/12 text-brand-cyan border-brand-cyan/35" },
  open: { label: "OPEN", cls: "bg-brand-purple/12 text-brand-purple border-brand-purple/35" },
  full: { label: "FULL", cls: "bg-brand-yellow/12 text-brand-yellow border-brand-yellow/35" },
  finished: { label: "FINISHED", cls: "bg-white/[0.06] text-slate-400 border-white/12" },
  cancelled: { label: "CANCELLED", cls: "bg-brand-red/12 text-brand-red border-brand-red/35" },
};

export default function RaceStatusBadge({ statusKey, className }) {
  const s = MAP[statusKey] || MAP.finished;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-[3px] rounded-md text-[10px] font-bold uppercase tracking-[0.12em] border whitespace-nowrap",
        s.cls,
        className
      )}
    >
      {statusKey === "live" && <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-live-pulse" />}
      {s.label}
    </span>
  );
}
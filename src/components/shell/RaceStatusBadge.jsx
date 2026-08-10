import React from "react";
import { cn } from "@/lib/utils";

const MAP = {
  live: { label: "LIVE", cls: "bg-brand-green/15 text-brand-green border-brand-green/30" },
  starting: { label: "STARTING", cls: "bg-brand-blue/15 text-brand-blue border-brand-blue/30" },
  open: { label: "OPEN", cls: "bg-brand-purple/15 text-brand-purple border-brand-purple/30" },
  full: { label: "FULL", cls: "bg-brand-orange/15 text-brand-orange border-brand-orange/30" },
  finished: { label: "FINISHED", cls: "bg-white/[0.08] text-slate-400 border-white/15" },
  cancelled: { label: "CANCELLED", cls: "bg-brand-red/15 text-brand-red border-brand-red/30" },
};

export default function RaceStatusBadge({ statusKey, className }) {
  const s = MAP[statusKey] || MAP.finished;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap",
        s.cls,
        statusKey === "live" && "animate-live-pulse",
        className
      )}
    >
      {statusKey === "live" && <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />}
      {s.label}
    </span>
  );
}
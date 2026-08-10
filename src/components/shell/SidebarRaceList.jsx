import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarRaceCard from "./SidebarRaceCard";

export default function SidebarRaceList({ races, loading, error, onRetry }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Active Races
        </h3>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-green/15 border border-brand-green/30">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-live-pulse" />
          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Live</span>
        </span>
      </div>

      {loading ? (
        [0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-[13px] border border-white/[0.07] p-2.5 bg-surface-1/40"
          >
            <Skeleton className="w-[54px] h-[54px] rounded-[9px] bg-white/[0.06]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4 bg-white/[0.06]" />
              <Skeleton className="h-2.5 w-1/2 bg-white/[0.06]" />
            </div>
          </div>
        ))
      ) : error ? (
        <div className="rounded-[13px] border border-white/[0.07] p-4 text-center bg-surface-1/40">
          <p className="text-xs text-slate-400">Couldn't load races</p>
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-brand-cyan hover:underline"
          >
            Retry
          </button>
        </div>
      ) : races.length === 0 ? (
        <div className="rounded-[13px] border border-dashed border-white/[0.08] p-4 text-center">
          <p className="text-xs text-slate-500">No races running</p>
        </div>
      ) : (
        races.map((r) => <SidebarRaceCard key={r.id} race={r} />)
      )}
    </div>
  );
}
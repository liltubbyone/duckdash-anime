import React, { useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import RaceRow from "./RaceRow";
import MobileRaceCard from "./MobileRaceCard";

const TABS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
  { id: "finished", label: "Finished" },
];

function matchesTab(row, tab) {
  if (tab === "all") return true;
  if (tab === "live") return row.statusKey === "live";
  if (tab === "upcoming") return row.status === "waiting";
  if (tab === "finished") return row.status === "finished";
  return true;
}

export default function RaceActivityPanel({
  rows,
  loading,
  error,
  isAdmin,
  onSelect,
  onJoin,
  onWatch,
  onViewAll,
  onRetry,
}) {
  const [tab, setTab] = useState("all");
  const filtered = rows.filter((r) => matchesTab(r, tab));

  return (
    <div className="duck-card p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="t-section-title text-white">Race Activity</h3>
          <p className="t-meta text-slate-500 mt-0.5">Live, upcoming, and recently completed races.</p>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-cyan hover:underline"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mt-4 mb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              tab === t.id
                ? "bg-brand-blue/15 text-brand-cyan border border-brand-blue/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      {loading ? (
        <ActivitySkeleton />
      ) : error ? (
        <ErrorState onRetry={onRetry} />
      ) : filtered.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <colgroup>
                <col style={{ width: "34%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "4%" }} />
              </colgroup>
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-slate-500 border-b border-white/[0.07]">
                  <th className="py-2 pr-3 font-semibold">Race Name</th>
                  <th className="py-2 pr-3 font-semibold">Mode</th>
                  <th className="py-2 pr-3 font-semibold">Racers</th>
                  <th className="py-2 pr-3 font-semibold">Prize</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <RaceRow key={row.id} row={row} onSelect={onSelect} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2.5">
            {filtered.map((row) => (
              <MobileRaceCard
                key={row.id}
                row={row}
                onSelect={onSelect}
                onJoin={onJoin}
                onWatch={onWatch}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-white/[0.05]">
          <Skeleton className="w-9 h-9 rounded-[9px] bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3 bg-white/[0.06]" />
            <Skeleton className="h-2.5 w-1/4 bg-white/[0.06]" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tab }) {
  const copy =
    tab === "live"
      ? "No live races right now"
      : tab === "upcoming"
      ? "No upcoming races yet"
      : tab === "finished"
      ? "No completed races yet"
      : "No races yet";
  return (
    <div className="py-10 text-center">
      <p className="t-card-title text-white">{copy}</p>
      <p className="t-meta text-slate-500 mt-1">Create a race to get the action started.</p>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="py-10 text-center">
      <p className="t-card-title text-white">Couldn't load race activity</p>
      <button
        onClick={onRetry}
        className="mt-3 inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-white/[0.06] border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.1] transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  );
}
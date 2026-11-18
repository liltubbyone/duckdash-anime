import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroArtwork from "./HeroArtwork";
import { Play, ArrowRight, Plus, Settings, Eye, Users, Coins, Timer } from "lucide-react";

const STATE_LABEL = {
  live: "LIVE NOW",
  open: "OPEN FOR RACERS",
  full: "FULL",
  finished: "FINISHED",
};

const STATE_TONE = {
  live: "border-brand-lime/40 bg-brand-lime/10 text-brand-lime",
  open: "border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan",
  full: "border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow",
  finished: "border-white/15 bg-white/[0.06] text-slate-300",
};

function HudCorners() {
  const base = "absolute w-3 h-3 border-brand-lime/50";
  return (
    <>
      <span className={`${base} top-3 left-3 border-l border-t`} />
      <span className={`${base} top-3 right-3 border-r border-t`} />
      <span className={`${base} bottom-3 left-3 border-l border-b`} />
      <span className={`${base} bottom-3 right-3 border-r border-b`} />
    </>
  );
}

function HeroStat({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} strokeWidth={2.2} />
        <span className="t-label text-slate-500 truncate">{label}</span>
      </div>
      <span className="score-num text-[15px] text-white whitespace-nowrap">{value}</span>
    </div>
  );
}

export default function FeaturedRaceHero({
  featured,
  loading,
  isAdmin,
  onWatch,
  onJoin,
  onView,
  onManage,
  onCreate,
}) {
  if (loading) {
    return (
      <div className="relative h-[250px] lg:h-[330px] rounded-[22px] overflow-hidden border border-white/10">
        <Skeleton className="absolute inset-0 bg-surface-2" />
      </div>
    );
  }

  // Empty / onboarding state
  if (!featured) {
    return (
      <div className="relative min-h-[250px] lg:min-h-[330px] rounded-[22px] overflow-hidden border border-white/[0.12]">
        <HeroArtwork name="" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(228_42%_3%/0.95)] via-[hsl(228_42%_3%/0.6)] to-transparent" />
        <HudCorners />
        <div className="relative z-10 h-full flex flex-col justify-center max-w-[64%] px-6 py-8 lg:px-10">
          <span className="chip border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan w-fit">
            The Next Race Awaits
          </span>
          <h2 className="mt-3 t-display text-white">
            Your starting line is empty
          </h2>
          <p className="mt-2.5 text-sm text-slate-300/85 max-w-md leading-relaxed">
            Create your first race, invite your racers, and bring the arena to life.
          </p>
          {isAdmin ? (
            <button
              onClick={onCreate}
              className="cta-esports mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl text-[12.5px] uppercase tracking-[0.14em] w-fit hover:-translate-y-[1px]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.8} />
              Create Your First Race
            </button>
          ) : (
            <p className="mt-5 text-sm text-slate-400">
              Check back soon — new races appear here as soon as they open.
            </p>
          )}
        </div>
      </div>
    );
  }

  const label = STATE_LABEL[featured.statusKey] || "FEATURED RACE";
  const tone = STATE_TONE[featured.statusKey] || STATE_TONE.finished;
  const isLive = featured.statusKey === "live";
  const isOpen = featured.statusKey === "open";
  const isFull = featured.statusKey === "full";

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/[0.14] group">
      <HeroArtwork name={featured.name} />

      {/* Left dark gradient for text safety */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(228_42%_3%/0.96)] via-[hsl(228_42%_3%/0.62)] to-transparent" />
      {/* Bottom fade blending into dashboard */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
      <HudCorners />

      <div className="relative z-10 grid gap-6 p-6 lg:p-9 min-h-[260px] lg:min-h-[330px] items-end lg:grid-cols-[1fr_248px]">
        {/* Identity + actions */}
        <div className="min-w-0">
          <span className={`chip ${tone}`}>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-live-pulse" />}
            {label}
          </span>

          <h2 className="mt-3 t-display text-white line-clamp-2">
            {featured.name}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-slate-300/85">
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" strokeWidth={2.2} />
              <span className="score-num text-white">{featured.participantCount}</span>
              <span className="text-slate-500">/ {featured.capacity} racers</span>
            </span>
            <span className="h-3 w-px bg-white/15" />
            <span className="font-semibold tracking-wide">{featured.mode}</span>
            <span className="h-3 w-px bg-white/15" />
            <span className="font-semibold tracking-wide">
              {featured.entryAmount > 0 ? `$${featured.entryAmount} entry` : "Free entry"}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {isLive && (
              <HeroButton primary onClick={() => onWatch(featured.id)} icon={Play}>
                Watch Race
              </HeroButton>
            )}
            {isOpen && (
              <HeroButton primary onClick={() => onJoin(featured.id)} icon={ArrowRight}>
                Join Race
              </HeroButton>
            )}
            {(isFull || featured.statusKey === "finished") && (
              <HeroButton primary onClick={() => onView(featured.id)} icon={Eye}>
                View Race
              </HeroButton>
            )}

            <HeroButton secondary onClick={() => onView(featured.id)}>
              View Details
            </HeroButton>
            {isAdmin && (
              <HeroButton secondary onClick={() => onManage(featured.id)} icon={Settings}>
                Manage
              </HeroButton>
            )}
          </div>
        </div>

        {/* Scoreboard stack */}
        <div className="hidden lg:flex flex-col gap-2">
          <HeroStat icon={Users} label="Racers" value={`${featured.participantCount}/${featured.capacity}`} accent="hsl(var(--accent-cyan))" />
          <HeroStat icon={Coins} label="Entry" value={featured.entryAmount > 0 ? `$${featured.entryAmount}` : "FREE"} accent="hsl(var(--accent-yellow))" />
          <HeroStat icon={Timer} label="Format" value={featured.mode.toUpperCase()} accent="hsl(var(--accent-purple))" />
          {featured.prizeName && (
            <div className="px-3.5 py-2.5 rounded-xl border border-brand-yellow/25 bg-brand-yellow/[0.07] backdrop-blur-md">
              <p className="t-label text-brand-yellow/80">Prize</p>
              <p className="mt-0.5 text-[13px] font-semibold text-white truncate">{featured.prizeName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroButton({ primary, secondary, children, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        primary
          ? "cta-esports inline-flex items-center gap-2 h-[42px] px-5 rounded-xl text-[12.5px] uppercase tracking-[0.12em] hover:-translate-y-[1px]"
          : "inline-flex items-center gap-2 h-[42px] px-4 rounded-xl bg-white/[0.05] border border-white/15 text-slate-100 text-[12.5px] font-semibold uppercase tracking-[0.1em] hover:bg-white/[0.1] hover:border-white/25 hover:-translate-y-[1px] transition-all backdrop-blur-md"
      }
    >
      {Icon && <Icon className="w-4 h-4" strokeWidth={2.4} />}
      {children}
    </button>
  );
}
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroArtwork from "./HeroArtwork";
import { Play, ArrowRight, Plus, Settings, Eye } from "lucide-react";

const STATE_LABEL = {
  live: "LIVE NOW",
  open: "OPEN FOR RACERS",
  full: "FULL",
  finished: "FINISHED",
};

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
      <div className="relative h-[240px] lg:h-[330px] rounded-[20px] overflow-hidden border border-white/10">
        <Skeleton className="absolute inset-0 bg-surface-2" />
      </div>
    );
  }

  // Empty / onboarding state
  if (!featured) {
    return (
      <div className="relative h-[240px] lg:h-[330px] rounded-[20px] overflow-hidden border border-white/10">
        <HeroArtwork name="" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(2,7,22,0.92)] via-[rgba(2,7,22,0.55)] to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center max-w-[60%] px-6 lg:px-9">
          <span className="text-[11px] font-bold tracking-[0.16em] text-brand-cyan uppercase">
            The Next Race Awaits
          </span>
          <h2 className="mt-2 text-[26px] lg:text-[34px] font-extrabold tracking-tight text-white leading-tight">
            Your starting line is empty
          </h2>
          <p className="mt-2 text-sm text-slate-300/80 max-w-md">
            Create your first race, invite your racers, and bring the dashboard to life.
          </p>
          {isAdmin ? (
            <button
              onClick={onCreate}
              className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-[11px] bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue text-white text-[15px] font-semibold hover:-translate-y-[1px] hover:brightness-110 transition-all w-fit"
            >
              <Plus className="w-4 h-4" strokeWidth={2.4} />
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
  const isLive = featured.statusKey === "live";
  const isOpen = featured.statusKey === "open";
  const isFull = featured.statusKey === "full";

  const meta = [
    `${featured.participantCount}/${featured.capacity} racers`,
    featured.mode,
    featured.entryAmount > 0 ? `$${featured.entryAmount} entry` : "Free entry",
  ].filter(Boolean);
  if (featured.prizeName) meta.push(`Prize: ${featured.prizeName}`);

  return (
    <div className="relative h-[230px] sm:h-[260px] lg:h-[330px] rounded-[20px] overflow-hidden border border-white/[0.18] group">
      <HeroArtwork name={featured.name} />

      {/* Left dark gradient for text safety */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(2,7,22,0.94)] via-[rgba(2,7,22,0.55)] to-transparent" />
      {/* Bottom fade blending into dashboard */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-[48%] lg:max-w-[46%] px-6 lg:px-9">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="w-2 h-2 rounded-full bg-brand-green animate-live-pulse" />
          )}
          <span
            className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
              isLive ? "text-brand-green" : isOpen ? "text-brand-cyan" : "text-slate-300"
            }`}
          >
            {label}
          </span>
        </div>

        <h2 className="mt-2 text-[25px] sm:text-[30px] lg:text-[36px] font-extrabold tracking-tight text-white leading-[1.05] line-clamp-2">
          {featured.name}
        </h2>

        <p className="mt-2.5 text-[12px] sm:text-[13px] text-slate-300/85 leading-relaxed line-clamp-2">
          {meta.join("  ·  ")}
        </p>

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
    </div>
  );
}

function HeroButton({ primary, secondary, children, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        primary
          ? "inline-flex items-center gap-2 h-[44px] px-5 rounded-[10px] bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue text-white text-[15px] font-semibold hover:-translate-y-[1px] hover:brightness-110 transition-all"
          : "inline-flex items-center gap-2 h-[44px] px-4 rounded-[10px] bg-[rgba(9,17,38,0.6)] border border-white/15 text-slate-100 text-[14px] font-medium hover:bg-[rgba(22,33,67,0.8)] hover:border-white/25 hover:-translate-y-[1px] transition-all backdrop-blur-sm"
      }
    >
      {Icon && <Icon className="w-4 h-4" strokeWidth={2.2} />}
      {children}
    </button>
  );
}
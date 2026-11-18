import React from "react";
import CreditsBadge from "./CreditsBadge";
import ProfileMenu from "./ProfileMenu";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardHeader({ user, credits }) {
  return (
    <header className="hidden lg:flex sticky top-0 z-[35] h-[68px] items-center justify-between gap-3 px-8 bg-[hsl(228_42%_3%/0.72)] backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        <span className="chip border-brand-lime/30 bg-brand-lime/10 text-brand-lime">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-live-pulse" />
          Arena Online
        </span>
        <span className="h-4 w-px bg-white/10" />
        <p className="t-label text-slate-500">Competitive Duck Racing</p>
      </div>

      <div className="flex items-center gap-3">
        <CreditsBadge credits={credits} />
        {user ? (
          <ProfileMenu user={user} />
        ) : (
          <Skeleton className="w-10 h-10 rounded-full bg-white/[0.06]" />
        )}
      </div>
    </header>
  );
}
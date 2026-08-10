import React from "react";
import CreditsBadge from "./CreditsBadge";
import ProfileMenu from "./ProfileMenu";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardHeader({ user, credits }) {
  return (
    <header className="hidden lg:flex sticky top-0 z-[35] h-[72px] items-center justify-end gap-3 px-8 bg-[rgba(3,8,23,0.82)] backdrop-blur-xl border-b border-white/[0.07]">
      <CreditsBadge credits={credits} />
      {user ? (
        <ProfileMenu user={user} />
      ) : (
        <Skeleton className="w-10 h-10 rounded-full bg-white/[0.06]" />
      )}
    </header>
  );
}
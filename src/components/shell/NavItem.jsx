import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NavItem({ to, icon: Icon, label, active }) {
  return (
    <Link
      to={to}
      className={cn(
        "group relative flex items-center gap-3 h-[44px] px-3 rounded-lg text-[13.5px] font-semibold transition-all duration-150",
        active
          ? "text-brand-lime bg-brand-lime/[0.07]"
          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2.5px] rounded-full bg-brand-lime shadow-[0_0_10px_hsl(var(--accent-lime)/0.9)]" />
      )}
      <Icon
        className={cn("w-[17px] h-[17px] transition-colors", active ? "text-brand-lime" : "text-slate-500 group-hover:text-slate-300")}
        strokeWidth={2}
      />
      <span className="tracking-wide">{label}</span>
    </Link>
  );
}
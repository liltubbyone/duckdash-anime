import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NavItem({ to, icon: Icon, label, active }) {
  return (
    <Link
      to={to}
      className={cn(
        "group relative flex items-center gap-3 h-[46px] px-3 rounded-[10px] text-sm font-medium transition-all duration-200",
        active
          ? "text-brand-cyan"
          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
      )}
    >
      {active && (
        <>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-brand-cyan shadow-[0_0_8px_hsl(var(--accent-cyan)/0.85)]" />
          <span className="absolute inset-0 rounded-[10px] bg-gradient-to-r from-brand-blue/15 to-transparent" />
        </>
      )}
      <Icon className="w-[18px] h-[18px] relative" strokeWidth={1.8} />
      <span className="relative">{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto relative text-slate-500" />}
    </Link>
  );
}
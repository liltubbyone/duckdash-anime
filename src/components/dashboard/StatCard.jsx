import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatCard({ icon: Icon, label, value, context, accent, loading }) {
  if (loading) {
    return (
      <div className="duck-card p-4 lg:p-5 min-h-[108px] lg:min-h-[124px]">
        <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
        <Skeleton className="h-8 w-16 mt-4 bg-white/[0.06]" />
      </div>
    );
  }
  return (
    <div className="duck-card p-4 lg:p-5 min-h-[108px] lg:min-h-[124px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-[1px] hover:border-white/[0.16]">
      <div className="flex items-center gap-2.5">
        <span
          className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-[9px]"
          style={{ background: `${accent}1f`, color: accent }}
        >
          <Icon className="w-4 h-4 lg:w-[18px] lg:h-[18px]" strokeWidth={1.9} />
        </span>
        <span className="t-label text-slate-400">{label}</span>
      </div>
      <div>
        <p className="text-[28px] lg:text-[34px] font-bold text-white tabular-nums leading-none tracking-tight">
          {value}
        </p>
        {context && <p className="t-meta text-slate-500 mt-1.5">{context}</p>}
      </div>
    </div>
  );
}
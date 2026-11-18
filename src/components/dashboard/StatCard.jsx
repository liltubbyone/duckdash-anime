import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatCard({ icon: Icon, label, value, context, accent, loading }) {
  if (loading) {
    return (
      <div className="duck-card p-4 lg:p-5 min-h-[108px] lg:min-h-[124px]">
        <Skeleton className="h-3 w-20 bg-white/[0.06]" />
        <Skeleton className="h-8 w-16 mt-5 bg-white/[0.06]" />
      </div>
    );
  }
  return (
    <div className="duck-card relative overflow-hidden p-4 lg:p-5 min-h-[108px] lg:min-h-[124px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-[1px]">
      {/* Accent rail */}
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: `linear-gradient(180deg, ${accent}, transparent 88%)` }}
      />
      {/* Corner glow */}
      <span
        className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ background: accent }}
      />

      <div className="flex items-center justify-between gap-2 relative">
        <span className="t-label text-slate-500">{label}</span>
        <span
          className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
          style={{ background: `${accent}1f`, color: accent }}
        >
          <Icon className="w-[15px] h-[15px]" strokeWidth={2.2} />
        </span>
      </div>

      <div className="relative">
        <p className="score-num text-[30px] lg:text-[36px] text-white leading-none">{value}</p>
        {context && <p className="t-meta text-slate-500 mt-1.5">{context}</p>}
      </div>
    </div>
  );
}
import React from "react";
import { Check } from "lucide-react";

const STEPS = ["Basics", "Format", "Prize", "Timing", "Launch"];

export default function BuilderStepper({ current, completed }) {
  return (
    <nav aria-label="Race builder steps" className="hidden md:flex items-center w-full">
      {STEPS.map((label, i) => {
        const isCurrent = i === current;
        const isDone = i < current || completed.has(i);
        const isFuture = i > current;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold transition-all ${
                  isCurrent
                    ? "cta-esports"
                    : isDone
                    ? "bg-brand-lime/12 text-brand-lime border border-brand-lime/35"
                    : "bg-white/[0.04] text-slate-600 border border-white/10"
                }`}
              >
                {isDone && !isCurrent ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap ${
                  isCurrent ? "text-white" : isDone ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${isFuture ? "bg-white/10" : "bg-brand-lime/35"}`} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function MobileStepper({ current }) {
  const pct = ((current + 1) / STEPS.length) * 100;
  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Step {current + 1} of {STEPS.length}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-brand-lime">{STEPS[current]}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-lime to-brand-cyan transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
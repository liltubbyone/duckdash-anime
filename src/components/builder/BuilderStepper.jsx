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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${
                  isCurrent
                    ? "bg-brand-blue text-white ring-4 ring-brand-blue/20"
                    : isDone
                    ? "bg-brand-cyan text-black"
                    : "bg-white/[0.06] text-slate-500 border border-white/10"
                }`}
              >
                {isDone && !isCurrent ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`text-[13px] font-semibold whitespace-nowrap ${
                  isCurrent ? "text-white" : isDone ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${isFuture ? "bg-white/10" : "bg-brand-cyan/40"}`} />
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
        <span className="text-[12px] font-semibold text-slate-400">
          Step {current + 1} of {STEPS.length}
        </span>
        <span className="text-[13px] font-bold text-white">{STEPS[current]}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
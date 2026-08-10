import React from "react";
import { Minus, Plus } from "lucide-react";

export default function StepperControl({ value, onChange, min = 1, max = 10, step = 1, suffix }) {
  const clamp = (v) => Math.max(min, Math.min(max, v));
  const set = (v) => onChange(clamp(v));

  return (
    <div className="inline-flex items-stretch rounded-[10px] border border-white/10 overflow-hidden bg-white/[0.03]">
      <button
        type="button"
        onClick={() => set(value - step)}
        disabled={value <= min}
        className="w-10 flex items-center justify-center text-slate-300 hover:bg-white/[0.06] disabled:opacity-30 transition-colors"
        aria-label="decrease"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => set(Number(e.target.value) || min)}
        className="w-16 bg-transparent text-center text-white font-semibold text-[15px] tabular-nums outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && <span className="flex items-center pr-2 text-slate-500 text-xs">{suffix}</span>}
      <button
        type="button"
        onClick={() => set(value + step)}
        disabled={value >= max}
        className="w-10 flex items-center justify-center text-slate-300 hover:bg-white/[0.06] disabled:opacity-30 transition-colors border-l border-white/10"
        aria-label="increase"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
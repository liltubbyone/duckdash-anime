import React from "react";

export function Field({ label, helper, error, required, children, className }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-2">
        {label}
        {required && <span className="text-brand-red">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-brand-red mt-1.5 font-medium">{error}</p>
      ) : helper ? (
        <p className="text-[11px] text-slate-500 mt-1.5">{helper}</p>
      ) : null}
    </div>
  );
}

export const inputCls =
  "h-12 w-full rounded-xl bg-white/[0.03] border border-white/10 px-3.5 text-[14px] text-white placeholder:text-slate-600 outline-none transition-all focus:border-brand-lime/60 focus:ring-2 focus:ring-brand-lime/15";

export const textareaCls =
  "w-full rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-slate-600 outline-none transition-all focus:border-brand-lime/60 focus:ring-2 focus:ring-brand-lime/15 resize-none";

export function StepPanel({ title, subtitle, children }) {
  return (
    <div className="duck-card-elevated panel-accent p-5 lg:p-7">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="w-1 h-3.5 rounded-full bg-brand-lime shadow-[0_0_10px_hsl(var(--accent-lime)/0.8)]" />
          <h2 className="text-[13px] font-bold uppercase tracking-[0.1em] text-white">{title}</h2>
        </div>
        {subtitle && <p className="text-[13px] text-slate-400 mt-1.5 ml-3">{subtitle}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
import React from "react";

export function Field({ label, helper, error, required, children, className }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1 text-[12px] font-semibold text-slate-300 mb-1.5">
        {label}
        {required && <span className="text-brand-red">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-brand-red mt-1.5">{error}</p>
      ) : helper ? (
        <p className="text-[11px] text-slate-500 mt-1.5">{helper}</p>
      ) : null}
    </div>
  );
}

export const inputCls =
  "h-12 w-full rounded-[11px] bg-white/[0.03] border border-white/10 px-3.5 text-[14px] text-white placeholder:text-slate-600 outline-none transition-all focus:border-brand-cyan/60 focus:ring-2 focus:ring-brand-cyan/15";

export const textareaCls =
  "w-full rounded-[11px] bg-white/[0.03] border border-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-slate-600 outline-none transition-all focus:border-brand-cyan/60 focus:ring-2 focus:ring-brand-cyan/15 resize-none";

export function StepPanel({ title, subtitle, children }) {
  return (
    <div className="duck-card-elevated p-5 lg:p-7">
      <div className="mb-5">
        <h2 className="text-[18px] font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-[13px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
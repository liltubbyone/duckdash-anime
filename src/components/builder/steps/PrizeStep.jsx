import React from "react";
import { Field, inputCls, textareaCls, StepPanel } from "../Field";
import PrizeUploader from "../PrizeUploader";

export default function PrizeStep({ form, update, errors }) {
  const paid = form.entryType === "paid";
  return (
    <StepPanel title="Prize & Entry" subtitle="Give your race meaning and set the entry.">
      <Field label="Prize Photo" helper="A photo makes the prize feel real. Optional.">
        <PrizeUploader value={form.prizeImage} onChange={(prizeImage) => update({ prizeImage })} />
      </Field>

      <Field label="Prize Name" error={errors.prizeName}>
        <input
          className={inputCls}
          value={form.prizeName}
          maxLength={60}
          onChange={(e) => update({ prizeName: e.target.value })}
          placeholder="e.g. Ascended Heroes ETB"
        />
      </Field>

      <Field label="Prize Description" helper="Optional, shown to racers.">
        <textarea
          className={textareaCls}
          rows={2}
          maxLength={140}
          value={form.prizeDescription}
          onChange={(e) => update({ prizeDescription: e.target.value })}
          placeholder="A sealed booster box shipped to the winner…"
        />
      </Field>

      {/* Free vs Paid */}
      <Field label="Entry Type">
        <div className="inline-flex rounded-[11px] border border-white/10 overflow-hidden bg-white/[0.03] p-1 gap-1">
          <SegBtn active={!paid} onClick={() => update({ entryType: "free", entryAmount: 0 })}>Free</SegBtn>
          <SegBtn active={paid} onClick={() => update({ entryType: "paid", entryAmount: form.entryAmount || 10 })}>Paid</SegBtn>
        </div>
      </Field>

      {paid && (
        <Field label="Entry Amount ($)" error={errors.entryAmount} helper="Racers pay this to join via secure checkout.">
          <div className="relative max-w-[220px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]">$</span>
            <input
              type="number"
              min={1}
              max={1000}
              className={inputCls + " pl-7"}
              value={form.entryAmount}
              onChange={(e) => update({ entryAmount: Number(e.target.value) || 0 })}
            />
          </div>
        </Field>
      )}

      {!paid && (
        <div className="rounded-[12px] bg-brand-green/[0.06] border border-brand-green/20 px-4 py-3">
          <p className="text-[13px] text-slate-200">This race is <span className="font-bold text-brand-green">FREE</span> to join.</p>
        </div>
      )}
    </StepPanel>
  );
}

function SegBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 h-9 rounded-[8px] text-[13px] font-semibold transition-all ${active ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"}`}
    >
      {children}
    </button>
  );
}
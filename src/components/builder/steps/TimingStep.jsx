import React from "react";
import { Zap, Hand, Check } from "lucide-react";
import { Field, StepPanel } from "../Field";

const DURATIONS = [5, 10, 15, 20, 30];

export default function TimingStep({ form, update, errors }) {
  return (
    <StepPanel title="Start & Timing" subtitle="Decide how and when the race begins.">
      <Field label="Start Mode" error={errors.startMode}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ModeCard
            selected={form.startMode === "auto"}
            onClick={() => update({ startMode: "auto" })}
            icon={Zap}
            title="Auto Start"
            desc="The race begins automatically the moment all slots are filled."
          />
          <ModeCard
            selected={form.startMode === "manual"}
            onClick={() => update({ startMode: "manual" })}
            icon={Hand}
            title="Manual Start"
            desc="You start the race from the lobby when you're ready."
          />
        </div>
      </Field>

      <Field label="Race Duration" error={errors.duration} helper="How long the race runs once started.">
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => update({ duration: d })}
              className={`h-11 px-5 rounded-[11px] text-[14px] font-semibold transition-all ${
                form.duration === d
                  ? "bg-brand-blue text-white ring-2 ring-brand-blue/25"
                  : "bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      </Field>
    </StepPanel>
  );
}

function ModeCard({ selected, onClick, icon: Icon, title, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative text-left p-4 rounded-[14px] border transition-all ${
        selected ? "border-brand-cyan ring-2 ring-brand-cyan/25 bg-brand-cyan/[0.04]" : "border-white/10 hover:border-white/25 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? "bg-brand-cyan/20 text-brand-cyan" : "bg-white/[0.06] text-slate-400"}`}>
          <Icon className="w-4 h-4" />
        </span>
        <span className="font-bold text-white text-[15px]">{title}</span>
        {selected && <Check className="w-4 h-4 text-brand-cyan ml-auto" strokeWidth={3} />}
      </div>
      <p className="text-[12px] text-slate-400 leading-relaxed">{desc}</p>
    </button>
  );
}
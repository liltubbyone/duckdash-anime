import React from "react";
import { Layers, Users, Check } from "lucide-react";
import { Field, StepPanel } from "../Field";
import StepperControl from "../StepperControl";

export default function FormatStep({ form, update, errors }) {
  const cap = form.mode === "mass" ? form.massCapacity : form.laneCount * form.ducksPerLane;

  return (
    <StepPanel title="Format & Capacity" subtitle="Choose how racers compete and how many can join.">
      {/* Mode cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ModeCard
          selected={form.mode === "lanes"}
          onClick={() => update({ mode: "lanes" })}
          icon={Layers}
          title="Lanes"
          desc="Racers compete in organized lanes. Configure lane count and ducks per lane."
        />
        <ModeCard
          selected={form.mode === "mass"}
          onClick={() => update({ mode: "mass" })}
          icon={Users}
          title="Mass"
          desc="All racers compete together in one large field. Built for bigger events."
        />
      </div>

      {form.mode === "lanes" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Number of Lanes" error={errors.laneCount}>
            <StepperControl value={form.laneCount} onChange={(v) => update({ laneCount: v })} min={2} max={20} />
          </Field>
          <Field label="Ducks per Lane" error={errors.ducksPerLane}>
            <StepperControl value={form.ducksPerLane} onChange={(v) => update({ ducksPerLane: v })} min={1} max={10} />
          </Field>
        </div>
      ) : (
        <Field label="Participant Capacity" error={errors.massCapacity} helper="Backend maximum: 1000 racers.">
          <StepperControl value={form.massCapacity} onChange={(v) => update({ massCapacity: v })} min={2} max={1000} step={5} />
        </Field>
      )}

      <div className="rounded-[12px] bg-brand-cyan/[0.06] border border-brand-cyan/20 px-4 py-3">
        <p className="text-[13px] text-slate-200">
          <span className="font-bold text-white">{cap}</span> racer capacity
          {form.mode === "lanes" && (
            <span className="text-slate-400"> · {form.laneCount} lanes × {form.ducksPerLane} ducks</span>
          )}
        </p>
      </div>
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
        selected
          ? "border-brand-cyan ring-2 ring-brand-cyan/25 bg-brand-cyan/[0.04]"
          : "border-white/10 hover:border-white/25 bg-white/[0.02]"
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
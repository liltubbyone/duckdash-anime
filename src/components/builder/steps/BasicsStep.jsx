import React from "react";
import { Field, inputCls, textareaCls, StepPanel } from "../Field";
import ThemePicker from "../ThemePicker";

export default function BasicsStep({ form, update, errors }) {
  return (
    <StepPanel title="Race Basics" subtitle="Name your event and choose its world.">
      <Field label="Race Name" required error={errors.name} helper={`${form.name.length}/60 characters`}>
        <input
          className={inputCls}
          value={form.name}
          maxLength={60}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="e.g. Galactic Grand Prix"
        />
      </Field>

      <Field label="Short Description" helper="Optional tagline shown in the lobby.">
        <textarea
          className={textareaCls}
          rows={2}
          maxLength={120}
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="A neon-soaked dash through the cosmos…"
        />
      </Field>

      <Field label="Race Environment" required error={errors.theme} helper="Select a themed world.">
        <ThemePicker value={form.theme} onChange={(theme) => update({ theme })} />
      </Field>
    </StepPanel>
  );
}
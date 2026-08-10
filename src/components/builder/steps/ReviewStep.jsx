import React from "react";
import { Pencil, Layers, Users, Trophy, Zap, Timer, Flag } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import { environmentById } from "@/lib/raceArt";

export default function ReviewStep({ form, onEdit }) {
  const env = environmentById(form.theme);
  const cap = form.mode === "mass" ? form.massCapacity : form.laneCount * form.ducksPerLane;
  const entry = form.entryType === "paid" && form.entryAmount > 0 ? `$${form.entryAmount}` : "FREE";

  return (
    <div className="space-y-4">
      {/* Preview banner */}
      <div className="relative h-36 rounded-[16px] overflow-hidden border border-white/10">
        <div
          className="absolute inset-0"
          style={{
            background:
              `radial-gradient(120% 100% at 72% 28%, ${env.palette[0]}55, transparent 60%),` +
              `linear-gradient(125deg, #0a1330, #050a1c)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(2,7,22,0.9)] to-transparent" />
        <div className="absolute right-4 bottom-0"><DuckSprite color={env.duck} size={88} /></div>
        <div className="relative z-10 p-5 flex flex-col justify-center h-full max-w-[70%]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cyan">Ready to Launch</span>
          <h2 className="text-[22px] font-extrabold text-white mt-1 leading-tight truncate">{form.name.trim() || "Untitled Race"}</h2>
          <p className="text-[12px] text-slate-300 mt-1">{env.label}</p>
        </div>
      </div>

      <Group title="Basics" icon={Flag} onEdit={() => onEdit(0)}>
        <Item label="Name" value={form.name.trim() || "—"} />
        <Item label="Description" value={form.description.trim() || "—"} />
        <Item label="Environment" value={env.label} />
      </Group>

      <Group title="Format" icon={form.mode === "mass" ? Users : Layers} onEdit={() => onEdit(1)}>
        <Item label="Mode" value={form.mode === "mass" ? "Mass" : "Lanes"} />
        {form.mode === "lanes" ? (
          <>
            <Item label="Lanes" value={form.laneCount} />
            <Item label="Ducks per lane" value={form.ducksPerLane} />
          </>
        ) : (
          <Item label="Capacity" value={form.massCapacity} />
        )}
        <Item label="Total capacity" value={`${cap} racers`} />
      </Group>

      <Group title="Prize & Entry" icon={Trophy} onEdit={() => onEdit(2)}>
        <Item label="Prize" value={form.prizeName.trim() || (form.prizeImage ? "Photo set" : "Not set")} />
        <Item label="Entry" value={entry} />
      </Group>

      <Group title="Timing" icon={Timer} onEdit={() => onEdit(3)}>
        <Item label="Start mode" value={form.startMode === "auto" ? "Auto (when full)" : "Manual"} />
        <Item label="Duration" value={`${form.duration}s`} />
      </Group>
    </div>
  );
}

function Group({ title, icon: Icon, onEdit, children }) {
  return (
    <div className="duck-card-elevated p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-[14px] font-bold text-white uppercase tracking-wide">
          <Icon className="w-4 h-4 text-brand-cyan" /> {title}
        </h3>
        <button onClick={onEdit} className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-cyan hover:underline">
          <Pencil className="w-3 h-3" /> Edit
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white text-right max-w-[65%] truncate">{value}</span>
    </div>
  );
}
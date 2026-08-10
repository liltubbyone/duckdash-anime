import React from "react";
import { Layers, Users, Trophy, Zap, Timer, Flag, CheckCircle2 } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import { environmentById } from "@/lib/raceArt";

function capacityOf(f) {
  return f.mode === "mass" ? f.massCapacity : f.laneCount * f.ducksPerLane;
}

export default function RaceSummary({ form }) {
  const env = environmentById(form.theme);
  const cap = capacityOf(form);
  const entry = form.entryType === "paid" && form.entryAmount > 0 ? `$${form.entryAmount}` : "FREE";

  // Readiness checklist
  const checks = [
    { label: "Race name", done: !!form.name.trim() },
    { label: "Theme", done: !!form.theme },
    { label: "Capacity", done: form.mode === "mass" ? form.massCapacity >= 2 : form.laneCount >= 2 },
    { label: "Prize", done: !!form.prizeName.trim() || !!form.prizeImage },
    { label: "Timing", done: !!form.startMode && !!form.duration },
  ];
  const remaining = checks.filter((c) => !c.done).length;

  return (
    <div className="duck-card-elevated p-5 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Flag className="w-4 h-4 text-brand-cyan" />
        <h3 className="text-[14px] font-bold text-white uppercase tracking-wide">Race Summary</h3>
      </div>

      {/* Theme preview */}
      <div className="relative h-24 rounded-[12px] overflow-hidden mb-4 border border-white/10">
        <div
          className="absolute inset-0"
          style={{
            background:
              `radial-gradient(120% 100% at 70% 30%, ${env.palette[0]}55, transparent 60%),` +
              `linear-gradient(135deg, #0a1330, #050a1c)`,
          }}
        />
        <div className="absolute right-2 bottom-0"><DuckSprite color={env.duck} size={56} /></div>
        <div className="absolute bottom-2 left-2.5">
          <p className="text-[13px] font-bold text-white leading-tight">{form.name.trim() || "Untitled Race"}</p>
          <p className="text-[10px] text-slate-400">{env.label}</p>
        </div>
      </div>

      <div className="space-y-2.5 text-[13px]">
        <Row icon={form.mode === "mass" ? Users : Layers} label="Mode" value={form.mode === "mass" ? "Mass" : "Lanes"} />
        <Row icon={Users} label="Capacity" value={`${cap} racers`} />
        <Row icon={Trophy} label="Prize" value={form.prizeName.trim() || (form.prizeImage ? "Photo set" : "Not set")} />
        <Row icon={Zap} label="Entry" value={entry} />
        <Row icon={Timer} label="Duration" value={`${form.duration}s`} />
        <Row icon={Flag} label="Start" value={form.startMode === "auto" ? "Auto (when full)" : "Manual"} />
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          {remaining === 0 ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span className="text-[12px] font-semibold text-brand-green">Ready to create</span>
            </>
          ) : (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-slate-600" />
              <span className="text-[12px] font-semibold text-slate-400">{remaining} {remaining === 1 ? "detail" : "details"} remaining</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-slate-400">
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <span className="font-semibold text-white truncate max-w-[60%] text-right">{value}</span>
    </div>
  );
}
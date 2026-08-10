import React from "react";
import { Check } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import { THEMES } from "@/lib/raceArt";

export default function ThemePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {THEMES.map((t) => {
        const selected = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-pressed={selected}
            className={`relative aspect-video rounded-[14px] overflow-hidden border transition-all duration-200 text-left ${
              selected
                ? "border-brand-cyan ring-2 ring-brand-cyan/30 -translate-y-[1px]"
                : "border-white/10 hover:border-white/25 hover:-translate-y-[1px]"
            }`}
          >
            {/* Thumbnail */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  `radial-gradient(120% 100% at 70% 30%, ${t.palette[0]}55, transparent 60%),` +
                  `radial-gradient(110% 90% at 25% 85%, ${t.palette[1]}44, transparent 55%),` +
                  `linear-gradient(135deg, #0a1330, #050a1c)`,
              }}
            />
            <div className="absolute right-1.5 bottom-0 opacity-90">
              <DuckSprite color={t.duck} size={52} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-[12px] font-semibold text-white truncate">{t.label}</p>
            </div>
            {selected && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-cyan text-black flex items-center justify-center">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
import React from "react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import { environmentFor, environmentById, STARS } from "@/lib/raceArt";

/**
 * Procedural cinematic race-environment artwork.
 * Layered radial lighting + starfield + lane lines + a large duck character.
 * No text baked in — all UI text is rendered as real HTML by the hero.
 */
export default function HeroArtwork({ name = "", theme = "" }) {
  const env = theme ? environmentById(theme) : environmentFor(name);
  const [c1, c2] = env.palette;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base atmospheric gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(120% 95% at 72% 28%, ${c1}40, transparent 58%),` +
            `radial-gradient(110% 85% at 28% 82%, ${c2}30, transparent 55%),` +
            `linear-gradient(125deg, #050a1c 0%, #0a1330 55%, #050a1c 100%)`,
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0 opacity-[0.35]">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Soft environment glow */}
      <div
        className="absolute right-[12%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-3xl"
        style={{ background: env.glow }}
      />

      {/* Track lane lines (perspective hint) */}
      <div className="absolute inset-x-0 bottom-0 h-[42%] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              `repeating-linear-gradient(90deg, transparent 0 60px, rgba(255,255,255,0.05) 60px 62px),` +
              `linear-gradient(180deg, transparent, rgba(0,0,0,0.5))`,
          }}
        />
      </div>

      {/* Hero duck character — center/right */}
      <div className="absolute right-[7%] bottom-[2%] hidden sm:block">
        <DuckSprite color={env.duck} size={240} />
      </div>
      <div className="absolute right-[4%] bottom-[2%] sm:hidden">
        <DuckSprite color={env.duck} size={150} />
      </div>
    </div>
  );
}
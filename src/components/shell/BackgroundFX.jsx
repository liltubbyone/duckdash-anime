import React from "react";

const STARS = Array.from({ length: 46 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 1.6 + 0.4,
  opacity: Math.random() * 0.5 + 0.15,
}));

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 600px at 82% -8%, hsl(var(--accent-purple) / 0.13), transparent 60%)," +
            "radial-gradient(760px 520px at -5% 105%, hsl(var(--accent-cyan) / 0.08), transparent 60%)," +
            "linear-gradient(180deg, hsl(var(--bg-deep)) 0%, hsl(var(--bg-primary)) 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.10]">
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
    </div>
  );
}
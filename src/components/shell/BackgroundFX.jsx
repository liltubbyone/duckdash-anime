import React from "react";

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Base arena wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 620px at 78% -12%, hsl(var(--accent-purple) / 0.16), transparent 62%)," +
            "radial-gradient(900px 560px at 6% 4%, hsl(var(--accent-cyan) / 0.10), transparent 60%)," +
            "linear-gradient(180deg, hsl(var(--bg-deep)) 0%, hsl(var(--bg-primary)) 55%, hsl(var(--bg-deep)) 100%)",
        }}
      />

      {/* Perspective grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[58%] opacity-[0.20]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--accent-cyan) / 0.35) 1px, transparent 1px)," +
            "linear-gradient(to bottom, hsl(var(--accent-cyan) / 0.35) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transform: "perspective(620px) rotateX(64deg)",
          transformOrigin: "bottom center",
          maskImage: "linear-gradient(to top, black, transparent 76%)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent 76%)",
        }}
      />

      {/* Horizon accent */}
      <div
        className="absolute inset-x-0 bottom-[38%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--accent-lime) / 0.32), transparent)" }}
      />

      {/* Vignette to keep content readable */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(125% 95% at 50% 0%, transparent 42%, hsl(var(--bg-deep) / 0.86) 100%)" }}
      />
    </div>
  );
}
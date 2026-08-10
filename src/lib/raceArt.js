// Reusable race-environment art system (procedural — no external image deps).
// Environments are derived from race name keywords so each world has identity.

const ENVIRONMENTS = [
  {
    id: "galactic",
    keywords: ["galactic", "space", "cosmic", "nebula", "star", "grand prix"],
    palette: ["#8654ff", "#377dff"],
    duck: "purple",
    glow: "rgba(134,84,255,0.35)",
  },
  {
    id: "lagoon",
    keywords: ["neon", "lagoon", "water", "ocean", "aqua", "lake"],
    palette: ["#28c2ff", "#38e39a"],
    duck: "cyan",
    glow: "rgba(40,194,255,0.30)",
  },
  {
    id: "sakura",
    keywords: ["sakura", "cherry", "blossom", "spring", "stream"],
    palette: ["#ef55c7", "#ff9b47"],
    duck: "pink",
    glow: "rgba(239,85,199,0.32)",
  },
  {
    id: "arctic",
    keywords: ["arctic", "ice", "frozen", "snow", "frost", "polar"],
    palette: ["#28c2ff", "#9fd8ff"],
    duck: "blue",
    glow: "rgba(40,194,255,0.28)",
  },
  {
    id: "volcano",
    keywords: ["volcano", "lava", "fire", "magma", "rush", "inferno"],
    palette: ["#ff667d", "#ff9b47"],
    duck: "red",
    glow: "rgba(255,102,125,0.32)",
  },
  {
    id: "moonlight",
    keywords: ["moon", "moonlight", "midnight", "rapid", "night"],
    palette: ["#377dff", "#8654ff"],
    duck: "indigo",
    glow: "rgba(55,125,255,0.30)",
  },
];

const DEFAULT_ENV = ENVIRONMENTS[0];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

export function environmentFor(name = "") {
  const n = (name || "").toLowerCase();
  for (const env of ENVIRONMENTS) {
    if (env.keywords.some((k) => n.includes(k))) return env;
  }
  return ENVIRONMENTS[hash(n || "duck") % ENVIRONMENTS.length];
}

export const STARS = Array.from({ length: 60 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 1.8 + 0.4,
  opacity: Math.random() * 0.6 + 0.15,
}));
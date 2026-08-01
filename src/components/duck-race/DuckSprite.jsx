import React from "react";
import { AccessoryLayers } from "./accessories";

const DUCK_COLORS = {
  gold: { body: "#FFD700", beak: "#FF8C00", wing: "#FFC107", eye: "#1a1a2e" },
  pink: { body: "#FF69B4", beak: "#FF1493", wing: "#FF85C8", eye: "#1a1a2e" },
  blue: { body: "#4FC3F7", beak: "#0288D1", wing: "#81D4FA", eye: "#1a1a2e" },
  green: { body: "#66BB6A", beak: "#2E7D32", wing: "#81C784", eye: "#1a1a2e" },
  purple: { body: "#AB47BC", beak: "#7B1FA2", wing: "#CE93D8", eye: "#1a1a2e" },
  red: { body: "#EF5350", beak: "#C62828", wing: "#EF9A9A", eye: "#1a1a2e" },
  teal: { body: "#26A69A", beak: "#00695C", wing: "#4DB6AC", eye: "#1a1a2e" },
  orange: { body: "#FF9800", beak: "#E65100", wing: "#FFB74D", eye: "#1a1a2e" },
  indigo: { body: "#5C6BC0", beak: "#283593", wing: "#7986CB", eye: "#1a1a2e" },
  lime: { body: "#8BC34A", beak: "#33691E", wing: "#AED581", eye: "#1a1a2e" },
  magenta: { body: "#E040FB", beak: "#6A1B9A", wing: "#EA80FC", eye: "#1a1a2e" },
  silver: { body: "#B0BEC5", beak: "#607D8B", wing: "#CFD8DC", eye: "#1a1a2e" },
  coral: { body: "#FF7043", beak: "#BF360C", wing: "#FF8A65", eye: "#1a1a2e" },
  cyan: { body: "#4DD0E1", beak: "#00838F", wing: "#80DEEA", eye: "#1a1a2e" },
};

export const AVAILABLE_COLORS = Object.keys(DUCK_COLORS);

function DuckSprite({ color = "gold", size = 60, isRacing = false, className = "", hat = "none", glasses = "none", clothes = "none" }) {
  const c = DUCK_COLORS[color] || DUCK_COLORS.gold;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${isRacing ? "animate-duck-bob" : ""}`}
    >
      {/* Body */}
      <ellipse cx="50" cy="62" rx="30" ry="22" fill={c.body} />
      {/* Wing */}
      <ellipse cx="42" cy="58" rx="14" ry="10" fill={c.wing} opacity="0.8" />
      {/* Head */}
      <circle cx="72" cy="40" r="16" fill={c.body} />
      {/* Eye white */}
      <ellipse cx="78" cy="36" rx="6" ry="7" fill="white" />
      {/* Eye pupil - anime style big */}
      <ellipse cx="80" cy="36" rx="4" ry="5" fill={c.eye} />
      {/* Eye shine */}
      <circle cx="82" cy="34" r="2" fill="white" />
      <circle cx="79" cy="38" r="1" fill="white" opacity="0.6" />
      {/* Beak */}
      <path d="M 86 42 L 98 40 L 86 46 Z" fill={c.beak} />
      {/* Blush */}
      <ellipse cx="74" cy="46" rx="4" ry="2.5" fill="#FF9999" opacity="0.5" />
      {/* Tail feathers */}
      <path d="M 20 52 Q 12 42 16 34" stroke={c.wing} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 22 50 Q 10 44 14 36" stroke={c.body} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Water line ripples */}
      <path d="M 25 78 Q 35 74 45 78 Q 55 82 65 78 Q 75 74 82 78" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />

      {/* Customization accessories */}
      <AccessoryLayers hat={hat} glasses={glasses} clothes={clothes} />
    </svg>
  );
}

export default React.memo(DuckSprite);
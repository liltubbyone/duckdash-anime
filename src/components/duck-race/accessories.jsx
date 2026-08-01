import React from "react";

export const HATS = [
  { id: "none", label: "None" },
  { id: "crown", label: "Crown" },
  { id: "cap", label: "Cap" },
  { id: "tophat", label: "Top Hat" },
  { id: "party", label: "Party" },
];

export const GLASSES = [
  { id: "none", label: "None" },
  { id: "sunglasses", label: "Shades" },
  { id: "round", label: "Round" },
  { id: "star", label: "Star" },
];

export const CLOTHES = [
  { id: "none", label: "None" },
  { id: "scarf", label: "Scarf" },
  { id: "bowtie", label: "Bowtie" },
  { id: "cape", label: "Cape" },
];

// SVG accessory layers drawn over the duck (viewBox 0 0 100 100).
export function AccessoryLayers({ hat = "none", glasses = "none", clothes = "none" }) {
  return (
    <>
      {/* Cape drapes behind body */}
      {clothes === "cape" && (
        <path d="M 44 50 Q 56 44 68 50 L 72 76 Q 56 70 40 76 Z" fill="#7c3aed" opacity="0.5" />
      )}

      {/* Hats */}
      {hat === "crown" && (
        <g>
          <path d="M 60 28 L 60 19 L 66 24 L 72 14 L 78 24 L 84 19 L 84 28 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
          <circle cx="72" cy="13" r="2.2" fill="#FF4136" />
        </g>
      )}
      {hat === "cap" && (
        <g>
          <path d="M 56 30 Q 56 18 72 18 Q 87 18 87 30 Z" fill="#dc2626" />
          <path d="M 80 30 L 93 33 L 91 36 L 80 33 Z" fill="#991b1b" />
        </g>
      )}
      {hat === "tophat" && (
        <g>
          <rect x="62" y="9" width="20" height="17" rx="2" fill="#1a1a2e" />
          <rect x="55" y="24" width="34" height="4" rx="2" fill="#1a1a2e" />
          <rect x="62" y="14" width="20" height="3" fill="#dc2626" />
        </g>
      )}
      {hat === "party" && (
        <g>
          <path d="M 72 7 L 83 28 L 61 28 Z" fill="#ec4899" />
          <circle cx="72" cy="7" r="2.2" fill="#fbbf24" />
          <circle cx="69" cy="17" r="1.4" fill="#fff" />
          <circle cx="75" cy="22" r="1.4" fill="#3b82f6" />
        </g>
      )}

      {/* Glasses (over the eye around 78,36) */}
      {glasses === "sunglasses" && (
        <g>
          <rect x="72" y="32" width="14" height="9" rx="3" fill="#1a1a2e" />
          <rect x="66" y="35" width="8" height="2.5" rx="1" fill="#1a1a2e" />
          <rect x="75" y="34" width="4" height="2" rx="1" fill="#3b82f6" opacity="0.5" />
        </g>
      )}
      {glasses === "round" && (
        <g>
          <circle cx="79" cy="36" r="6" fill="rgba(255,255,255,0.25)" stroke="#1a1a2e" strokeWidth="2" />
          <circle cx="71" cy="36" r="6" fill="rgba(255,255,255,0.25)" stroke="#1a1a2e" strokeWidth="2" />
        </g>
      )}
      {glasses === "star" && (
        <path d="M 79 30 L 81 35 L 86 35 L 82 38.5 L 83 43.5 L 79 40.5 L 75 43.5 L 76 38.5 L 72 35 L 77 35 Z" fill="#fbbf24" stroke="#1a1a2e" strokeWidth="1" />
      )}

      {/* Clothes (around neck/chest) */}
      {clothes === "scarf" && (
        <g>
          <path d="M 44 50 Q 56 46 68 50 L 68 56 Q 56 60 44 56 Z" fill="#dc2626" />
          <path d="M 62 55 L 70 70 L 66 72 L 58 57 Z" fill="#991b1b" />
        </g>
      )}
      {clothes === "bowtie" && (
        <g>
          <path d="M 52 52 L 62 47 L 62 61 L 52 56 Z" fill="#1a1a2e" />
          <path d="M 52 52 L 42 47 L 42 61 L 52 56 Z" fill="#1a1a2e" />
          <circle cx="52" cy="54" r="2.2" fill="#dc2626" />
        </g>
      )}
    </>
  );
}
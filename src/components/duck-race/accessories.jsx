import React from "react";

export const HATS = [
  { id: "none", label: "None" },
  { id: "crown", label: "Crown" },
  { id: "cap", label: "Cap" },
  { id: "tophat", label: "Top Hat" },
  { id: "party", label: "Party" },
  { id: "wizard", label: "Wizard" },
  { id: "pirate", label: "Pirate" },
  { id: "halo", label: "Halo" },
  { id: "beanie", label: "Beanie" },
  { id: "cowboy", label: "Cowboy" },
  { id: "graduation", label: "Grad" },
  { id: "ninja", label: "Ninja" },
  { id: "headphones", label: "Phones" },
  { id: "flower", label: "Flowers" },
  { id: "horns", label: "Horns" },
  { id: "mohawk", label: "Mohawk" },
];

export const GLASSES = [
  { id: "none", label: "None" },
  { id: "sunglasses", label: "Shades" },
  { id: "round", label: "Round" },
  { id: "star", label: "Star" },
  { id: "visor", label: "Visor" },
  { id: "monocle", label: "Monocle" },
  { id: "pixel", label: "Pixel" },
  { id: "3d", label: "3D" },
  { id: "cyber", label: "Cyber" },
  { id: "blindfold", label: "Blindfold" },
  { id: "heart", label: "Heart" },
];

export const CLOTHES = [
  { id: "none", label: "None" },
  { id: "scarf", label: "Scarf" },
  { id: "bowtie", label: "Bowtie" },
  { id: "cape", label: "Cape" },
  { id: "vest", label: "Vest" },
  { id: "necklace", label: "Necklace" },
  { id: "tie", label: "Tie" },
  { id: "lei", label: "Lei" },
  { id: "chain", label: "Chain" },
  { id: "hoodie", label: "Hoodie" },
  { id: "armor", label: "Armor" },
  { id: "bandana", label: "Bandana" },
];

// SVG accessory layers drawn over the duck (viewBox 0 0 100 100).
export function AccessoryLayers({ hat = "none", glasses = "none", clothes = "none" }) {
  return (
    <>
      {/* Cape drapes behind body */}
      {clothes === "cape" && (
        <path d="M 44 50 Q 56 44 68 50 L 72 76 Q 56 70 40 76 Z" fill="#7c3aed" opacity="0.5" />
      )}

      {/* Hoodie hood behind body */}
      {clothes === "hoodie" && (
        <path d="M 38 48 Q 56 40 74 48 L 72 62 Q 56 58 40 62 Z" fill="#374151" opacity="0.85" />
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
      {hat === "wizard" && (
        <g>
          <ellipse cx="72" cy="29" rx="17" ry="3.5" fill="#4c1d95" />
          <path d="M 58 29 L 72 3 L 86 29 Z" fill="#6b21a8" />
          <path d="M 70 14 L 72 10 L 74 14 L 78 12 L 74 16 L 76 20 L 72 17 L 68 20 L 70 16 L 66 12 Z" fill="#fbbf24" />
        </g>
      )}
      {hat === "pirate" && (
        <g>
          <rect x="55" y="29" width="36" height="9" rx="2" fill="#1a1a2e" />
          <circle cx="72" cy="33.5" r="3.6" fill="#fff" />
          <circle cx="70.5" cy="33" r="0.8" fill="#1a1a2e" />
          <circle cx="73.5" cy="33" r="0.8" fill="#1a1a2e" />
        </g>
      )}
      {hat === "halo" && (
        <ellipse cx="72" cy="9" rx="13" ry="3.5" fill="none" stroke="#FFD700" strokeWidth="2.5" />
      )}
      {hat === "beanie" && (
        <g>
          <path d="M 56 30 Q 56 12 72 12 Q 88 12 88 30 Z" fill="#2563eb" />
          <rect x="56" y="28" width="32" height="5" fill="#1e40af" />
          <circle cx="72" cy="8" r="3" fill="#fbbf24" />
        </g>
      )}
      {hat === "cowboy" && (
        <g>
          <ellipse cx="72" cy="30" rx="21" ry="5" fill="#8B4513" />
          <path d="M 60 28 Q 60 14 72 14 Q 84 14 84 28 Z" fill="#8B4513" />
          <rect x="60" y="26" width="24" height="3" fill="#1a1a2e" />
        </g>
      )}
      {hat === "graduation" && (
        <g>
          <rect x="55" y="24" width="34" height="6" rx="1" fill="#1a1a2e" />
          <path d="M 54 20 L 72 11 L 90 20 L 72 29 Z" fill="#1a1a2e" />
          <path d="M 88 20 L 91 31" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="91" cy="32" r="2" fill="#fbbf24" />
        </g>
      )}
      {hat === "ninja" && (
        <g>
          <rect x="54" y="28" width="38" height="9" fill="#1a1a2e" />
          <rect x="64" y="31" width="18" height="3" fill="#000" />
          <circle cx="82" cy="32.5" r="2" fill="#dc2626" />
        </g>
      )}
      {hat === "headphones" && (
        <g>
          <path d="M 56 32 Q 56 6 72 6 Q 88 6 88 32" stroke="#1a1a2e" strokeWidth="4" fill="none" />
          <rect x="50" y="30" width="9" height="14" rx="3" fill="#1a1a2e" />
          <rect x="85" y="30" width="9" height="14" rx="3" fill="#1a1a2e" />
          <rect x="51" y="33" width="3" height="8" rx="1" fill="#ec4899" />
        </g>
      )}
      {hat === "flower" && (
        <g>
          <circle cx="60" cy="26" r="3.2" fill="#ec4899" />
          <circle cx="66" cy="22" r="3.2" fill="#fbbf24" />
          <circle cx="72" cy="21" r="3.2" fill="#ec4899" />
          <circle cx="78" cy="22" r="3.2" fill="#fbbf24" />
          <circle cx="84" cy="26" r="3.2" fill="#ec4899" />
          <circle cx="60" cy="26" r="1.2" fill="#fbbf24" />
          <circle cx="66" cy="22" r="1.2" fill="#ec4899" />
          <circle cx="72" cy="21" r="1.2" fill="#fbbf24" />
          <circle cx="78" cy="22" r="1.2" fill="#ec4899" />
          <circle cx="84" cy="26" r="1.2" fill="#fbbf24" />
        </g>
      )}
      {hat === "horns" && (
        <g>
          <path d="M 60 28 L 54 10 L 64 26 Z" fill="#dc2626" />
          <path d="M 84 28 L 90 10 L 80 26 Z" fill="#dc2626" />
        </g>
      )}
      {hat === "mohawk" && (
        <g>
          <path d="M 68 28 L 70 6 L 72 28 Z" fill="#22c55e" />
          <path d="M 71 28 L 73 4 L 75 28 Z" fill="#3b82f6" />
          <path d="M 74 28 L 76 7 L 78 28 Z" fill="#ec4899" />
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
      {glasses === "visor" && (
        <g>
          <rect x="66" y="30" width="24" height="10" rx="4" fill="rgba(34,211,238,0.45)" stroke="#06b6d4" strokeWidth="1.5" />
          <rect x="68" y="32" width="20" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
        </g>
      )}
      {glasses === "monocle" && (
        <g>
          <circle cx="79" cy="36" r="7" fill="rgba(255,255,255,0.2)" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 86 40 Q 93 44 91 51" stroke="#fbbf24" strokeWidth="1.2" fill="none" />
        </g>
      )}
      {glasses === "pixel" && (
        <g>
          <rect x="65" y="30" width="11" height="11" fill="#1a1a2e" />
          <rect x="78" y="30" width="11" height="11" fill="#1a1a2e" />
          <rect x="76" y="33" width="3" height="4" fill="#1a1a2e" />
          <rect x="67" y="32" width="3" height="3" fill="#fff" opacity="0.5" />
          <rect x="80" y="32" width="3" height="3" fill="#fff" opacity="0.5" />
        </g>
      )}
      {glasses === "3d" && (
        <g>
          <rect x="67" y="30" width="9" height="9" rx="1" fill="#ef4444" />
          <rect x="78" y="30" width="9" height="9" rx="1" fill="#3b82f6" />
          <rect x="76" y="33" width="2" height="3" fill="#1a1a2e" />
        </g>
      )}
      {glasses === "cyber" && (
        <g>
          <rect x="64" y="28" width="26" height="12" rx="3" fill="#1a1a2e" />
          <rect x="67" y="32" width="20" height="2.5" rx="1" fill="#06b6d4" />
          <circle cx="70" cy="40" r="1.5" fill="#ec4899" />
        </g>
      )}
      {glasses === "blindfold" && (
        <g>
          <rect x="63" y="30" width="30" height="9" rx="2" fill="#1a1a2e" />
          <circle cx="90" cy="34.5" r="2.5" fill="#0f172a" />
        </g>
      )}
      {glasses === "heart" && (
        <g>
          <path d="M 71 34 C 69 31 65 32 65 35 C 65 38 71 41 71 41 C 71 41 77 38 77 35 C 77 32 73 31 71 34 Z" fill="#ec4899" stroke="#1a1a2e" strokeWidth="1" />
          <path d="M 80 34 C 78 31 74 32 74 35 C 74 38 80 41 80 41 C 80 41 86 38 86 35 C 86 32 82 31 80 34 Z" fill="#ec4899" stroke="#1a1a2e" strokeWidth="1" />
        </g>
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
      {clothes === "vest" && (
        <g>
          <path d="M 42 54 Q 56 50 70 54 L 68 74 Q 56 70 44 74 Z" fill="#92400e" />
          <path d="M 56 52 L 56 73" stroke="#451a03" strokeWidth="1.5" />
          <circle cx="53" cy="60" r="1.4" fill="#fbbf24" />
          <circle cx="53" cy="68" r="1.4" fill="#fbbf24" />
        </g>
      )}
      {clothes === "necklace" && (
        <g>
          <path d="M 44 52 Q 56 64 68 52" stroke="#fbbf24" strokeWidth="2" fill="none" />
          <circle cx="56" cy="61" r="3" fill="#ec4899" stroke="#fbbf24" strokeWidth="1" />
        </g>
      )}
      {clothes === "tie" && (
        <g>
          <rect x="52" y="49" width="8" height="5" fill="#991b1b" />
          <path d="M 53 54 L 59 54 L 61 58 L 59 74 L 53 74 L 51 58 Z" fill="#dc2626" />
        </g>
      )}
      {clothes === "lei" && (
        <g>
          <circle cx="46" cy="54" r="2.6" fill="#ec4899" />
          <circle cx="51" cy="58" r="2.6" fill="#fbbf24" />
          <circle cx="57" cy="60" r="2.6" fill="#ec4899" />
          <circle cx="63" cy="58" r="2.6" fill="#fbbf24" />
          <circle cx="68" cy="54" r="2.6" fill="#ec4899" />
        </g>
      )}
      {clothes === "chain" && (
        <path d="M 44 52 Q 56 63 68 52" stroke="#fbbf24" strokeWidth="3" fill="none" />
      )}
      {clothes === "hoodie" && (
        <g>
          <path d="M 42 54 Q 56 50 70 54 L 68 64 Q 56 60 44 64 Z" fill="#4b5563" />
          <path d="M 52 54 L 51 66" stroke="#1f2937" strokeWidth="1.5" />
          <path d="M 60 54 L 61 66" stroke="#1f2937" strokeWidth="1.5" />
        </g>
      )}
      {clothes === "armor" && (
        <g>
          <path d="M 42 52 Q 56 48 70 52 L 68 74 Q 56 70 44 74 Z" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
          <circle cx="56" cy="62" r="4" fill="#fbbf24" />
        </g>
      )}
      {clothes === "bandana" && (
        <g>
          <path d="M 44 52 Q 56 48 68 52 L 68 56 Q 56 60 44 56 Z" fill="#16a34a" />
          <path d="M 64 55 L 72 66 L 68 68 L 60 57 Z" fill="#15803d" />
          <circle cx="50" cy="54" r="0.8" fill="#fff" />
          <circle cx="56" cy="53" r="0.8" fill="#fff" />
          <circle cx="62" cy="54" r="0.8" fill="#fff" />
        </g>
      )}
    </>
  );
}
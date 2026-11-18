import React from "react";
import DuckSprite from "./DuckSprite";

const MEDALS = ["🥇", "🥈", "🥉"];
// Display order: 2nd, 1st, 3rd (podium style)
const ORDERS = [1, 0, 2];

export default function Leaderboard({ ranked }) {
  if (!ranked || ranked.length === 0) return null;
  const top = ranked.slice(0, 3);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-end justify-center gap-2 md:gap-3">
        {ORDERS.map((displayIdx) => {
          const item = top[displayIdx];
          if (!item) return <div key={displayIdx} className="flex-1 max-w-[120px]" />;
          const isFirst = displayIdx === 0;
          return (
            <div
              key={displayIdx}
              className={`flex-1 max-w-[140px] flex flex-col items-center transition-all duration-300 ${
                isFirst ? "order-2 -mt-3" : displayIdx === 1 ? "order-1" : "order-3"
              }`}
            >
              <div className={`text-base md:text-lg mb-1.5 ${isFirst ? "animate-bounce" : "opacity-70"}`}>
                {MEDALS[displayIdx]}
              </div>
              <div
                className={`relative w-full rounded-t-lg rounded-b-md flex items-center justify-center border ${
                  isFirst ? "h-24 md:h-28" : "h-16 md:h-20"
                } ${
                  isFirst
                    ? "border-brand-lime/45 bg-gradient-to-b from-brand-lime/[0.16] to-brand-lime/[0.03] shadow-[0_0_40px_-18px_hsl(var(--accent-lime)/0.8)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <DuckSprite
                  color={item.color}
                  hexColor={item.hex}
                  size={isFirst ? 56 : 40}
                  hat={item.hat}
                  glasses={item.glasses}
                  clothes={item.clothes}
                />
                {/* Progress bar */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <div className="h-1 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-150 ${
                        isFirst
                          ? "bg-brand-lime"
                          : "bg-gradient-to-r from-brand-cyan/70 to-brand-cyan"
                      }`}
                      style={{ width: `${Math.round(item.progress || 0)}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className={`text-[11px] font-bold uppercase tracking-[0.06em] mt-1.5 truncate w-full text-center ${
                isFirst ? "text-brand-lime" : "text-slate-400"
              }`}>
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
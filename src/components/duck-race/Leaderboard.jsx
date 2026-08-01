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
      <div className="flex items-end justify-center gap-2 md:gap-4">
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
              <div className={`text-xl md:text-2xl mb-1 ${isFirst ? "animate-bounce" : ""}`}>
                {MEDALS[displayIdx]}
              </div>
              <div
                className={`relative w-full rounded-t-lg rounded-b-md flex items-center justify-center border-2 ${
                  isFirst ? "h-24 md:h-28" : "h-16 md:h-20"
                } ${
                  isFirst
                    ? "bg-gradient-to-b from-yellow-500/30 to-yellow-700/20 border-yellow-400/60 shadow-lg shadow-yellow-400/20"
                    : "bg-white/5 border-white/15"
                }`}
              >
                <DuckSprite
                  color={item.color}
                  size={isFirst ? 56 : 40}
                  hat={item.hat}
                  glasses={item.glasses}
                  clothes={item.clothes}
                />
                {/* Progress bar */}
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-150"
                      style={{ width: `${Math.round(item.progress || 0)}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-white/85 text-xs font-bold mt-1 truncate w-full text-center">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import React from "react";
import DuckSprite from "./DuckSprite";

export default function RaceLane({ laneNumber, entry, progress = 0, isRacing, isWinner, onBuyIn }) {
  const isEmpty = !entry;

  return (
    <div className={`relative w-full h-20 md:h-24 rounded-xl overflow-hidden transition-all duration-300 ${
      isWinner ? "ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/30" : ""
    }`}>
      {/* Water background */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-400/80 via-cyan-400/70 to-blue-400/80">
        {/* Animated waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute bottom-0 left-0 right-0 h-full animate-wave-slow"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100'%3E%3Cpath fill='%23ffffff' fill-opacity='0.3' d='M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,100 L0,100 Z'%3E%3C/path%3E%3C/svg%3E\")",
              backgroundSize: "400px 100%",
              backgroundRepeat: "repeat-x",
            }}
          />
        </div>
      </div>

      {/* Lane number */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <span className="text-white font-bold text-sm">{laneNumber}</span>
      </div>

      {/* Finish line */}
      <div className="absolute right-12 top-0 bottom-0 w-1">
        <div className="h-full w-full" style={{
          background: "repeating-linear-gradient(0deg, #fff 0px, #fff 4px, #111 4px, #111 8px)",
          opacity: 0.6,
        }} />
      </div>

      {/* Duck or buy-in button */}
      {isEmpty ? (
        <button
          onClick={onBuyIn}
          className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/15 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-white/40 group-hover:bg-white/20 transition-all">
            <span className="text-white/80 group-hover:text-white text-sm font-medium">Buy In</span>
            <span className="text-yellow-300 text-xs">🎟️</span>
          </div>
        </button>
      ) : (
        <div
          className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center gap-2"
          style={{
            left: `${Math.min(8 + progress * 0.82, 90)}%`,
          }}
        >
          <DuckSprite color={entry.duck_color} size={52} isRacing={isRacing} />
        </div>
      )}

      {/* Player name tag */}
      {entry && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          <div className={`px-2 py-1 rounded-md text-xs font-bold truncate max-w-[80px] ${
            isWinner
              ? "bg-yellow-400 text-yellow-900"
              : "bg-white/15 backdrop-blur-sm text-white/90"
          }`}>
            {entry.duck_name}
          </div>
        </div>
      )}

      {/* Winner badge */}
      {isWinner && (
        <div className="absolute top-1 right-1 z-20 text-lg animate-bounce">👑</div>
      )}
    </div>
  );
}
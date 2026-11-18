import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DuckSprite from "./DuckSprite";

export default function WinnerOverlay({ winner, onClose }) {
  if (!winner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 180 }}
          className="duck-card-elevated panel-accent relative w-full max-w-sm p-7 overflow-visible"
          style={{ borderColor: "hsl(var(--accent-lime) / 0.35)" }}
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute -top-4 -left-4 text-2xl animate-bounce">✨</div>
          <div className="absolute -top-4 -right-4 text-2xl animate-bounce">✨</div>

          <div className="text-center">
            <p className="t-label text-brand-lime/70">Race Complete</p>

            <motion.div
              className="mt-3 flex justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            >
              <DuckSprite color={winner.duck_color} hexColor={winner.duck_hex} size={116} hat={winner.hat} glasses={winner.glasses} clothes={winner.clothes} />
            </motion.div>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none tracking-[0.01em] text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-cyan">
              Winner
            </h2>
            <p className="mt-2 text-lg font-bold text-white truncate">{winner.duck_name}</p>
            <p className="t-meta text-slate-400">Owned by {winner.player_name}</p>
            {winner.lane_number ? (
              <p className="score-num mt-1.5 text-[11px] text-brand-yellow/80">LANE #{winner.lane_number}</p>
            ) : null}

            <div className="hud-divider my-5" />

            <button
              onClick={onClose}
              className="cta-esports w-full h-11 rounded-xl text-[11.5px] uppercase tracking-[0.14em]"
            >
              Back to Arena
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
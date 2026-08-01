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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 150 }}
          className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 max-w-sm mx-4"
          onClick={e => e.stopPropagation()}
        >
          {/* Sparkle decorations */}
          <div className="absolute -top-4 -left-4 text-3xl animate-bounce">✨</div>
          <div className="absolute -top-4 -right-4 text-3xl animate-bounce delay-100">✨</div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl animate-pulse">🏆</div>

          <div className="text-center space-y-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <p className="text-6xl">👑</p>
            </motion.div>

            <div className="flex justify-center">
              <DuckSprite color={winner.duck_color} size={120} hat={winner.hat} glasses={winner.glasses} clothes={winner.clothes} />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 font-display">
                WINNER!
              </h2>
              <p className="text-white text-xl font-bold mt-1">{winner.duck_name}</p>
              <p className="text-white/60 text-sm">Owned by {winner.player_name}</p>
              <p className="text-yellow-400/80 text-xs mt-1">Lane #{winner.lane_number}</p>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm border border-white/20 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
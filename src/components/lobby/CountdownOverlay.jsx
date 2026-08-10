import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CountdownOverlay({ active, onDone }) {
  const [n, setN] = useState(3);

  useEffect(() => {
    if (!active) return;
    setN(3);
    let v = 3;
    const id = setInterval(() => {
      v -= 1;
      if (v < 0) {
        clearInterval(id);
        onDone();
      } else {
        setN(v);
      }
    }, 900);
    return () => clearInterval(id);
  }, [active, onDone]);

  if (!active) return null;
  const label = n > 0 ? String(n) : "GO!";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        <div className="absolute w-64 h-64 rounded-full bg-brand-blue/20 blur-3xl animate-pulse" />
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative text-[120px] sm:text-[160px] font-black text-white tracking-tighter leading-none"
            style={{ textShadow: "0 0 60px rgba(40,194,255,0.6)" }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
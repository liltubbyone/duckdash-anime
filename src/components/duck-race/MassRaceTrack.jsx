import React, { useRef, useEffect, useState, useCallback } from "react";

const DUCK_COLORS = [
  "#FFD700", "#FF69B4", "#4FC3F7", "#66BB6A", "#AB47BC", "#EF5350",
  "#FF9800", "#26C6DA", "#9CCC65", "#7E57C2", "#EC407A", "#5C6BC0",
  "#FFCA28", "#26A69A", "#42A5F5", "#7E57C2",
];

const SPRITE_SIZE = 48; // offscreen sprite resolution

// Pre-render a duck sprite to an offscreen canvas for fast drawImage calls
function createDuckSprite(color, size = SPRITE_SIZE) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const s = size;

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.6, s * 0.32, s * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.ellipse(s * 0.4, s * 0.6, s * 0.16, s * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Head
  ctx.beginPath();
  ctx.arc(s * 0.7, s * 0.42, s * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // Eye white
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(s * 0.76, s * 0.4, s * 0.065, s * 0.078, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath();
  ctx.ellipse(s * 0.77, s * 0.4, s * 0.04, s * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(s * 0.79, s * 0.38, s * 0.02, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = "#FF8C00";
  ctx.beginPath();
  ctx.moveTo(s * 0.86, s * 0.42);
  ctx.lineTo(s * 0.98, s * 0.4);
  ctx.lineTo(s * 0.86, s * 0.48);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

// Pre-render the crown sprite once
function createCrownSprite(size = SPRITE_SIZE) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.font = `${size * 0.5}px serif`;
  ctx.textAlign = "center";
  ctx.fillText("👑", size / 2, size * 0.45);
  return canvas;
}

export default function MassRaceTrack({ race, isRacing, onStart, onFinish, onPositionsUpdate }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const winnerRef = useRef(null);
  const ducksRef = useRef([]);
  const speedsRef = useRef([]);
  const onFinishRef = useRef(onFinish);
  const onPositionsUpdateRef = useRef(onPositionsUpdate);
  const positionsFrameRef = useRef(0);
  const dimensionsRef = useRef({ width: 800, height: 450 });
  const spritesRef = useRef([]);
  const crownSpriteRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  const participants = race?.participants || [];
  const isFinished = race?.status === "finished";

  // Keep onFinish ref in sync (avoids re-creating render loop)
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    onPositionsUpdateRef.current = onPositionsUpdate;
  }, [onPositionsUpdate]);

  // Keep dimensionsRef in sync
  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);

  // Pre-render duck sprites once
  useEffect(() => {
    spritesRef.current = DUCK_COLORS.map(c => createDuckSprite(c));
    crownSpriteRef.current = createCrownSprite();
  }, []);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = Math.max(300, Math.min(600, w * 9 / 16));
      dimensionsRef.current = { width: w, height: h };
      setDimensions({ width: w, height: h });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Draw water background + finish line, return finishX
  const drawBackground = useCallback((ctx, width, height, now) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#0ea5e9");
    grad.addColorStop(0.5, "#0284c7");
    grad.addColorStop(1, "#075985");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Wave overlay
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < width; i += 20) {
      const offset = Math.sin((i + now * 0.05) * 0.02) * 4;
      ctx.fillRect(i, height * 0.7 + offset, 10, height * 0.3);
    }

    // Finish line (checkered)
    const finishX = width - 24;
    let toggle = true;
    for (let y = 0; y < height; y += 8) {
      ctx.fillStyle = toggle ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.4)";
      ctx.fillRect(finishX, y, 8, 8);
      toggle = !toggle;
    }
    return finishX;
  }, []);

  // Compute grid layout
  const computeLayout = useCallback((count, width, height) => {
    const padding = 8;
    const trackHeight = height - padding * 2;
    const aspect = width / trackHeight;
    const rows = Math.max(1, Math.round(Math.sqrt(count / aspect)));
    const cols = Math.ceil(count / rows);
    const rowHeight = trackHeight / rows;
    const duckSize = Math.min(rowHeight * 0.9, Math.max(4, rowHeight - 2));
    return { rows, cols, rowHeight, duckSize, padding };
  }, []);

  // Stable render loop — reads everything from refs
  const render = useCallback((now) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      animFrameRef.current = requestAnimationFrame(render);
      return;
    }
    const ctx = canvas.getContext("2d");
    const { width, height } = dimensionsRef.current;

    const finishX = drawBackground(ctx, width, height, now);

    const ducks = ducksRef.current;
    const speeds = speedsRef.current;
    const sprites = spritesRef.current;
    const crown = crownSpriteRef.current;

    if (ducks.length === 0 || sprites.length === 0) {
      animFrameRef.current = requestAnimationFrame(render);
      return;
    }

    const { rows, rowHeight, duckSize, padding } = computeLayout(ducks.length, width, height);
    const cols = Math.ceil(ducks.length / rows);

    const durationMs = Math.max(3, race?.race_duration || 10) * 1000;
    const baseSpeed = 1 / durationMs;

    // Delta time (clamped)
    if (!lastTimeRef.current) lastTimeRef.current = now;
    const dt = Math.min(50, now - lastTimeRef.current);
    lastTimeRef.current = now;

    // Report live top-3 positions (throttled) for the leaderboard
    positionsFrameRef.current++;
    if (positionsFrameRef.current % 6 === 0 && onPositionsUpdateRef.current) {
      const top = ducks
        .map((d, i) => ({ name: d.name, colorIndex: i, progress: d.progress }))
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3);
      onPositionsUpdateRef.current(top);
    }

    // Check for winner
    if (!winnerRef.current) {
      for (let i = 0; i < ducks.length; i++) {
        if (ducks[i].progress >= 1) {
          winnerRef.current = ducks[i];
          break;
        }
      }
    }

    const showNames = ducks.length <= 50;
    const startX = 16;
    const maxX = finishX - duckSize;
    const range = maxX - startX;

    const winnerDuck = winnerRef.current;

    for (let i = 0; i < ducks.length; i++) {
      const duck = ducks[i];

      if (!winnerDuck) {
        // Occasionally fluctuate speed
        if (Math.random() < 0.1) {
          speeds[i] = baseSpeed * (0.5 + Math.random() * 1.2);
        }
        duck.progress = Math.min(1, duck.progress + speeds[i] * dt);
      }

      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = startX + duck.progress * range;
      const bob = Math.sin(now * 0.005 + i * 0.5) * 2;
      const y = padding + row * rowHeight + rowHeight / 2 + bob - duckSize / 2;

      const sprite = sprites[i % sprites.length];
      ctx.drawImage(sprite, x, y, duckSize, duckSize);

      // Crown on winner
      if (winnerDuck === duck && crown) {
        ctx.drawImage(crown, x + duckSize * 0.1, y - duckSize * 0.3, duckSize, duckSize);
      }

      if (showNames) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `${Math.max(8, duckSize * 0.4)}px Arial`;
        ctx.textAlign = "left";
        ctx.fillText(duck.name.substring(0, 12), x + duckSize * 0.7, y + duckSize * 0.3);
      }
    }

    if (winnerDuck) {
      onFinishRef.current({ name: winnerDuck.name, hex: DUCK_COLORS[winnerDuck.colorIndex] });
      return; // Stop the loop
    }

    animFrameRef.current = requestAnimationFrame(render);
  }, [race, drawBackground, computeLayout]);

  // Start animation
  const startAnimation = useCallback(() => {
    const names = race?.participants || [];
    if (names.length === 0) return;

    const durationMs = Math.max(3, race?.race_duration || 10) * 1000;
    const baseSpeed = 1 / durationMs;

    ducksRef.current = names.map((name, i) => ({ name, progress: 0, colorIndex: i % DUCK_COLORS.length }));
    speedsRef.current = names.map(() => baseSpeed);
    winnerRef.current = null;
    lastTimeRef.current = 0;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(render);
  }, [race, render]);

  // Countdown then start
  const handleStart = useCallback(() => {
    let count = 3;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        setHasStarted(true);
        onStart();
        startAnimation();
      }
    }, 800);
  }, [onStart, startAnimation]);

  // Auto-start when race status becomes racing
  useEffect(() => {
    if (race?.status === "racing" && !animFrameRef.current && !winnerRef.current) {
      if (!hasStarted) setHasStarted(true);
      startAnimation();
    }
  }, [race?.status, race?.race_started_at, startAnimation, hasStarted]);

  // Reset started flag when a new race (waiting) loads
  useEffect(() => {
    if (race?.status === "waiting" && !animFrameRef.current) {
      setHasStarted(false);
      winnerRef.current = null;
    }
  }, [race?.id, race?.status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []);

  // Draw static state (waiting or finished)
  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = dimensionsRef.current;

    drawBackground(ctx, width, height, performance.now());

    const finishX = width - 24;
    const names = race?.participants || [];
    if (names.length === 0 || spritesRef.current.length === 0) return;

    const { rows, rowHeight, duckSize, padding } = computeLayout(names.length, width, height);
    const cols = Math.ceil(names.length / rows);
    const sprites = spritesRef.current;
    const crown = crownSpriteRef.current;
    const ducks = ducksRef.current;
    const startX = 16;
    const maxX = finishX - duckSize;
    const range = maxX - startX;

    names.forEach((name, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const y = padding + row * rowHeight + rowHeight / 2 - duckSize / 2;
      const progress = isFinished && ducks[i] ? (ducks[i].progress || 0) : 0;
      const x = isFinished ? startX + progress * range : 16 + (i % 5) * 3;
      const sprite = sprites[i % sprites.length];
      ctx.drawImage(sprite, x, y, duckSize, duckSize);

      const isWinner = race?.winner_name === name;
      if (isWinner && crown) {
        ctx.drawImage(crown, x + duckSize * 0.1, y - duckSize * 0.3, duckSize, duckSize);
      }

      if (names.length <= 50) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `${Math.max(8, duckSize * 0.4)}px Arial`;
        ctx.textAlign = "left";
        ctx.fillText(name.substring(0, 12), x + duckSize * 0.7, y + duckSize * 0.3);
      }
    });
  }, [race, isFinished, drawBackground, computeLayout]);

  useEffect(() => {
    if (isRacing || race?.status === "racing") return;
    drawStatic();
  }, [dimensions, race, isRacing, isFinished, drawStatic]);

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="block w-full"
        />

        {/* Countdown overlay */}
        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="text-7xl font-bold text-white font-display animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Waiting overlay */}
        {race?.status === "waiting" && !countdown && !hasStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm gap-4">
            <p className="text-white/80 text-sm">
              {participants.length} ducks ready to race
            </p>
            {onStart && (
              <button
                onClick={handleStart}
                disabled={participants.length < 2}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg disabled:opacity-50 transition-all"
              >
                🏁 Start Mass Race
              </button>
            )}
          </div>
        )}

        {/* Finished overlay */}
        {isFinished && race?.winner_name && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-yellow-400 text-yellow-900 font-bold shadow-lg">
            👑 Winner: {race.winner_name}
          </div>
        )}
      </div>

      {participants.length > 50 && race?.status !== "racing" && (
        <p className="text-white/40 text-xs text-center">
          Showing {participants.length} participants — names hidden during large races
        </p>
      )}
    </div>
  );
}
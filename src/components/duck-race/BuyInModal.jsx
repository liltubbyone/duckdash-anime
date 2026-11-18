import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DuckSprite, { AVAILABLE_COLORS } from "./DuckSprite";
import { HATS, GLASSES, CLOTHES } from "./accessories";

const DUCK_NAMES = [
  "Quackzilla", "Sir Waddles", "Duckinator", "Captain Quack",
  "Thunder Duck", "Splash Master", "Feather Storm", "Aqua Wing",
  "Turbo Quack", "Duck Norris", "Wave Rider", "Swift Tail"
];

export default function BuyInModal({ open, onClose, laneNumber, buyInAmount, takenColors, availableLanes = [], totalLanes = 0, isMassRace, onConfirm, defaultName = "", defaultLoadout = {} }) {
  const savedColor = defaultLoadout?.duck_color;
  const [playerName, setPlayerName] = useState(defaultName);
  const [duckName, setDuckName] = useState(DUCK_NAMES[Math.floor(Math.random() * DUCK_NAMES.length)]);
  const [selectedColor, setSelectedColor] = useState(
    savedColor && !takenColors.includes(savedColor) ? savedColor : AVAILABLE_COLORS.find(c => !takenColors.includes(c)) || AVAILABLE_COLORS[0]
  );
  const [hat, setHat] = useState(defaultLoadout?.hat || "none");
  const [glasses, setGlasses] = useState(defaultLoadout?.glasses || "none");
  const [clothes, setClothes] = useState(defaultLoadout?.clothes || "none");
  const [submitting, setSubmitting] = useState(false);
  const [selectedLane, setSelectedLane] = useState(laneNumber);

  // Reset to saved loadout whenever the modal opens
  useEffect(() => {
    if (open) {
      setPlayerName(defaultName);
      setHat(defaultLoadout?.hat || "none");
      setGlasses(defaultLoadout?.glasses || "none");
      setClothes(defaultLoadout?.clothes || "none");
      const sc = defaultLoadout?.duck_color;
      if (sc && !takenColors.includes(sc)) setSelectedColor(sc);
      setSelectedLane(availableLanes.includes(laneNumber) ? laneNumber : (availableLanes[0] || laneNumber));
    }
  }, [open, defaultName, defaultLoadout, laneNumber, availableLanes]);

  const handleConfirm = async () => {
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onConfirm({ playerName: playerName.trim(), duckName, duckColor: selectedColor, hat, glasses, clothes, lane: selectedLane });
    } finally {
      setSubmitting(false);
    }
  };

  const availableColors = AVAILABLE_COLORS.filter(c => !takenColors.includes(c));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-surface-1 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="t-label text-slate-500">Race Entry</span>
            <span className="mt-1 block font-display text-2xl font-extrabold uppercase tracking-[0.02em]">
              Join Race
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Duck Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-lime/15 rounded-full blur-xl" />
              <DuckSprite color={selectedColor} size={100} hat={hat} glasses={glasses} clothes={clothes} />
            </div>
          </div>

          {/* Lane selection */}
          {!isMassRace && totalLanes > 0 && (
            <div>
              <Label className="t-label text-slate-400">Choose Your Lane</Label>
              <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
                {Array.from({ length: totalLanes }, (_, i) => i + 1).map(lane => {
                  const available = availableLanes.includes(lane);
                  return (
                    <button
                      key={lane}
                      disabled={!available}
                      onClick={() => setSelectedLane(lane)}
                      className={`w-9 h-9 rounded-md text-sm font-bold transition-all ${
                        !available
                          ? "opacity-20 cursor-not-allowed bg-white/[0.03]"
                          : selectedLane === lane
                            ? "bg-brand-lime text-black scale-110"
                            : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"
                      }`}
                    >
                      {lane}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color selection */}
          <div>
            <Label className="t-label text-slate-400">Choose Your Duck</Label>
            <div className="flex gap-2 mt-2 justify-center">
              {AVAILABLE_COLORS.map(color => {
                const taken = takenColors.includes(color);
                return (
                  <button
                    key={color}
                    disabled={taken}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      taken
                        ? "opacity-25 cursor-not-allowed border-transparent"
                        : selectedColor === color
                          ? "border-brand-lime scale-110 shadow-[0_0_18px_-6px_hsl(var(--accent-lime)/0.8)]"
                          : "border-transparent hover:border-white/50 hover:scale-105"
                    }`}
                  >
                    <DuckSprite color={color} size={36} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player name */}
          <div>
            <Label className="t-label text-slate-400">Your Name</Label>
            <Input
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className="mt-1 bg-white/[0.05] border-white/12 text-white placeholder:text-slate-600"
              maxLength={20}
            />
          </div>

          {/* Duck name */}
          <div>
            <Label className="t-label text-slate-400">Duck Name</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={duckName}
                onChange={e => setDuckName(e.target.value)}
                className="bg-white/[0.05] border-white/12 text-white"
                maxLength={15}
              />
              <Button
                variant="outline"
                size="sm"
                className="border-white/12 text-slate-300 hover:bg-white/[0.08] shrink-0"
                onClick={() => setDuckName(DUCK_NAMES[Math.floor(Math.random() * DUCK_NAMES.length)])}
              >
                🎲
              </Button>
            </div>
          </div>

          {/* Accessories */}
          <div className="space-y-3">
            {[
              { label: "Hat", value: hat, set: setHat, options: HATS },
              { label: "Glasses", value: glasses, set: setGlasses, options: GLASSES },
              { label: "Clothes", value: clothes, set: setClothes, options: CLOTHES },
            ].map(group => (
              <div key={group.label}>
                <Label className="t-label text-slate-400">{group.label}</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {group.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => group.set(opt.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        group.value === opt.id
                          ? "bg-brand-lime text-black"
                          : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Buy in info */}
          <div className="rounded-xl p-3 text-center border border-white/10 bg-white/[0.03]">
            <p className="t-label text-slate-500">Buy-in Amount</p>
            <p className="score-num mt-1 text-2xl text-brand-yellow">{buyInAmount > 0 ? `$${buyInAmount}` : "FREE"}</p>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!playerName.trim() || availableColors.length === 0 || submitting}
            className="cta-esports w-full font-bold text-[12px] uppercase tracking-[0.14em] h-12 rounded-xl"
          >
            {submitting ? "Redirecting to checkout..." : buyInAmount > 0 ? `🦆 Enter Race — $${buyInAmount}` : "🦆 Enter Race — Free"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
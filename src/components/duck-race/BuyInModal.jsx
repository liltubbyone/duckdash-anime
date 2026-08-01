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

export default function BuyInModal({ open, onClose, laneNumber, buyInAmount, takenColors, onConfirm, defaultName = "", defaultLoadout = {} }) {
  const savedColor = defaultLoadout?.duck_color;
  const [playerName, setPlayerName] = useState(defaultName);
  const [duckName, setDuckName] = useState(DUCK_NAMES[Math.floor(Math.random() * DUCK_NAMES.length)]);
  const [selectedColor, setSelectedColor] = useState(
    savedColor && !takenColors.includes(savedColor) ? savedColor : AVAILABLE_COLORS.find(c => !takenColors.includes(c)) || AVAILABLE_COLORS[0]
  );
  const [hat, setHat] = useState(defaultLoadout?.hat || "none");
  const [glasses, setGlasses] = useState(defaultLoadout?.glasses || "none");
  const [clothes, setClothes] = useState(defaultLoadout?.clothes || "none");

  // Reset to saved loadout whenever the modal opens
  useEffect(() => {
    if (open) {
      setPlayerName(defaultName);
      setHat(defaultLoadout?.hat || "none");
      setGlasses(defaultLoadout?.glasses || "none");
      setClothes(defaultLoadout?.clothes || "none");
      const sc = defaultLoadout?.duck_color;
      if (sc && !takenColors.includes(sc)) setSelectedColor(sc);
    }
  }, [open, defaultName, defaultLoadout]);

  const handleConfirm = () => {
    if (!playerName.trim()) return;
    onConfirm({ playerName: playerName.trim(), duckName, duckColor: selectedColor, hat, glasses, clothes });
  };

  const availableColors = AVAILABLE_COLORS.filter(c => !takenColors.includes(c));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-slate-900 to-slate-800 border-sky-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              🏁 Join Lane {laneNumber}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Duck Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-xl" />
              <DuckSprite color={selectedColor} size={100} hat={hat} glasses={glasses} clothes={clothes} />
            </div>
          </div>

          {/* Color selection */}
          <div>
            <Label className="text-sky-200 text-xs uppercase tracking-wider">Choose Your Duck</Label>
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
                          ? "border-white scale-110 shadow-lg"
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
            <Label className="text-sky-200 text-xs uppercase tracking-wider">Your Name</Label>
            <Input
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              maxLength={20}
            />
          </div>

          {/* Duck name */}
          <div>
            <Label className="text-sky-200 text-xs uppercase tracking-wider">Duck Name</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={duckName}
                onChange={e => setDuckName(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                maxLength={15}
              />
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 shrink-0"
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
                <Label className="text-sky-200 text-xs uppercase tracking-wider">{group.label}</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {group.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => group.set(opt.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        group.value === opt.id
                          ? "bg-sky-500 text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/20"
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
          <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
            <p className="text-white/60 text-xs">Buy-in Amount</p>
            <p className="text-2xl font-bold text-yellow-400">${buyInAmount}</p>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!playerName.trim() || availableColors.length === 0}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg h-12"
          >
            🦆 Enter Race!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Trophy, Settings, Users, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPanel({ race, entriesCount, onStartRace, onNewRace, isRacing }) {
  const [buyIn, setBuyIn] = useState("10");
  const [lanes, setLanes] = useState("6");
  const [duration, setDuration] = useState(race?.race_duration || 10);
  const [isMass, setIsMass] = useState(false);
  const [namesText, setNamesText] = useState("");

  const canStart = entriesCount >= 2 && race?.status === "waiting";
  const isMassRace = race?.is_mass_race;

  const handleNewRace = () => {
    const buyInNum = Math.max(0, Number(buyIn) || 0);
    const lanesNum = Math.min(20, Math.max(2, Number(lanes) || 2));
    if (isMass) {
      const names = namesText
        .split("\n")
        .map(n => n.trim())
        .filter(n => n.length > 0)
        .slice(0, 1000);
      onNewRace(buyInNum, lanesNum, duration, { isMassRace: true, participants: names });
    } else {
      onNewRace(buyInNum, lanesNum, duration);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 space-y-4">
      <div className="flex items-center gap-2 text-white/90">
        <Settings className="w-4 h-4 text-sky-400" />
        <h3 className="font-bold text-sm uppercase tracking-wider">Admin Controls</h3>
      </div>

      {/* Start button for standard races */}
      {race?.status === "waiting" && !isMassRace && (
        <Button
          onClick={onStartRace}
          disabled={!canStart || isRacing}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold h-11 gap-2"
        >
          <Play className="w-4 h-4" />
          Start Race ({entriesCount} ducks)
        </Button>
      )}

      {race?.status === "finished" && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">
              {isMassRace ? `Winner: ${race.winner_name || "—"}` : "Race Complete!"}
            </span>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-white/10">
        {/* Race mode toggle */}
        <Label className="text-white/60 text-xs mb-1.5 block">Race Mode</Label>
        <div className="flex gap-1.5 mb-3">
          <button
            onClick={() => setIsMass(false)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              !isMass
                ? "bg-sky-500 text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Lanes
          </button>
          <button
            onClick={() => setIsMass(true)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              isMass
                ? "bg-sky-500 text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Mass (up to 1000)
          </button>
        </div>

        {/* Mass race: names input */}
        {isMass ? (
          <div className="mb-3">
            <Label className="text-white/60 text-xs">
              Participant Names (one per line, max 1000)
            </Label>
            <Textarea
              value={namesText}
              onChange={e => setNamesText(e.target.value)}
              placeholder={"Alice\nBob\nCharlie\n..."}
              rows={6}
              className="bg-white/10 border-white/20 text-white mt-1 text-sm font-mono"
            />
            <p className="text-white/40 text-xs mt-1">
              {namesText.split("\n").filter(n => n.trim()).length} names entered
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Buy-in ($)</Label>
                <Input
                  type="number"
                  value={buyIn}
                  onChange={e => setBuyIn(e.target.value)}
                  min={0}
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs">Lanes</Label>
                <Input
                  type="number"
                  value={lanes}
                  onChange={e => setLanes(e.target.value)}
                  min={2}
                  max={20}
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
            </div>
          </>
        )}

        {/* Duration (shared) */}
        <div className="mt-3">
          <Label className="text-white/60 text-xs">Race Duration</Label>
          <div className="flex gap-1.5 mt-1.5">
            {[5, 10, 15, 20, 30].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                  duration === d
                    ? "bg-sky-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={handleNewRace}
          className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 gap-2"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4" />
          {isMass ? "Create Mass Race" : "New Race"}
        </Button>
      </div>
    </div>
  );
}
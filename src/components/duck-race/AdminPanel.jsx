import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Trophy, Settings, Users, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";

export default function AdminPanel({ race, entriesCount, onStartRace, onNewRace, isRacing }) {
  const [buyIn, setBuyIn] = useState("10");
  const [lanes, setLanes] = useState("6");
  const [ducksPerLane, setDucksPerLane] = useState("1");
  const [massSpots, setMassSpots] = useState("20");
  const [duration, setDuration] = useState(race?.race_duration || 10);
  const [isMass, setIsMass] = useState(false);
  const [autoStart, setAutoStart] = useState(true);
  const [raceName, setRaceName] = useState("");
  const [prizeName, setPrizeName] = useState("");
  const [prizeImage, setPrizeImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const canStart = entriesCount >= 2 && race?.status === "waiting";
  const isMassRace = race?.is_mass_race;

  const handleNewRace = () => {
    const buyInNum = Math.max(0, Number(buyIn) || 0);
    const details = {
      race_name: raceName.trim(),
      prize_name: prizeName.trim(),
      prize_image: prizeImage,
      auto_start: autoStart,
    };
    if (isMass) {
      const spotsNum = Math.min(1000, Math.max(2, Number(massSpots) || 2));
      onNewRace(buyInNum, spotsNum, duration, { ...details, isMassRace: true });
    } else {
      const lanesNum = Math.min(20, Math.max(2, Number(lanes) || 2));
      const dplNum = Math.max(1, Number(ducksPerLane) || 1);
      onNewRace(buyInNum, lanesNum, duration, { ...details, ducks_per_lane: dplNum });
    }
  };

  const handlePrizeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPrizeImage(file_url);
    } catch (err) {
      console.error("Prize upload failed:", err);
    } finally {
      setUploading(false);
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
        {/* Race details */}
        <div className="mb-3 space-y-2">
          <div>
            <Label className="text-white/60 text-xs">Race Name</Label>
            <Input
              value={raceName}
              onChange={e => setRaceName(e.target.value)}
              placeholder="e.g. Saturday Showdown"
              className="bg-white/10 border-white/20 text-white mt-1"
              maxLength={40}
            />
          </div>
          <div>
            <Label className="text-white/60 text-xs">Prize Name</Label>
            <Input
              value={prizeName}
              onChange={e => setPrizeName(e.target.value)}
              placeholder="e.g. Golden Trophy"
              className="bg-white/10 border-white/20 text-white mt-1"
              maxLength={40}
            />
          </div>
          <div>
            <Label className="text-white/60 text-xs">Prize Photo</Label>
            {prizeImage ? (
              <div className="relative mt-1 w-20 h-20 rounded-lg overflow-hidden border border-white/20">
                <Image src={prizeImage} fittingType="fill" className="w-full h-full" />
                <button
                  onClick={() => setPrizeImage("")}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className={`mt-1 flex items-center justify-center gap-2 h-20 rounded-lg border border-dashed border-white/20 cursor-pointer hover:bg-white/10 transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                <input type="file" accept="image/*" onChange={handlePrizeUpload} className="hidden" />
                <span className="text-white/50 text-xs">{uploading ? "Uploading..." : "＋ Upload prize photo"}</span>
              </label>
            )}
          </div>
        </div>

        {/* Race mode toggle */}
        <Label className="text-white/60 text-xs mb-1.5 block">Race Mode</Label>
        <div className="flex gap-1.5 mb-3">
          <button
            onClick={() => setIsMass(false)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              !isMass ? "bg-sky-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Lanes
          </button>
          <button
            onClick={() => setIsMass(true)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              isMass ? "bg-sky-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Mass (up to 1000)
          </button>
        </div>

        {/* Buy-in (shared) */}
        <div className="mb-3">
          <Label className="text-white/60 text-xs">Buy-in ($)</Label>
          <Input
            type="number"
            value={buyIn}
            onChange={e => setBuyIn(e.target.value)}
            min={0}
            className="bg-white/10 border-white/20 text-white mt-1"
          />
          <p className="text-white/40 text-xs mt-1">{Number(buyIn) > 0 ? "Users pay to join" : "Free entry"}</p>
        </div>

        {/* Mode-specific capacity */}
        {isMass ? (
          <div className="mb-3">
            <Label className="text-white/60 text-xs">Total Spots</Label>
            <Input
              type="number"
              value={massSpots}
              onChange={e => setMassSpots(e.target.value)}
              min={2}
              max={1000}
              className="bg-white/10 border-white/20 text-white mt-1"
            />
            <p className="text-white/40 text-xs mt-1">Users sign up to fill spots</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-3">
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
            <div>
              <Label className="text-white/60 text-xs">Ducks per Lane</Label>
              <Input
                type="number"
                value={ducksPerLane}
                onChange={e => setDucksPerLane(e.target.value)}
                min={1}
                max={10}
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
          </div>
        )}

        {/* Start mode (shared) */}
        <div className="mb-3">
          <Label className="text-white/60 text-xs mb-1.5 block">Start Mode</Label>
          <div className="flex gap-1.5">
            <button
              onClick={() => setAutoStart(true)}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                autoStart ? "bg-sky-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              Auto (when full)
            </button>
            <button
              onClick={() => setAutoStart(false)}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                !autoStart ? "bg-sky-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              Manual (admin starts)
            </button>
          </div>
        </div>

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
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
    <div className="duck-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="w-3.5 h-3.5 text-brand-lime" />
        <h3 className="t-label text-slate-400">Admin Controls</h3>
      </div>

      {/* Start button for standard races */}
      {race?.status === "waiting" && !isMassRace && (
        <Button
          onClick={onStartRace}
          disabled={!canStart || isRacing}
          className="cta-esports w-full h-11 gap-2 text-[11.5px] uppercase tracking-[0.14em]"
        >
          <Play className="w-4 h-4" />
          Start Race ({entriesCount} ducks)
        </Button>
      )}

      {race?.status === "finished" && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-brand-yellow">
            <Trophy className="w-4 h-4" />
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
            <Label className="t-label text-slate-400">Race Name</Label>
            <Input
              value={raceName}
              onChange={e => setRaceName(e.target.value)}
              placeholder="e.g. Saturday Showdown"
              className="bg-white/[0.05] border-white/12 text-white mt-1"
              maxLength={40}
            />
          </div>
          <div>
            <Label className="t-label text-slate-400">Prize Name</Label>
            <Input
              value={prizeName}
              onChange={e => setPrizeName(e.target.value)}
              placeholder="e.g. Golden Trophy"
              className="bg-white/[0.05] border-white/12 text-white mt-1"
              maxLength={40}
            />
          </div>
          <div>
            <Label className="t-label text-slate-400">Prize Photo</Label>
            {prizeImage ? (
              <div className="relative mt-1 w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                <Image src={prizeImage} fittingType="fill" className="w-full h-full" />
                <button
                  onClick={() => setPrizeImage("")}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className={`mt-1 flex items-center justify-center gap-2 h-20 rounded-lg border border-dashed border-white/12 cursor-pointer hover:bg-white/[0.05] hover:border-white/25 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                <input type="file" accept="image/*" onChange={handlePrizeUpload} className="hidden" />
                <span className="t-meta text-slate-500">{uploading ? "Uploading..." : "＋ Upload prize photo"}</span>
              </label>
            )}
          </div>
        </div>

        {/* Race mode toggle */}
        <Label className="t-label text-slate-400 mb-1.5 block">Race Mode</Label>
        <div className="flex gap-1.5 mb-3">
          <button
            onClick={() => setIsMass(false)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              !isMass ? "bg-brand-lime text-black" : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Lanes
          </button>
          <button
            onClick={() => setIsMass(true)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              isMass ? "bg-brand-lime text-black" : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Mass (up to 1000)
          </button>
        </div>

        {/* Buy-in (shared) */}
        <div className="mb-3">
          <Label className="t-label text-slate-400">Buy-in ($)</Label>
          <Input
            type="number"
            value={buyIn}
            onChange={e => setBuyIn(e.target.value)}
            min={0}
            className="bg-white/[0.05] border-white/12 text-white mt-1"
          />
          <p className="t-meta text-slate-600 mt-1">{Number(buyIn) > 0 ? "Users pay to join" : "Free entry"}</p>
        </div>

        {/* Mode-specific capacity */}
        {isMass ? (
          <div className="mb-3">
            <Label className="t-label text-slate-400">Total Spots</Label>
            <Input
              type="number"
              value={massSpots}
              onChange={e => setMassSpots(e.target.value)}
              min={2}
              max={1000}
              className="bg-white/[0.05] border-white/12 text-white mt-1"
            />
            <p className="t-meta text-slate-600 mt-1">Users sign up to fill spots</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label className="t-label text-slate-400">Lanes</Label>
              <Input
                type="number"
                value={lanes}
                onChange={e => setLanes(e.target.value)}
                min={2}
                max={20}
                className="bg-white/[0.05] border-white/12 text-white mt-1"
              />
            </div>
            <div>
              <Label className="t-label text-slate-400">Ducks per Lane</Label>
              <Input
                type="number"
                value={ducksPerLane}
                onChange={e => setDucksPerLane(e.target.value)}
                min={1}
                max={10}
                className="bg-white/[0.05] border-white/12 text-white mt-1"
              />
            </div>
          </div>
        )}

        {/* Start mode (shared) */}
        <div className="mb-3">
          <Label className="t-label text-slate-400 mb-1.5 block">Start Mode</Label>
          <div className="flex gap-1.5">
            <button
              onClick={() => setAutoStart(true)}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                autoStart ? "bg-brand-lime text-black" : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"
              }`}
            >
              Auto (when full)
            </button>
            <button
              onClick={() => setAutoStart(false)}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                !autoStart ? "bg-brand-lime text-black" : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"
              }`}
            >
              Manual (admin starts)
            </button>
          </div>
        </div>

        {/* Duration (shared) */}
        <div className="mt-3">
          <Label className="t-label text-slate-400">Race Duration</Label>
          <div className="flex gap-1.5 mt-1.5">
            {[5, 10, 15, 20, 30].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                  duration === d
                    ? "bg-brand-lime text-black"
                    : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={handleNewRace}
          className="w-full mt-3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/12 gap-2"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4" />
          {isMass ? "Create Mass Race" : "New Race"}
        </Button>
      </div>
    </div>
  );
}
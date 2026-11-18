import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";
import { Save, Trash2, Pencil } from "lucide-react";

export default function RaceEditor({ race, onUpdate, onDelete }) {
  const [raceName, setRaceName] = useState("");
  const [prizeName, setPrizeName] = useState("");
  const [prizeImage, setPrizeImage] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [duration, setDuration] = useState(10);
  const [autoStart, setAutoStart] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (race) {
      setRaceName(race.race_name || "");
      setPrizeName(race.prize_name || "");
      setPrizeImage(race.prize_image || "");
      setBuyIn(String(race.buy_in_amount ?? 0));
      setDuration(race.race_duration || 10);
      setAutoStart(race.auto_start !== false);
    }
  }, [race?.id]);

  if (!race || race.status !== "waiting") return null;

  const handleUpload = async (e) => {
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

  const handleSave = () => {
    onUpdate(race.id, {
      race_name: raceName.trim(),
      prize_name: prizeName.trim(),
      prize_image: prizeImage,
      buy_in_amount: Math.max(0, Number(buyIn) || 0),
      race_duration: duration,
      auto_start: autoStart,
    });
  };

  return (
    <div className="duck-card p-5 space-y-3">
      <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-2 w-full">
        <Pencil className="w-3.5 h-3.5 text-brand-lime" />
        <h3 className="t-label text-slate-400">Edit / Manage Race</h3>
      </button>
      {expanded && (
        <>
          <div>
            <Label className="t-label text-slate-400">Race Name</Label>
            <Input value={raceName} onChange={e => setRaceName(e.target.value)} className="bg-white/[0.05] border-white/12 text-white mt-1" maxLength={40} />
          </div>
          <div>
            <Label className="t-label text-slate-400">Prize Name</Label>
            <Input value={prizeName} onChange={e => setPrizeName(e.target.value)} className="bg-white/[0.05] border-white/12 text-white mt-1" maxLength={40} />
          </div>
          <div>
            <Label className="t-label text-slate-400">Prize Photo</Label>
            {prizeImage ? (
              <div className="relative mt-1 w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                <Image src={prizeImage} fittingType="fill" className="w-full h-full" />
                <button onClick={() => setPrizeImage("")} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center">✕</button>
              </div>
            ) : (
              <label className={`mt-1 flex items-center justify-center gap-2 h-16 rounded-lg border border-dashed border-white/12 cursor-pointer hover:bg-white/[0.05] hover:border-white/25 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <span className="t-meta text-slate-500">{uploading ? "Uploading..." : "＋ Upload prize photo"}</span>
              </label>
            )}
          </div>
          <div>
            <Label className="t-label text-slate-400">Buy-in ($)</Label>
            <Input type="number" value={buyIn} onChange={e => setBuyIn(e.target.value)} min={0} className="bg-white/[0.05] border-white/12 text-white mt-1" />
          </div>
          <div>
            <Label className="t-label text-slate-400">Race Duration</Label>
            <div className="flex gap-1.5 mt-1.5">
              {[5, 10, 15, 20, 30].map(d => (
                <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${duration === d ? "bg-brand-lime text-black" : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"}`}>{d}s</button>
              ))}
            </div>
          </div>
          <div>
            <Label className="t-label text-slate-400 mb-1.5 block">Start Mode</Label>
            <div className="flex gap-1.5">
              <button onClick={() => setAutoStart(true)} className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${autoStart ? "bg-brand-lime text-black" : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"}`}>Auto (when full)</button>
              <button onClick={() => setAutoStart(false)} className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${!autoStart ? "bg-brand-lime text-black" : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white"}`}>Manual</button>
            </div>
          </div>
          <Button onClick={handleSave} className="cta-esports w-full font-bold gap-2 text-[11px] uppercase tracking-[0.12em]">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
          <Button onClick={() => { if (confirm("Delete this race and all its entries?")) onDelete(race.id); }} variant="outline" className="w-full bg-brand-red/10 hover:bg-brand-red/15 border-brand-red/30 text-brand-red gap-2">
            <Trash2 className="w-4 h-4" /> Delete Race
          </Button>
        </>
      )}
    </div>
  );
}
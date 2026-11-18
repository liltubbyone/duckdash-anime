import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import DuckSprite, { AVAILABLE_COLORS } from "@/components/duck-race/DuckSprite";
import { HATS, GLASSES, CLOTHES } from "@/components/duck-race/accessories";
import { useToast } from "@/components/ui/use-toast";

const GROUPS = [
  { key: "hat", label: "Hats", options: HATS },
  { key: "glasses", label: "Glasses", options: GLASSES },
  { key: "clothes", label: "Outfits", options: CLOTHES },
];

export default function Customize() {
  const { toast } = useToast();
  const [color, setColor] = useState("gold");
  const [hat, setHat] = useState("none");
  const [glasses, setGlasses] = useState("none");
  const [clothes, setClothes] = useState("none");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me().then(me => {
      setColor(me?.duck_color || "gold");
      setHat(me?.hat || "none");
      setGlasses(me?.glasses || "none");
      setClothes(me?.clothes || "none");
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ duck_color: color, hat, glasses, clothes });
    setSaving(false);
    toast({
      title: "Duck customized! 🦆",
      description: "Your look is saved and ready for the next race.",
    });
  };

  const setters = { hat: setHat, glasses: setGlasses, clothes: setClothes };
  const values = { hat, glasses, clothes };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-2">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.12em] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Arena
      </Link>

      <div className="flex items-center gap-2.5 mb-6">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-yellow/12 border border-brand-yellow/30">
          <Sparkles className="w-4 h-4 text-brand-yellow" />
        </span>
        <h1 className="t-page-title text-white">Customize Your Duck</h1>
      </div>

      {/* Preview */}
      <div className="duck-card panel-accent relative overflow-hidden flex flex-col items-center py-8 mb-4">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(320px 160px at 50% 0%, hsl(var(--accent-lime) / 0.18), transparent 70%)" }} />
        <div className="relative">
          <DuckSprite color={color} size={132} hat={hat} glasses={glasses} clothes={clothes} />
        </div>
        <p className="t-label text-slate-500 mt-4">Live Loadout Preview</p>
      </div>

      {/* Color */}
      <div className="duck-card p-5 mb-3">
        <Label className="t-label text-slate-500 mb-3 block">Duck Color</Label>
        <div className="flex gap-2 flex-wrap">
          {AVAILABLE_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                color === c
                  ? "border-brand-lime scale-110 shadow-[0_0_16px_hsl(var(--accent-lime)/0.5)]"
                  : "border-transparent hover:border-white/30"
              }`}
            >
              <DuckSprite color={c} size={36} />
            </button>
          ))}
        </div>
      </div>

      {/* Accessories */}
      {GROUPS.map(group => (
        <div key={group.key} className="duck-card p-5 mb-3">
          <Label className="t-label text-slate-500 mb-3 block">{group.label}</Label>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map(opt => (
              <button
                key={opt.id}
                onClick={() => setters[group.key](opt.id)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-[0.08em] transition-all flex items-center gap-1 border ${
                  values[group.key] === opt.id
                    ? "bg-brand-lime/12 text-brand-lime border-brand-lime/40"
                    : "bg-white/[0.04] text-slate-400 border-white/[0.06] hover:bg-white/[0.09] hover:text-slate-200"
                }`}
              >
                {values[group.key] === opt.id && <Check className="w-3 h-3" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <Button
        onClick={handleSave}
        disabled={saving}
        className="cta-esports w-full h-12 rounded-xl text-[12px] uppercase tracking-[0.14em] hover:brightness-105 mt-1"
      >
        {saving ? "Saving..." : "Save My Duck"}
      </Button>
      <Link
        to="/"
        className="block text-center text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.12em] mt-4 transition-colors"
      >
        Skip &amp; Race →
      </Link>
    </div>
  );
}
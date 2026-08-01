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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      <div className="relative z-10 max-w-xl mx-auto px-4 py-6 md:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Race
        </Link>

        <div className="flex items-center gap-2 text-white/90 mb-8">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h1 className="text-2xl font-bold font-display">Customize Your Duck</h1>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl" />
            <DuckSprite color={color} size={140} hat={hat} glasses={glasses} clothes={clothes} />
          </div>
        </div>

        {/* Color */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 mb-4">
          <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Duck Color</Label>
          <div className="flex gap-2 flex-wrap">
            {AVAILABLE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  color === c ? "border-white scale-110 shadow-lg" : "border-transparent hover:border-white/50"
                }`}
              >
                <DuckSprite color={c} size={36} />
              </button>
            ))}
          </div>
        </div>

        {/* Accessories */}
        {GROUPS.map(group => (
          <div key={group.key} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 mb-4">
            <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">{group.label}</Label>
            <div className="flex flex-wrap gap-1.5">
              {group.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setters[group.key](opt.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                    values[group.key] === opt.id
                      ? "bg-sky-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
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
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold h-12"
        >
          {saving ? "Saving..." : "💾 Save My Duck"}
        </Button>
        <Link
          to="/"
          className="block text-center text-white/50 hover:text-white/80 text-sm mt-4 transition-colors"
        >
          Skip &amp; Race →
        </Link>
      </div>
    </div>
  );
}
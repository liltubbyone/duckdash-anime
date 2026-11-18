import React from "react";
import { Gift } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DuckSprite from "@/components/duck-race/DuckSprite";

export default function ReferralCard() {
  const { toast } = useToast();

  const handleInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast({ title: "Invite link copied!", description: "Share it with friends to build your flock." });
    } catch {
      toast({ title: "Invite friends", description: "Share the app link to grow your flock." });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-cyan/25 p-4 bg-gradient-to-br from-brand-cyan/10 via-surface-3 to-surface-2 clip-notch">
      <div
        className="absolute -right-6 -bottom-6 opacity-80 pointer-events-none"
        aria-hidden
      >
        <DuckSprite color="cyan" size={92} />
      </div>
      <div className="relative w-[62%]">
        <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-white">Build Your Flock</h4>
        <p className="text-[11px] text-slate-300/80 mt-1 leading-relaxed">
          Invite racers and earn credits when they join the fun.
        </p>
        <button
          onClick={handleInvite}
          className="cta-esports mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] uppercase tracking-[0.1em]"
        >
          <Gift className="w-3.5 h-3.5" />
          Invite Racers
        </button>
      </div>
    </div>
  );
}
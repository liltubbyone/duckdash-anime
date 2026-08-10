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
    <div className="relative overflow-hidden rounded-[16px] border border-brand-purple/25 p-4 bg-gradient-to-br from-brand-purple/15 via-surface-3 to-surface-2">
      <div
        className="absolute -right-6 -bottom-6 opacity-90 pointer-events-none"
        aria-hidden
      >
        <DuckSprite color="pink" size={92} />
      </div>
      <div className="relative w-[62%]">
        <h4 className="t-card-title text-white">Build Your Flock</h4>
        <p className="text-[11px] text-slate-300/80 mt-1 leading-relaxed">
          Invite racers and earn credits when they join the fun.
        </p>
        <button
          onClick={handleInvite}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white text-xs font-semibold hover:brightness-110 transition-all"
        >
          <Gift className="w-3.5 h-3.5" />
          Invite Racers
        </button>
      </div>
    </div>
  );
}
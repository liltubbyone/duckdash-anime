import React, { useState } from "react";
import { Link2, Twitter, Facebook, MessageCircle, Share2, Check } from "lucide-react";

const CHIP = "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:border-white/25 hover:bg-white/[0.08] text-[11px] font-medium transition-colors";

export default function SocialShare({ raceId, raceName }) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== "undefined"
    ? window.location.origin + window.location.pathname
    : "";
  const url = raceId ? `${baseUrl}?race=${raceId}` : baseUrl;
  const text = `Join my duck race${raceName ? `: ${raceName}` : ""} 🦆`;

  const share = (network) => {
    const enc = encodeURIComponent(url);
    const encText = encodeURIComponent(text);
    const links = {
      x: `https://twitter.com/intent/tweet?text=${encText}&url=${enc}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      whatsapp: `https://wa.me/?text=${encText}%20${enc}`,
    };
    window.open(links[network], "_blank", "noopener,noreferrer");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Duck Race", text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <span className="t-label text-slate-600">Invite</span>
      <button onClick={copy} className={CHIP}>
        {copied ? <Check className="w-3.5 h-3.5 text-brand-lime" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "Copied" : "Copy Link"}
      </button>
      <button onClick={() => share("x")} className={CHIP}>
        <Twitter className="w-3.5 h-3.5" /> Post
      </button>
      <button onClick={() => share("facebook")} className={CHIP}>
        <Facebook className="w-3.5 h-3.5" /> Share
      </button>
      <button onClick={() => share("whatsapp")} className={CHIP}>
        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
      </button>
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={nativeShare}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand-lime/10 border border-brand-lime/30 text-brand-lime hover:bg-brand-lime/15 text-[10.5px] font-bold uppercase tracking-[0.1em] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      )}
    </div>
  );
}
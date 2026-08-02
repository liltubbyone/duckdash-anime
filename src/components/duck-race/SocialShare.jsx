import React, { useState } from "react";
import { Link2, Twitter, Facebook, MessageCircle, Share2, Check } from "lucide-react";

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
      <span className="text-white/50 text-xs">Invite friends:</span>
      <button
        onClick={copy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 text-xs transition-all"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <button
        onClick={() => share("x")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 text-xs transition-all"
      >
        <Twitter className="w-3.5 h-3.5" /> Post
      </button>
      <button
        onClick={() => share("facebook")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 text-xs transition-all"
      >
        <Facebook className="w-3.5 h-3.5" /> Share
      </button>
      <button
        onClick={() => share("whatsapp")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 text-xs transition-all"
      >
        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
      </button>
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={nativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 text-xs transition-all"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      )}
    </div>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";
import DuckSprite from "@/components/duck-race/DuckSprite";
import CreditsBadge from "./CreditsBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MobileHeader({ user, credits }) {
  const navigate = useNavigate();
  const initials = (user?.full_name || "U").trim().split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header
      className="lg:hidden fixed top-0 inset-x-0 z-[40] h-16 flex items-center justify-between px-4 bg-[hsl(228_42%_3%/0.9)] backdrop-blur-2xl border-b border-white/[0.06]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <button onClick={() => navigate("/")} className="flex items-center gap-2">
        <DuckSprite color="gold" size={28} />
        <span className="font-display text-[19px] font-extrabold uppercase tracking-[0.03em] bg-gradient-to-r from-brand-lime via-brand-cyan to-brand-blue bg-clip-text text-transparent">
          DuckDash
        </span>
      </button>
      <div className="flex items-center gap-2">
        <CreditsBadge credits={credits} />
        <button onClick={() => navigate("/profile")}>
          <Avatar className="w-9 h-9 border border-white/10">
            <AvatarFallback className="bg-gradient-to-br from-brand-lime/30 to-brand-cyan/30 text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
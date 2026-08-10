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
      className="lg:hidden fixed top-0 inset-x-0 z-[40] h-16 flex items-center justify-between px-4 bg-[rgba(3,8,23,0.88)] backdrop-blur-xl border-b border-white/[0.07]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <button onClick={() => navigate("/")} className="flex items-center gap-2">
        <DuckSprite color="gold" size={30} />
        <span className="text-[15px] font-extrabold tracking-tight bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink bg-clip-text text-transparent">
          DUCK RACE
        </span>
      </button>
      <div className="flex items-center gap-2">
        <CreditsBadge credits={credits} />
        <button onClick={() => navigate("/profile")}>
          <Avatar className="w-9 h-9 border border-white/10">
            <AvatarFallback className="bg-gradient-to-br from-brand-purple/40 to-brand-blue/40 text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
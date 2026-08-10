import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Flag, Plus, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/", label: "Races", icon: Flag },
  { to: "/profile", label: "Leaders", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
];

export default function MobileBottomNav({ onCreateRace }) {
  const navigate = useNavigate();
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-[40] bg-[rgba(3,8,23,0.95)] backdrop-blur-xl border-t border-white/[0.07]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 h-[72px]">
        {ITEMS.slice(0, 2).map((item) => (
          <NavBtn key={item.label} icon={item.icon} label={item.label} onClick={() => navigate(item.to)} />
        ))}
        <div className="flex items-start justify-center pt-1">
          <button
            onClick={onCreateRace}
            className="-mt-[14px] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:brightness-110 transition-all"
            style={{ background: "linear-gradient(135deg, hsl(var(--accent-pink)), hsl(var(--accent-purple)))", boxShadow: "0 8px 20px rgba(111,58,255,0.4)" }}
          >
            <Plus className="w-5 h-5" strokeWidth={2.6} />
          </button>
        </div>
        {ITEMS.slice(2).map((item) => (
          <NavBtn key={item.label} icon={item.icon} label={item.label} onClick={() => navigate(item.to)} />
        ))}
      </div>
    </nav>
  );
}

function NavBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn("flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-200 transition-colors")}
    >
      <Icon className="w-5 h-5" strokeWidth={1.8} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
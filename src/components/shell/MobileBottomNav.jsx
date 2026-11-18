import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-[40] bg-[hsl(228_42%_3%/0.94)] backdrop-blur-2xl border-t border-white/[0.06]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 h-[72px]">
        {ITEMS.slice(0, 2).map((item) => (
          <NavBtn
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={pathname === item.to}
            onClick={() => navigate(item.to)}
          />
        ))}
        <div className="flex items-start justify-center pt-1">
          <button
            onClick={onCreateRace}
            className="cta-esports -mt-[14px] w-12 h-12 rounded-full flex items-center justify-center animate-ring-pulse"
            aria-label="Create race"
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
        {ITEMS.slice(2).map((item) => (
          <NavBtn
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={pathname === item.to}
            onClick={() => navigate(item.to)}
          />
        ))}
      </div>
    </nav>
  );
}

function NavBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 transition-colors",
        active ? "text-brand-lime" : "text-slate-500 hover:text-slate-300"
      )}
    >
      {active && <span className="absolute top-0 h-[2px] w-8 rounded-full bg-brand-lime shadow-[0_0_8px_hsl(var(--accent-lime)/0.9)]" />}
      <Icon className="w-5 h-5" strokeWidth={2} />
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </button>
  );
}
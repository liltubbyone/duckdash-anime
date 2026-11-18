import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Flag, History, Trophy, Bird, Settings as SettingsIcon, Plus } from "lucide-react";
import DuckSprite from "@/components/duck-race/DuckSprite";
import NavItem from "./NavItem";
import SidebarRaceList from "./SidebarRaceList";
import ReferralCard from "./ReferralCard";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, match: "/" },
  { to: "/", label: "My Races", icon: Flag, match: null },
  { to: "/", label: "Race History", icon: History, match: null },
  { to: "/", label: "Leaderboards", icon: Trophy, match: null },
  { to: "/customize", label: "Ducks", icon: Bird, match: "/customize" },
  { to: "/settings", label: "Settings", icon: SettingsIcon, match: "/settings" },
];

export default function DesktopSidebar({ user, races, loading, error, onRetry, onCreateRace }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[278px] z-[30] flex-col border-r border-white/[0.06] bg-[hsl(226_38%_4.6%/0.92)] backdrop-blur-2xl">
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 space-y-5">
        {/* Brand */}
        <button onClick={() => navigate("/")} className="group relative flex items-center gap-3 w-full text-left pl-1">
          <div className="relative shrink-0">
            <span className="absolute -inset-1.5 rounded-full bg-brand-lime/10 blur-md" />
            <DuckSprite color="gold" size={40} />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-[26px] font-extrabold leading-none uppercase tracking-[0.02em] bg-gradient-to-r from-brand-lime via-brand-cyan to-brand-blue bg-clip-text text-transparent">
              DuckDash
            </h1>
            <p className="t-label text-slate-500 mt-1">Anime Racing League</p>
          </div>
        </button>

        {/* Create CTA */}
        {isAdmin && (
          <button
            onClick={onCreateRace}
            className="cta-esports group relative flex items-center justify-center gap-2 w-full h-[50px] rounded-xl overflow-hidden text-[12.5px] uppercase tracking-[0.14em] hover:-translate-y-[1px] active:translate-y-0"
          >
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute top-0 left-0 h-full w-1/3 bg-white/25 blur-md animate-sheen" />
            </span>
            <Plus className="relative w-4 h-4" strokeWidth={2.8} />
            <span className="relative">Create Race</span>
          </button>
        )}

        {/* Navigation */}
        <div>
          <p className="t-label text-slate-600 px-3 mb-2">Arena</p>
          <nav className="space-y-0.5">
            {NAV.map((item) => (
              <NavItem
                key={item.label}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={item.match ? pathname === item.match : false}
              />
            ))}
          </nav>
        </div>

        <div className="hud-divider" />

        {/* Active races */}
        <SidebarRaceList races={races} loading={loading} error={error} onRetry={onRetry} />
      </div>

      {/* Referral */}
      <div className="px-4 pb-4 pt-2">
        <ReferralCard />
      </div>
    </aside>
  );
}
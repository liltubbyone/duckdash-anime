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
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[278px] z-[30] flex-col border-r border-white/[0.07] bg-[rgba(4,9,25,0.97)] backdrop-blur-xl">
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 space-y-5">
        {/* Brand */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 w-full text-left">
          <DuckSprite color="gold" size={42} />
          <div>
            <h1 className="text-[24px] font-extrabold leading-none tracking-tight bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink bg-clip-text text-transparent">
              DUCK RACE
            </h1>
            <p className="text-[8.5px] tracking-[0.22em] text-slate-500 mt-1 uppercase">
              Pick your duck · Win the race
            </p>
          </div>
        </button>

        {/* Create CTA */}
        {isAdmin && (
          <button
            onClick={onCreateRace}
            className="group relative flex items-center gap-3 w-full h-[54px] px-4 rounded-[12px] text-white text-sm font-semibold overflow-hidden transition-all duration-200 hover:-translate-y-[1px] hover:brightness-110 active:translate-y-0"
            style={{
              background: "linear-gradient(90deg, hsl(var(--accent-pink)), hsl(var(--accent-purple)), hsl(var(--accent-blue)))",
              boxShadow: "0 12px 30px rgba(111,58,255,0.22)",
            }}
          >
            <span className="absolute inset-x-0 top-0 h-px bg-white/25" />
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Create New Race
          </button>
        )}

        {/* Navigation */}
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

        <div className="h-px bg-white/[0.07]" />

        {/* Active races */}
        <SidebarRaceList races={races} loading={loading} error={error} onRetry={onRetry} />
      </div>

      {/* Referral */}
      <div className="px-5 pb-5 pt-2">
        <ReferralCard />
      </div>
    </aside>
  );
}
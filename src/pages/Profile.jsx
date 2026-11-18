import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import DuckSprite from "@/components/duck-race/DuckSprite";
import { Trophy, DollarSign, Heart, ArrowLeft, Medal, Clock, Settings as SettingsIcon } from "lucide-react";
import moment from "moment";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const me = await base44.auth.me();
    setUser(me);
    if (me?.id) {
      const [myEntries, allRaces] = await Promise.all([
        base44.entities.RaceEntry.filter({ user_id: me.id }, "-created_date", 100),
        base44.entities.DuckRace.list("-created_date", 50),
      ]);
      setEntries(myEntries);
      setRaces(allRaces);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const raceMap = new Map(races.map(r => [r.id, r]));
  const wins = entries.filter(e => e.is_winner);
  const winCount = wins.length;
  const totalRaces = entries.length;
  const totalEarnings = wins.reduce((sum, e) => {
    const race = raceMap.get(e.race_id);
    const pool = (race?.buy_in_amount || 0) * (race?.total_lanes || 1);
    return sum + pool;
  }, 0);

  // Favorite duck colors
  const colorCounts = {};
  entries.forEach(e => {
    colorCounts[e.duck_color] = (colorCounts[e.duck_color] || 0) + 1;
  });
  const favoriteColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const topColor = favoriteColors[0]?.[0] || "gold";

  // Recent races
  const recentRaces = entries.slice(0, 8);

  const winRate = totalRaces > 0 ? Math.round((winCount / totalRaces) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.12em] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Arena
      </Link>

      {/* Profile header */}
      <div className="duck-card panel-accent relative overflow-hidden p-6 mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-lime/20 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-surface-3 border-2 border-brand-lime/40 flex items-center justify-center">
              <DuckSprite color={topColor} size={78} />
            </div>
            {winCount > 0 && (
              <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center text-lg shadow-lg shadow-brand-yellow/40">
                👑
              </div>
            )}
          </div>
          <h1 className="t-page-title text-white mt-4">
            {user?.display_name || user?.full_name || user?.email || "Player"}
          </h1>
          <p className="t-label text-slate-500 mt-2">
            {user?.role === "admin" ? "Admin · Race Host" : "Duck Racer"}
          </p>
          <Link
            to="/settings"
            className="mt-4 inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/12 text-white text-[11px] font-bold uppercase tracking-[0.12em] transition-all"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            Settings
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatCard
          icon={<Trophy className="w-4 h-4" />}
          label="Wins"
          value={winCount}
          accent="hsl(var(--accent-yellow))"
        />
        <StatCard
          icon={<DollarSign className="w-4 h-4" />}
          label="Total Earnings"
          value={`$${totalEarnings}`}
          accent="hsl(var(--accent-lime))"
        />
        <StatCard
          icon={<Medal className="w-4 h-4" />}
          label="Win Rate"
          value={`${winRate}%`}
          sub={`${winCount}/${totalRaces} races`}
          accent="hsl(var(--accent-cyan))"
        />
      </div>

      {/* Favorite colors */}
      <div className="duck-card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-3.5 h-3.5 text-brand-pink" />
          <h3 className="t-label text-slate-300">Favorite Duck Colors</h3>
        </div>
        {favoriteColors.length > 0 ? (
          <div className="flex flex-wrap gap-5">
            {favoriteColors.map(([color, count], idx) => (
              <div key={color} className="flex flex-col items-center gap-1">
                <div className={`relative ${idx === 0 ? "scale-110" : ""}`}>
                  {idx === 0 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs">⭐</span>
                  )}
                  <DuckSprite color={color} size={56} />
                </div>
                <span className="text-slate-300 text-[11px] font-semibold capitalize">{color}</span>
                <span className="score-num text-[10px] text-slate-500">{count}x</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-4">
            No races yet — buy into a race to see your favorite colors!
          </p>
        )}
      </div>

      {/* Recent races */}
      <div className="duck-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-3.5 h-3.5 text-brand-cyan" />
          <h3 className="t-label text-slate-300">Recent Races</h3>
        </div>
        {recentRaces.length > 0 ? (
          <div className="space-y-2">
            {recentRaces.map(entry => {
              const race = raceMap.get(entry.race_id);
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    entry.is_winner
                      ? "bg-brand-yellow/[0.07] border-brand-yellow/25"
                      : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
                  }`}
                >
                  <DuckSprite color={entry.duck_color} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13.5px] font-semibold truncate">
                      {entry.duck_name}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Lane #{entry.lane_number}
                      {race ? ` · $${race.buy_in_amount} buy-in` : ""}
                      {race?.race_duration ? ` · ${race.race_duration}s` : ""}
                    </p>
                  </div>
                  {entry.is_winner ? (
                    <span className="text-brand-yellow text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-1 shrink-0">
                      <Trophy className="w-3 h-3" /> Won
                    </span>
                  ) : (
                    <span className="text-slate-600 text-[11px] shrink-0">
                      {entry.created_date ? moment(entry.created_date).fromNow() : ""}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-4">
            You haven't raced yet. <Link to="/" className="text-brand-lime hover:underline">Join a race!</Link>
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="duck-card relative overflow-hidden p-5 text-center">
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: `linear-gradient(180deg, ${accent}, transparent 88%)` }}
      />
      <div
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-2"
        style={{ background: `${accent}1f`, color: accent }}
      >
        {icon}
      </div>
      <p className="score-num text-[26px] text-white leading-none">{value}</p>
      <p className="t-label text-slate-500 mt-1.5">{label}</p>
      {sub && <p className="text-slate-600 text-[11px] mt-0.5">{sub}</p>}
    </div>
  );
}
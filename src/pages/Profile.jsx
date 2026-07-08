import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import DuckSprite, { AVAILABLE_COLORS } from "@/components/duck-race/DuckSprite";
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Background petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute text-pink-300/20 animate-float-down"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
              fontSize: `${12 + Math.random() * 14}px`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Race
        </Link>

        {/* Profile header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl" />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-2 border-white/20 flex items-center justify-center">
              <DuckSprite color={topColor} size={90} />
            </div>
            {winCount > 0 && (
              <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-xl shadow-lg shadow-yellow-400/40">
                👑
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 font-display">
            {user?.display_name || user?.full_name || user?.email || "Player"}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {user?.role === "admin" ? "🛡️ Admin" : "🦆 Duck Racer"}
          </p>
          <Link
            to="/settings"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white text-sm font-medium transition-all"
          >
            <SettingsIcon className="w-4 h-4" />
            Settings
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Wins"
            value={winCount}
            accent="from-yellow-400 to-orange-500"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Total Earnings"
            value={`$${totalEarnings}`}
            accent="from-green-400 to-emerald-500"
          />
          <StatCard
            icon={<Medal className="w-5 h-5" />}
            label="Win Rate"
            value={`${winRate}%`}
            sub={`${winCount}/${totalRaces} races`}
            accent="from-sky-400 to-blue-500"
          />
        </div>

        {/* Favorite colors */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-2 text-white/90 mb-4">
            <Heart className="w-4 h-4 text-pink-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Favorite Duck Colors</h3>
          </div>
          {favoriteColors.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {favoriteColors.map(([color, count], idx) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  <div className={`relative ${idx === 0 ? "scale-110" : ""}`}>
                    {idx === 0 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs">⭐</span>
                    )}
                    <DuckSprite color={color} size={56} />
                  </div>
                  <span className="text-white/60 text-xs capitalize">{color}</span>
                  <span className="text-white/40 text-xs">{count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-4">
              No races yet — buy into a race to see your favorite colors!
            </p>
          )}
        </div>

        {/* Recent races */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-2 text-white/90 mb-4">
            <Clock className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Recent Races</h3>
          </div>
          {recentRaces.length > 0 ? (
            <div className="space-y-2">
              {recentRaces.map(entry => {
                const race = raceMap.get(entry.race_id);
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      entry.is_winner
                        ? "bg-yellow-500/10 border border-yellow-500/20"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <DuckSprite color={entry.duck_color} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-medium truncate">
                        {entry.duck_name}
                      </p>
                      <p className="text-white/40 text-xs">
                        Lane #{entry.lane_number}
                        {race ? ` · $${race.buy_in_amount} buy-in` : ""}
                        {race?.race_duration ? ` · ${race.race_duration}s` : ""}
                      </p>
                    </div>
                    {entry.is_winner ? (
                      <span className="text-yellow-400 text-xs font-bold flex items-center gap-1 shrink-0">
                        <Trophy className="w-3 h-3" /> Won
                      </span>
                    ) : (
                      <span className="text-white/30 text-xs shrink-0">
                        {entry.created_date ? moment(entry.created_date).fromNow() : ""}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-4">
              You haven't raced yet. <Link to="/" className="text-sky-400 hover:underline">Join a race!</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 text-center">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${accent} text-black mb-2`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-white/40 text-xs uppercase tracking-wider mt-1">{label}</p>
      {sub && <p className="text-white/30 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}
import React from "react";
import { Trophy, Users, Radio, CalendarClock } from "lucide-react";
import StatCard from "./StatCard";

export default function StatsGrid({ stats, loading }) {
  const s = stats || { totalRaces: 0, totalEntries: 0, liveRaces: 0, upcomingRaces: 0 };
  const cards = [
    {
      icon: Trophy,
      label: "Total Races",
      value: s.totalRaces,
      context: `${s.upcomingRaces} open now`,
      accent: "#ffc83d",
    },
    {
      icon: Users,
      label: "Total Racers",
      value: s.totalEntries,
      context: "entries across all races",
      accent: "#28c2ff",
    },
    {
      icon: Radio,
      label: "Live Now",
      value: s.liveRaces,
      context: s.liveRaces > 0 ? "currently racing" : "no live races",
      accent: "#38e39a",
    },
    {
      icon: CalendarClock,
      label: "Upcoming",
      value: s.upcomingRaces,
      context: "open for buy-in",
      accent: "#8654ff",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {cards.map((c) => (
        <StatCard key={c.label} loading={loading} {...c} />
      ))}
    </div>
  );
}
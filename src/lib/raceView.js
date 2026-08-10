// Pure presentation mappers: DuckRace + RaceEntry -> dashboard view models.
// No backend calls — keeps dashboard components dumb and testable.

export function raceCapacity(race) {
  if (!race) return 0;
  return race.is_mass_race
    ? race.total_lanes || 0
    : (race.total_lanes || 0) * (race.ducks_per_lane || 1);
}

export function raceParticipants(entries, raceId) {
  return entries.filter((e) => e.race_id === raceId).length;
}

export function raceMode(race) {
  return race?.is_mass_race ? "Mass" : "Lanes";
}

export function raceName(race) {
  const n = (race?.race_name || "").trim();
  return n || `Race #${(race?.id || "").slice(-4)}`;
}

// statusKey: "live" | "open" | "full" | "finished"
export function raceStatusKey(race, count) {
  if (!race) return "finished";
  if (race.status === "racing") return "live";
  if (race.status === "finished") return "finished";
  if (count >= raceCapacity(race)) return "full";
  return "open";
}

export function toFeatured(race, entries, user) {
  if (!race) return null;
  const count = raceParticipants(entries, race.id);
  const cap = raceCapacity(race);
  const skey = raceStatusKey(race, count);
  return {
    id: race.id,
    name: raceName(race),
    status: race.status,
    statusKey: skey,
    mode: raceMode(race),
    participantCount: count,
    capacity: cap,
    prizeName: race.prize_name || "",
    entryAmount: race.buy_in_amount || 0,
    heroImage: race.prize_image || "",
    thumb: race.prize_image || "",
    canJoin: skey === "open",
    canWatch: race.status === "racing" || race.status === "finished",
    canManage: user?.role === "admin",
    isMass: !!race.is_mass_race,
  };
}

export function toActivityRow(race, entries, user) {
  const count = raceParticipants(entries, race.id);
  const skey = raceStatusKey(race, count);
  return {
    id: race.id,
    name: raceName(race),
    thumb: race.prize_image || "",
    status: race.status,
    statusKey: skey,
    mode: raceMode(race),
    participantCount: count,
    capacity: raceCapacity(race),
    prizeName: race.prize_name || "",
    entryAmount: race.buy_in_amount || 0,
    finishedAt: race.race_finished_at || "",
    canJoin: skey === "open",
    canWatch: race.status === "racing",
    canManage: user?.role === "admin",
  };
}

export function computeStats(races, entries) {
  return {
    totalRaces: races.length,
    totalEntries: entries.length,
    liveRaces: races.filter((r) => r.status === "racing").length,
    upcomingRaces: races.filter((r) => r.status === "waiting").length,
  };
}

// Featured selection priority: live first, then open (waiting), most participants.
export function pickFeatured(races, entries) {
  const active = races.filter((r) => r.status === "racing" || r.status === "waiting");
  if (!active.length) return null;

  const byCount = (a, b) => raceParticipants(entries, b.id) - raceParticipants(entries, a.id);
  const racing = active.filter((r) => r.status === "racing").sort(byCount);
  if (racing.length) return racing[0];

  const open = active.filter((r) => r.status === "waiting").sort(byCount);
  return open[0] || null;
}

export function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
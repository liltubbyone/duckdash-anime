import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Lightweight shell data: current user, credit balance (races won),
 * and a short list of active races for the sidebar. Kept separate from
 * page-level data fetching so the shell never pulls the full dashboard payload.
 */
export function useShellData() {
  const [user, setUser] = useState(null);
  const [races, setRaces] = useState([]);
  const [entries, setEntries] = useState([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [me, raceList, entryList] = await Promise.all([
        base44.auth.me(),
        base44.entities.DuckRace.list("-created_date", 20),
        base44.entities.RaceEntry.list("-created_date", 200),
      ]);
      setUser(me);
      setRaces(raceList);
      setEntries(entryList);

      // Credits = number of races this user has won (no credits backend yet).
      try {
        const myWins = await base44.entities.RaceEntry.filter({
          user_id: me.id,
          is_winner: true,
        });
        setCredits(myWins.length || 0);
      } catch {
        setCredits(0);
      }
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const unsubRace = base44.entities.DuckRace.subscribe(() => load());
    const unsubEntry = base44.entities.RaceEntry.subscribe(() => load());
    return () => {
      unsubRace();
      unsubEntry();
    };
  }, [load]);

  const sidebarRaces = races
    .filter((r) => r.status === "waiting" || r.status === "racing")
    .sort((a, b) => (b.status === "racing" ? 1 : 0) - (a.status === "racing" ? 1 : 0))
    .slice(0, 3)
    .map((r) => {
      const count = entries.filter((e) => e.race_id === r.id).length;
      const cap = r.is_mass_race
        ? r.total_lanes
        : r.total_lanes * (r.ducks_per_lane || 1);
      return {
        id: r.id,
        name: r.race_name || `Race #${(r.id || "").slice(-4)}`,
        thumb: r.prize_image,
        status: r.status,
        count,
        cap,
        isMass: r.is_mass_race,
      };
    });

  return { user, credits, sidebarRaces, loading, error, retry: load };
}
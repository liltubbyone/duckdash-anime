import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useShellData } from "@/lib/useShellData";
import BackgroundFX from "./BackgroundFX";
import DesktopSidebar from "./DesktopSidebar";
import DashboardHeader from "./DashboardHeader";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import CreateRaceSheet from "./CreateRaceSheet";

export default function AppShell() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, credits, sidebarRaces, loading, error, retry } = useShellData();
  const [createOpen, setCreateOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const handleCreateRace = async (buyInAmount, totalLanes, duration, opts = {}) => {
    try {
      const newRace = await base44.entities.DuckRace.create({
        status: "waiting",
        total_lanes: totalLanes,
        buy_in_amount: buyInAmount,
        race_duration: duration,
        is_mass_race: opts.isMassRace || false,
        participants: [],
        ducks_per_lane: opts.ducks_per_lane || 1,
        auto_start: opts.auto_start !== false,
        race_name: opts.race_name || "",
        prize_name: opts.prize_name || "",
        prize_image: opts.prize_image || "",
      });
      setCreateOpen(false);
      toast({ title: "Race created 🦆", description: "Your new race is open for buy-in." });
      navigate("/");
      return newRace;
    } catch (e) {
      toast({ title: "Could not create race", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen">
      <BackgroundFX />

      <DesktopSidebar
        user={user}
        races={sidebarRaces}
        loading={loading}
        error={error}
        onRetry={retry}
        onCreateRace={() => setCreateOpen(true)}
      />

      <MobileHeader user={user} credits={credits} />

      <div className="lg:pl-[278px]">
        <DashboardHeader user={user} credits={credits} />
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-20 lg:pt-7 pb-28 lg:pb-10 min-w-0">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav onCreateRace={() => setCreateOpen(true)} />

      <CreateRaceSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreateRace={handleCreateRace}
        isAdmin={isAdmin}
      />
    </div>
  );
}
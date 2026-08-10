import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useShellData } from "@/lib/useShellData";
import BackgroundFX from "./BackgroundFX";
import DesktopSidebar from "./DesktopSidebar";
import DashboardHeader from "./DashboardHeader";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, credits, sidebarRaces, loading, error, retry } = useShellData();

  const goCreate = () => navigate("/create");
  // The builder has its own sticky action bar; hide the mobile bottom nav there.
  const hideMobileNav = location.pathname === "/create";

  return (
    <div className="min-h-screen">
      <BackgroundFX />

      <DesktopSidebar
        user={user}
        races={sidebarRaces}
        loading={loading}
        error={error}
        onRetry={retry}
        onCreateRace={goCreate}
      />

      <MobileHeader user={user} credits={credits} />

      <div className="lg:pl-[278px]">
        <DashboardHeader user={user} credits={credits} />
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-20 lg:pt-7 pb-28 lg:pb-10 min-w-0">
          <Outlet />
        </main>
      </div>

      {!hideMobileNav && <MobileBottomNav onCreateRace={goCreate} />}
    </div>
  );
}
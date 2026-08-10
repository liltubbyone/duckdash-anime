import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import AdminPanel from "@/components/duck-race/AdminPanel";

export default function CreateRaceSheet({ open, onOpenChange, onCreateRace, isAdmin }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[400px] bg-surface-2 border-white/10 p-0 overflow-y-auto"
      >
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="text-white text-lg font-bold">Create New Race</SheetTitle>
          <SheetDescription className="text-slate-400">
            Configure your race and open it for buy-ins.
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 pb-10">
          {isAdmin ? (
            <AdminPanel
              race={null}
              entriesCount={0}
              isRacing={false}
              onStartRace={() => {}}
              onNewRace={onCreateRace}
            />
          ) : (
            <div className="text-center py-20 text-slate-400 text-sm">
              Race creation is available to admins only.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
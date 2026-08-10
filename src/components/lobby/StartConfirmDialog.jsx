import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StartConfirmDialog({ open, onOpenChange, race, entryCount, onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface-2 border-white/15">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Start {race?.race_name || "the race"}?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            You're about to start with <span className="text-white font-semibold">{entryCount} racers</span>. Once the countdown begins, new entries will close.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/[0.05] border-white/10 text-slate-200">Not Yet</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-gradient-to-r from-brand-pink to-brand-purple text-white border-0 hover:brightness-110"
          >
            Start Countdown
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CancelRaceDialog({ open, onOpenChange, race, onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface-2 border-white/15">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Cancel this race?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This permanently removes {race?.race_name || "the race"} and all its entries. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/[0.05] border-white/10 text-slate-200">Keep Race</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-brand-red text-white border-0 hover:bg-brand-red/90"
          >
            Cancel Race
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
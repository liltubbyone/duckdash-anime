import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, Check, Loader2, X } from "lucide-react";
import BuilderStepper, { MobileStepper } from "@/components/builder/BuilderStepper";
import RaceSummary from "@/components/builder/RaceSummary";
import BasicsStep from "@/components/builder/steps/BasicsStep";
import FormatStep from "@/components/builder/steps/FormatStep";
import PrizeStep from "@/components/builder/steps/PrizeStep";
import TimingStep from "@/components/builder/steps/TimingStep";
import ReviewStep from "@/components/builder/steps/ReviewStep";

const INITIAL = {
  name: "",
  description: "",
  theme: "",
  mode: "lanes",
  laneCount: 6,
  ducksPerLane: 1,
  massCapacity: 20,
  prizeName: "",
  prizeImage: "",
  prizeDescription: "",
  entryType: "free",
  entryAmount: 0,
  startMode: "auto",
  duration: 10,
};

function validate(step, f) {
  const e = {};
  if (step === 0) {
    if (!f.name.trim()) e.name = "Give your race a name.";
    if (!f.theme) e.theme = "Pick a race environment.";
  }
  if (step === 1) {
    if (f.mode === "lanes") {
      if (f.laneCount < 2) e.laneCount = "Minimum 2 lanes.";
      if (f.ducksPerLane < 1) e.ducksPerLane = "Minimum 1 duck per lane.";
    } else if (f.massCapacity < 2) e.massCapacity = "Minimum 2 racers.";
  }
  if (step === 2 && f.entryType === "paid" && (!f.entryAmount || f.entryAmount < 1)) {
    e.entryAmount = "Enter a valid amount.";
  }
  if (step === 3) {
    if (!f.startMode) e.startMode = "Choose a start mode.";
    if (!f.duration) e.duration = "Choose a duration.";
  }
  return e;
}

export default function CreateRace() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState(INITIAL);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {}).finally(() => setChecking(false));
  }, []);

  if (checking) {
    return <div className="flex justify-center py-32"><Loader2 className="w-6 h-6 text-brand-cyan animate-spin" /></div>;
  }
  if (user?.role !== "admin") {
    return (
      <div className="text-center py-32">
        <h1 className="text-xl font-bold text-white">Admins only</h1>
        <p className="text-slate-400 mt-2 text-sm">Race creation is available to hosts and admins.</p>
        <button onClick={() => navigate("/")} className="mt-5 text-brand-cyan font-semibold hover:underline">Back to dashboard</button>
      </div>
    );
  }

  const handleContinue = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const handleCreate = async () => {
    let allErrors = {};
    [0, 1, 2, 3].forEach((s) => Object.assign(allErrors, validate(s, form)));
    setErrors(allErrors);
    if (Object.keys(allErrors).length) {
      const firstInvalid = [0, 1, 2, 3].find((s) => Object.keys(validate(s, form)).length);
      setStep(firstInvalid ?? 0);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        status: "waiting",
        race_name: form.name.trim(),
        description: form.description.trim(),
        theme: form.theme,
        total_lanes: form.mode === "mass" ? form.massCapacity : form.laneCount,
        ducks_per_lane: form.mode === "mass" ? 1 : form.ducksPerLane,
        buy_in_amount: form.entryType === "paid" ? form.entryAmount : 0,
        race_duration: form.duration,
        auto_start: form.startMode === "auto",
        is_mass_race: form.mode === "mass",
        participants: [],
        prize_name: form.prizeName.trim(),
        prize_image: form.prizeImage,
      };
      const race = await base44.entities.DuckRace.create(payload);
      toast({ title: "Race created 🦆", description: "Opening the lobby…" });
      navigate(`/lobby/${race.id}`);
    } catch (e) {
      toast({ title: "Could not create race", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const StepView = [BasicsStep, FormatStep, PrizeStep, TimingStep][step];
  const isLast = step === 4;

  return (
    <div className="max-w-[1240px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="t-page-title text-white">Create New Race</h1>
          <p className="text-[13px] text-slate-400 mt-1">Set up your event in a few quick steps.</p>
        </div>
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/[0.05] border border-white/10 text-[13px] font-semibold text-slate-300 hover:bg-white/[0.1] transition-all">
          <X className="w-4 h-4" /> Exit
        </button>
      </div>

      {/* Stepper */}
      <div className="duck-card p-4 mb-5">
        <BuilderStepper current={step} completed={new Set()} />
        <MobileStepper current={step} />
      </div>

      {/* Mobile collapsible summary */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setSummaryOpen((v) => !v)} className="w-full flex items-center justify-between duck-card px-4 py-3">
          <span className="text-[13px] font-bold text-white">Race Summary</span>
          <span className="text-[12px] text-brand-cyan">{summaryOpen ? "Hide" : "Show"}</span>
        </button>
        {summaryOpen && <div className="mt-2"><RaceSummary form={form} /></div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Form */}
        <div className="min-w-0">
          {!isLast ? (
            <StepView form={form} update={update} errors={errors} />
          ) : (
            <ReviewStep form={form} onEdit={(s) => setStep(s)} />
          )}
        </div>

        {/* Sticky summary (desktop) */}
        <div className="hidden lg:block">
          <RaceSummary form={form} />
        </div>
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-0 z-30 mt-6 -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 pb-[max(1rem,env(safe-area-inset-bottom))] lg:pb-2 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="duck-card px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 h-11 px-4 rounded-[11px] bg-white/[0.05] border border-white/10 text-[14px] font-semibold text-slate-200 hover:bg-white/[0.1] disabled:opacity-30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {isLast ? (
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="inline-flex items-center gap-2 h-11 px-7 rounded-[11px] bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue text-white text-[14px] font-bold hover:-translate-y-[1px] hover:brightness-110 disabled:opacity-60 transition-all"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" strokeWidth={2.6} />}
              {submitting ? "Creating…" : "Create & Open Lobby"}
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-[11px] bg-gradient-to-r from-brand-pink to-brand-purple text-white text-[14px] font-bold hover:-translate-y-[1px] hover:brightness-110 transition-all"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
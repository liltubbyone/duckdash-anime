import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings as SettingsIcon, User, LogOut } from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(me => {
      setUser(me);
      setFullName(me?.display_name || me?.full_name || "");
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await base44.auth.updateMe({ display_name: fullName });
    setUser(prev => ({ ...prev, display_name: fullName }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-2">
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.12em] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Profile
      </Link>

      <div className="flex items-center gap-2.5 mb-6">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-lime/12 border border-brand-lime/30">
          <SettingsIcon className="w-4 h-4 text-brand-lime" />
        </span>
        <h1 className="t-page-title text-white">Settings</h1>
      </div>

      {/* Profile section */}
      <div className="duck-card panel-accent p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-3.5 h-3.5 text-brand-cyan" />
          <h2 className="t-label text-slate-300">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="t-label text-slate-500">Display Name</Label>
            <Input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Enter your name"
              className="bg-white/[0.04] border-white/12 text-white mt-1.5 focus-visible:ring-brand-lime/40"
              maxLength={50}
            />
          </div>

          <div>
            <Label className="t-label text-slate-500">Email</Label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-white/[0.02] border-white/[0.08] text-slate-500 mt-1.5"
            />
            <p className="text-slate-600 text-[11px] mt-1">Email cannot be changed</p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button
              onClick={handleSave}
              disabled={saving || fullName.trim() === (user?.display_name || user?.full_name || "").trim()}
              className="cta-esports h-10 px-5 rounded-lg text-[11px] uppercase tracking-[0.12em] hover:brightness-105"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            {saved && (
              <span className="text-brand-lime text-[11px] font-bold uppercase tracking-[0.1em]">Saved</span>
            )}
          </div>
        </div>
      </div>

      {/* Account section */}
      <div className="duck-card p-5">
        <h2 className="t-label text-slate-300 mb-4">Account</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-[13.5px] font-semibold">Role</p>
            <p className="text-slate-500 text-[11px] mt-0.5">{user?.role === "admin" ? "Admin · Race Host" : "Duck Racer"}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/15 gap-2 h-10 rounded-lg text-[11px] uppercase tracking-[0.1em] font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
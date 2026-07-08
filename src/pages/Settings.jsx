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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      <div className="relative z-10 max-w-xl mx-auto px-4 py-6 md:py-10">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="flex items-center gap-2 text-white/90 mb-8">
          <SettingsIcon className="w-5 h-5 text-sky-400" />
          <h1 className="text-2xl font-bold font-display">Settings</h1>
        </div>

        {/* Profile section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-2 text-white/90 mb-4">
            <User className="w-4 h-4 text-sky-400" />
            <h2 className="font-bold text-sm uppercase tracking-wider">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-white/60 text-xs">Display Name</Label>
              <Input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="bg-white/10 border-white/20 text-white mt-1.5"
                maxLength={50}
              />
            </div>

            <div>
              <Label className="text-white/60 text-xs">Email</Label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-white/5 border-white/10 text-white/40 mt-1.5"
              />
              <p className="text-white/30 text-xs mt-1">Email cannot be changed</p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                onClick={handleSave}
                disabled={saving || fullName.trim() === (user?.display_name || user?.full_name || "").trim()}
                className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {saved && (
                <span className="text-green-400 text-sm font-medium">✓ Saved!</span>
              )}
            </div>
          </div>
        </div>

        {/* Account section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
          <h2 className="font-bold text-sm uppercase tracking-wider text-white/90 mb-4">Account</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Role</p>
              <p className="text-white/40 text-xs">{user?.role === "admin" ? "🛡️ Admin" : "🦆 Duck Racer"}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
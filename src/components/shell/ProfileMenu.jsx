import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, Settings, Bird, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { base44 } from "@/api/base44Client";

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function ProfileMenu({ user }) {
  const navigate = useNavigate();
  const name = user?.full_name || "Player";
  const role = user?.role || "user";

  const handleSignOut = async () => {
    try {
      await base44.auth.logout();
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 pl-1 pr-2 h-11 rounded-full hover:bg-white/[0.05] transition-colors">
          <Avatar className="w-9 h-9 border border-white/10">
            <AvatarFallback className="bg-gradient-to-br from-brand-purple/40 to-brand-blue/40 text-white text-xs font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-[13px] font-semibold text-white max-w-[120px] truncate">{name}</p>
            <p className="text-[11px] text-slate-400 capitalize">{role}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-[14px] bg-surface-3 border-white/10 shadow-2xl p-1.5"
      >
        <div className="px-2 py-2">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs text-slate-400 capitalize">{role}</p>
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          className="rounded-[8px] text-slate-300 hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.06] cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <User className="w-4 h-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rounded-[8px] text-slate-300 hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.06] cursor-pointer"
          onClick={() => navigate("/customize")}
        >
          <Bird className="w-4 h-4" /> My Duck
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rounded-[8px] text-slate-300 hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.06] cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <Settings className="w-4 h-4" /> Account Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          className="rounded-[8px] text-brand-red hover:bg-brand-red/10 focus:bg-brand-red/10 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
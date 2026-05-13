"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { peerLearningApi } from "@/lib/api/peerLearning";

interface HeaderProps {
  scrolled: boolean;
  mounted: boolean;
  onProfileToggle: () => void;
  profileOpen: boolean;
}

export default function Header({ scrolled, mounted, onProfileToggle, profileOpen }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await peerLearningApi.getUnreadNotificationCount();
      setUnreadCount(count);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`h-16 flex items-center justify-between px-4 lg:px-8 border-b border-transparent transition-all duration-300 z-30
      ${scrolled ? "bg-[#0F172A]/80 backdrop-blur-md border-white/10 shadow-lg" : "bg-transparent"}
    `}>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-full focus-within:border-teal-500/50 focus-within:shadow-[0_0_15px_rgba(13,148,136,0.2)] transition-all">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40 w-48 focus:w-64 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link 
          href="/notification"
          className="relative p-2 rounded-full text-white/60 hover:text-teal-400 hover:bg-white/5 transition-all"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#B45309] text-white text-[10px] font-black shadow-[0_0_8px_rgba(180,83,9,0.8)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white/20" />
          )}
        </Link>

        <div className="h-6 w-px bg-white/10" />

        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onProfileToggle}
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-white group-hover:text-teal-200 transition-colors">{mounted ? (user?.name || "User") : "User"}</p>
              <p className="text-[10px] text-teal-400 uppercase tracking-widest font-semibold pb-0.5">{mounted ? (user?.role || "Student") : "Student"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-teal-500 to-teal-800 border-2 border-[#0F172A] shadow-[0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center font-bold relative overflow-hidden transition-transform group-hover:scale-105">
              {mounted && user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onProfileToggle} />
              <div className="absolute right-0 top-full mt-3 w-48 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up origin-top-right">
                <div className="p-2 space-y-1">
                  <Link
                    href="/profile"
                    onClick={onProfileToggle}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-white/80 hover:text-teal-400 hover:bg-teal-500/10 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={async () => {
                      onProfileToggle();
                      await logout();
                      router.push("/");
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-[#ef4444]/80 hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

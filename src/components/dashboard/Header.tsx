"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, User, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme, toggleTheme, mounted: themeMounted } = useTheme();
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
    <header className={`h-16 flex items-center justify-between px-4 lg:px-8 border-b transition-all duration-300 z-30
      ${scrolled 
        ? "bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg" 
        : "bg-transparent border-transparent"}
    `}>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full focus-within:border-teal-500/50 focus-within:shadow-[0_0_15px_rgba(13,148,136,0.2)] transition-all">
          <Search className="w-4 h-4 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 w-48 focus:w-64 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Changer next to notification icon */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="relative p-2 rounded-full text-slate-500 dark:text-white/60 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer group"
        >
          {themeMounted ? (
            theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-teal-600 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-300" />
            )
          ) : (
            <div className="w-5 h-5" />
          )}
        </button>

        {/* Notification Bell */}
        <Link 
          href="/notification"
          className="relative p-2 rounded-full text-slate-500 dark:text-white/60 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#B45309] text-white text-[10px] font-black shadow-[0_0_8px_rgba(180,83,9,0.8)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20" />
          )}
        </Link>

        <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onProfileToggle}
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-200 transition-colors">{mounted ? (user?.name || "User") : "User"}</p>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 uppercase tracking-widest font-semibold pb-0.5">{mounted ? (user?.role || "Student") : "Student"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-teal-500 to-teal-800 border-2 border-white dark:border-[#0F172A] shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center font-bold text-white relative overflow-hidden transition-transform group-hover:scale-105">
              {mounted && user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onProfileToggle} />
              <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-50 animate-slide-up origin-top-right">
                <div className="p-2 space-y-1">
                  <Link
                    href="/profile"
                    onClick={onProfileToggle}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-white/80 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={async () => {
                      onProfileToggle();
                      await logout();
                      router.push("/");
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 dark:text-[#ef4444]/80 hover:text-red-700 dark:hover:text-[#ef4444] hover:bg-red-50 dark:hover:bg-[#ef4444]/10 rounded-xl transition-colors"
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

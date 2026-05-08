"use client";

import { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import Footer from "../dashboard/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
      if (window.innerWidth < 1024) setSidebarOpen(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex overflow-hidden">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

        <Header
          scrolled={scrolled}
          mounted={mounted}
          onProfileToggle={() => setProfileOpen((prev) => !prev)}
          profileOpen={profileOpen}
        />

        <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#0F172A] flex flex-col">
          <div className="absolute top-0 right-0 w-125 h-125 bg-teal-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-100 h-100 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-1 flex-col">
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-slide-up pb-24 flex-1">
              {children}
            </div>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

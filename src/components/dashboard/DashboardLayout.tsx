"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, Search, Bell, Settings, LogOut, 
  LayoutDashboard, Brain, BookOpen, Target, Users, TrendingUp 
} from "lucide-react";
import { useRouter } from "next/navigation";
import MentoraLogo from "@/components/auth/MentoraLogo";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Knowledge Assist", href: "/knowledge-assist", icon: Brain },
  { name: "Material Generator", href: "/learning-generator", icon: BookOpen },
  { name: "Assessment", href: "/assessment", icon: Target },
  { name: "Peer Learning", href: "/peer-learning", icon: Users },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    
    // Auto-collapse on small screens
    if (window.innerWidth < 1024) setSidebarOpen(false);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex overflow-hidden">
      
      {/* ── SIDEBAR ── */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0B1121] border-r border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
          <div className={`overflow-hidden transition-all ${!sidebarOpen && "lg:hidden"}`}>
            <MentoraLogo size="sm" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-hide">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
                  ${active 
                    ? "bg-teal-500/10 text-teal-400 shadow-[inset_0_0_20px_rgba(13,148,136,0.1)]" 
                    : "text-white/60 hover:bg-[#334155]/30 hover:text-teal-200"
                  }
                `}
                title={!sidebarOpen ? item.name : undefined}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full shadow-[0_0_10px_rgba(13,148,136,0.8)]" />
                )}
                <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} />
                <span className={`font-semibold text-sm whitespace-nowrap transition-opacity duration-300 ${!sidebarOpen && "lg:opacity-0 lg:hidden"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1.5 shrink-0">
          <Link href="/settings" className={`flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:bg-[#334155]/30 hover:text-white transition-all group`}>
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className={`font-medium text-sm whitespace-nowrap ${!sidebarOpen && "lg:hidden"}`}>Settings</span>
          </Link>
          <button 
            onClick={async () => { await logout(); router.push("/login"); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all group`}
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className={`font-medium text-sm whitespace-nowrap ${!sidebarOpen && "lg:hidden"}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER */}
        <header className={`h-16 flex items-center justify-between px-4 lg:px-8 border-b border-transparent transition-all duration-300 z-30
          ${scrolled ? "bg-[#0F172A]/80 backdrop-blur-md border-white/10 shadow-lg" : "bg-transparent"}
        `}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
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
            <button className="relative p-2 rounded-full text-white/60 hover:text-teal-400 hover:bg-white/5 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B45309] shadow-[0_0_8px_rgba(180,83,9,0.8)] animate-pulse" />
            </button>
            
            <div className="h-6 w-px bg-white/10" />
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-white group-hover:text-teal-200 transition-colors">{user?.name || "User"}</p>
                <p className="text-[10px] text-teal-400 uppercase tracking-widest font-semibold pb-0.5">{user?.role || "Student"}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-800 border-2 border-[#0F172A] shadow-[0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center font-bold relative overflow-hidden">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#0F172A]">
          {/* Subtle background glow for all pages */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative z-10 animate-slide-up pb-24">
            {children}
          </div>

          {/* FOOTER */}
          <footer className="w-full text-center py-6 border-t border-white/5 text-xs text-white/30 z-10 relative">
            <p className="mb-2">MENTORA – AI-Powered Personalized Learning</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="hover:text-teal-400 transition-colors">Help</a>
              <a href="#" className="hover:text-teal-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-teal-400 transition-colors">Contact</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

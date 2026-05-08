"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  X, Settings, LogOut,
  LayoutDashboard, Brain, BookOpen, Target, Users, TrendingUp, ChevronDown, PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import MentoraLogo from "@/components/auth/MentoraLogo";
import { useAuth } from "@/contexts/AuthContext";
import GitHubStatusControl from "@/components/dashboard/GitHubStatusControl";
import { useActiveReview } from "@/contexts/ActiveReviewContext";

type NavSubItem = {
  name: string;
  href: string;
};

type NavItem = {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: NavSubItem[];
};

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Knowledge Assist",
    icon: Brain,
    subItems: [
      { name: "Knowledge Profile", href: "/knowledge-assist" },
      { name: "Assessment", href: "/knowledge-assist/assessment" },
      { name: "Sandbox", href: "/knowledge-assist/sandbox" },
      { name: "Forensics", href: "/knowledge-assist/forensics" },
      { name: "Mastery", href: "/knowledge-assist/mastery" },
    ],
  },
  {
    name: "Material Generator",
    icon: BookOpen,
    subItems: [
      { name: "Overview", href: "/learning-generator" },
      { name: "Knowledge Gaps", href: "/learning-generator/knowledge-gaps" },
      { name: "Materials", href: "/learning-generator/materials" },
      { name: "Learn Code", href: "/learning-generator/workspace" },
    ],
  },
  { name: "Assessment", href: "/assessment", icon: Target },
  { name: "Peer Learning", href: "/peer-learning", icon: Users },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

const exactSubItemHrefs = new Set(["/knowledge-assist", "/learning-generator"]);

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  expandedMenu: string | null;
  setExpandedMenu: (name: string | null) => void;
  onMobileClose: () => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, expandedMenu, setExpandedMenu, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { isReviewRunning, sandboxHref } = useActiveReview();

  const isActive = (item: NavItem) => {
    if (item.href) return pathname === item.href;
    return item.subItems?.some((subItem) => isSubActive(subItem.href)) ?? false;
  };

  const isSubActive = (href: string) => {
    if (exactSubItemHrefs.has(href)) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 bg-[#0B1121] border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col ${
        sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-2 border-b border-white/5 shrink-0">
        <div className={`overflow-hidden transition-all ${!sidebarOpen && "lg:hidden"}`}>
          <MentoraLogo size="sm" />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all shrink-0 ${!sidebarOpen && "lg:mx-auto"}`}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <div className="relative w-5 h-5">
            <PanelLeftClose
              className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${sidebarOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"}`}
            />
            <PanelLeftOpen
              className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${!sidebarOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
            />
          </div>
        </button>
        <button onClick={onMobileClose} className="lg:hidden text-white/50 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-hide">
        {navItems.map((item) => {
          const active = isActive(item);

          if (item.subItems) {
            const isExpanded = expandedMenu === item.name;
            const reviewGuided = isReviewRunning && item.name === "Knowledge Assist";
            const defaultHref = reviewGuided
              ? sandboxHref(undefined, "sidebar-active-review")
              : item.subItems[0]?.href;
            const isInGroup = item.subItems.some((subItem) => isSubActive(subItem.href));
            return (
              <div key={item.name} className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (reviewGuided && defaultHref) {
                      router.push(defaultHref);
                      setExpandedMenu(item.name);
                      onMobileClose();
                      return;
                    }

                    if (!sidebarOpen) {
                      if (defaultHref) router.push(defaultHref);
                      onMobileClose();
                    } else if (!isInGroup && defaultHref) {
                      router.push(defaultHref);
                    }
                    setExpandedMenu(isExpanded ? null : item.name);
                  }}
                  className={`relative flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-300
                    ${reviewGuided
                      ? "scale-[1.03] border-cyan-300/35 bg-cyan-400/15 text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.28)]"
                      : active
                      ? "border-teal-500/20 bg-teal-500/10 text-teal-400 shadow-[inset_0_0_20px_rgba(13,148,136,0.1)]"
                      : "border-transparent text-white/60 hover:bg-[#334155]/30 hover:text-teal-200"
                    }
                  `}
                  title={!sidebarOpen ? (reviewGuided ? "Review running - open Sandbox" : item.name) : undefined}
                >
                  {(active || reviewGuided) && (
                    <div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                        reviewGuided
                          ? "bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.9)]"
                          : "bg-teal-500 shadow-[0_0_10px_rgba(13,148,136,0.8)]"
                      }`}
                    />
                  )}
                  <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${reviewGuided ? "scale-125 animate-pulse" : ""}`} />
                  <span className={`font-semibold text-sm whitespace-nowrap transition-opacity duration-300 flex-1 ${!sidebarOpen && "lg:opacity-0 lg:hidden"}`}>
                    {item.name}
                  </span>
                  {!sidebarOpen ? null : (
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  )}
                </button>

                <div className={`${!isExpanded || !sidebarOpen ? "hidden" : ""} pl-6 space-y-1`}>
                  {item.subItems.map((subItem) => {
                    const sandboxGuided =
                      isReviewRunning && subItem.href === "/knowledge-assist/sandbox";
                    return (
                      <Link
                        key={subItem.href}
                        href={
                          sandboxGuided
                            ? sandboxHref(undefined, "sidebar-active-review")
                            : subItem.href
                        }
                        className={`block px-3 py-2 rounded-lg text-sm transition-all
                          ${sandboxGuided
                            ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/30 shadow-[0_0_18px_rgba(34,211,238,0.22)]"
                            : isSubActive(subItem.href)
                            ? "bg-teal-500/10 text-teal-300"
                            : "text-white/50 hover:text-teal-200 hover:bg-[#334155]/30"
                          }
                        `}
                      >
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
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
        <GitHubStatusControl sidebarOpen={sidebarOpen} />
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
  );
}

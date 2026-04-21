"use client";

import Link from "next/link";
import { 
  Brain, FileText, Target, Users, ChevronRight, Sparkles, 
  TrendingUp, Activity, Award, Bug, PlayCircle, BookOpen
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* ── WELCOME SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            Welcome back, {user?.name?.split(' ')[0] || "Jane"}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
          </h1>
          <p className="text-[#F8FAFC]/60 mt-1">Your AI tutor has generated new insights based on your learning activity.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* ── LEARNER INSIGHT CARD (Left/Main Content area) ── */}
        <div className="col-span-1 lg:col-span-2 relative p-[1px] rounded-2xl overflow-hidden group">
          {/* Animated border effect */}
          <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0 group-hover:rotate-180 transition-transform duration-1000 ease-linear animate-pulse" />
          
          <div className="relative h-full bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl p-6 lg:p-8 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-3 shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                  <Sparkles className="w-3 h-3" /> AI Insight
                </div>
                <h2 className="text-2xl font-bold text-white">Advanced Data Structures</h2>
                <p className="text-sm text-white/50 mt-1">Current Learning Goal</p>
              </div>
              
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#B45309]/10 border border-[#B45309]/30 text-[#B45309] font-bold">
                  <Award className="w-4 h-4" /> Mastery Level 4
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white/40 mb-3 uppercase tracking-wider">Detected Weak Concepts</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm font-medium">B-Trees</span>
                <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-sm font-medium">Graph Traversal (DFS)</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 rounded-lg text-sm font-medium hover:bg-white/10 cursor-pointer transition-colors">+2 more</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-teal-100">Recommended action: Complete targeted graph exercises.</p>
              <button className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] transition-all">
                Start Now
              </button>
            </div>
          </div>
        </div>

        {/* ── PROGRESS OVERVIEW (Right area) ── */}
        <div className="col-span-1 bg-[#334155]/30 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:bg-[#334155]/50 transition-colors">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" /> Course Progress
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Algorithm Fundamentals</span>
                  <span className="text-[#B45309] font-bold">92%</span>
                </div>
                <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-[#B45309] rounded-full w-[92%] relative">
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-shimmer" />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70 flex items-center gap-2">
                    Advanced Data Structures <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Needs attention" />
                  </span>
                  <span className="text-teal-400 font-bold">45%</span>
                </div>
                <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full w-[45%] relative">
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-shimmer" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">System Design</span>
                  <span className="text-teal-400 font-bold">12%</span>
                </div>
                <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full w-[12%] relative" />
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 font-semibold rounded-xl transition-colors border border-white/5">
            View Analytics
          </button>
        </div>
      </div>

      {/* ── QUICK ACCESS MODULE CARDS ── */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Core Modules</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: "Knowledge Assist", href: "/knowledge-assist", icon: Brain, desc: "Ask questions, get explanations", cta: "Ask AI" },
            { tag: "Material Generator", href: "/learning-generator", icon: FileText, desc: "Personalized tutorials & exercises", cta: "Generate Learning Plan" },
            { tag: "Assessment & Mastery", href: "/assessment", icon: Target, desc: "Evaluate and track mastery", cta: "Start Assessment" },
            { tag: "Peer Learning", href: "/peer-learning", icon: Users, desc: "Collaborate with other learners", cta: "Explore Community" },
          ].map((mod, i) => (
            <Link 
              key={i} href={mod.href}
              className="group p-5 bg-[#334155]/20 hover:bg-[#334155]/40 border border-white/5 hover:border-teal-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,148,136,0.1)] flex flex-col h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-teal-500/50 group-hover:bg-teal-500/10 transition-all text-white/70 group-hover:text-teal-400">
                <mod.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white mb-1.5">{mod.tag}</h4>
              <p className="text-xs text-white/50 mb-6 flex-1">{mod.desc}</p>
              <div className="flex items-center text-teal-400 text-sm font-bold mt-auto group-hover:underline">
                {mod.cta} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── AI GENERATED CONTENT PREVIEW ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Just for you</h3>
          <span className="text-xs text-white/40">Generated 5 mins ago</span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border border-white/5 hover:border-teal-500/20 transition-all cursor-pointer group">
            <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> AI Generated
            </div>
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-white/50" /> Graph DFS Explained</h4>
            <p className="text-xs text-white/50 mb-4 line-clamp-2">A simplified breakdown of Depth-First Search specifically targeting the logic error you made earlier today.</p>
            <button className="w-full py-2 bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 text-xs font-bold rounded-lg transition-colors border border-teal-500/20">Read Concept</button>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border border-white/5 hover:border-amber-500/20 transition-all cursor-pointer group">
            <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> AI Generated
            </div>
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><PlayCircle className="w-4 h-4 text-white/50" /> Micro-Exercise</h4>
            <p className="text-xs text-white/50 mb-4 line-clamp-2">Implement a basic recursive function to traverse a binary tree. Estimated time: 5 minutes.</p>
            <button className="w-full py-2 bg-amber-600/10 hover:bg-amber-600/20 text-[#B45309] hover:text-amber-500 text-xs font-bold rounded-lg transition-colors border border-amber-500/20">Solve Exercise</button>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border border-white/5 hover:border-red-500/20 transition-all cursor-pointer group">
            <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> AI Generated
            </div>
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Bug className="w-4 h-4 text-white/50" /> Debugging Task</h4>
            <p className="text-xs text-white/50 mb-4 line-clamp-2">You struggled with off-by-one errors. Fix this provided array traversal loop.</p>
            <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-colors border border-red-500/20">Start Debugging</button>
          </div>

        </div>
      </div>
      
    </div>
  );
}

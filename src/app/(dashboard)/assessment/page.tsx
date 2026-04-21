"use client";

import { Target, Award, CheckCircle2, ChevronRight, Lock, Code2, ShieldAlert } from "lucide-react";

export default function AssessmentPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* ── HEADER & SCORE DISPLAY ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#B45309]/10 border border-[#B45309]/30 flex items-center justify-center shadow-[0_0_20px_rgba(180,83,9,0.2)]">
            <Award className="w-7 h-7 text-[#B45309]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Mastery Hub</h1>
            <p className="text-[#F8FAFC]/50 text-sm">Evaluate your skills and level up your programmer profile.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="px-5 py-3 rounded-xl bg-[#334155]/30 border border-white/5 flex flex-col items-end">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Global Score</span>
            <span className="text-2xl font-black text-white">8,450</span>
          </div>
          <div className="px-5 py-3 rounded-xl bg-gradient-to-br from-[#B45309]/20 to-[#0F172A] border border-[#B45309]/30 flex flex-col items-end shadow-inner">
            <span className="text-[#B45309] text-[10px] font-bold uppercase tracking-widest">Current Rank</span>
            <span className="text-2xl font-black text-[#B45309]">Gold Tier</span>
          </div>
        </div>
      </div>

      {/* ── MASTERY LEVEL INDICATORS ── */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Topic Mastery</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-5 bg-gradient-to-b from-[#334155]/40 to-[#0F172A] border-t-2 border-teal-500 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_30px_rgba(13,148,136,0.1)] transition-all">
            <div className="absolute top-2 right-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
            </div>
            <Code2 className="w-6 h-6 text-white/40 mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">Basic Syntax</h4>
            <p className="text-xs text-white/50 mb-4">Level 5 (Max)</p>
            <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
              <div className="w-full h-full bg-teal-500 rounded-full" />
            </div>
          </div>

          <div className="p-5 bg-gradient-to-b from-[#334155]/40 to-[#0F172A] border-t-2 border-[#B45309] rounded-2xl relative overflow-hidden group hover:shadow-[0_0_30px_rgba(180,83,9,0.1)] transition-all">
            <div className="absolute top-2 right-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B45309]/20">
                <Target className="w-3 h-3 text-[#B45309]" />
              </div>
            </div>
            <Target className="w-6 h-6 text-white/40 mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">Data Structures</h4>
            <p className="text-xs text-[#B45309] font-bold mb-4">Level 3 (In Progress)</p>
            <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-[#B45309] rounded-full relative">
                <div className="absolute inset-y-0 right-0 w-4 bg-white/30 animate-shimmer" />
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#334155]/10 border-t-2 border-white/10 rounded-2xl relative overflow-hidden grayscale opacity-60">
            <div className="absolute top-2 right-2">
              <Lock className="w-4 h-4 text-white/30" />
            </div>
            <ShieldAlert className="w-6 h-6 text-white/40 mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">System Design</h4>
            <p className="text-xs text-white/40 mb-4">Locked</p>
            <div className="w-full h-1.5 bg-[#0F172A] rounded-full" />
          </div>

        </div>
      </div>

      {/* ── QUIZ CARDS ── */}
      <div>
        <div className="flex items-center justify-between mb-4 mt-4">
          <h3 className="text-lg font-bold text-white">Pending Assessments</h3>
          <button className="text-teal-400 text-sm font-bold hover:underline">View History</button>
        </div>

        <div className="space-y-4">
          
          <div className="p-1 rounded-2xl bg-gradient-to-r from-[#B45309]/40 via-[#B45309]/10 to-transparent">
            <div className="bg-[#0F172A] p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded bg-[#B45309]/10 text-[#B45309] text-[10px] font-bold uppercase tracking-wider">
                  Level Up Exam
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Trees & Graphs Final</h4>
                <p className="text-xs text-white/50">Pass this to achieve Gold Tier in Data Structures. 45 mins.</p>
              </div>
              <button className="px-6 py-3 bg-[#B45309] hover:bg-amber-600 text-white font-bold rounded-xl transition-transform hover:scale-105 shadow-[0_0_15px_rgba(180,83,9,0.4)] whitespace-nowrap">
                Start Exam
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#334155]/20 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-500/30 transition-colors">
             <div>
                <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                  Check-in Quiz
                </div>
                <h4 className="text-lg font-bold text-white mb-1">DFS Implementation</h4>
                <p className="text-xs text-white/50">Short 5-question logic check generated by your AI tutor.</p>
              </div>
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-teal-400 border border-white/10 font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2">
                Quick Start <ChevronRight className="w-4 h-4" />
              </button>
          </div>

        </div>
      </div>
      
    </div>
  );
}

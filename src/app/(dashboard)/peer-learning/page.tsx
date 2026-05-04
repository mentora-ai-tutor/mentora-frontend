"use client";

import { Users, Search, MessageSquare, Plus, ArrowUpRight, Heart, HeartPulse, CheckCircle2, Lock, Play, BookOpen, Clock, Activity, Target, Sparkles, Award } from "lucide-react";
import Link from "next/link";

export default function PeerLearningDashboard() {
  return (
    <div className="space-y-8 animate-slide-up text-white">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(13,148,136,0.2)]">
            <Users className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              PEER LEARNING DASHBOARD
            </h1>
            <p className="text-[#F8FAFC]/60 mt-1">Manage your collaborative learning sessions and track mastery.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── MAIN CONTENT (COL 1 & 2) ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overall Mastery Progress (Main Highlight) */}
          <div className="relative p-[1px] rounded-2xl overflow-hidden group">
            {/* Animated border effect */}
            <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0 group-hover:rotate-180 transition-transform duration-1000 ease-linear animate-pulse" />
            
            <div className="relative h-full bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl p-6 lg:p-8 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-3 shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                    <Sparkles className="w-3 h-3" /> Progress Insight
                  </div>
                  <h2 className="text-2xl font-bold text-white">Overall Mastery: 45% Complete</h2>
                  <p className="text-sm text-white/50 mt-1">Keep it up! You're making great progress.</p>
                </div>
                
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold">
                    <Award className="w-4 h-4" /> Mastery Level 2
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full w-[45%] relative">
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-shimmer" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white/40 mb-3 uppercase tracking-wider">Topics Status</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#334155]/30 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                      </span>
                      <span className="font-medium text-white/90 text-sm">Loops (45%)</span>
                    </div>
                    <span className="text-xs font-bold text-teal-400">Current Focus</span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                      <span className="text-white/60 text-sm">Recursion (30%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">Arrays (92%)</span>
                    </div>
                    <span className="text-xs font-bold text-green-400">✓ Can teach</span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Lock className="w-3.5 h-3.5 text-white/30" />
                      <span className="text-white/40 text-sm">Collections (Locked)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Focus */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden group hover:bg-[#334155]/40 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />
            
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-400" /> YOUR CURRENT FOCUS: LOOPS
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 text-center">
                <p className="text-xs text-white/50 font-medium mb-1">Current Score</p>
                <p className="text-2xl font-bold text-white">45%</p>
              </div>
              <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 text-center">
                <p className="text-xs text-white/50 font-medium mb-1">Target Score</p>
                <p className="text-2xl font-bold text-teal-400">90%</p>
              </div>
              <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 text-center">
                <p className="text-xs text-white/50 font-medium mb-1">Sessions Done</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 text-center">
                <p className="text-xs text-white/50 font-medium mb-1">Needed Est.</p>
                <p className="text-2xl font-bold text-[#B45309]">3</p>
              </div>
            </div>

            <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/40 font-semibold mb-2 uppercase tracking-wider">Assigned Teacher for Loops</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-[#0F172A] border border-teal-500/30 flex items-center justify-center font-bold text-white shadow-lg">M</div>
                  <div>
                    <p className="font-bold text-white text-lg">Michael T.</p>
                    <p className="text-sm text-teal-300 flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Mastery in Loops: 95%</p>
                  </div>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-white/50 font-medium mb-1">Next Session</p>
                <p className="text-base font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20">Today at 3:00 PM</p>
              </div>
            </div>
          </div>

          {/* Pending Sessions */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#B45309]" /> Pending Sessions
            </h3>
            <div className="space-y-4">
              <div className="group p-5 bg-[#334155]/20 hover:bg-[#334155]/40 border border-white/5 hover:border-teal-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,148,136,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-3">
                    Pair Session
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1">Loops Deep Dive</h4>
                  <p className="text-sm text-white/50">You are the <span className="text-white">LEARNER</span> | Teacher: Michael T.</p>
                  <p className="text-sm font-semibold text-teal-400 mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" /> Ready to start
                  </p>
                </div>
                <Link href="/peer-learning/pair-session" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:shadow-[0_0_25px_rgba(13,148,136,0.5)] flex items-center justify-center gap-2 hover:scale-105">
                    <Play className="w-4 h-4 fill-current" /> Start Session
                  </button>
                </Link>
              </div>

              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 opacity-75">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B45309]/10 border border-[#B45309]/20 text-[#B45309] text-[10px] font-bold tracking-wider uppercase mb-3">
                    Group Session
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1">Loops Coding Challenge</h4>
                  <p className="text-sm text-white/50">Your Role: <span className="text-white">EXPLAINER</span> | Team: Alice, Bob</p>
                  <p className="text-sm font-semibold text-[#B45309] mt-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Waiting for team (2/3 ready)
                  </p>
                </div>
                <button disabled className="w-full sm:w-auto px-6 py-3 bg-[#0F172A] border border-white/10 text-white/40 font-bold rounded-xl cursor-not-allowed">
                  Waiting...
                </button>
              </div>
            </div>
          </div>
          
        </div>

        {/* ── SIDEBAR (COL 3) ── */}
        <div className="space-y-6">
          
          {/* Recent Activity */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6 hover:bg-[#334155]/40 transition-colors">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" /> Recent Activity
            </h3>
            <div className="space-y-6">
              <div className="relative pl-4 border-l-2 border-teal-500/30">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0F172A] border-2 border-teal-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                </div>
                <p className="text-xs text-teal-400 font-bold mb-1">April 22, 2026</p>
                <h4 className="font-bold text-white mb-1">Pair Session on Loops</h4>
                <p className="text-xs text-white/50 mb-3">Your Score: 85% | Teacher Score: 92%</p>
                <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-xs text-teal-100 font-medium italic">
                  "Great improvement! Your off-by-one errors are fixed."
                </div>
              </div>

              <div className="relative pl-4 border-l-2 border-white/10">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0F172A] border-2 border-white/20" />
                <p className="text-xs text-white/40 font-bold mb-1">April 20, 2026</p>
                <h4 className="font-bold text-white mb-1">Group Session on Arrays</h4>
                <p className="text-xs text-white/50 mb-1">Your Score: 92% | Role: SOLVER</p>
                <p className="text-xs text-white/50">Team Score: 88%</p>
              </div>

              <div className="relative pl-4 border-l-2 border-white/10">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0F172A] border-2 border-white/20" />
                <p className="text-xs text-white/40 font-bold mb-1">April 18, 2026</p>
                <h4 className="font-bold text-white mb-1">Pair Session on Loops</h4>
                <p className="text-xs text-white/50 mb-3">Your Score: 70% | Teacher Score: 88%</p>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 font-medium italic">
                  "Good attempt. Focus on loop conditions."
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Knowledge Preview */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6 hover:bg-[#334155]/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#B45309]" /> Recommendations
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#0F172A]/50 border border-white/5 hover:border-teal-500/30 transition-all cursor-pointer group">
                <h4 className="font-bold text-white text-sm mb-1.5 group-hover:text-teal-400 transition-colors">How to Fix Off-by-One Errors in Loops</h4>
                <p className="text-xs text-white/50 mb-3 font-medium">By STU2102 | 127 found helpful</p>
                <div className="text-xs font-bold text-teal-400 group-hover:underline">Read Now →</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0F172A]/50 border border-white/5 hover:border-teal-500/30 transition-all cursor-pointer group">
                <h4 className="font-bold text-white text-sm mb-1.5 group-hover:text-teal-400 transition-colors">Understanding Nested Loops</h4>
                <p className="text-xs text-white/50 mb-3 font-medium">By STU2106 | 89 found helpful</p>
                <div className="text-xs font-bold text-teal-400 group-hover:underline">Read Now →</div>
              </div>
            </div>
          </div>

          {/* Verified Pools Status */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6 hover:bg-[#334155]/40 transition-colors">
            <h3 className="text-lg font-bold text-white mb-6">Verified Teaching Pools</h3>
            <div className="space-y-5">
              <div className="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Arrays</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 px-2 py-0.5 rounded bg-teal-500/10">Verified</span>
                </div>
                <p className="text-xs text-teal-100/60 mb-3 font-medium">Students taught: 2 | Avg score: 90%</p>
                <button className="w-full text-xs font-bold bg-[#0F172A] border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 py-2 rounded-lg transition-colors">
                  View Teaching Assignments
                </button>
              </div>
              
              <div className="px-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white/80">Loops</span>
                  <span className="text-[10px] text-white/40 font-bold">Needs 45% more</span>
                </div>
              </div>
              
              <div className="px-2">
                <div className="flex items-center gap-2 opacity-50">
                  <Lock className="w-4 h-4 text-white/40" />
                  <span className="font-bold text-sm text-white/60">Recursion</span>
                </div>
                <p className="text-[10px] text-white/40 ml-6 mt-1 font-medium">Locked until Loops mastered</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

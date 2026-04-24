"use client";

import { Users, Search, MessageSquare, Plus, ArrowUpRight, Heart, HeartPulse, CheckCircle2, Lock, Play, BookOpen, Clock, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PeerLearningDashboard() {
  return (
    <div className="space-y-8 animate-slide-up pb-8 text-white">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">PEER LEARNING DASHBOARD</h1>
            <p className="text-sm text-white/50">YOUR PEER LEARNING STATUS</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── MAIN CONTENT (COL 1 & 2) ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overall Mastery Progress */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Overall Mastery Progress: 45% Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-500" style={{ width: "45%" }}></div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-white/80">Topics Status:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="font-medium text-blue-400">Loops: 45% (In Progress)</span>
                    <span className="text-white/40">- Your current focus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <span className="text-white/60">Recursion: 30% (Not Started)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Arrays: 92% (Mastered) ✓ Can teach</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-yellow-400 font-medium">Binary Search Trees: 40% (In Progress)</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/40">
                    <Lock className="w-3 h-3" />
                    <span>Collections: 0% (Locked - needs Recursion first)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Current Focus */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-[#0F172A] border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" /> YOUR CURRENT FOCUS: LOOPS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Current Score</p>
                  <p className="text-xl font-bold text-white">45%</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Target Score</p>
                  <p className="text-xl font-bold text-blue-400">90%</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Sessions Completed</p>
                  <p className="text-xl font-bold text-white">2</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Sessions Needed</p>
                  <p className="text-xl font-bold text-yellow-400">3 <span className="text-xs font-normal text-white/50">more est.</span></p>
                </div>
              </div>

              <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-white/5">
                <h3 className="font-bold text-sm mb-3">YOUR ASSIGNED TEACHER FOR LOOPS:</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">M</div>
                    <div>
                      <p className="font-bold">Michael T.</p>
                      <p className="text-xs text-white/60">Mastery in Loops: 95%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Next Session</p>
                    <p className="text-sm font-semibold text-blue-400">Today at 3:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Sessions */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" /> YOUR PENDING SESSIONS:
            </h3>
            <div className="space-y-4">
              <Card className="bg-[#1e293b]/50 border-white/5 hover:border-blue-500/30 transition-colors">
                <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-blue-400 mb-1">[Pair Session - Loops]</h4>
                    <p className="text-sm text-white/70">You are the LEARNER | Teacher: Michael T.</p>
                    <p className="text-xs font-medium text-green-400 mt-2">Status: Ready to start</p>
                  </div>
                  <Link href="/peer-learning/pair-session">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2">
                      <Play className="w-4 h-4" /> START SESSION
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-[#1e293b]/30 border-white/5">
                <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-purple-400 mb-1">[Group Session - Loops]</h4>
                    <p className="text-sm text-white/70">Your Role: EXPLAINER | Team: Alice (Solver), Bob (Reviewer)</p>
                    <p className="text-xs text-white/50 mt-1">Session Type: CODING SESSION</p>
                    <p className="text-xs font-medium text-yellow-500 mt-2">Status: Waiting for team (2/3 ready)</p>
                  </div>
                  <Button variant="outline" disabled className="bg-black/20 text-white/50 border-white/10">
                    WAITING
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 flex-1">VIEW FULL PROGRESS</Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 flex-1">GO TO KNOWLEDGE BASE</Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 flex-1">VIEW VERIFIED POOL</Button>
          </div>
        </div>

        {/* ── SIDEBAR (COL 3) ── */}
        <div className="space-y-6">
          
          {/* Recent Activity */}
          <div className="bg-[#1e293b]/50 p-5 rounded-2xl border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> YOUR RECENT ACTIVITY:
            </h3>
            
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <p className="text-xs text-white/40 mb-1">April 22, 2026</p>
                <h4 className="font-bold text-sm mb-1">Pair Session on Loops</h4>
                <p className="text-xs text-white/70 mb-2">Your Score: 85% | Teacher Score: 92%</p>
                <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded text-xs text-blue-300 italic mb-2">
                  "Great improvement! Your off-by-one errors are fixed."
                </div>
                <button className="text-[10px] uppercase font-bold text-white/50 hover:text-blue-400 transition-colors">
                  [VIEW DETAILS]
                </button>
              </div>

              <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <p className="text-xs text-white/40 mb-1">April 20, 2026</p>
                <h4 className="font-bold text-sm mb-1">Group Session on Arrays</h4>
                <p className="text-xs text-white/70 mb-2">Your Score: 92% | Role: SOLVER</p>
                <p className="text-xs text-white/50 mb-2">Team Score: 88%</p>
                <button className="text-[10px] uppercase font-bold text-white/50 hover:text-blue-400 transition-colors">
                  [VIEW DETAILS]
                </button>
              </div>

              <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <p className="text-xs text-white/40 mb-1">April 18, 2026</p>
                <h4 className="font-bold text-sm mb-1">Pair Session on Loops</h4>
                <p className="text-xs text-white/70 mb-2">Your Score: 70% | Teacher Score: 88%</p>
                <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded text-xs text-blue-300 italic mb-2">
                  "Good attempt. Focus on loop conditions."
                </div>
                <button className="text-[10px] uppercase font-bold text-white/50 hover:text-blue-400 transition-colors">
                  [VIEW DETAILS]
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Knowledge */}
          <div className="bg-[#1e293b]/50 p-5 rounded-2xl border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" /> RECOMMENDED KNOWLEDGE
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <h4 className="text-sm font-bold mb-1 line-clamp-1">How to Fix Off-by-One Errors in Loops</h4>
                <p className="text-xs text-white/50 mb-2">By Student_STU2102 | 127 found helpful</p>
                <Button size="sm" variant="ghost" className="w-full text-xs h-7 bg-white/5 hover:bg-white/10">VIEW</Button>
              </div>
              <div className="p-3 bg-black/20 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <h4 className="text-sm font-bold mb-1 line-clamp-1">Understanding Nested Loops</h4>
                <p className="text-xs text-white/50 mb-2">By Student_STU2106 | 89 found helpful</p>
                <Button size="sm" variant="ghost" className="w-full text-xs h-7 bg-white/5 hover:bg-white/10">VIEW</Button>
              </div>
            </div>
          </div>

          {/* Verified Pools Status */}
          <div className="bg-[#1e293b]/50 p-5 rounded-2xl border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4">YOUR VERIFIED POOLS STATUS</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-green-400">Arrays</span>
                  <Badge className="bg-green-500/20 text-green-400 border-none">VERIFIED</Badge>
                </div>
                <p className="text-xs text-white/50 mb-2">Students you taught: 2 | Avg score: 90%</p>
                <Button size="sm" className="w-full text-xs bg-green-600 hover:bg-green-500 text-white h-7">VIEW TEACHING ASSIGNMENTS</Button>
              </div>
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white/70">Loops</span>
                  <span className="text-[10px] text-white/40">Need 45% more</span>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-white/30" />
                  <span className="font-bold text-sm text-white/30">Recursion</span>
                </div>
                <p className="text-[10px] text-white/30 ml-5 mt-1">Locked until Loops mastered</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


"use client";

import { CheckCircle2, Users, ArrowRight, MessageSquare, ListChecks, Code2, Clock, Sparkles, Award, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function MiniProjectPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-12 text-white max-w-5xl mx-auto font-sans">
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(13,148,136,0.2)]">
          <Target className="w-3.5 h-3.5" /> Project Milestone
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">Mini Project Performance</h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <span>Group: GRP_LOOPS_001</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Session: <span className="text-teal-400">MINI PROJECT</span></span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Round 4 of 4</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>April 23, 2026</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* YOUR PERFORMANCE */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden hover:bg-[#334155]/40 transition-all shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
            <h2 className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] flex items-center gap-2">
              <Award className="w-4 h-4" /> Personal Mastery: Solver
            </h2>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-8 mb-8">
              <div className="text-7xl font-black text-white tracking-tighter">95<span className="text-teal-400 text-4xl">%</span></div>
              <div className="flex-1">
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden mb-3 border border-white/5 p-[2px]">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_15px_rgba(13,148,136,0.5)]" style={{ width: "95%" }}></div>
                </div>
                <p className="text-xs font-black text-teal-400 uppercase tracking-widest">Master Engineer</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Competency Audit</h3>
              {[
                { label: "Implemented 6 core features", points: "+60", icon: CheckCircle2, color: "text-teal-400" },
                { label: "Integrated 2 bonus features", points: "+20", icon: Sparkles, color: "text-[#B45309]" },
                { label: "Codebase optimization", points: "+15", icon: Code2, color: "text-teal-400" },
                { label: "Neural link collaboration", points: "+10", icon: Users, color: "text-teal-400" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5 group hover:bg-black/30 transition-colors">
                  <span className="flex items-center gap-3 text-sm font-medium text-white/80">
                    <item.icon className={`w-4 h-4 ${item.color}`} /> {item.label}
                  </span>
                  <span className="font-black text-xs text-teal-400">{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TEAM PERFORMANCE */}
        <div className="space-y-6">
          <Card className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" /> Squadron Performance
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="overflow-hidden rounded-2xl border border-white/5">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-black text-white/30 uppercase bg-black/40">
                    <tr>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Mastery</th>
                      <th className="px-5 py-4 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/20">
                    <tr className="border-b border-white/5">
                      <td className="px-5 py-4 font-black text-teal-400 uppercase text-[11px]">Solver</td>
                      <td className="px-5 py-4 font-bold text-white/90">YOU</td>
                      <td className="px-5 py-4 font-black text-white">95%</td>
                      <td className="px-5 py-4 text-right text-teal-400 font-bold text-xs uppercase tracking-tighter">95/100</td>
                    </tr>
                    <tr className="border-b border-white/5 bg-white/5">
                      <td className="px-5 py-4 font-black text-white/40 uppercase text-[11px]">Reviewer</td>
                      <td className="px-5 py-4 font-bold text-white/90">Alice</td>
                      <td className="px-5 py-4 font-black text-white">89%</td>
                      <td className="px-5 py-4 text-right text-white/40 font-bold text-xs uppercase tracking-tighter">90/100</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 font-black text-white/40 uppercase text-[11px]">Explainer</td>
                      <td className="px-5 py-4 font-bold text-white/90">Bob</td>
                      <td className="px-5 py-4 font-black text-white">91%</td>
                      <td className="px-5 py-4 text-right text-white/40 font-bold text-xs uppercase tracking-tighter">92/100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-center shadow-inner">
                <span className="text-xs font-black text-teal-400 uppercase tracking-[0.2em]">Squadron Mean Mastery: 91.7%</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />
             <div className="p-2 border-b border-white/5 bg-[#0F172A]/80 -mx-6 -mt-6 mb-6 px-8 flex items-center gap-3">
              <Code2 className="w-4 h-4 text-teal-400" />
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Quality Architecture Audit</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Compilation Matrix", value: "Verified Stable" },
                { label: "Neural Link Coverage", value: "100% Comprehensive" },
                { label: "Code Legibility Audit", value: "Premium" },
                { label: "Sequence Efficiency", value: "Optimal O(n)" },
                { label: "Boundary Protocol", value: "Fault Tolerant" },
              ].map((audit, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5 group hover:bg-black/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-xs font-medium text-white/60">{audit.label}</span>
                  </div>
                  <span className="font-black text-white text-[10px] uppercase tracking-tighter">{audit.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES COMPLETION */}
      <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8 flex justify-between items-center">
          <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-teal-400" /> Project Feature Log
          </h2>
          <div className="flex gap-4">
             <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Core: 100%</span>
             <span className="text-[10px] font-black text-[#B45309] uppercase tracking-widest bg-[#B45309]/10 px-2 py-0.5 rounded border border-[#B45309]/20">Bonus: 67%</span>
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black text-white/30 uppercase bg-black/40">
              <tr>
                <th className="px-8 py-4">Designation</th>
                <th className="px-8 py-4">Protocol Status</th>
                <th className="px-8 py-4 text-right">Primary Contributor</th>
              </tr>
            </thead>
            <tbody className="bg-black/10">
              {[
                { name: "Student Name/Grade Repository", status: "Verified", author: "YOU (Solver)", color: "text-teal-400" },
                { name: "Neural Average Calculation Matrix", status: "Verified", author: "YOU (Solver)", color: "text-teal-400" },
                { name: "Min/Max Boundary Identification", status: "Verified", author: "YOU (Solver)", color: "text-teal-400" },
                { name: "Above-Average Sequence Filter", status: "Verified", author: "YOU (Solver)", color: "text-teal-400" },
                { name: "Dynamic Contributor Entry Module", status: "Verified", author: "YOU (Solver)", color: "text-teal-400" },
                { name: "Protocol Exit Routine ('quit')", status: "Verified", author: "YOU (Solver)", color: "text-teal-400" },
                { name: "Mastery Sorting Logic (Bonus)", status: "Verified", author: "YOU (Solver)", color: "text-[#B45309]", bg: "bg-[#B45309]/5" },
                { name: "Letter Grade Classification (Bonus)", status: "Verified", author: "YOU (Solver)", color: "text-[#B45309]", bg: "bg-[#B45309]/5" },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${row.bg || ''}`}>
                  <td className="px-8 py-4 font-bold text-white/80">{row.name}</td>
                  <td className={`px-8 py-4 font-black uppercase text-[10px] tracking-widest ${row.color} flex items-center gap-2`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {row.status}
                  </td>
                  <td className="px-8 py-4 text-right text-white/40 font-bold text-xs uppercase tracking-tighter">{row.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* PEER FEEDBACK & COMPLETION */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" /> Squadron Feedback
            </h2>
          </div>
          <div className="p-8 space-y-6 flex-1">
            <div className="bg-teal-500/5 border-l-4 border-teal-500 p-5 rounded-r-2xl shadow-inner">
              <p className="text-[10px] font-black text-teal-400 mb-2 uppercase tracking-widest">Alice (Reviewer):</p>
              <p className="text-sm italic text-white/70 leading-relaxed font-medium">
                "Your code was clean and well-structured. All edge cases handled correctly. The bonus features were a nice touch!"
              </p>
            </div>
            <div className="bg-white/5 border-l-4 border-white/10 p-5 rounded-r-2xl shadow-inner">
              <p className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">Bob (Explainer):</p>
              <p className="text-sm italic text-white/50 leading-relaxed font-medium">
                "Great collaboration! You implemented exactly what we designed. Code was easy to understand and modify. Excellent work!"
              </p>
            </div>
          </div>
        </div>

        <div className="bg-teal-600 p-[2px] rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(13,148,136,0.3)] group">
          <div className="bg-[#0F172A] p-8 rounded-[22px] h-full flex flex-col">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black tracking-widest uppercase mb-4">
                <Sparkles className="w-4 h-4" /> Series Finalized
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Mission Series Complete</h3>
              <p className="text-xs text-white/40 mt-2 font-medium">All 4 instructional rounds finalized.</p>
            </div>
            
            <div className="space-y-4 mt-auto">
              <Link href="/peer-learning/session-series-performance" className="block">
                <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black h-14 rounded-2xl shadow-lg transition-all group-hover:scale-[1.02] active:scale-95 text-[11px] uppercase tracking-widest">
                  VIEW FULL SERIES ANALYTICS <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </Link>
              <Link href="/peer-learning" className="block text-center">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">Return to Command Center</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

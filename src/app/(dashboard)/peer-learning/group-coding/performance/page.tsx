"use client";

import { CheckCircle2, TrendingUp, Users, AlertTriangle, ArrowRight, MessageSquare, ListChecks, Sparkles, Award, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function GroupCodingPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-12 text-white max-w-5xl mx-auto font-sans">
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(13,148,136,0.2)]">
          <Activity className="w-3.5 h-3.5" /> Performance Analytics
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">Group Coding Performance</h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <span>Group: GRP_LOOPS_001</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Session: <span className="text-teal-400">CODING</span></span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Round 2 of 4</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>April 23, 2026</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* YOUR PERFORMANCE */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden hover:bg-[#334155]/40 transition-all shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
            <h2 className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] flex items-center gap-2">
              <Award className="w-4 h-4" /> Personal Mastery: Explainer
            </h2>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-8 mb-8">
              <div className="text-7xl font-black text-white tracking-tighter">88<span className="text-teal-400 text-4xl">%</span></div>
              <div className="flex-1">
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden mb-3 border border-white/5 p-[2px]">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_15px_rgba(13,148,136,0.5)]" style={{ width: "88%" }}></div>
                </div>
                <p className="text-xs font-black text-teal-400 uppercase tracking-widest">Distinction Achieved</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Competency Breakdown</h3>
              {[
                { label: "Problem articulation", points: "+25", icon: CheckCircle2, color: "text-teal-400" },
                { label: "Requirement decomposition", points: "+25", icon: CheckCircle2, color: "text-teal-400" },
                { label: "Neural link communication", points: "+20", icon: CheckCircle2, color: "text-teal-400" },
                { label: "Operational hint used", points: "-5", icon: AlertTriangle, color: "text-[#B45309]" },
                { label: "Peer Validation (Solver)", points: "+11.5", icon: CheckCircle2, color: "text-teal-400" },
                { label: "Peer Validation (Reviewer)", points: "+11", icon: CheckCircle2, color: "text-teal-400" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5 group hover:bg-black/30 transition-colors">
                  <span className="flex items-center gap-3 text-sm font-medium text-white/80">
                    <item.icon className={`w-4 h-4 ${item.color}`} /> {item.label}
                  </span>
                  <span className={`font-black text-xs ${item.points.startsWith('+') ? 'text-teal-400' : 'text-[#B45309]'}`}>{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TEAM PERFORMANCE */}
        <div className="space-y-6">
          <Card className="bg-[#334155]/30 border-white/10 rounded-3xl overflow-hidden shadow-2xl">
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
                      <td className="px-5 py-4 font-black text-teal-400 uppercase text-[11px]">Explainer</td>
                      <td className="px-5 py-4 font-bold text-white/90">YOU</td>
                      <td className="px-5 py-4 font-black text-white">88%</td>
                      <td className="px-5 py-4 text-right text-teal-400 font-bold text-xs">90/100</td>
                    </tr>
                    <tr className="border-b border-white/5 bg-white/5">
                      <td className="px-5 py-4 font-black text-white/40 uppercase text-[11px]">Solver</td>
                      <td className="px-5 py-4 font-bold text-white/90">Alice</td>
                      <td className="px-5 py-4 font-black text-white">92%</td>
                      <td className="px-5 py-4 text-right text-white/40 font-bold text-xs">94/100</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 font-black text-white/40 uppercase text-[11px]">Reviewer</td>
                      <td className="px-5 py-4 font-bold text-white/90">Bob</td>
                      <td className="px-5 py-4 font-black text-white">85%</td>
                      <td className="px-5 py-4 text-right text-white/40 font-bold text-xs">86/100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-center shadow-inner">
                <span className="text-xs font-black text-teal-400 uppercase tracking-[0.2em]">Squadron Mean Mastery: 88.3%</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl p-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" /> Neural Link Trend
              </h2>
              <span className="text-[10px] font-black text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 uppercase tracking-widest animate-pulse">Improving</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="text-center">
                <p className="text-[9px] font-black text-white/20 mb-2 uppercase tracking-[0.2em]">Previous</p>
                <p className="text-2xl font-black text-white/40">82%</p>
              </div>
              <div className="flex-1 h-[2px] bg-white/10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(13,148,136,0.8)]" />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-teal-400 mb-2 uppercase tracking-[0.2em]">Current</p>
                <p className="text-2xl font-black text-white">88%</p>
              </div>
              <div className="text-center bg-teal-500/10 p-3 rounded-2xl border border-teal-500/20 min-w-[70px] shadow-inner">
                <p className="text-[9px] font-black text-teal-400 mb-1 uppercase">Gain</p>
                <p className="text-xl font-black text-teal-400">+6%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* TASK & SOLUTION QUALITY */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-teal-400" /> Verification Matrix
            </h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-4 text-[11px] font-bold uppercase tracking-tight">
              {["Problem sync", "Logic design", "Code implement", "Architecture review", "Telemetry test", "Final verification"].map((task, i) => (
                <div key={i} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span className="text-white/70">{task}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/5 pt-8 space-y-4">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 text-center underline decoration-white/5 underline-offset-8">Codebase Quality Audit</h3>
              {[
                { label: "Correctness", value: "Valid output across all test vectors" },
                { label: "Efficiency", value: "Optimal O(n²) sequence complexity" },
                { label: "Architecture", value: "Clean, modular implementation" },
                { label: "Safety", value: "Handles empty array & null pointer cases" },
              ].map((audit, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors shadow-inner">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="font-black text-white text-xs uppercase tracking-widest block mb-1">{audit.label}</span>
                    <span className="text-xs text-white/50 font-medium italic">"{audit.value}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEEDBACK & NEXT STEPS */}
        <div className="space-y-6 flex flex-col">
          <Card className="bg-[#334155]/30 border-white/10 rounded-3xl overflow-hidden flex-1 shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> Peer Transmissions
              </h2>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="bg-teal-500/5 border-l-4 border-teal-500 p-5 rounded-r-2xl shadow-inner">
                <p className="text-[10px] font-black text-teal-400 mb-2 uppercase tracking-widest">Alice (Solver):</p>
                <p className="text-sm italic text-white/70 leading-relaxed font-medium">
                  "Great explanation! You made the nested loop concept very clear. Helped me understand what to code."
                </p>
              </div>
              <div className="bg-white/5 border-l-4 border-white/10 p-5 rounded-r-2xl shadow-inner">
                <p className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">Bob (Reviewer):</p>
                <p className="text-sm italic text-white/50 leading-relaxed font-medium">
                  "Good breakdown of requirements. Helped us catch the duplicate pair issue. Keep up the good work!"
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-teal-600 p-[2px] rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(13,148,136,0.3)] group">
            <div className="bg-[#0F172A] p-8 rounded-[22px] h-full">
              <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-6 text-center">Protocol Elevation</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-bold text-white/60">
                  <span>Upcoming Phase</span>
                  <span className="text-teal-400 uppercase tracking-widest text-[10px]">Debugging Unit</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-white/60">
                  <span>Assigned Designation</span>
                  <span className="text-teal-400 uppercase tracking-widest text-[10px]">Reviewer (Rotating)</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-white/60">
                  <span>Temporal Schedule</span>
                  <span className="text-white uppercase tracking-widest text-[10px]">Tomorrow at 14:00</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link href="/peer-learning/group-debugging" className="block">
                  <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black h-14 rounded-2xl shadow-lg transition-all group-hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest">
                    INITIALIZE NEXT ROUND <ArrowRight className="w-4 h-4 ml-3" />
                  </Button>
                </Link>
                <Link href="/peer-learning" className="block text-center">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">Return to Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

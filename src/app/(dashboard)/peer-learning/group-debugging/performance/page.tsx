"use client";

import { CheckCircle2, Users, ArrowRight, MessageSquare, Bug, Clock, Sparkles, Award, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function GroupDebuggingPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-12 text-white max-w-5xl mx-auto font-sans">
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(13,148,136,0.2)]">
          <Activity className="w-3.5 h-3.5" /> Diagnostic Performance
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">Debugging Session Audit</h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <span>Group: GRP_LOOPS_001</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Session: <span className="text-[#B45309]">DEBUGGING</span></span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Round 3 of 4</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Duration: 18 min</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* YOUR PERFORMANCE */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden hover:bg-[#334155]/40 transition-all shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
            <h2 className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] flex items-center gap-2">
              <Award className="w-4 h-4" /> Personal Mastery: Reviewer
            </h2>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-8 mb-8">
              <div className="text-7xl font-black text-white tracking-tighter">94<span className="text-teal-400 text-4xl">%</span></div>
              <div className="flex-1">
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden mb-3 border border-white/5 p-[2px]">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_15px_rgba(13,148,136,0.5)]" style={{ width: "94%" }}></div>
                </div>
                <p className="text-xs font-black text-teal-400 uppercase tracking-widest">Master Evaluator</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Metric Breakdown</h3>
              {[
                { label: "Detected 4 of 4 anomalies", points: "+40", icon: Bug, color: "text-[#B45309]" },
                { label: "Precise coordinate detection", points: "+20", icon: CheckCircle2, color: "text-teal-400" },
                { label: "Diagnostic Fix accuracy", points: "+20", icon: CheckCircle2, color: "text-teal-400" },
                { label: "Verification sequence completion", points: "+10", icon: CheckCircle2, color: "text-teal-400" },
                { label: "Peer Approval (Explainer)", points: "+2", icon: Sparkles, color: "text-teal-400" },
                { label: "Peer Approval (Solver)", points: "+2", icon: Sparkles, color: "text-teal-400" },
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
                <Users className="w-4 h-4 text-teal-400" /> Squadron Status
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="overflow-hidden rounded-2xl border border-white/5">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-black text-white/30 uppercase bg-black/40">
                    <tr>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Score</th>
                      <th className="px-5 py-4 text-right">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/20">
                    <tr className="border-b border-white/5">
                      <td className="px-5 py-4 font-black text-teal-400 uppercase text-[11px]">Reviewer</td>
                      <td className="px-5 py-4 font-bold text-white/90">YOU</td>
                      <td className="px-5 py-4 font-black text-white">94%</td>
                      <td className="px-5 py-4 text-right text-teal-400 font-bold text-xs uppercase tracking-tighter">Excellent</td>
                    </tr>
                    <tr className="border-b border-white/5 bg-white/5">
                      <td className="px-5 py-4 font-black text-white/40 uppercase text-[11px]">Explainer</td>
                      <td className="px-5 py-4 font-bold text-white/90">Alice</td>
                      <td className="px-5 py-4 font-black text-white">86%</td>
                      <td className="px-5 py-4 text-right text-white/40 font-bold text-xs uppercase tracking-tighter">Good</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 font-black text-white/40 uppercase text-[11px]">Solver</td>
                      <td className="px-5 py-4 font-bold text-white/90">Bob</td>
                      <td className="px-5 py-4 font-black text-white">91%</td>
                      <td className="px-5 py-4 text-right text-white/40 font-bold text-xs uppercase tracking-tighter">V. Good</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-center shadow-inner">
                <span className="text-xs font-black text-teal-400 uppercase tracking-[0.2em]">Squadron Mean Score: 90.3%</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl p-6 shadow-2xl">
             <div className="p-2 border-b border-white/5 bg-[#0F172A]/80 -mx-6 -mt-6 mb-6 px-8 flex items-center gap-3">
              <Clock className="w-4 h-4 text-teal-400" />
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Temporal Audit Metrics</h2>
            </div>
            <div className="space-y-3">
              {[
                { bug: "Bug #1 Detection", time: "1m 30s" },
                { bug: "Bug #2 Detection", time: "2m 00s" },
                { bug: "Bug #3 Detection", time: "3m 00s" },
                { bug: "Bug #4 Detection", time: "4m 30s" },
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                  <span className="text-xs font-medium text-white/60">{m.bug}</span>
                  <span className="font-black text-white text-xs">{m.time}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Mean Detection Rate</span>
                <span className="text-sm font-black text-teal-400">2m 45s / anomaly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BUGS SUMMARY */}
      <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
          <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
            <Bug className="w-4 h-4 text-[#B45309]" /> Neural Anomaly Log
          </h2>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black text-white/30 uppercase bg-black/40">
              <tr>
                <th className="px-8 py-4">Ref</th>
                <th className="px-8 py-4">Coordinate</th>
                <th className="px-8 py-4">Classification</th>
                <th className="px-8 py-4 text-center">Found</th>
                <th className="px-8 py-4 text-center">Patched</th>
                <th className="px-8 py-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="bg-black/10">
              {[
                { id: "#1", loc: "Line 6", type: "Off-by-one", sev: "Critical", sevColor: "text-teal-400" },
                { id: "#2", loc: "Line 8", type: "Index Variance", sev: "Critical", sevColor: "text-teal-400" },
                { id: "#3", loc: "Line 11", type: "Syntax Breach", sev: "Minor", sevColor: "text-[#B45309]/60" },
                { id: "#4", loc: "Line 14", type: "Logic Mismatch", sev: "Major", sevColor: "text-[#B45309]" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-8 py-4 font-black text-white/40">{row.id}</td>
                  <td className="px-8 py-4 font-bold text-white/80">{row.loc}</td>
                  <td className="px-8 py-4 text-xs font-medium">{row.type}</td>
                  <td className="px-8 py-4 text-center"><CheckCircle2 className="w-4 h-4 text-teal-400 mx-auto" /></td>
                  <td className="px-8 py-4 text-center"><CheckCircle2 className="w-4 h-4 text-teal-400 mx-auto" /></td>
                  <td className={`px-8 py-4 text-right font-black uppercase text-[10px] tracking-widest ${row.sevColor}`}>{row.sev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* FEEDBACK & NEXT STEPS */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" /> Neural Transmissions Received
            </h2>
          </div>
          <div className="p-8 space-y-6 flex-1">
            <div className="bg-teal-500/5 border-l-4 border-teal-500 p-5 rounded-r-2xl shadow-inner">
              <p className="text-[10px] font-black text-teal-400 mb-2 uppercase tracking-widest">Alice (Explainer):</p>
              <p className="text-sm italic text-white/70 leading-relaxed font-medium">
                "Excellent bug hunting! You found issues I completely missed. Clear bug reports made explaining easy."
              </p>
            </div>
            <div className="bg-white/5 border-l-4 border-white/10 p-5 rounded-r-2xl shadow-inner">
              <p className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">Bob (Solver):</p>
              <p className="text-sm italic text-white/50 leading-relaxed font-medium">
                "Your bug reports were very clear with exact line numbers. Made fixing straightforward. Great teamwork!"
              </p>
            </div>
          </div>
        </div>

        <div className="bg-teal-600 p-[2px] rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(13,148,136,0.3)] group">
          <div className="bg-[#0F172A] p-8 rounded-[22px] h-full flex flex-col">
            <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-6 text-center">Protocol Advancement</h3>
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex justify-between text-xs font-bold text-white/60">
                <span>Phase Designation</span>
                <span className="text-teal-400 uppercase tracking-widest text-[10px]">Mini Project Session</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-white/60">
                <span>Squadron Designation</span>
                <span className="text-teal-400 uppercase tracking-widest text-[10px]">Solver (Rotating)</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-white/60">
                <span>Temporal Schedule</span>
                <span className="text-white uppercase tracking-widest text-[10px]">Tomorrow at 14:00</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link href="/peer-learning/mini-project" className="block">
                <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black h-14 rounded-2xl shadow-lg transition-all group-hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest">
                  INITIALIZE PROJECT <ArrowRight className="w-4 h-4 ml-3" />
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
  );
}

"use client";

import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Calendar, Clock, Award, Activity, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PairSessionPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-12 text-white max-w-5xl mx-auto font-sans">
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(13,148,136,0.2)]">
          <Activity className="w-3.5 h-3.5" /> Session Analytics
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">Pair Session Performance</h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <span>Session: SESS_LOOPS_001</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Topic: <span className="text-teal-400">LOOPS</span></span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Date: April 23, 2026</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Duration: 28 min</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* YOUR PERFORMANCE */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden hover:bg-[#334155]/40 transition-all shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
            <h2 className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] flex items-center gap-2">
              <Award className="w-4 h-4" /> Mastery Evaluation
            </h2>
          </div>
          <div className="p-10 text-center">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Neural Score Matrix</p>
            <div className="text-8xl font-black text-white tracking-tighter mb-2">85<span className="text-teal-400 text-4xl">%</span></div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/5 border border-teal-500/20 text-[10px] font-black text-teal-400 uppercase tracking-tight">
              Teacher Baseline: 92%
            </div>
          </div>
        </div>

        {/* MASTERY STATUS */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />
          <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2 mb-8">
            <Target className="w-4 h-4 text-teal-400" /> Mastery Trajectory
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Current Proficiency</p>
                <p className="text-3xl font-black text-white">85%</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-2">Threshold</p>
                <p className="text-3xl font-black text-teal-400">90%</p>
              </div>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[2px]">
              <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_15px_rgba(13,148,136,0.5)] relative" style={{ width: "85%" }}>
                <div className="absolute inset-0 bg-white/10 animate-shimmer" />
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#B45309]/5 border border-[#B45309]/20 rounded-2xl mt-4">
              <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0" />
              <div>
                <p className="text-[10px] font-black text-[#B45309] uppercase tracking-widest">Protocol Incomplete</p>
                <p className="text-xs text-[#B45309]/80 font-bold tracking-tight mt-1">~1 additional unit required to reach mastery status.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION BREAKDOWN */}
      <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
          <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Sequence Audit Breakdown</h2>
        </div>
        <div className="p-8 space-y-4">
          {[
            { q: 1, title: "Even numbers 2-10 loop logic", attempt: "First-pass success", points: "100/100", time: "1m 30s", success: true },
            { q: 2, title: "Even numbers 2-20 loop logic", attempt: "Off-by-one boundary anomaly", help: "Audit required", points: "70/100", time: "4m 00s", success: false, verification: "Corrected" },
            { q: 3, title: "Odd numbers 1-15 loop logic", attempt: "First-pass success", points: "100/100", time: "1m 45s", success: true },
            { q: 4, title: "Divisible by 3 (3-30) logic", attempt: "Procedural mismatch", help: "Audit required", points: "70/100", time: "3m 30s", success: false, verification: "Corrected" },
            { q: 5, title: "Multiplication table nested sequence", attempt: "First-pass success", points: "100/100", time: "2m 15s", success: true },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between p-5 bg-black/20 rounded-2xl border border-white/5 hover:bg-black/40 transition-all group shadow-inner">
              <div className="flex gap-4">
                <div className="mt-1">
                  {item.success ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <AlertTriangle className="w-5 h-5 text-[#B45309]" />}
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-tight text-white mb-1">Vector {item.q}: {item.title}</h3>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{item.attempt}</p>
                  {!item.success && (
                    <p className="text-[10px] text-[#B45309]/60 font-black uppercase mt-1">Audit Protocol: {item.help} | Verification: {item.verification}</p>
                  )}
                </div>
              </div>
              <div className="sm:text-right mt-4 sm:mt-0 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-1">
                <span className={`font-black text-xs ${item.success ? 'text-teal-400' : 'text-[#B45309]'}`}>{item.points}</span>
                <span className="text-[9px] text-white/20 font-black uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" /> {item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* METRICS & IMPROVEMENT */}
        <div className="space-y-8">
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Efficiency Metrics</h2>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: "First-pass accuracy", value: "3 of 5 (60%)" },
                { label: "Post-audit resolution", value: "2 of 5 (40%)" },
                { label: "Hints utilized", value: "0 Protocols" },
                { label: "Mean response rate", value: "2m 36s / vector" },
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                  <span className="text-[11px] font-bold text-white/50 uppercase tracking-tight">{m.label}</span>
                  <span className="font-black text-white text-xs">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl p-8 shadow-2xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2 mb-8">
              <TrendingUp className="w-4 h-4 text-teal-400" /> Delta Progression
            </h2>
            <div className="flex items-center justify-between gap-6">
              <div className="text-center">
                <p className="text-[9px] font-black text-white/20 mb-2 uppercase tracking-[0.2em]">Previous</p>
                <p className="text-2xl font-black text-white/40">70%</p>
              </div>
              <div className="flex-1 h-[2px] bg-white/10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(13,148,136,0.8)]" />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-teal-400 mb-2 uppercase tracking-[0.2em]">Current</p>
                <p className="text-2xl font-black text-white">85%</p>
              </div>
              <div className="text-center bg-teal-500/10 p-3 rounded-2xl border border-teal-500/20 min-w-[70px] shadow-inner">
                <p className="text-[9px] font-black text-teal-400 mb-1 uppercase tracking-tighter">Gain</p>
                <p className="text-xl font-black text-teal-400">+15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK & AREAS */}
        <div className="space-y-8">
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col flex-1">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-400" /> Neural Feedback Log
              </h2>
            </div>
            <div className="p-8 flex-1">
              <div className="bg-teal-500/5 border-l-4 border-teal-500 p-6 rounded-r-2xl shadow-inner italic text-white/70 text-sm leading-relaxed font-medium">
                "Great improvement! Your off-by-one errors are mostly fixed. Next session, focus on nested loops and more complex conditions. You went from 70% to 85% - one more session and you'll reach mastery status."
              </div>
            </div>
          </div>

          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Improvement Vectors</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Nested loop architecture", type: "CRITICAL", icon: AlertTriangle, color: "text-[#B45309]", bg: "bg-[#B45309]/5" },
                { label: "Complex procedural conditions", type: "MAJOR", icon: AlertTriangle, color: "text-[#B45309]", bg: "bg-[#B45309]/5" },
                { label: "Basic loop syntax", type: "MASTERED", icon: CheckCircle2, color: "text-teal-400", bg: "bg-teal-500/5" },
                { label: "Off-by-one boundary safety", type: "OPTIMIZED", icon: CheckCircle2, color: "text-teal-400", bg: "bg-teal-500/5" },
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 group hover:bg-white/5 transition-colors shadow-inner">
                  <v.icon className={`w-5 h-5 ${v.color} shrink-0`} />
                  <div className="flex-1">
                    <span className="text-xs font-black text-white/80 uppercase tracking-tight block">{v.label}</span>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 block ${v.color} opacity-60`}>{v.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-teal-600 p-[2px] rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(13,148,136,0.3)] group mt-12">
        <div className="bg-[#0F172A] p-10 rounded-[22px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Initialize Next Evaluation</h3>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Protocol estimate: 1 session remaining until mastery</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/peer-learning/group-coding/">
                <Button className="bg-teal-600 hover:bg-teal-500 text-white font-black h-14 px-10 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest">
                  BOOK NEXT EVALUATION <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </Link>
              <Link href="/peer-learning">
                <button className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black px-10 h-14 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center">
                  RETURN TO COMMAND CENTER
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { CheckCircle2, Users, ArrowRight, Award, Trophy, Star, BookOpen, UserPlus, Sparkles, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function SessionSeriesPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-12 text-white max-w-5xl mx-auto font-sans">
      {/* HEADER */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(13,148,136,0.2)]">
          <Activity className="w-3.5 h-3.5" /> Series Conclusion Report
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Mission Series Performance</h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <span>Topic: <span className="text-white">LOOPS</span></span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Squadron: GRP_LOOPS_001</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Duration: 4 Sessions</span>
        </div>
      </div>

      {/* FINAL MASTERY STATUS */}
      <div className="bg-[#334155]/30 border border-teal-500/20 rounded-[32px] overflow-hidden relative shadow-2xl group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-teal-500/10 transition-all duration-700" />
        <div className="py-16 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-teal-500/10 border-2 border-teal-500/40 mb-8 shadow-[0_0_40px_rgba(13,148,136,0.2)] relative">
            <CheckCircle2 className="w-10 h-10 text-teal-400" />
            <div className="absolute -inset-2 border border-teal-500/20 rounded-full animate-ping opacity-20" />
          </div>
          <h2 className="text-[10px] font-black text-teal-400 tracking-[0.4em] uppercase mb-4 opacity-70">Final Subject Mastery Protocol</h2>
          <div className="text-5xl md:text-7xl font-black text-white flex items-center justify-center gap-4 tracking-tighter">
            MASTERED <span className="text-teal-400 font-black">92.3%</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* SESSION BY SESSION */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" /> Operational History
            </h2>
          </div>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-black text-white/30 uppercase bg-black/40">
                <tr>
                  <th className="px-8 py-4">Phase</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4 text-right">Mastery</th>
                </tr>
              </thead>
              <tbody className="bg-black/10">
                {[
                  { name: "Coding R1", role: "Explainer", score: "82%", status: "text-white/60" },
                  { name: "Coding R2", role: "Explainer", score: "88%", status: "text-white/80" },
                  { name: "Debugging R3", role: "Reviewer", score: "94%", status: "text-teal-400" },
                  { name: "Mini Project R4", role: "Solver", score: "95%", status: "text-teal-400 font-black" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-4 font-bold text-white/70">{row.name}</td>
                    <td className="px-8 py-4 text-xs font-black text-white/30 uppercase tracking-widest">{row.role}</td>
                    <td className={`px-8 py-4 text-right font-black ${row.status}`}>{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-teal-500/5 border-t border-teal-500/10 flex justify-between px-8">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Aggregate Sequence Mean</span>
              <span className="text-sm font-black text-teal-400">89.75%</span>
            </div>
          </CardContent>
        </div>

        {/* ROLE PERFORMANCE BREAKDOWN */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" /> Designation Audit
            </h2>
          </div>
          <CardContent className="p-8 space-y-8">
            <div className="overflow-hidden rounded-2xl border border-white/5">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-black text-white/30 uppercase bg-black/40">
                  <tr>
                    <th className="px-5 py-4">Designation</th>
                    <th className="px-5 py-4">Units</th>
                    <th className="px-5 py-4 text-right">Mean</th>
                  </tr>
                </thead>
                <tbody className="bg-black/20">
                  <tr className="border-b border-white/5">
                    <td className="px-5 py-4 font-black text-white/60 uppercase text-[10px]">Explainer</td>
                    <td className="px-5 py-4 font-bold text-white/40">2</td>
                    <td className="px-5 py-4 text-right font-black text-white">85%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-5 py-4 font-black text-white/60 uppercase text-[10px]">Reviewer</td>
                    <td className="px-5 py-4 font-bold text-white/40">1</td>
                    <td className="px-5 py-4 text-right font-black text-teal-400">94%</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-black text-white/60 uppercase text-[10px]">Solver</td>
                    <td className="px-5 py-4 font-bold text-white/40">1</td>
                    <td className="px-5 py-4 text-right font-black text-teal-400">95%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl shadow-inner">
                <p className="text-[9px] font-black text-teal-400 mb-1 uppercase tracking-widest opacity-70">Optimal Role</p>
                <p className="font-black text-white text-xs uppercase tracking-tight">Solver (95%)</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                <p className="text-[9px] font-black text-white/20 mb-1 uppercase tracking-widest">Growth Role</p>
                <p className="font-black text-white/60 text-xs uppercase tracking-tight">Explainer (85%)</p>
              </div>
            </div>
          </CardContent>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* TEAM PERFORMANCE */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" /> Squadron Aggregate
            </h2>
          </div>
          <CardContent className="p-8">
            <div className="overflow-hidden rounded-2xl border border-white/5 mb-6">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-black text-white/30 uppercase bg-black/40">
                  <tr>
                    <th className="px-5 py-4">Squadron Member</th>
                    <th className="px-5 py-4">Experience</th>
                    <th className="px-5 py-4 text-right">Mastery</th>
                  </tr>
                </thead>
                <tbody className="bg-black/20">
                  <tr className="border-b border-white/5 bg-teal-500/5">
                    <td className="px-5 py-4 font-black text-teal-400 uppercase text-[11px]">YOU</td>
                    <td className="px-5 py-4 text-[10px] font-bold text-white/40 uppercase tracking-tight">E, R, S</td>
                    <td className="px-5 py-4 text-right font-black text-teal-400">89.8%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-5 py-4 font-bold text-white/90">Alice</td>
                    <td className="px-5 py-4 text-[10px] font-bold text-white/20 uppercase tracking-tight">S, E, R</td>
                    <td className="px-5 py-4 text-right font-black text-white">88.5%</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-bold text-white/90">Bob</td>
                    <td className="px-5 py-4 text-[10px] font-bold text-white/20 uppercase tracking-tight">R, S, E</td>
                    <td className="px-5 py-4 text-right font-black text-white">87.3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-center shadow-inner">
              <span className="text-xs font-black text-teal-400 uppercase tracking-[0.2em]">Squadron Mean Aggregate: 88.5%</span>
            </div>
          </CardContent>
        </div>

        {/* TOPIC MASTERY CONFIRMATION */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-400" /> Mastery Verification
            </h2>
          </div>
          <CardContent className="p-8 space-y-4 flex-1">
            {[
              "Achieved >90% Mastery on 'Loops'",
              "Completed all 4 Operational Rounds",
              "Demonstrated Neural Link Proficiency",
              "Solutions Uploaded to Knowledge Base",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 bg-teal-500/5 p-4 rounded-2xl border border-teal-500/10 group hover:bg-teal-500/10 transition-colors shadow-inner">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-tight">{text}</span>
              </div>
            ))}
          </CardContent>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* WHAT YOU HAVE EARNED */}
        <div className="bg-[#334155]/30 border border-[#B45309]/30 rounded-3xl overflow-hidden shadow-2xl group">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
            <h2 className="text-[10px] font-black uppercase text-[#B45309] tracking-[0.2em] flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Neural Accolades Earned
            </h2>
          </div>
          <CardContent className="p-8 space-y-4">
            {[
              { label: "Mastery Certificate", sub: "Loops Specialization", icon: Award, color: "text-[#B45309]" },
              { label: "Verified Peer Designation", sub: "Priority Teaching Queue", icon: Sparkles, color: "text-teal-400" },
              { label: "Teaching Protocol", sub: "Authorized for 'Loops'", icon: UserPlus, color: "text-teal-400" },
              { label: "Archive Entry", sub: "Solutions added to Knowledge Base", icon: BookOpen, color: "text-teal-400" },
              { label: "Neural Badge: Loop Master", sub: "Level 1 Achieved", icon: Star, color: "text-[#B45309]" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/40 transition-all shadow-inner group-hover:translate-x-1 duration-300">
                <item.icon className={`w-8 h-8 ${item.color} shrink-0`} />
                <div>
                  <p className="font-black text-white text-xs uppercase tracking-widest">{item.label}</p>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </div>

        {/* NEXT STEPS */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Sequential Roadmap</h2>
          </div>
          <CardContent className="p-8 space-y-8 flex-1">
            <div className="p-5 bg-black/40 border border-[#B45309]/20 rounded-2xl shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#B45309]/5 rounded-full blur-2xl" />
               <p className="text-[9px] font-black text-[#B45309] uppercase tracking-widest mb-2">Priority Anomaly Detection</p>
               <p className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">Recursion <span className="text-[10px] font-bold text-[#B45309]/60">(Sync: 30%)</span></p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Neural Protocol Roadmap:</p>
              {[
                { step: 1, text: "Pair with Senior Instructor for Recursion", color: "bg-teal-500/20 text-teal-400" },
                { step: 2, text: "Initialize Learner Phase for Recursion", color: "bg-teal-500/20 text-teal-400" },
                { step: 3, text: "Deploy as Mentor for Loops Session", color: "bg-[#B45309]/20 text-[#B45309]" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-[10px] font-black shrink-0 shadow-inner`}>{item.step}</div>
                  <p className="text-xs text-white/70 font-bold uppercase tracking-tight mt-1.5">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/5 mt-auto">
              <Button className="w-full bg-[#B45309] hover:bg-[#B45309]/80 text-white font-black gap-3 h-14 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-[10px] uppercase tracking-widest">
                <Award className="w-4 h-4" /> REVEAL CERTIFICATE
              </Button>
              <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black h-14 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-[10px] uppercase tracking-widest">
                INITIALIZE NEXT SUBJECT
              </Button>
            </div>
          </CardContent>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-8 justify-center">
        <Link href="/peer-learning">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white/40 hover:text-white font-black px-10 h-12 rounded-2xl text-[10px] uppercase tracking-widest transition-all">
            RETURN TO COMMAND CENTER
          </Button>
        </Link>
        <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white/40 hover:text-white font-black px-10 h-12 rounded-2xl text-[10px] uppercase tracking-widest transition-all">
          ACCESS VERIFIED POOL
        </Button>
      </div>
    </div>
  );
}

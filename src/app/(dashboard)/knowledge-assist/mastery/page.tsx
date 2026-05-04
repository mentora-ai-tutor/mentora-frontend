"use client";

import {
  AlertTriangle,
  ArrowRight,
  BadgeAlert,
  Bot,
  CheckCircle2,
  CircleDot,
  Download,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

export default function KnowledgeAssistMasteryPage() {
  const priorityActions = [
    {
      title: "Nested Loops / Big O",
      severity: "URGENT",
      detail: "Identified systematic failure in determining termination conditions for nested iterations.",
      tone: "border-rose-500/40 text-rose-300",
    },
    {
      title: "Array Index Handling",
      severity: "MODERATE",
      detail: "Occasional index-out-of-bounds errors due to improper loop boundary definitions.",
      tone: "border-amber-500/40 text-amber-300",
    },
    {
      title: "Exception Syntax",
      severity: "LOW",
      detail: "Minor syntactical errors in try-with-resources blocks.",
      tone: "border-cyan-500/40 text-cyan-300",
    },
  ];

  const misconceptions = [
    {
      id: "M01",
      title: "Off-by-one errors",
      pattern: "Repeatedly using '<=' instead of '<' in array-traversal loops.",
      frequency: "14 hits",
      confidence: "98%",
    },
    {
      id: "M02",
      title: "Constructor Logic Overlap",
      pattern: "Confusing 'this()' calls with superclass field initialization.",
      frequency: "08 hits",
      confidence: "72%",
    },
    {
      id: "M03",
      title: "Shadowing Errors",
      pattern: "Re-declaring local variables with same identifier as class members.",
      frequency: "03 hits",
      confidence: "46%",
    },
  ];

  return (
    <div className="space-y-4 pb-4">
      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">
            <span className="px-2 py-1 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold">Diagnostic Report</span>
            <span className="text-white/40">Ref: RKA-9921-JVA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">Mastery Profile: Julian Rivera</h1>
          <p className="text-sm text-white/60 mt-2 max-w-3xl">
            Automated diagnostic analysis for Java SE Fundamentals. This report summarizes
            performance across core syntax, object-oriented principles, and error handling patterns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white/80 text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button type="button" className="px-3 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/20 text-cyan-200 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" /> Adaptive Sync
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4">
        <article className="rounded-2xl border border-cyan-500/25 bg-[#1e293b]/55 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-lg font-semibold">Unified Mastery Profile</h2>
            <div className="text-xs text-white/45 flex items-center gap-3">
              <span className="flex items-center gap-1"><CircleDot className="w-3 h-3 text-cyan-300" /> Current</span>
              <span className="flex items-center gap-1"><CircleDot className="w-3 h-3 text-white/30" /> Benchmark</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0A1020] p-4">
            <div className="h-[240px] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_70%)]" />
              <Radar className="w-48 h-48 text-cyan-300/70" />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              <div className="rounded-md border border-white/10 bg-[#111827] p-2">
                <p className="text-[10px] text-white/40 uppercase">Overall Proficiency</p>
                <p className="text-cyan-300 text-xl font-black mt-1">82.6%</p>
              </div>
              <div className="rounded-md border border-white/10 bg-[#111827] p-2">
                <p className="text-[10px] text-white/40 uppercase">Time To Stability</p>
                <p className="text-white text-xl font-black mt-1">14m 22s</p>
              </div>
              <div className="rounded-md border border-white/10 bg-[#111827] p-2">
                <p className="text-[10px] text-white/40 uppercase">Cognitive Load</p>
                <p className="text-amber-300 text-xl font-black mt-1">Medium</p>
              </div>
              <div className="rounded-md border border-white/10 bg-[#111827] p-2">
                <p className="text-[10px] text-white/40 uppercase">Confidence</p>
                <p className="text-emerald-300 text-xl font-black mt-1">0.96</p>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-amber-500/30 bg-[#1e293b]/55 p-4">
          <h2 className="text-white text-lg font-semibold flex items-center gap-2 mb-3">
            <BadgeAlert className="w-4 h-4 text-amber-300" /> Priority Actions
          </h2>
          <div className="space-y-2">
            {priorityActions.map((item, idx) => (
              <div key={idx} className={`rounded-lg border ${item.tone.split(" ")[0]} bg-[#0F172A] p-3`}>
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold">{item.title}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${item.tone.split(" ")[1]} bg-white/5`}>
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-white/45 mt-1">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-100 italic">
            Focus on iteration logic before moving to recursion modules.
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-semibold">Misconception Clusters</h3>
          <p className="text-xs text-white/45">Total Clusters: 03 | Severity Index: 4.2</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0F172A] text-xs uppercase text-white/40">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Misconception Title</th>
                <th className="p-3 text-left">Observed Pattern</th>
                <th className="p-3 text-left">Frequency</th>
                <th className="p-3 text-left">Confidence</th>
                <th className="p-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {misconceptions.map((item) => (
                <tr key={item.id} className="border-t border-white/5">
                  <td className="p-3 text-white/55">{item.id}</td>
                  <td className="p-3 text-white font-medium">{item.title}</td>
                  <td className="p-3 text-white/60">{item.pattern}</td>
                  <td className="p-3 text-cyan-300">{item.frequency}</td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">{item.confidence}</span></td>
                  <td className="p-3 text-white/30"><ArrowRight className="w-4 h-4" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-cyan-300" /> Adaptive Learning Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <article className="rounded-lg border border-white/10 bg-[#0F172A] p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white font-semibold">Remedial Focus</p>
              <span className="text-[10px] text-cyan-300">B1</span>
            </div>
            <p className="text-sm text-white/60">Inject 5-minute interactive sandbox module on Loop Invariants.</p>
          </article>
          <article className="rounded-lg border border-white/10 bg-[#0F172A] p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white font-semibold">Complexity Pivot</p>
              <span className="text-[10px] text-cyan-300">B2</span>
            </div>
            <p className="text-sm text-white/60">Defer inheritance diagnostics until iteration frequency errors reduce.</p>
          </article>
          <article className="rounded-lg border border-white/10 bg-[#0F172A] p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white font-semibold">Engagement Mode</p>
              <span className="text-[10px] text-cyan-300">B3</span>
            </div>
            <p className="text-sm text-white/60">Use technical/concise tone while keeping hints grounded in raw error codes.</p>
          </article>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <div className="text-xs uppercase tracking-wider text-white/45">Data Freshness <span className="text-emerald-300">Real-Time</span></div>
        <div className="flex items-center gap-2 text-cyan-300">
          <Target className="w-4 h-4" />
          <ShieldCheck className="w-4 h-4" />
          <Sparkles className="w-4 h-4" />
          <CheckCircle2 className="w-4 h-4" />
          <AlertTriangle className="w-4 h-4 text-amber-300" />
        </div>
      </section>
    </div>
  );
}


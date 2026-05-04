"use client";

import {
  Activity,
  AlertCircle,
  Binary,
  Bot,
  Brain,
  Gauge,
  GitBranch,
  ShieldCheck,
  TerminalSquare,
  Zap,
} from "lucide-react";

export default function KnowledgeAssistPage() {
  const signalFeed = [
    {
      tag: "#SANDBOX_EXEC",
      text: "User_student_742 triggered recursive loop anomaly in module 'BinarySearch'.",
      time: "14:22:01",
      tone: "text-cyan-300",
    },
    {
      tag: "#GITHUB_WEBHOOK",
      text: "Commit [f8a2c1] merged to lab-v4. Updating assessment parameters.",
      time: "14:21:45",
      tone: "text-white/70",
    },
    {
      tag: "#FORENSIC_ALERT",
      text: "Pattern match: 'Stack Overflow Copypasta' detected in student_209 submission.",
      time: "14:20:12",
      tone: "text-amber-300",
    },
    {
      tag: "#SANDBOX_EXEC",
      text: "Validation passed: student_112 successfully implemented HashMap rehash.",
      time: "14:19:55",
      tone: "text-emerald-300",
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <section className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-white">Behavioral Forensic Overview</h1>
        <p className="text-sm md:text-base text-white/60 max-w-4xl">
          Central command for real-time pedagogical diagnostics and signal processing. Review
          system-wide performance and emerging cognitive gaps.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/60 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold tracking-[0.2em] text-cyan-300 uppercase">Class Mastery</p>
            <Brain className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <p className="text-4xl font-black text-white leading-none">84.2%</p>
            <p className="text-xs text-emerald-400 mt-1 font-bold">+3.1%</p>
            <p className="text-xs text-white/40 mt-2">Aggregate across all active modules</p>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/60 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold tracking-[0.2em] text-emerald-300 uppercase">Signal Rate</p>
            <Zap className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <p className="text-4xl font-black text-white leading-none">1,429</p>
            <p className="text-xs text-white/40 mt-1">req/s live sandbox telemetry</p>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/60 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold tracking-[0.2em] text-amber-300 uppercase">Identified Gaps</p>
            <AlertCircle className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <p className="text-4xl font-black text-white leading-none">32</p>
            <p className="text-xs text-rose-300 mt-1 font-bold">+12 critical</p>
            <p className="text-xs text-white/40 mt-2">Misconceptions needing intervention</p>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)] gap-4">
        <div className="space-y-4">
          <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-bold">Engine Modules</h2>
              <span className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 font-bold uppercase">
                All Systems Nominal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#0F172A] border border-white/10 p-4">
                <div className="flex items-center gap-2 text-cyan-300 mb-3">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-bold">Adaptive Assessment</span>
                </div>
                <p className="text-xs text-white/50">Dynamic pathing based on real-time student response entropy.</p>
                <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-cyan-400" />
                </div>
                <p className="mt-2 text-[11px] text-cyan-300">78% health</p>
              </div>

              <div className="rounded-xl bg-[#0F172A] border border-white/10 p-4">
                <div className="flex items-center gap-2 text-emerald-300 mb-3">
                  <TerminalSquare className="w-4 h-4" />
                  <span className="text-sm font-bold">Live Sandbox</span>
                </div>
                <p className="text-xs text-white/50">Containerized execution environment for skill validation.</p>
                <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-emerald-400" />
                </div>
                <p className="mt-2 text-[11px] text-emerald-300">94% health</p>
              </div>

              <div className="rounded-xl bg-[#0F172A] border border-white/10 p-4">
                <div className="flex items-center gap-2 text-amber-300 mb-3">
                  <Binary className="w-4 h-4" />
                  <span className="text-sm font-bold">Behavioral Forensics</span>
                </div>
                <p className="text-xs text-white/50">Deductive engine mapping intent to syntax patterns.</p>
                <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[62%] bg-amber-400" />
                </div>
                <p className="mt-2 text-[11px] text-amber-300">62% load</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-bold">Signal Processing Heatmap</h2>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-300" />
                <Gauge className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0F172A] p-6 space-y-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 rounded bg-cyan-500/20 border border-cyan-500/30"
                  style={{ width: `${95 - index * 8}%` }}
                />
              ))}
              <p className="text-[11px] text-center pt-2 tracking-wider text-cyan-200/70 uppercase">
                Data Visualization Layer Active: Monitoring 4,208+ Nodes
              </p>
            </div>
          </article>
        </div>

        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-bold">Real-time Signal Feed</h2>
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="space-y-3 overflow-y-auto pr-1 max-h-[540px]">
            {signalFeed.map((feed, index) => (
              <div key={`${feed.tag}-${index}`} className="rounded-xl border border-white/10 bg-[#0F172A] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className={`text-[11px] font-bold tracking-wider ${feed.tone}`}>{feed.tag}</p>
                  <p className="text-[10px] text-white/40">{feed.time}</p>
                </div>
                <p className="text-xs text-white/65 leading-relaxed">{feed.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-300" />
            <p className="text-xs text-cyan-200">System heartbeat active. Latency: 42ms.</p>
          </div>
        </article>
      </section>

      <section className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <p className="text-xs text-white/50 uppercase tracking-wider">Forensic Engine v2.4.0 Stable</p>
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-sm font-semibold hover:bg-cyan-500/30 transition-colors"
        >
          + New Diagnostic
        </button>
      </section>
    </div>
  );
}

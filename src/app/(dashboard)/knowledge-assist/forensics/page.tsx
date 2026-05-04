"use client";

import {
  BarChart3,
  Binary,
  CheckCircle2,
  Clock3,
  GitBranch,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function KnowledgeAssistForensicsPage() {
  const evolutionTimeline = [
    {
      commit: "v1.0.4",
      date: "2024-02-12",
      title: "Naive Implementation",
      note: "Direct procedure-oriented logic within a single class. High coupling detected.",
    },
    {
      commit: "v1.4.8",
      date: "2024-03-28",
      title: "Initial Encapsulation",
      note: "Split logic into multiple classes. Introduced basic access modifiers.",
    },
    {
      commit: "v2.1.0 (Current)",
      date: "2024-05-18",
      title: "Polymorphic Abstraction",
      note: "Interfaces and abstract classes implemented. Pattern matching usage detected.",
    },
  ];

  const logs = [
    { hash: "8f2a9c1", event: "Refactored Interface", impact: "+12.4% Score", time: "2h ago", tone: "text-emerald-300" },
    { hash: "3d4e5f1", event: "Added JUnit Tests", impact: "+8.1% Coverage", time: "5h ago", tone: "text-cyan-300" },
    { hash: "b9a8c1d", event: "Bug Fix: NullPointer", impact: "Stability +", time: "1d ago", tone: "text-amber-300" },
    { hash: "a2f3g4h", event: "Initial Template", impact: "Baseline", time: "3d ago", tone: "text-white/50" },
  ];

  return (
    <div className="space-y-4 pb-4">
      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300 font-bold">Behavioral Forensics</p>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">Student Repository Evolution</h1>
          <p className="text-sm text-white/55 mt-2">ID: GH-2024-X91</p>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
          <p className="text-xs text-emerald-300 font-semibold uppercase">Synced</p>
          <p className="text-[11px] text-white/50 mt-1">Last fetch: 2024-05-24 14:22:01</p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-4">
        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
          <div className="h-12 w-12 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-3">
            <GitBranch className="w-5 h-5 text-cyan-300" />
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase font-semibold">
            Live Monitoring
          </span>
          <h2 className="text-xl text-white font-semibold mt-3 leading-snug">edu-repo/java-advanced-patterns</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-white/50">Total Commits</span><span className="text-cyan-300 font-semibold">342</span></div>
            <div className="flex justify-between"><span className="text-white/50">Branches Analyzed</span><span className="text-cyan-300 font-semibold">14</span></div>
            <div className="flex justify-between"><span className="text-white/50">Avg. Commit Volatility</span><span className="text-amber-300 font-semibold">24.5%</span></div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-white/50">
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-[10px] border border-[#0F172A] flex items-center justify-center text-black font-bold">M</span>
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-[10px] border border-[#0F172A] flex items-center justify-center text-black font-bold">R</span>
              <span className="w-6 h-6 rounded-full bg-white/20 text-[10px] border border-[#0F172A] flex items-center justify-center text-white font-bold">+3</span>
            </div>
            Active Collaborators
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-300" /> Longitudinal Mastery Profile</h2>
            <span className="text-xs text-white/50 border border-white/10 px-2 py-1 rounded">6 Months</span>
          </div>
          <div className="h-[235px] rounded-xl border border-white/10 bg-[#0F172A] p-4">
            <div className="h-full flex items-end gap-4">
              {[38, 66, 82, 58, 74, 92, 61].map((v, i) => (
                <div key={i} className="flex-1 bg-cyan-500/70 rounded-t-sm" style={{ height: `${v}%` }} />
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/55">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Commit Frequency</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Refactoring Spikes</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Feature Completeness</span>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><ScanSearch className="w-4 h-4 text-cyan-300" /> Evolutionary Analysis: Java Object-Oriented Design</h2>
          <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">Trajectory: Accelerated Mastering</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-4">
          <div className="space-y-2">
            {evolutionTimeline.map((item, index) => (
              <article key={index} className="rounded-lg border border-white/10 bg-[#0F172A] p-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-1">
                  <span className="text-cyan-300">{item.commit}</span>
                  <span className="text-white/40">{item.date}</span>
                </div>
                <p className="text-white font-semibold">{item.title}</p>
                <p className="text-xs text-white/45 mt-1">{item.note}</p>
              </article>
            ))}
          </div>
          <article className="rounded-lg border border-white/10 bg-[#0A1020] p-4">
            <div className="font-mono text-sm leading-6 text-emerald-300">
              <p>- public void process(String data) {"{"}</p>
              <p className="text-white/40">  // condition-heavy logic ...</p>
              <p>+ public interface DataProcessor {"{"}</p>
              <p>+   void process(Payload payload);</p>
              <p>+ {"}"}</p>
              <p>+ public class JsonProcessor implements DataProcessor {"{"}</p>
              <p>+   ...</p>
              <p>+ {"}"}</p>
              <p className="text-white/40 mt-2">// Analysis: strategic shift from conditional logic to polymorphism</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
              <div className="rounded bg-[#111827] border border-white/10 p-2">
                <p className="text-white/40">Cyclomatic Complexity</p>
                <p className="text-cyan-300 font-semibold mt-1">4 from 12</p>
              </div>
              <div className="rounded bg-[#111827] border border-white/10 p-2">
                <p className="text-white/40">Maintainability Index</p>
                <p className="text-cyan-300 font-semibold mt-1">88 High</p>
              </div>
              <div className="rounded bg-[#111827] border border-white/10 p-2">
                <p className="text-white/40">Cognitive Load</p>
                <p className="text-emerald-300 font-semibold mt-1">-64% Delta</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-300" /> Pattern Authenticity Analysis</h3>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-sm"><span className="text-white/70">Manual Typing Cadence</span><span className="text-emerald-300 font-semibold">92% Match</span></div>
              <div className="h-1.5 mt-1 rounded-full bg-white/10"><div className="h-full w-[92%] rounded-full bg-emerald-400" /></div>
              <p className="text-xs text-white/45 mt-1">Consistent hesitation patterns at complex algorithmic boundaries suggest human cognitive processing.</p>
            </div>
            <div>
              <div className="flex justify-between text-sm"><span className="text-white/70">AI-Generated Skeleton Match</span><span className="text-rose-300 font-semibold">12% Match</span></div>
              <div className="h-1.5 mt-1 rounded-full bg-white/10"><div className="h-full w-[12%] rounded-full bg-rose-400" /></div>
              <p className="text-xs text-white/45 mt-1">Low correlation with GPT-4 and Claude 3 common scaffolding templates for the 'Factory Pattern'.</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-200 italic">
            Forensic Conclusion: The repository exhibits high evolutionary authenticity. Improvements in code
            quality are incremental and correlated with student session logs.
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Clock3 className="w-4 h-4 text-cyan-300" /> Evolutionary Logs</h3>
          <div className="mt-3 rounded-lg border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0F172A] text-xs uppercase text-white/40">
                <tr>
                  <th className="p-3 text-left">Hash</th>
                  <th className="p-3 text-left">Event</th>
                  <th className="p-3 text-left">Impact</th>
                  <th className="p-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="border-t border-white/5">
                    <td className="p-3 text-white/70">{log.hash}</td>
                    <td className="p-3 text-white">{log.event}</td>
                    <td className={`p-3 font-semibold ${log.tone}`}>{log.impact}</td>
                    <td className="p-3 text-white/45">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="mt-4 text-cyan-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> View Full Commit History
          </button>
        </article>
      </section>

      <section className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4 text-cyan-300">
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Analysis Stable</div>
        <div className="flex items-center gap-2"><Binary className="w-4 h-4" /><Sparkles className="w-4 h-4" /></div>
      </section>
    </div>
  );
}


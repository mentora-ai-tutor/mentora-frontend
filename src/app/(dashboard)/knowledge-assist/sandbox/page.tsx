"use client";

import {
  Bell,
  Binary,
  Gauge,
  Monitor,
  Search,
  Settings,
  ShieldCheck,
  Terminal,
  Waypoints,
  Zap,
} from "lucide-react";

export default function KnowledgeAssistSandboxPage() {
  const logs = [
    { time: "14:02:11", level: "INFO", message: "Initializing JVM with 1024MB heap space...", tone: "text-emerald-300" },
    { time: "14:02:12", level: "INFO", message: "Main class 'SessionHandler.java' loaded successfully.", tone: "text-emerald-300" },
    { time: "14:05:33", level: "ERR", message: "Task failed on interrupted condition at SessionHandler.java:42", tone: "text-rose-300" },
    { time: "14:05:45", level: "WARN", message: "Compilation frequency exceeding normal baseline: 8 comps/min.", tone: "text-amber-300" },
    { time: "14:06:12", level: "INFO", message: "Hot-swap recompile successful. No issues detected.", tone: "text-emerald-300" },
    { time: "14:08:22", level: "INFO", message: "Thread 'worker-1' reached breakthrough state. Logic verified.", tone: "text-emerald-300" },
    { time: "14:10:01", level: "USR", message: "User input detected: 'int x = Math.sqrt(-1);'", tone: "text-cyan-300" },
    { time: "14:10:02", level: "ERR", message: "Incompatible types: double cannot be converted to int.", tone: "text-rose-300" },
  ];

  const processRows = [
    { process: "java.runtime.worker_01", cpu: "12.4%", memory: "0x4F92A", tops: "452", status: "EXECUTING", tone: "text-emerald-300" },
    { process: "java.runtime.gc_thread", cpu: "2.1%", memory: "0x12A0B", tops: "12", status: "IDLE", tone: "text-slate-300" },
    { process: "sandbox.fs.watcher", cpu: "0.4%", memory: "0x992CF", tops: "1,024", status: "LISTENING", tone: "text-cyan-300" },
    { process: "telemetry.sink.live", cpu: "8.7%", memory: "0x334E1", tops: "2,890", status: "STREAMING", tone: "text-cyan-300" },
  ];

  return (
    <div className="space-y-4 pb-4">
      <section className="space-y-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-1 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold uppercase">Live Container</span>
          <span className="text-white/60">ID: CONTAINER-ALPHA-9921</span>
        </div>
        <p className="text-white/80 text-lg">Sandbox Telemetry: Learner SID-4402</p>
        <p className="text-white/55 max-w-4xl">
          High-frequency dissection of Java runtime environment. Monitoring real-time compilation,
          cognitive patterns, and integrity scores.
        </p>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_320px] gap-4">
        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-lg font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-300" /> JAVA RUNTIME LOGS
            </h2>
            <div className="flex items-center gap-2 text-white/40">
              <Search className="w-4 h-4" />
              <Settings className="w-4 h-4" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0A1020] p-3 h-[390px] overflow-y-auto space-y-2 font-mono text-sm">
            {logs.map((log, idx) => (
              <div key={idx} className="grid grid-cols-[74px_54px_minmax(0,1fr)] gap-2 text-xs">
                <span className="text-white/35">{log.time}</span>
                <span className={`${log.tone} font-bold`}>[{log.level}]</span>
                <span className={`${log.tone}`}>{log.message}</span>
              </div>
            ))}
            <p className="text-cyan-300/70 text-xs pt-2">| Listening for telemetry streams...</p>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/45 uppercase tracking-wider">Connection Uptime</p>
              <p className="text-3xl font-black text-emerald-300">02:14:45.092</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/45 uppercase tracking-wider">Packet Drops</p>
              <p className="text-3xl font-black text-rose-300">0.00%</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0F172A] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Integrity Score</p>
                <p className="text-xs text-white/40">AI Injection Probability</p>
              </div>
              <ShieldCheck className="w-4 h-4 text-amber-300" />
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-cyan-500/25 border-t-cyan-400 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-black text-white">14.2%</p>
                  <p className="text-xs text-cyan-300 uppercase">Low Risk</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs space-y-2">
              <div className="flex justify-between text-white/50">
                <span>Keystroke Cadence Rhythmic (Human)</span>
                <span>0 / Session</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div className="h-full w-[92%] rounded-full bg-cyan-400" />
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-200">
              Authoritative confirmation: Authentic learner journey.
            </div>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="rounded-2xl border border-cyan-500/30 bg-[#1e293b]/55 p-4">
          <p className="text-xs text-white/45 uppercase tracking-wider">Compilation Frequency</p>
          <p className="mt-1 text-cyan-300 text-3xl font-black">12 total</p>
          <div className="mt-4 h-28 flex items-end gap-2">
            {[22, 54, 68, 30, 45, 36, 58, 62].map((v, i) => (
              <div key={i} className="bg-cyan-400/80 rounded-sm w-6" style={{ height: `${v}%` }} />
            ))}
          </div>
          <p className="text-xs text-white/50 mt-2">Peak: 4.2 builds/min</p>
        </article>

        <article className="rounded-2xl border border-amber-500/30 bg-[#1e293b]/55 p-4">
          <p className="text-xs text-white/45 uppercase tracking-wider">Error-Correction Latency</p>
          <p className="mt-1 text-amber-300 text-3xl font-black">0.8s avg</p>
          <div className="mt-4 h-28 relative">
            <svg viewBox="0 0 260 120" className="w-full h-full">
              <path d="M0 90 C 35 84, 60 35, 95 55 C 130 76, 160 110, 190 40 C 220 20, 240 70, 260 85" fill="none" stroke="rgba(245,158,11,0.8)" strokeWidth="4" />
              <circle cx="190" cy="40" r="5" fill="rgba(251,191,36,1)" />
            </svg>
          </div>
          <p className="text-xs text-emerald-300 mt-2">Status: Rapid Recovery</p>
        </article>

        <article className="rounded-2xl border border-emerald-500/30 bg-[#1e293b]/55 p-4">
          <p className="text-xs text-white/45 uppercase tracking-wider">Time-To-Solution</p>
          <p className="mt-1 text-emerald-300 text-3xl font-black">ETR: 12m</p>
          <div className="mt-5">
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[62%] bg-emerald-400" />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-white/45 uppercase">
              <span>Start</span>
              <span>Milestone 1</span>
              <span>End</span>
            </div>
          </div>
          <p className="text-xs text-white/55 mt-3">Current progress: 62% ahead of cohort average</p>
          <p className="text-xs text-emerald-300 mt-1">Trend: Optimal Path</p>
        </article>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-semibold">Execution Context Tracking</h3>
          <div className="flex items-center gap-3 text-[10px] uppercase">
            <span className="text-emerald-300 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />Active</span>
            <span className="text-white/40 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/30" />Idle</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/45 text-xs uppercase bg-[#0F172A]">
              <tr>
                <th className="text-left p-3">System Process</th>
                <th className="text-left p-3">CPU Load</th>
                <th className="text-left p-3">Memory Offset</th>
                <th className="text-left p-3">TOPS</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {processRows.map((row, idx) => (
                <tr key={idx} className="border-t border-white/5">
                  <td className="p-3 text-cyan-200">{row.process}</td>
                  <td className="p-3 text-white/75">{row.cpu}</td>
                  <td className="p-3 text-white/75">{row.memory}</td>
                  <td className="p-3 text-white/75">{row.tops}</td>
                  <td className={`p-3 text-xs font-semibold ${row.tone}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <div className="flex items-center gap-3 text-cyan-300">
          <Monitor className="w-4 h-4" />
          <Waypoints className="w-4 h-4" />
          <Binary className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-3 text-white/50">
          <Gauge className="w-4 h-4" />
          <Bell className="w-4 h-4" />
          <Zap className="w-4 h-4 text-cyan-300" />
        </div>
      </section>
    </div>
  );
}


"use client";

import {
  AlertTriangle,
  BarChart3,
  Bell,
  Binary,
  CheckCircle2,
  ChevronRight,
  Gauge,
  Settings2,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Target,
  Waypoints,
  Zap,
} from "lucide-react";

export default function KnowledgeAssistAssessmentPage() {
  const pipelineItems = [
    {
      trigger: "SANDBOX_FAILURE",
      stage: "GENERATING",
      title: "Failure in Loops::NestedIterator",
      desc: "Generating Loop Logic Quiz...",
      tone: "amber",
    },
    {
      trigger: "MASTERY_DECAY",
      stage: "FINALIZING",
      title: "Decay in DataStructures::BinaryTrees",
      desc: "Assembling Traversal Heuristics...",
      tone: "cyan",
    },
    {
      trigger: "SIGNAL_BEHAVIOR",
      stage: "WAITING",
      title: "High-Speed Execution on Recursion::BaseCases",
      desc: "Preparing Challenge-Level Assessment...",
      tone: "emerald",
    },
  ];

  const pendingAssessments = [
    { name: "Pointer Arithmetic", signal: "Logical Fallacy detected", icon: AlertTriangle, tone: "text-rose-300" },
    { name: "Async Flow Control", signal: "Excessive Latency", icon: Zap, tone: "text-amber-300" },
    { name: "Graph Theory Intro", signal: "Concept Transition", icon: Waypoints, tone: "text-emerald-300" },
  ];

  const toneStyles: Record<string, { border: string; text: string; bar: string }> = {
    amber: { border: "border-amber-500/40", text: "text-amber-300", bar: "bg-amber-400" },
    cyan: { border: "border-cyan-500/40", text: "text-cyan-300", bar: "bg-cyan-400" },
    emerald: { border: "border-emerald-500/40", text: "text-emerald-300", bar: "bg-emerald-400" },
  };

  return (
    <div className="space-y-4 pb-4">
      <section className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-black text-white">Assessment Pipeline</h1>
        <div className="rounded-xl border border-white/10 bg-[#1e293b]/60 p-1 flex items-center gap-1 text-xs">
          <button type="button" className="px-3 py-1.5 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold">
            Active Monitoring
          </button>
          <button type="button" className="px-3 py-1.5 rounded-md text-white/50 hover:text-white/70 transition-colors">
            Historical Logs
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-4">
        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-300" /> Current Pipeline
            </h2>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <div className="space-y-3">
            {pipelineItems.map((item, index) => {
              const style = toneStyles[item.tone];
              return (
                <div key={index} className={`rounded-xl border ${style.border} bg-[#0F172A] p-3`}>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-2">
                    <span className={`${style.text} font-bold`}>Trigger: {item.trigger}</span>
                    <span className="text-white/40">Stage: {item.stage}</span>
                  </div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-xs text-white/35 mt-1 italic">&ldquo;{item.desc}&rdquo;</p>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full w-[62%] ${style.bar}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">IRT Model: Loop Complexity</h2>
                <p className="text-sm text-white/50 mt-1">Probability of Correct Response vs. Latent Ability (theta)</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[11px]">
                <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300">Current Trace</span>
                <span className="px-2 py-1 rounded-md bg-white/5 text-white/50">Normative Group</span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-[#0F172A] p-4">
              <div className="h-[220px] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_70%)]" />
                <svg viewBox="0 0 600 220" className="w-full h-full">
                  <path d="M0 200 C 140 190, 240 160, 300 130 C 360 90, 450 40, 600 35" fill="none" stroke="rgba(34,211,238,0.9)" strokeWidth="3" />
                  <path d="M0 198 C 130 188, 230 170, 295 145 C 355 118, 455 65, 600 60" fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="2" strokeDasharray="6 6" />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3">
                <div>
                  <p className="text-[10px] uppercase text-white/40">Discrimination (a)</p>
                  <p className="text-4xl font-black text-cyan-300">1.84</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/40">Difficulty (b)</p>
                  <p className="text-4xl font-black text-amber-300">0.45</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/40">Guessing (c)</p>
                  <p className="text-4xl font-black text-emerald-300">0.05</p>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
              <h3 className="text-3xl font-bold text-white flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-amber-300" /> Pending Assessments
              </h3>
              <div className="space-y-2">
                {pendingAssessments.map((item, index) => (
                  <div key={index} className="rounded-lg border border-white/10 bg-[#0F172A] p-3 flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <item.icon className={`w-4 h-4 mt-0.5 ${item.tone}`} />
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-xs text-white/40">Signal: {item.signal}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
              <h3 className="text-3xl font-bold text-white flex items-center gap-2 mb-3">
                <Settings2 className="w-5 h-5 text-cyan-300" /> Engine Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                    <span>MAX_DIFFICULTY_CEILING</span>
                    <span className="text-cyan-300">85%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full w-[85%] rounded-full bg-cyan-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                    <span>ADAPTIVE_STEP_SIZE</span>
                    <span className="text-cyan-300">0.158</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full w-[58%] rounded-full bg-cyan-400" />
                  </div>
                </div>
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Dynamic Seed Generation</p>
                    <p className="text-xs text-white/40">Regenerate items every session</p>
                  </div>
                  <div className="w-10 h-6 rounded-full bg-cyan-500/60 p-1">
                    <div className="w-4 h-4 rounded-full bg-white ml-auto" />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="rounded-2xl border border-cyan-500/30 bg-[#1e293b]/55 p-4">
          <p className="text-[10px] uppercase text-white/40 tracking-wider">System_Diagnostic_01</p>
          <div className="mt-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            <p className="text-white font-semibold">Logic Branching Stability</p>
          </div>
          <p className="mt-2 text-4xl font-black text-cyan-300">99.2%</p>
        </article>
        <article className="rounded-2xl border border-amber-500/30 bg-[#1e293b]/55 p-4">
          <p className="text-[10px] uppercase text-white/40 tracking-wider">System_Diagnostic_02</p>
          <div className="mt-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-300" />
            <p className="text-white font-semibold">Response Pattern Variance</p>
          </div>
          <p className="mt-2 text-4xl font-black text-amber-300">+-0.42</p>
        </article>
        <article className="rounded-2xl border border-emerald-500/30 bg-[#1e293b]/55 p-4">
          <p className="text-[10px] uppercase text-white/40 tracking-wider">System_Diagnostic_03</p>
          <div className="mt-3 flex items-center gap-2">
            <Binary className="w-4 h-4 text-emerald-300" />
            <p className="text-white font-semibold">Item Bank Connectivity</p>
          </div>
          <p className="mt-2 text-4xl font-black text-emerald-300">4,812 Nodes</p>
        </article>
      </section>

      <section className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <div className="flex items-center gap-2 text-white/60">
          <Shield className="w-4 h-4 text-cyan-300" />
          <p className="text-xs uppercase tracking-wider">System Status</p>
        </div>
        <div className="flex items-center gap-2 text-cyan-300">
          <Sparkles className="w-4 h-4" />
          <BarChart3 className="w-4 h-4" />
          <Gauge className="w-4 h-4" />
        </div>
      </section>
    </div>
  );
}

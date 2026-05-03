"use client";

import { Clock, Play, Send, CheckCircle2, MessageSquare, HelpCircle, Users, Terminal, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function GroupCodingSessionPage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-black text-teal-400 uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> GROUP CODING SESSION - LOOPS
          </h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1 font-medium">
            <span>Group ID: GRP_LOOPS_001</span>
            <span>Type: <span className="text-white">CODING SESSION</span></span>
            <span>Round: 2 of 4</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#0F172A]/40 px-4 py-2 rounded-xl border border-white/5 self-center md:self-auto">
          <Clock className="w-5 h-5 text-[#B45309] animate-pulse" />
          <span className="text-xl font-bold font-mono text-[#B45309]">25:00</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL - ROLES & PROBLEM & EDITOR */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Role Assignment */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h2 className="text-[10px] font-black uppercase text-white/50 tracking-widest">Current Role Assignment</h2>
            </div>
            <div className="p-0">
              <div className="grid grid-cols-3 divide-x divide-white/5 text-center">
                <div className="p-5 bg-teal-500/10 border-b-2 border-teal-500">
                  <h3 className="font-black text-teal-400 text-xs uppercase mb-1">Explainer</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">(YOU)</p>
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-tight">Explain logic</p>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-white/60 text-xs uppercase mb-1">Solver</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">Alice</p>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tight">Write code</p>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-white/60 text-xs uppercase mb-1">Reviewer</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">Bob</p>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tight">Audit logic</p>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <Card className="bg-[#334155]/30 border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="text-sm font-black text-white/50 flex items-center gap-2 uppercase tracking-widest">
                <Code2 className="w-4 h-4 text-teal-400" /> Mission Briefing
              </h2>
            </div>
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-white mb-3 tracking-tight">FIND ALL PAIRS WITH GIVEN SUM</h3>
              <p className="text-sm text-white/70 mb-6 leading-relaxed font-medium">
                Given an array of integers and a target sum, find all unique pairs (i, j)<br />
                where <span className="text-teal-400 font-bold">i {"<"} j</span> and <span className="text-teal-400 font-bold">arr[i] + arr[j] = target</span>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 shadow-inner">
                  <h3 className="text-[10px] font-black text-white/30 mb-3 uppercase tracking-widest">Example Input/Output</h3>
                  <p className="text-[11px] font-mono text-white/60 mb-1">arr = [2, 4, 3, 5, 7, 8, 1], target = 9</p>
                  <p className="text-[11px] font-mono text-teal-400 font-bold">Output: (2,7), (4,5), (8,1)</p>
                </div>
                <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 shadow-inner">
                  <h3 className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">Architectural Starter</h3>
                  <pre className="text-[10px] font-mono text-teal-100/50 leading-relaxed tracking-tighter">
                    public class PairSum {"{\n"}
                    {"  "}public static void main(String[] args) {"{\n"}
                    {"    "}// Implementation unit\n
                    {"  }\n"}
                    {"}"}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collaborative Code Editor */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0F172A]/80 flex-wrap gap-4">
              <h2 className="font-bold text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" /> Collaborative IDE
              </h2>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="h-9 px-4 text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
                  <Play className="w-3 h-3 mr-2 text-teal-400" /> RUN CODE
                </Button>
                <Link href="/peer-learning/group-coding/performance">
                  <Button size="sm" className="h-9 px-5 text-xs bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all hover:scale-105 active:scale-95">
                    SUBMIT FINAL
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-6 flex-1 font-mono text-sm bg-[#0F172A] text-gray-400 overflow-auto leading-relaxed">
              <div className="text-teal-400 font-bold inline">public class</div> <div className="text-white inline">PairSum</div> {"{\n"}
              {"  "}<div className="text-teal-400 inline font-bold opacity-80">public static void</div> <div className="text-[#B45309] inline font-bold">main</div>(String[] args) {"{\n"}
              {"    "}<div className="text-teal-400 inline">int</div>[] arr = {"{"}2, 4, 3, 5, 7, 8, 1{"}"};\n
              {"    "}<div className="text-teal-400 inline">int</div> target = 9;\n\n
              {"    "}<div className="text-teal-400/30 italic px-2 py-0.5 rounded bg-teal-500/5 border border-teal-500/10 mb-2 inline-block">// Alice (Solver) is synchronizing code...</div>\n
              {"    "}<div className="text-teal-400 inline font-bold">for</div>(<div className="text-teal-400 inline">int</div> i = 0; i {"<"} arr.length; i++) {"{\n"}
              {"      "}<div className="text-teal-400 inline font-bold">for</div>(<div className="text-teal-400 inline">int</div> j = i + 1; j {"<"} arr.length; j++) {"{\n"}
              {"        "}<div className="text-teal-400 inline font-bold">if</div>(arr[i] + arr[j] == target) {"{\n"}
              {"          "}System.out.println(<div className="text-[#B45309] inline">"("</div> + arr[i] + <div className="text-[#B45309] inline">","</div> + arr[j] + <div className="text-[#B45309] inline">")"</div>);\n
              {"        }\n"}
              {"      }\n"}
              {"    }\n"}
              {"  }\n"}
              {"}"}
            </div>
          </div>

          {/* Output Console */}
          <Card className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 px-5">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Telemetry Output</h3>
              </div>
              <div className="p-6 font-mono text-xs space-y-2 bg-black/20">
                <p className="text-white/30 italic">{">"} Running PairSum.java unit...</p>
                <div className="pl-4 py-1 border-l border-white/5 space-y-1">
                  <p className="text-white/80">(2,7)</p>
                  <p className="text-white/80">(4,5)</p>
                  <p className="text-white/80">(8,1)</p>
                </div>
                <p className="text-white/30 italic">{">"} Execution completed successfully.</p>
                <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl flex items-center gap-3 shadow-inner">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px]">All automated test cases passed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - CHAT & HINTS */}
        <div className="space-y-6 flex flex-col">
          {/* Live Chat */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col min-h-[500px] overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 flex flex-col gap-3">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> Neural Link: Chat
              </h2>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[10px] font-black text-teal-400 uppercase tracking-tight">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
                  </span> YOU
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span> Alice
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span> Bob
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-auto space-y-6 bg-black/10">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block">Alice (Solver):</span>
                <p className="text-sm text-white/80 leading-relaxed font-medium">I'll write the outer loop from i=0 to length-1.</p>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Bob (Reviewer):</span>
                <p className="text-sm text-white/60 leading-relaxed font-medium">Don't forget to start j from i+1 to avoid duplicates.</p>
              </div>
              <div className="space-y-1.5 bg-teal-500/5 p-3 rounded-xl border border-teal-500/10">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block">You (Explainer):</span>
                <p className="text-sm text-teal-100/90 leading-relaxed font-bold italic">"The core logic should check if arr[i] + arr[j] exactly matches the target."</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-[#0F172A]/80 shadow-2xl">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/50 transition-all"
                />
                <Button size="icon" className="bg-teal-600 hover:bg-teal-500 text-white shrink-0 rounded-xl border-none shadow-lg h-10 w-10 transition-all hover:scale-105 active:scale-95">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Role Hints & Task Progress */}
          <div className="space-y-6">
            <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
              <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#B45309]" /> Operational Guidance
                </h2>
              </div>
              <div className="p-4 space-y-3">
                <Button variant="outline" className="w-full justify-start text-left text-sm bg-[#B45309]/10 border-[#B45309]/30 text-[#B45309] hover:bg-[#B45309]/20 h-auto py-4 px-5 rounded-2xl transition-all shadow-inner border">
                  <div className="leading-snug">
                    <span className="font-black block mb-1 text-[10px] uppercase tracking-widest opacity-70">[Hint Level 1]</span>
                    Break down the problem: Pick an element, check others, and compare the sum.
                  </div>
                </Button>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/5 text-white/20 hover:text-white h-auto py-3 px-5 rounded-xl transition-all cursor-not-allowed">
                    Unlock Level 2: Target Complexity
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/5 text-white/20 hover:text-white h-auto py-3 px-5 rounded-xl transition-all cursor-not-allowed">
                    Unlock Level 3: Implementation
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6 hover:bg-[#334155]/40 transition-colors shadow-xl">
              <h2 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Task Evolution</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 opacity-40">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span className="line-through text-xs font-bold tracking-tight">Phase 1: Conceptual Sync</span>
                </div>
                <div className="flex items-center gap-3 bg-teal-500/10 p-3 rounded-xl border border-teal-500/20 shadow-inner">
                  <div className="w-4 h-4 rounded-full border-2 border-teal-400 border-t-transparent animate-spin"></div>
                  <span className="font-black text-teal-400 text-xs uppercase tracking-tighter">Phase 2: Logic Articulation</span>
                </div>
                <div className="flex items-center gap-3 px-3">
                  <div className="w-4 h-4 border-2 border-white/10 rounded"></div>
                  <span className="text-white/30 text-xs font-bold tracking-tight uppercase">Phase 3: Final Verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

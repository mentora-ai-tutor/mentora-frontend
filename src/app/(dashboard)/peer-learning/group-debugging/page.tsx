"use client";

import { Clock, Play, Send, CheckCircle2, MessageSquare, HelpCircle, Bug, ShieldAlert, Sparkles, Terminal, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

export default function GroupDebuggingSessionPage() {
  const [showBugReport, setShowBugReport] = useState(false);

  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-black text-[#B45309] uppercase tracking-tight flex items-center gap-2">
            <Bug className="w-5 h-5 animate-pulse" /> Group Debugging - Neural Audit
          </h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1 font-medium">
            <span>Group ID: GRP_LOOPS_001</span>
            <span>Type: <span className="text-white">DEBUGGING SESSION</span></span>
            <span>Round 3 of 4</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#0F172A]/40 px-4 py-2 rounded-xl border border-white/5 self-center md:self-auto">
          <Clock className="w-5 h-5 text-[#B45309]" />
          <span className="text-xl font-bold font-mono text-[#B45309]">20:00</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL - ROLES & BUGS & EDITOR */}
        <div className="lg:col-span-2 space-y-6 flex flex-col relative">
          
          {/* Overlay for Bug Report Form */}
          {showBugReport && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-md rounded-2xl animate-in fade-in zoom-in duration-300">
              <div className="w-full max-w-md bg-brand-tertiary border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(180,83,9,0.2)] overflow-hidden">
                <div className="border-b border-white/5 p-5 bg-[#0F172A]/80 flex items-center justify-between">
                  <h2 className="text-lg font-black flex items-center gap-2 text-[#B45309] uppercase tracking-tighter">
                    <ShieldAlert className="w-5 h-5" /> Submit Neural Audit
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Bug Coordinate (Line):</label>
                    <input type="text" placeholder="e.g. 14" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#B45309]/50 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Diagnostic Description:</label>
                    <textarea rows={2} placeholder="Explain the anomaly..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:border-[#B45309]/50 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Suggested Fix Matrix:</label>
                    <textarea rows={2} placeholder="Code to resolve bug..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:border-[#B45309]/50 focus:outline-none transition-all" />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button onClick={() => setShowBugReport(false)} className="flex-1 bg-[#B45309] hover:bg-[#B45309]/80 text-white font-black rounded-xl h-12 shadow-lg transition-all active:scale-95">
                      CONFIRM REPORT
                    </Button>
                    <Button onClick={() => setShowBugReport(false)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5 rounded-xl h-12 text-white font-bold">
                      CANCEL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role Assignment */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h2 className="text-[10px] font-black uppercase text-white/50 tracking-widest">Neural Designation Matrix</h2>
            </div>
            <div className="p-0">
              <div className="grid grid-cols-3 divide-x divide-white/5 text-center">
                <div className="p-5 bg-[#B45309]/10 border-b-2 border-[#B45309]">
                  <h3 className="font-black text-[#B45309] text-xs uppercase mb-1">Reviewer</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">(YOU)</p>
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-tight">Detect bugs</p>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-white/60 text-xs uppercase mb-1">Explainer</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">Alice</p>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tight">Contextualize</p>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-white/60 text-xs uppercase mb-1">Solver</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">Bob</p>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tight">Deploy fix</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bug Tracker */}
          <div className="bg-[#B45309]/5 border border-[#B45309]/20 rounded-2xl overflow-hidden hover:bg-[#B45309]/10 transition-all shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-black text-lg mb-1 flex items-center gap-2 text-[#B45309] tracking-tight">
                    <ShieldAlert className="w-5 h-5" /> ANOMALY TRACKER
                  </h2>
                  <p className="text-sm text-white/50 font-medium italic">"Audit the codebase for structural vulnerabilities"</p>
                </div>
                <div className="bg-[#B45309]/10 text-[#B45309] px-4 py-1.5 rounded-full text-xs font-black border border-[#B45309]/20 shadow-inner tracking-widest">
                  ALERTS: 0 OF 4 FOUND
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[1, 2, 3, 4].map((id) => (
                  <div key={id} className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5 group hover:bg-black/40 transition-all">
                    <div className="w-5 h-5 border-2 border-white/10 rounded flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-white/5 rounded-sm" />
                    </div>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-tight">Bug #{id}: <span className="text-white/20 italic font-normal ml-1">Searching...</span></span>
                  </div>
                ))}
              </div>

              <Button onClick={() => setShowBugReport(true)} className="bg-[#B45309] hover:bg-[#B45309]/80 text-white font-black gap-3 rounded-xl shadow-[0_0_20px_rgba(180,83,9,0.2)] border-none px-6 h-12 transition-all hover:scale-105 active:scale-95">
                <Bug className="w-4 h-4" /> INITIATE AUDIT REPORT
              </Button>
            </div>
          </div>

          {/* Collaborative Code Editor */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0F172A]/80 flex-wrap gap-4">
              <h2 className="font-bold text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" /> Buggy Source Code
              </h2>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="h-9 px-4 text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
                  <Play className="w-3 h-3 mr-2 text-teal-400" /> RUN FIXED CODE
                </Button>
                <Link href="/peer-learning/group-debugging/performance">
                  <Button size="sm" className="h-9 px-5 text-xs bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all">
                    SUBMIT ALL FIXES
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-6 flex-1 font-mono text-sm bg-[#0F172A] text-gray-400 overflow-auto leading-relaxed relative">
              <div className="text-teal-400 font-bold inline">public class</div> <div className="text-white inline">BuggyArraySum</div> {"{\n"}
              {"  "}<div className="text-teal-400 inline opacity-80">public static void</div> <div className="text-[#B45309] inline font-bold">main</div>(String[] args) {"{\n"}
              {"    "}<div className="text-teal-400 inline">int</div>[] numbers = {"{"}1, 2, 3, 4, 5{"}"};\n
              {"    "}<div className="text-teal-400 inline">int</div> sum = 0;\n\n
              {"    "}<div className="text-[#B45309]/30 italic px-2 py-0.5 rounded bg-[#B45309]/5 border border-[#B45309]/10 mb-2 inline-block">// Bob (Solver) is deploying fixes...</div>\n
              {"    "}<div className="text-white/20 italic">// BUG 1: Off-by-one boundary anomaly</div>\n
              <div className="bg-[#B45309]/5 -mx-4 px-4 py-1 border-l-4 border-[#B45309]">
                {"    "}<div className="text-teal-400 inline font-bold">for</div>(<div className="text-teal-400 inline">int</div> i = 0; i {"<="} numbers.length; i++) {"{\n"}
              </div>
              <div className="bg-[#B45309]/5 -mx-4 px-4 py-1 border-l-4 border-[#B45309]">
                {"      "}<div className="text-white/20 italic">// BUG 2: Target index variance</div>\n
                {"      "}sum = sum + numbers[0];\n
              </div>
              {"    }\n\n"}
              <div className="bg-[#B45309]/5 -mx-4 px-4 py-1 border-l-4 border-[#B45309]">
                {"    "}<div className="text-white/20 italic">// BUG 3: Syntax termination error</div>\n
                {"    "}System.out.println(<div className="text-[#B45309] inline">"Sum is: "</div> + sum)\n
              </div>\n
              <div className="bg-[#B45309]/5 -mx-4 px-4 py-1 border-l-4 border-[#B45309]">
                {"    "}<div className="text-white/20 italic">// BUG 4: Procedural logic mismatch</div>\n
                {"    "}<div className="text-teal-400 inline">int</div> average = sum;\n
                {"    "}System.out.println(<div className="text-[#B45309] inline">"Average is: "</div> + average);\n
              </div>
              {"  }\n"}
              {"}"}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - CHAT & HINTS */}
        <div className="space-y-6 flex flex-col">
          {/* Output Console */}
          <Card className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 px-5">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Telemetry Output</h3>
              </div>
              <div className="p-5 font-mono text-xs space-y-2 bg-black/20 min-h-[150px]">
                <p className="text-white/30 italic">{">"} Initializing BuggyArraySum diagnostic...</p>
                <div className="py-2 space-y-1">
                  <p className="text-white/80 font-bold">Sum is: 15</p>
                  <p className="text-white/80 font-bold">Average is: 3</p>
                </div>
                <p className="text-white/30 italic">{">"} Audit sequence completed.</p>
                <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl flex items-center gap-3 shadow-inner">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px]">Fixes verified successfully</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col min-h-[400px] overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 flex flex-col gap-3">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> Neural Link: Communication
              </h2>
              <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
                  </span> YOU
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">Alice</div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">Bob</div>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-auto space-y-6 bg-black/10">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block">You (Reviewer):</span>
                <p className="text-sm text-white/80 font-medium">I found Bug #1 - off-by-one at line 6. Condition should be i {"<"} length.</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Alice (Explainer):</span>
                <p className="text-sm text-white/60 font-medium">Bug #3 is definitely the missing semicolon at line 11.</p>
              </div>
              <div className="space-y-1 bg-teal-500/5 p-3 rounded-xl border border-teal-500/10">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block">Bob (Solver):</span>
                <p className="text-sm text-teal-100/90 italic font-bold">"Deploying fixes for all identified structural anomalies now."</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-[#0F172A]/80 shadow-2xl">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Transmit audit data..." 
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/50 transition-all font-medium"
                />
                <Button size="icon" className="bg-teal-600 hover:bg-teal-500 text-white shrink-0 rounded-xl shadow-lg h-10 w-10">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Role Hints */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 px-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#B45309]" /> Operational Support
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <Button variant="outline" className="w-full justify-start text-left text-sm bg-[#B45309]/10 border-[#B45309]/30 text-[#B45309] hover:bg-[#B45309]/20 h-auto py-4 px-5 rounded-2xl transition-all shadow-inner border">
                <div className="leading-snug">
                  <span className="font-black block mb-1 text-[10px] uppercase tracking-widest opacity-70">[Hint Level 1]</span>
                  Focus on boundary conditions. Array indices often cause structural overflows.
                </div>
              </Button>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/5 text-white/20 hover:text-white h-auto py-3 px-5 rounded-xl transition-all cursor-not-allowed">
                  Unlock Level 2: Array Index Audit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

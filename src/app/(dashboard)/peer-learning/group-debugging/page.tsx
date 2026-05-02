"use client";

import { Clock, Play, Send, CheckCircle2, MessageSquare, HelpCircle, Bug, ShieldAlert, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function GroupDebuggingSessionPage() {
  const [showBugReport, setShowBugReport] = useState(false);

  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-black text-red-400">GROUP DEBUGGING SESSION - LOOPS</h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1">
            <span>Group ID: GRP_LOOPS_001</span>
            <span>Session Type: DEBUGGING SESSION</span>
            <span>Round: 3 of 4</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#B45309]" />
          <span className="text-xl font-bold font-mono">20:00</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL - ROLES & BUGS & EDITOR */}
        <div className="lg:col-span-2 space-y-6 flex flex-col relative">
          
          {/* Overlay for Bug Report Form */}
          {showBugReport && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-md rounded-2xl">
              <div className="w-full max-w-md bg-[#1e293b]/90 border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-hidden">
                <div className="border-b border-white/5 p-4 bg-[#0F172A]/80">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-red-400">
                    <Bug className="w-5 h-5" /> REPORT A BUG
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Bug Location (Line number):</label>
                    <input type="text" className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-red-500/50 focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Bug Description:</label>
                    <textarea rows={2} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:border-red-500/50 focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Suggested Fix:</label>
                    <textarea rows={2} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:border-red-500/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider block">Severity:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="sev" className="accent-red-500" /> Minor</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="sev" className="accent-red-500" /> Major</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="sev" className="accent-red-500" defaultChecked /> Critical</label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-white/5 mt-4">
                    <Button onClick={() => setShowBugReport(false)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl border-none shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                      SUBMIT BUG REPORT
                    </Button>
                    <Button onClick={() => setShowBugReport(false)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5 rounded-xl">
                      CANCEL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role Assignment */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="text-sm font-bold uppercase text-white/50 tracking-wider">CURRENT ROLE ASSIGNMENT</h2>
            </div>
            <div className="p-0">
              <div className="grid grid-cols-3 divide-x divide-white/5 text-center">
                <div className="p-4 bg-green-900/20 border-b-2 border-green-500">
                  <h3 className="font-bold text-green-400 mb-1">REVIEWER</h3>
                  <p className="text-xs font-bold text-white mb-2">(YOU)</p>
                  <p className="text-xs text-white/70">Find the bugs</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-purple-400 mb-1">EXPLAINER</h3>
                  <p className="text-xs font-bold text-white mb-2">Alice</p>
                  <p className="text-xs text-white/70">Explain bugs</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-teal-400 mb-1">SOLVER</h3>
                  <p className="text-xs font-bold text-white mb-2">Bob</p>
                  <p className="text-xs text-white/70">Write fixes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bug Tracker & Problem Statement */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden hover:bg-red-500/10 transition-colors">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold text-lg mb-1 flex items-center gap-2 text-red-400">
                    <Bug className="w-5 h-5" /> BUG TRACKER
                  </h2>
                  <p className="text-sm text-white/70">You need to find and mark bugs</p>
                </div>
                <div className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm font-bold border border-red-500/30">
                  Bugs Found: 0 of 4
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 bg-[#0F172A]/50 p-3 rounded-xl border border-white/5">
                  <div className="w-4 h-4 border-2 border-white/20 rounded shrink-0"></div>
                  <span className="text-sm font-medium">Bug #1: <span className="text-white/50 font-normal ml-1">NOT FOUND YET - Location suspected: Line 6</span></span>
                </div>
                <div className="flex items-center gap-3 bg-[#0F172A]/50 p-3 rounded-xl border border-white/5">
                  <div className="w-4 h-4 border-2 border-white/20 rounded shrink-0"></div>
                  <span className="text-sm font-medium">Bug #2: <span className="text-white/50 font-normal ml-1">NOT FOUND YET - Location suspected: Line 8</span></span>
                </div>
                <div className="flex items-center gap-3 bg-[#0F172A]/50 p-3 rounded-xl border border-white/5">
                  <div className="w-4 h-4 border-2 border-white/20 rounded shrink-0"></div>
                  <span className="text-sm font-medium">Bug #3: <span className="text-white/50 font-normal ml-1">NOT FOUND YET - Location suspected: Line 11</span></span>
                </div>
                <div className="flex items-center gap-3 bg-[#0F172A]/50 p-3 rounded-xl border border-white/5">
                  <div className="w-4 h-4 border-2 border-white/20 rounded shrink-0"></div>
                  <span className="text-sm font-medium">Bug #4: <span className="text-white/50 font-normal ml-1">NOT FOUND YET - Location suspected: Line 14</span></span>
                </div>
              </div>

              <Button onClick={() => setShowBugReport(true)} className="bg-red-600 hover:bg-red-500 text-white font-bold gap-2 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)] border-none">
                <ShieldAlert className="w-4 h-4" /> REPORT A BUG
              </Button>
            </div>
          </div>

          {/* Collaborative Code Editor */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="font-bold text-sm flex items-center gap-2">
                BUGGY CODE - FIND ALL BUGS
              </h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10">
                  <Play className="w-3 h-3 mr-1" /> RUN FIXED CODE
                </Button>
                <Link href="/peer-learning/group-debugging/performance">
                  <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-500 text-white border-none shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                    SUBMIT ALL FIXES
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 flex-1 font-mono text-sm bg-[#0F172A] text-gray-300 overflow-auto">
              <div className="text-teal-400">public class</div> <div className="text-green-300 inline">BuggyArraySum</div> {"{\n"}
              {"  "}<div className="text-teal-400 inline">public static void</div> <div className="text-amber-200 inline">main</div>(String[] args) {"{\n"}
              {"    "}<div className="text-teal-400 inline">int</div>[] numbers = {"{"}1, 2, 3, 4, 5{"}"};\n
              {"    "}<div className="text-teal-400 inline">int</div> sum = 0;\n\n
              {"    "}<div className="text-white/30 italic bg-teal-500/10 px-1 rounded">// Bob (Solver) is writing fixes...</div>\n
              {"    "}<div className="text-white/30 italic">// BUG 1: Off-by-one in loop condition</div>\n
              <div className="bg-red-500/10 -mx-4 px-4 py-0.5 border-l-2 border-red-500">
                {"    "}<div className="text-purple-400 inline">for</div>(<div className="text-teal-400 inline">int</div> i = 0; i {"<="} numbers.length; i++) {"{\n"}
              </div>
              <div className="bg-red-500/10 -mx-4 px-4 py-0.5 border-l-2 border-red-500">
                {"      "}<div className="text-white/30 italic">// BUG 2: Wrong variable used</div>\n
                {"      "}sum = sum + numbers[0];\n
              </div>
              {"    }\n\n"}
              <div className="bg-red-500/10 -mx-4 px-4 py-0.5 border-l-2 border-red-500">
                {"    "}<div className="text-white/30 italic">// BUG 3: Missing semicolon</div>\n
                {"    "}System.out.println(<div className="text-green-200 inline">"Sum is: "</div> + sum)\n
              </div>\n
              <div className="bg-red-500/10 -mx-4 px-4 py-0.5 border-l-2 border-red-500">
                {"    "}<div className="text-white/30 italic">// BUG 4: Logic error - should calculate average</div>\n
                {"    "}<div className="text-teal-400 inline">int</div> average = sum;\n
                {"    "}System.out.println(<div className="text-green-200 inline">"Average is: "</div> + average);\n
              </div>
              {"  }\n"}
              {"}"}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - CHAT & HINTS */}
        <div className="space-y-6 flex flex-col">
          {/* Output */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-0">
              <div className="p-2 border-b border-white/5 bg-[#0F172A]/80">
                <h3 className="text-xs font-bold text-white/50 uppercase ml-2 tracking-wider">OUTPUT:</h3>
              </div>
              <div className="p-4 font-mono text-xs space-y-1 bg-[#0F172A]/50">
                <p className="text-white/50">{">"} Running BuggyArraySum...</p>
                <p className="text-white/80">Sum is: 15</p>
                <p className="text-white/80">Average is: 3</p>
                <p className="text-white/50">{">"} Execution completed.</p>
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All bugs fixed! All tests passed!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col h-[400px] overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex flex-col gap-2">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400" /> LIVE CHAT
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> You (Reviewer)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Alice (Explainer)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Bob (Solver)</span>
              </div>
            </div>
            
            <div className="p-4 flex-1 overflow-auto space-y-4 text-sm max-h-[300px]">
              <div className="space-y-1">
                <span className="font-bold text-green-400">You (Reviewer):</span>
                <span className="text-white/80"> I found Bug #1 - off-by-one at line 6. Condition should be i {"<"} numbers.length</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-green-400">You (Reviewer):</span>
                <span className="text-white/80"> Bug #2 - using numbers[0] instead of numbers[i] at line 8</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-purple-400">Alice (Explainer):</span>
                <span className="text-white/80"> Bug #3 is missing semicolon at line 11</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-teal-400">Bob (Solver):</span>
                <span className="text-white/80"> I'll fix all bugs now</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-teal-400">Bob (Solver):</span>
                <span className="text-white/80"> Bug #4 - average should be sum divided by length</span>
              </div>
            </div>

            <div className="p-3 border-t border-white/5 bg-[#0F172A]/80">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                />
                <Button size="icon" className="bg-green-600 hover:bg-green-500 text-white shrink-0 rounded-xl shadow-[0_0_10px_rgba(34,197,94,0.3)] border-none">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Role Hints */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#B45309]" /> YOUR ROLE HINTS (REVIEWER)
              </h2>
            </div>
            <div className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start text-left text-sm bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 h-auto py-3 rounded-xl">
                <div className="leading-snug">
                  <span className="font-bold block mb-1">[HINT LEVEL 1]</span>
                  Check for off-by-one errors in loop conditions. Look at array bounds.
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm bg-white/5 border-white/5 text-white/60 hover:text-white h-auto py-2 rounded-xl">
                [HINT LEVEL 2] Check array indices
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm bg-white/5 border-white/5 text-white/60 hover:text-white h-auto py-2 rounded-xl">
                [HINT LEVEL 3] Specific line hint
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm bg-white/5 border-white/5 text-white/60 hover:text-white h-auto py-2 rounded-xl">
                [HINT LEVEL 4] List all bugs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

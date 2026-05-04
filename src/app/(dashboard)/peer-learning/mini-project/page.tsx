"use client";

import { Clock, Play, Send, CheckCircle2, MessageSquare, HelpCircle, Code2, Users, ListTodo, Circle, CheckSquare, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

export default function MiniProjectSessionPage() {
  const [showMarkComplete, setShowMarkComplete] = useState(false);

  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-black text-teal-400 uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> GROUP MINI PROJECT - LOOPS
          </h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1 font-medium">
            <span>Group ID: GRP_LOOPS_001</span>
            <span>Type: <span className="text-white">MINI PROJECT</span></span>
            <span>Round 4 of 4</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#0F172A]/40 px-4 py-2 rounded-xl border border-white/5 self-center md:self-auto">
          <Clock className="w-5 h-5 text-[#B45309] animate-pulse" />
          <span className="text-xl font-bold font-mono text-[#B45309]">45:00</span>
        </div>
      </div>

      {/* Mark Complete Overlay */}
      {showMarkComplete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-md rounded-2xl animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-lg bg-brand-tertiary border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(13,148,136,0.2)] overflow-hidden">
            <div className="border-b border-white/5 p-5 bg-[#0F172A]/80 flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-2 text-teal-400 uppercase tracking-tighter">
                <CheckCircle2 className="w-5 h-5" /> Deploy Feature Module
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Target Feature:</span>
                <p className="font-black text-white">Calculate Average Grade Matrix</p>
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Source Code Audit:</span>
                <div className="p-4 font-mono text-xs bg-black text-gray-400 rounded-xl border border-white/5 max-h-[150px] overflow-auto leading-relaxed shadow-inner">
                  <div className="text-teal-400 inline">public static double</div> <div className="text-[#B45309] inline">calculateAverage</div>(ArrayList{"<"}Student{">"} s) {"{\n"}
                  {"  "}<div className="text-teal-400 inline">if</div>(s.isEmpty()) <div className="text-teal-400 inline">return</div> 0;\n
                  {"  "}<div className="text-teal-400 inline">int</div> sum = 0;\n
                  {"  "}<div className="text-teal-400 inline">for</div>(Student student : s) sum += student.grade;\n
                  {"  "}<div className="text-teal-400 inline">return</div> (<div className="text-teal-400 inline">double</div>) sum / s.size();\n
                  {"}"}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Telemetry Test:</span>
                  <p className="text-teal-400 font-bold flex items-center gap-2 text-xs uppercase tracking-tight"><CheckCircle2 className="w-3.5 h-3.5" /> PASSED (VAL=81.2)</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Reviewer Status:</span>
                  <p className="text-white font-bold text-xs uppercase tracking-tight flex items-center gap-2 justify-end"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> DEPLOYABLE</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button onClick={() => setShowMarkComplete(false)} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl h-12 shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest">
                  CONFIRM DEPLOYMENT
                </Button>
                <Button onClick={() => setShowMarkComplete(false)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5 rounded-xl h-12 text-white font-bold text-xs uppercase tracking-widest">
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL - ROLES & PROJECT & EDITOR */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* Role Assignment */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h2 className="text-[10px] font-black uppercase text-white/50 tracking-widest">Neural Designation Matrix</h2>
            </div>
            <div className="p-0">
              <div className="grid grid-cols-3 divide-x divide-white/5 text-center">
                <div className="p-5 bg-teal-500/10 border-b-2 border-teal-500">
                  <h3 className="font-black text-teal-400 text-xs uppercase mb-1">Solver</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">(YOU)</p>
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-tight">Deploy core logic</p>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-white/60 text-xs uppercase mb-1">Reviewer</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">Alice</p>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tight">Telemetry Audit</p>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-white/60 text-xs uppercase mb-1">Explainer</h3>
                  <p className="text-xs font-black text-white mb-2 tracking-tighter">Bob</p>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tight">Documentation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
              <h2 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <Code2 className="w-5 h-5 text-teal-400" /> Project: Student Grade Architect
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 p-6">
              <div>
                <h3 className="text-[10px] font-black text-white/30 uppercase mb-4 tracking-widest">Protocol Requirements:</h3>
                <div className="space-y-3 text-xs font-bold text-white/80">
                  <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/5"><CheckSquare className="w-4 h-4 text-teal-400 shrink-0" /> <span className="line-through text-white/30 font-medium">Store student names and grades</span></div>
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-white/5"><Circle className="w-4 h-4 text-white/20 shrink-0" /> <span className="tracking-tight uppercase">Calculate average grade</span></div>
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-white/5"><Circle className="w-4 h-4 text-white/20 shrink-0" /> <span className="tracking-tight uppercase">Find boundary grades (Hi/Lo)</span></div>
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-white/5"><Circle className="w-4 h-4 text-white/20 shrink-0" /> <span className="tracking-tight uppercase">Display outliers (Above Mean)</span></div>
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-white/5"><Circle className="w-4 h-4 text-white/20 shrink-0" /> <span className="tracking-tight uppercase">Dynamic contributor entry</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-white/30 uppercase mb-4 tracking-widest">Optimization Modules:</h3>
                <div className="space-y-3 text-xs font-bold text-white/80">
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-white/5"><Circle className="w-4 h-4 text-[#B45309]/40 shrink-0" /> <span className="tracking-tight uppercase text-white/40">Sort students by grade</span></div>
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-white/5"><Circle className="w-4 h-4 text-[#B45309]/40 shrink-0" /> <span className="tracking-tight uppercase text-white/40">Letter Grade Classification</span></div>
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-white/5"><Circle className="w-4 h-4 text-[#B45309]/40 shrink-0" /> <span className="tracking-tight uppercase text-white/40">Persistence: Local Archive</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Collaborative Code Editor */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0F172A]/80 flex-wrap gap-4 px-6">
              <h2 className="font-bold text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" /> Collaborative IDE
              </h2>
              <div className="flex gap-3 flex-wrap">
                <Button size="sm" variant="outline" className="h-9 px-4 text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
                  <Play className="w-3 h-3 mr-2 text-teal-400" /> RUN PROJECT
                </Button>
                <Button onClick={() => setShowMarkComplete(true)} size="sm" className="h-9 px-4 text-xs bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all">
                  MARK FEATURE COMPLETE
                </Button>
                <Link href="/peer-learning/mini-project/performance">
                  <Button size="sm" className="h-9 px-4 text-xs bg-[#B45309] hover:bg-[#B45309]/80 text-white font-black rounded-xl transition-all">
                    SUBMIT FINAL
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-8 flex-1 font-mono text-sm bg-black text-gray-400 overflow-auto leading-relaxed shadow-inner">
              <div className="text-teal-400 font-bold inline">import</div> java.util.*;\n\n
              <div className="text-teal-400 inline font-bold opacity-80">class</div> <div className="text-white inline">Student</div> {"{\n"}
              {"  "}String name;\n
              {"  "}<div className="text-teal-400 inline">int</div> grade;\n\n
              {"  "}<div className="text-[#B45309] inline font-bold">Student</div>(String name, <div className="text-teal-400 inline">int</div> grade) {"{\n"}
              {"    "}<div className="text-teal-400 inline">this</div>.name = name;\n
              {"    "}<div className="text-teal-400 inline">this</div>.grade = grade;\n
              {"  }\n"}
              {"}\n\n"}
              <div className="text-teal-400 inline font-bold">public class</div> <div className="text-white inline">GradeManager</div> {"{\n"}
              {"  "}<div className="text-teal-400 inline font-bold opacity-80">public static void</div> <div className="text-[#B45309] inline font-bold">main</div>(String[] args) {"{\n"}
              {"    "}ArrayList{"<"}Student{">"} students = <div className="text-teal-400 inline">new</div> ArrayList{"<"}{">"}();\n\n
              {"    "}<div className="text-white/20 italic px-2 py-0.5 rounded bg-white/5 border border-white/10 mb-2 inline-block">// Initializing contributor matrix...</div>\n
              {"    "}students.add(<div className="text-teal-400 inline">new</div> Student(<div className="text-[#B45309] inline">"Alice"</div>, 85));\n
              {"    "}students.add(<div className="text-teal-400 inline">new</div> Student(<div className="text-[#B45309] inline">"Bob"</div>, 72));\n
              {"    "}students.add(<div className="text-teal-400 inline">new</div> Student(<div className="text-[#B45309] inline">"Carol"</div>, 93));\n\n
              {"    "}<div className="text-white/20 italic">// TODO: Calculate and display average diagnostic</div>\n
              {"    "}<div className="text-teal-400 inline">double</div> average = calculateAverage(students);\n
              {"    "}System.out.println(<div className="text-[#B45309] inline">"Average grade: "</div> + average);\n\n
              {"  }\n\n"}
              {"  "}<div className="text-teal-400 inline font-bold opacity-80">public static double</div> <div className="text-[#B45309] inline font-bold">calculateAverage</div>(ArrayList{"<"}Student{">"} students) {"{\n"}
              {"    "}<div className="text-teal-400 inline">if</div>(students.isEmpty()) <div className="text-teal-400 inline">return</div> 0;\n
              {"    "}<div className="text-teal-400 inline">int</div> sum = 0;\n
              {"    "}<div className="text-teal-400 inline">for</div>(Student s : students) {"{\n"}
              {"      "}sum = sum + s.grade;\n
              {"    }\n"}
              {"    "}<div className="text-teal-400 inline">return</div> (<div className="text-teal-400 inline">double</div>) sum / students.size();\n
              {"  }\n"}
              {"}"}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - CHAT, OUTPUT & HINTS */}
        <div className="space-y-6 flex flex-col">
          {/* Output Console */}
          <Card className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 px-5">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Telemetry Output</h3>
              </div>
              <div className="p-8 font-mono text-xs space-y-2 bg-black min-h-[120px]">
                <p className="text-white/30 italic">{">"} Initializing GradeManager runtime...</p>
                <p className="text-white/80 font-bold tracking-tight">Average grade: 81.2</p>
                <p className="text-white/30 italic">{">"} Sequence finalized.</p>
                <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl flex items-center gap-3 shadow-inner">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px]">Average Calculation Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Progress */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-all shadow-xl">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 px-5">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-teal-400" /> Operational Evolution
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 shadow-inner">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Active Protocol:</p>
                <p className="font-black text-teal-400 text-xs uppercase tracking-tight">Feature 2: Average Calculation Matrix</p>
                <p className="text-[10px] text-white/40 mt-3 font-bold uppercase">Assignee: YOU (Solver)</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/20">Project Completion</span>
                  <span className="text-teal-400">40% SYNCHRONIZED</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1.5px]">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full w-[40%] relative shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                    <div className="absolute inset-0 bg-white/10 animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col min-h-[300px] overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 flex flex-col gap-3">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> Neural Link: Communication
              </h2>
              <div className="flex flex-wrap gap-2 text-[9px] font-black uppercase tracking-tighter opacity-60">
                <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">YOU</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-white">Alice</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-white">Bob</span>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-auto space-y-6 bg-black/10">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Bob (Explainer):</span>
                <p className="text-sm text-white/60 font-medium">Feature 2 is calculateAverage. Alice will test it after deployment.</p>
              </div>
              <div className="space-y-1 bg-teal-500/5 p-3 rounded-xl border border-teal-500/10">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block">You (Solver):</span>
                <p className="text-sm text-teal-100/90 italic font-bold">"I've written the calculateAverage method. It sums all grades and divides by count."</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Alice (Reviewer):</span>
                <p className="text-sm text-white/60 font-medium font-bold italic text-teal-400">"Testing sample data... Average is 81.2 - CORRECT!"</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-[#0F172A]/80 shadow-2xl">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Transmit data..." 
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
                  Create a Student class with name/grade fields. Use ArrayList for storage logic.
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

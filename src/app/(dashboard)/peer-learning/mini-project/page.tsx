"use client";

import { Clock, Play, Send, CheckCircle2, MessageSquare, HelpCircle, Code2, Users, ListTodo, Circle, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function MiniProjectSessionPage() {
  const [showMarkComplete, setShowMarkComplete] = useState(false);

  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-black text-teal-400">GROUP MINI PROJECT - LOOPS</h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1">
            <span>Group ID: GRP_LOOPS_001</span>
            <span>Session Type: MINI PROJECT</span>
            <span>Round: 4 of 4</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#B45309]" />
          <span className="text-xl font-bold font-mono">45:00</span>
        </div>
      </div>

      {/* Mark Complete Overlay */}
      {showMarkComplete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-md rounded-2xl">
          <div className="w-full max-w-lg bg-[#1e293b]/90 border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(13,148,136,0.2)] overflow-hidden">
            <div className="border-b border-white/5 p-4 bg-[#0F172A]/80">
              <h2 className="text-lg font-bold flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-5 h-5" /> MARK FEATURE COMPLETE
              </h2>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="space-y-1">
                <span className="text-white/50 font-bold uppercase text-xs tracking-wider">Feature:</span>
                <p className="font-bold">Calculate Average Grade</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-white/50 font-bold uppercase text-xs tracking-wider">Code added:</span>
                <div className="p-4 font-mono text-xs bg-[#0F172A] text-gray-300 rounded-xl border border-white/5 max-h-[150px] overflow-auto">
                  <div className="text-teal-400 inline">public static double</div> <div className="text-amber-200 inline">calculateAverage</div>(ArrayList{"<"}Student{">"} s) {"{\n"}
                  {"  "}<div className="text-purple-400 inline">if</div>(s.isEmpty()) <div className="text-purple-400 inline">return</div> 0;\n
                  {"  "}<div className="text-teal-400 inline">int</div> sum = 0;\n
                  {"  "}<div className="text-purple-400 inline">for</div>(Student student : s) sum += student.grade;\n
                  {"  "}<div className="text-purple-400 inline">return</div> (<div className="text-teal-400 inline">double</div>) sum / s.size();\n
                  {"}"}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-white/50 font-bold uppercase text-xs tracking-wider">Test Result:</span>
                <p className="text-green-400 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Passed (Average = 81.2)</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-white/50 font-bold uppercase text-xs tracking-wider">Reviewed by:</span>
                <p className="text-white flex items-center gap-2">Alice (Reviewer) - <span className="text-green-400 font-bold">✅ Approved</span></p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5 mt-4">
                <Button onClick={() => setShowMarkComplete(false)} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl border-none shadow-[0_0_15px_rgba(13,148,136,0.3)]">
                  CONFIRM FEATURE COMPLETE
                </Button>
                <Button onClick={() => setShowMarkComplete(false)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5 rounded-xl">
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
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="text-sm font-bold uppercase text-white/50 tracking-wider">CURRENT ROLE ASSIGNMENT</h2>
            </div>
            <div className="p-0">
              <div className="grid grid-cols-3 divide-x divide-white/5 text-center">
                <div className="p-4 bg-teal-900/20 border-b-2 border-teal-500">
                  <h3 className="font-bold text-teal-400 mb-1">SOLVER</h3>
                  <p className="text-xs font-bold text-white mb-2">(YOU)</p>
                  <p className="text-xs text-white/70">Write the main code</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-green-400 mb-1">REVIEWER</h3>
                  <p className="text-xs font-bold text-white mb-2">Alice</p>
                  <p className="text-xs text-white/70">Test features, edge cases</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-purple-400 mb-1">EXPLAINER</h3>
                  <p className="text-xs font-bold text-white mb-2">Bob</p>
                  <p className="text-xs text-white/70">Document code, present</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Code2 className="w-5 h-5 text-teal-400" /> PROJECT: Student Grade Manager
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 p-5">
              <div>
                <h3 className="text-xs font-bold text-white/50 uppercase mb-3 tracking-wider">REQUIRED FEATURES:</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex gap-2"><CheckSquare className="w-4 h-4 text-teal-400 shrink-0" /> <span className="line-through text-white/50">Store student names and grades</span></div>
                  <div className="flex gap-2"><Circle className="w-4 h-4 text-white/30 shrink-0" /> <span>Calculate average grade</span></div>
                  <div className="flex gap-2"><Circle className="w-4 h-4 text-white/30 shrink-0" /> <span>Find highest and lowest grade</span></div>
                  <div className="flex gap-2"><Circle className="w-4 h-4 text-white/30 shrink-0" /> <span>Display students above average</span></div>
                  <div className="flex gap-2"><Circle className="w-4 h-4 text-white/30 shrink-0" /> <span>Allow user to add new student</span></div>
                  <div className="flex gap-2"><Circle className="w-4 h-4 text-white/30 shrink-0" /> <span>Exit program when user types 'quit'</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white/50 uppercase mb-3 tracking-wider">BONUS FEATURES:</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex gap-2"><Circle className="w-4 h-4 text-[#B45309]/80 shrink-0" /> <span>Sort students by grade</span></div>
                  <div className="flex gap-2"><Circle className="w-4 h-4 text-[#B45309]/80 shrink-0" /> <span>Calculate letter grade (A-F)</span></div>
                  <div className="flex gap-2"><Circle className="w-4 h-4 text-[#B45309]/80 shrink-0" /> <span>Save data to file</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Collaborative Code Editor */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0F172A]/80 flex-wrap gap-2">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" /> COLLABORATIVE CODE EDITOR
              </h2>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10">
                  <Play className="w-3 h-3 mr-1" /> RUN PROJECT
                </Button>
                <Button onClick={() => setShowMarkComplete(true)} size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-500 text-white border-none shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                  MARK FEATURE COMPLETE
                </Button>
                <Link href="/peer-learning/mini-project/performance">
                  <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-500 text-white border-none">
                    SUBMIT FINAL
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 flex-1 font-mono text-sm bg-[#0F172A] text-gray-300 overflow-auto">
              <div className="text-purple-400 inline">import</div> java.util.*;\n\n
              <div className="text-teal-400 inline">class</div> <div className="text-teal-200 inline">Student</div> {"{\n"}
              {"  "}String name;\n
              {"  "}<div className="text-teal-400 inline">int</div> grade;\n\n
              {"  "}<div className="text-amber-200 inline">Student</div>(String name, <div className="text-teal-400 inline">int</div> grade) {"{\n"}
              {"    "}<div className="text-teal-400 inline">this</div>.name = name;\n
              {"    "}<div className="text-teal-400 inline">this</div>.grade = grade;\n
              {"  }\n"}
              {"}\n\n"}
              <div className="text-teal-400 inline">public class</div> <div className="text-teal-200 inline">GradeManager</div> {"{\n"}
              {"  "}<div className="text-teal-400 inline">public static void</div> <div className="text-amber-200 inline">main</div>(String[] args) {"{\n"}
              {"    "}ArrayList{"<"}Student{">"} students = <div className="text-teal-400 inline">new</div> ArrayList{"<"}{">"}();\n\n
              {"    "}<div className="text-white/30 italic">// Add initial students</div>\n
              {"    "}students.add(<div className="text-teal-400 inline">new</div> Student(<div className="text-green-200 inline">"Alice"</div>, 85));\n
              {"    "}students.add(<div className="text-teal-400 inline">new</div> Student(<div className="text-green-200 inline">"Bob"</div>, 72));\n
              {"    "}students.add(<div className="text-teal-400 inline">new</div> Student(<div className="text-green-200 inline">"Carol"</div>, 93));\n\n
              {"    "}<div className="text-white/30 italic">// TODO: Calculate and display average</div>\n
              {"    "}<div className="text-teal-400 inline">double</div> average = calculateAverage(students);\n
              {"    "}System.out.println(<div className="text-green-200 inline">"Average grade: "</div> + average);\n\n
              {"  }\n\n"}
              {"  "}<div className="text-teal-400 inline">public static double</div> <div className="text-amber-200 inline">calculateAverage</div>(ArrayList{"<"}Student{">"} students) {"{\n"}
              {"    "}<div className="text-purple-400 inline">if</div>(students.isEmpty()) <div className="text-purple-400 inline">return</div> 0;\n
              {"    "}<div className="text-teal-400 inline">int</div> sum = 0;\n
              {"    "}<div className="text-purple-400 inline">for</div>(Student s : students) {"{\n"}
              {"      "}sum = sum + s.grade;\n
              {"    }\n"}
              {"    "}<div className="text-purple-400 inline">return</div> (<div className="text-teal-400 inline">double</div>) sum / students.size();\n
              {"  }\n"}
              {"}"}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - CHAT, OUTPUT & HINTS */}
        <div className="space-y-6 flex flex-col">
          {/* Output */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-0">
              <div className="p-2 border-b border-white/5 bg-[#0F172A]/80">
                <h3 className="text-xs font-bold text-white/50 uppercase ml-2 tracking-wider">OUTPUT:</h3>
              </div>
              <div className="p-4 font-mono text-xs space-y-1 bg-[#0F172A]/50">
                <p className="text-white/50">{">"} Running GradeManager...</p>
                <p className="text-white/80">Average grade: 81.2</p>
                <p className="text-white/50">{">"} Execution completed.</p>
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>calculateAverage feature working correctly!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Progress & Breakdown */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="text-sm font-bold uppercase text-white/50 flex items-center gap-2 tracking-wider">
                <ListTodo className="w-4 h-4 text-purple-400" /> TASK BREAKDOWN (Explainer guides)
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-white/50 mb-1 tracking-wider uppercase">Current Task:</p>
                <p className="font-bold text-teal-400 text-sm">Feature 2 - Calculate average grade</p>
                <p className="text-xs text-white/70 mt-2">Assigned to: You (Solver) • Status: IN PROGRESS</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Project Progress</span>
                  <span className="text-teal-400">40% (2/5 features)</span>
                </div>
                <div className="w-full h-2 bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full w-[40%] relative">
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col h-[250px] overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex flex-col gap-2">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> LIVE CHAT
              </h2>
            </div>
            
            <div className="p-4 flex-1 overflow-auto space-y-4 text-sm">
              <div className="space-y-1">
                <span className="font-bold text-purple-400">Bob (Explainer):</span>
                <span className="text-white/80"> Feature 2 is calculateAverage. Alice (Reviewer) will test it after you write the code</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-teal-400">You (Solver):</span>
                <span className="text-white/80"> I've written the calculateAverage method. It sums all grades and divides by count</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-green-400">Alice (Reviewer):</span>
                <span className="text-white/80"> Testing with sample data... Average is 81.2 - CORRECT!</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-purple-400">Bob (Explainer):</span>
                <span className="text-white/80"> Great! Now move to Feature 3 - find highest and lowest</span>
              </div>
            </div>

            <div className="p-3 border-t border-white/5 bg-[#0F172A]/80">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50"
                />
                <Button size="icon" className="bg-teal-600 hover:bg-teal-500 text-white shrink-0 rounded-xl border-none shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Role Hints */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#B45309]" /> YOUR ROLE HINTS (SOLVER)
              </h2>
            </div>
            <div className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start text-left text-sm bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 h-auto py-3 rounded-xl">
                <div className="leading-snug">
                  <span className="font-bold block mb-1">[HINT LEVEL 1]</span>
                  Start by creating a Student class with name and grade fields. Use ArrayList to store students.
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm bg-white/5 border-white/5 text-white/60 hover:text-white h-auto py-2 rounded-xl">
                [HINT LEVEL 2] Calculate Average hint
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm bg-white/5 border-white/5 text-white/60 hover:text-white h-auto py-2 rounded-xl">
                [HINT LEVEL 3] Find Min/Max hint
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Clock, Play, Send, CheckCircle2, AlertCircle, MessageSquare, Video, Mic, Share2, HelpCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PairSessionPage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-black text-teal-400">PAIR SESSION - LOOPS</h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1">
            <span>Session ID: SESS_LOOPS_001</span>
            <span className="font-bold text-white">Your Role: LEARNER</span>
            <span>Teacher: Michael T.</span>
            <span>Question: 2 of 5</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#B45309]" />
          <span className="text-xl font-bold font-mono">04:32</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL - QUESTION & EDITOR */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Question */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-5">
              <h2 className="font-bold text-lg mb-2">QUESTION:</h2>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                Write a for loop that prints all even numbers from 2 to 20 (inclusive).<br />
                The loop should start from 2 and increment by 2 each time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0F172A]/50 p-3 rounded-xl border border-white/5">
                  <h3 className="text-xs font-bold text-white/50 mb-2 uppercase tracking-wider">Expected Output:</h3>
                  <pre className="text-xs font-mono text-teal-300">2\n4\n6\n8\n10\n12\n14\n16\n18\n20</pre>
                </div>
                <div className="bg-[#0F172A]/50 p-3 rounded-xl border border-white/5">
                  <h3 className="text-xs font-bold text-white/50 mb-2 uppercase tracking-wider">Starter Code:</h3>
                  <pre className="text-xs font-mono text-teal-100">
                    public class EvenNumbers {"{\n"}
                    {"  "}public static void main(String[] args) {"{\n"}
                    {"    "}// Write your for loop here\n\n
                    {"  }\n"}
                    {"}"}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="font-bold text-sm">YOUR CODE:</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10">
                  <Play className="w-3 h-3 mr-1" /> RUN CODE
                </Button>
                <Button size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-500 text-white border-none shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                  SUBMIT ANSWER
                </Button>
                <Link href="/peer-learning/pair-session/teacher-help">
                  <Button size="sm" className="h-8 text-xs bg-[#B45309] hover:bg-[#B45309]/80 text-white border-none">
                    REQUEST HELP FROM TEACHER
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 flex-1 font-mono text-sm bg-[#0F172A] text-gray-300 overflow-auto">
              <div className="text-teal-400">public class</div> <div className="text-teal-200 inline">EvenNumbers</div> {"{\n"}
              {"  "}<div className="text-teal-400 inline">public static void</div> <div className="text-amber-200 inline">main</div>(String[] args) {"{\n"}
              {"    "}<div className="text-[#B45309] inline">for</div>(<div className="text-teal-400 inline">int</div> i = 2; i {"<"} 20; i = i + 2) {"{\n"}
              {"      "}System.out.println(i);\n
              {"    }\n"}
              {"  }\n"}
              {"}"}
            </div>
          </div>

          {/* Output Console */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-0">
              <div className="p-2 border-b border-white/5 bg-[#0F172A]/80">
                <h3 className="text-xs font-bold text-white/50 uppercase ml-2 tracking-wider">OUTPUT:</h3>
              </div>
              <div className="p-4 font-mono text-xs space-y-1 bg-[#0F172A]/50">
                <p className="text-white/50">{">"} Compiling EvenNumbers.java...</p>
                <p className="text-white/50">{">"} Running EvenNumbers...</p>
                <p className="text-white/80">2\n4\n6\n8\n10\n12\n14\n16\n18</p>
                <p className="text-white/50">{">"} Execution completed.</p>
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Output missing 20. Off-by-one error detected.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - CHAT & HINTS */}
        <div className="space-y-6 flex flex-col">
          {/* Live Chat */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col h-[500px] overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> LIVE CHAT
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span> Teacher Online
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto space-y-4">
              {/* Chat messages would go here */}
              <div className="text-center text-xs text-white/30 my-4 font-medium uppercase tracking-wider">Session started at 2:30 PM</div>
            </div>

            <div className="p-3 border-t border-white/5 bg-[#0F172A]/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50"
                />
                <Button size="icon" className="bg-teal-600 hover:bg-teal-500 text-white shrink-0 rounded-xl shadow-[0_0_10px_rgba(13,148,136,0.3)] border-none">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hints */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#B45309]" /> HINTS AVAILABLE
              </h2>
            </div>
            <div className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 rounded-xl">
                [HINT LEVEL 1] Minimal prompt
              </Button>
              <Button variant="outline" disabled className="w-full justify-start text-sm bg-white/5 border-white/5 text-white/30 rounded-xl">
                <Lock className="w-3 h-3 mr-2" /> [HINT LEVEL 2] Guided exploration
              </Button>
              <Button variant="outline" disabled className="w-full justify-start text-sm bg-white/5 border-white/5 text-white/30 rounded-xl">
                <Lock className="w-3 h-3 mr-2" /> [HINT LEVEL 3] Specific hint
              </Button>
              <Button variant="outline" disabled className="w-full justify-start text-sm bg-white/5 border-white/5 text-white/30 rounded-xl">
                <Lock className="w-3 h-3 mr-2" /> [HINT LEVEL 4] Solution
              </Button>
              <p className="text-xs text-center text-white/40 pt-2 font-medium">Current hint level available: Level 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

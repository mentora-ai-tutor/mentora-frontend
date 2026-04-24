"use client";

import { Clock, Play, Send, CheckCircle2, AlertCircle, MessageSquare, Video, Mic, Share2, HelpCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PairSessionPage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#1e293b]/50 p-4 rounded-xl border border-white/5">
        <div>
          <h1 className="text-xl font-black text-blue-400">PAIR SESSION - LOOPS</h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1">
            <span>Session ID: SESS_LOOPS_001</span>
            <span className="font-bold text-white">Your Role: LEARNER</span>
            <span>Teacher: Michael T.</span>
            <span>Question: 2 of 5</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          <span className="text-xl font-bold font-mono">04:32</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL - QUESTION & EDITOR */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Question */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardContent className="p-5">
              <h2 className="font-bold text-lg mb-2">QUESTION:</h2>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                Write a for loop that prints all even numbers from 2 to 20 (inclusive).<br/>
                The loop should start from 2 and increment by 2 each time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <h3 className="text-xs font-bold text-white/50 mb-2 uppercase">Expected Output:</h3>
                  <pre className="text-xs font-mono text-green-400">2\n4\n6\n8\n10\n12\n14\n16\n18\n20</pre>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <h3 className="text-xs font-bold text-white/50 mb-2 uppercase">Starter Code:</h3>
                  <pre className="text-xs font-mono text-blue-300">
                    public class EvenNumbers {"{\n"}
                    {"  "}public static void main(String[] args) {"{\n"}
                    {"    "}// Write your for loop here\n\n
                    {"  }\n"}
                    {"}"}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card className="bg-[#1e293b]/50 border-white/5 flex-1 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-black/20">
              <h2 className="font-bold text-sm">YOUR CODE:</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10">
                  <Play className="w-3 h-3 mr-1" /> RUN CODE
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white">
                  SUBMIT ANSWER
                </Button>
                <Link href="/peer-learning/pair-session/teacher-help">
                  <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-500 text-white">
                    REQUEST HELP FROM TEACHER
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 flex-1 font-mono text-sm bg-[#0d1117] text-gray-300 overflow-auto">
              <div className="text-blue-400">public class</div> <div className="text-green-300 inline">EvenNumbers</div> {"{\n"}
              {"  "}<div className="text-blue-400 inline">public static void</div> <div className="text-yellow-200 inline">main</div>(String[] args) {"{\n"}
              {"    "}<div className="text-purple-400 inline">for</div>(<div className="text-blue-400 inline">int</div> i = 2; i {"<"} 20; i = i + 2) {"{\n"}
              {"      "}System.out.println(i);\n
              {"    }\n"}
              {"  }\n"}
              {"}"}
            </div>
          </Card>

          {/* Output Console */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardContent className="p-0">
              <div className="p-2 border-b border-white/5 bg-black/20">
                <h3 className="text-xs font-bold text-white/50 uppercase ml-2">OUTPUT:</h3>
              </div>
              <div className="p-4 font-mono text-xs space-y-1">
                <p className="text-white/50">{">"} Compiling EvenNumbers.java...</p>
                <p className="text-white/50">{">"} Running EvenNumbers...</p>
                <p>2\n4\n6\n8\n10\n12\n14\n16\n18</p>
                <p className="text-white/50">{">"} Execution completed.</p>
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Output missing 20. Off-by-one error detected.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - CHAT & HINTS */}
        <div className="space-y-6 flex flex-col">
          {/* Live Chat */}
          <Card className="bg-[#1e293b]/50 border-white/5 flex-1 flex flex-col h-[500px]">
            <div className="p-3 border-b border-white/5 bg-black/20 flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" /> LIVE CHAT
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Teacher Online
              </div>
            </div>
            
            <div className="p-4 flex-1 overflow-auto space-y-4">
              {/* Chat messages would go here */}
              <div className="text-center text-xs text-white/30 my-4">Session started at 2:30 PM</div>
            </div>

            <div className="p-3 border-t border-white/5 bg-black/20">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                />
                <Button size="icon" className="bg-blue-600 hover:bg-blue-500 text-white shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Hints */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <div className="p-3 border-b border-white/5 bg-black/20">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-yellow-400" /> HINTS AVAILABLE
              </h2>
            </div>
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm bg-yellow-500/10 border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/20">
                [HINT LEVEL 1] Minimal prompt
              </Button>
              <Button variant="outline" disabled className="w-full justify-start text-sm bg-black/20 border-white/5 text-white/30">
                <Lock className="w-3 h-3 mr-2" /> [HINT LEVEL 2] Guided exploration
              </Button>
              <Button variant="outline" disabled className="w-full justify-start text-sm bg-black/20 border-white/5 text-white/30">
                <Lock className="w-3 h-3 mr-2" /> [HINT LEVEL 3] Specific hint
              </Button>
              <Button variant="outline" disabled className="w-full justify-start text-sm bg-black/20 border-white/5 text-white/30">
                <Lock className="w-3 h-3 mr-2" /> [HINT LEVEL 4] Solution
              </Button>
              <p className="text-xs text-center text-white/40 pt-2">Current hint level available: Level 1</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

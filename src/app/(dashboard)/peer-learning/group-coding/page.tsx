"use client";

import { Clock, Play, Send, CheckCircle2, MessageSquare, HelpCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function GroupCodingSessionPage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#1e293b]/50 p-4 rounded-xl border border-white/5">
        <div>
          <h1 className="text-xl font-black text-purple-400">GROUP CODING SESSION - LOOPS</h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1">
            <span>Group ID: GRP_LOOPS_001</span>
            <span>Session Type: CODING SESSION</span>
            <span>Round: 2 of 4</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          <span className="text-xl font-bold font-mono">25:00</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL - ROLES & PROBLEM & EDITOR */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Role Assignment */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm font-bold uppercase text-white/50">CURRENT ROLE ASSIGNMENT</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 divide-x divide-white/5 text-center">
                <div className="p-4 bg-purple-900/20 border-b-2 border-purple-500">
                  <h3 className="font-bold text-purple-400 mb-1">EXPLAINER</h3>
                  <p className="text-xs font-bold text-white mb-2">(YOU)</p>
                  <p className="text-xs text-white/70">Explain the problem</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-blue-400 mb-1">SOLVER</h3>
                  <p className="text-xs font-bold text-white mb-2">Alice</p>
                  <p className="text-xs text-white/70">Write the core code</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-green-400 mb-1">REVIEWER</h3>
                  <p className="text-xs font-bold text-white mb-2">Bob</p>
                  <p className="text-xs text-white/70">Check for bugs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem Statement */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardContent className="p-5">
              <h2 className="font-bold text-lg mb-2">PROBLEM STATEMENT:</h2>
              <h3 className="font-bold text-md text-white/90 mb-2">Find All Pairs with Given Sum</h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                Given an array of integers and a target sum, find all unique pairs (i, j)<br />
                where i {"<"} j and arr[i] + arr[j] = target.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <h3 className="text-xs font-bold text-white/50 mb-2 uppercase">Example:</h3>
                  <p className="text-xs font-mono text-gray-300">Input: arr = [2, 4, 3, 5, 7, 8, 1], target = 9</p>
                  <p className="text-xs font-mono text-green-400">Output: (2,7), (4,5), (8,1)</p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <h3 className="text-xs font-bold text-white/50 mb-2 uppercase">Starter Code:</h3>
                  <pre className="text-xs font-mono text-blue-300">
                    public class PairSum {"{\n"}
                    {"  "}public static void main(String[] args) {"{\n"}
                    {"    "}int[] arr = {"{"}2, 4, 3, 5, 7, 8, 1{"}"};\n
                    {"    "}int target = 9;\n
                    {"    "}// Write your solution here\n
                    {"  }\n"}
                    {"}"}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collaborative Code Editor */}
          <Card className="bg-[#1e293b]/50 border-white/5 flex-1 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-black/20">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" /> COLLABORATIVE CODE EDITOR
              </h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10">
                  <Play className="w-3 h-3 mr-1" /> RUN CODE
                </Button>
                <Link href="/peer-learning/group-coding/performance">
                  <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-500 text-white">
                    SUBMIT FINAL
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 flex-1 font-mono text-sm bg-[#0d1117] text-gray-300 overflow-auto">
              <div className="text-blue-400">public class</div> <div className="text-green-300 inline">PairSum</div> {"{\n"}
              {"  "}<div className="text-blue-400 inline">public static void</div> <div className="text-yellow-200 inline">main</div>(String[] args) {"{\n"}
              {"    "}<div className="text-blue-400 inline">int</div>[] arr = {"{"}2, 4, 3, 5, 7, 8, 1{"}"};\n
              {"    "}<div className="text-blue-400 inline">int</div> target = 9;\n\n
              {"    "}<div className="text-white/30 italic bg-blue-500/10 px-1 rounded">// Alice (Solver) is typing...</div>\n
              {"    "}<div className="text-purple-400 inline">for</div>(<div className="text-blue-400 inline">int</div> i = 0; i {"<"} arr.length; i++) {"{\n"}
              {"      "}<div className="text-purple-400 inline">for</div>(<div className="text-blue-400 inline">int</div> j = i + 1; j {"<"} arr.length; j++) {"{\n"}
              {"        "}<div className="text-purple-400 inline">if</div>(arr[i] + arr[j] == target) {"{\n"}
              {"          "}System.out.println(<div className="text-green-200 inline">"("</div> + arr[i] + <div className="text-green-200 inline">","</div> + arr[j] + <div className="text-green-200 inline">")"</div>);\n
              {"        }\n"}
              {"      }\n"}
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
                <p className="text-white/50">{">"} Running PairSum...</p>
                <p>(2,7)</p>
                <p>(4,5)</p>
                <p>(8,1)</p>
                <p className="text-white/50">{">"} Execution completed.</p>
                <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All test cases passed!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - CHAT & HINTS */}
        <div className="space-y-6 flex flex-col">
          {/* Live Chat */}
          <Card className="bg-[#1e293b]/50 border-white/5 flex-1 flex flex-col h-[500px]">
            <div className="p-3 border-b border-white/5 bg-black/20 flex flex-col gap-2">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" /> LIVE CHAT
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> You (Explainer)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Alice (Solver)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Bob (Reviewer)</span>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto space-y-4 text-sm">
              <div className="space-y-1">
                <span className="font-bold text-blue-400">Alice (Solver):</span>
                <span className="text-white/80"> I'll write the outer loop from i=0 to length-1</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-green-400">Bob (Reviewer):</span>
                <span className="text-white/80"> Don't forget to start j from i+1 to avoid duplicates</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-purple-400">You (Explainer):</span>
                <span className="text-white/80"> The condition should check arr[i] + arr[j] == target</span>
              </div>
            </div>

            <div className="p-3 border-t border-white/5 bg-black/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                />
                <Button size="icon" className="bg-purple-600 hover:bg-purple-500 text-white shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Role Hints & Task Progress */}
          <div className="space-y-4">
            <Card className="bg-[#1e293b]/50 border-white/5">
              <div className="p-3 border-b border-white/5 bg-black/20">
                <h2 className="font-bold text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-yellow-400" /> YOUR ROLE HINTS (EXPLAINER)
                </h2>
              </div>
              <CardContent className="p-4 space-y-2">
                <Button variant="outline" className="w-full justify-start text-left text-sm bg-yellow-500/10 border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/20 h-auto py-3">
                  <div className="leading-snug">
                    <span className="font-bold block mb-1">[HINT LEVEL 1]</span>
                    Break down the problem: 1) Outer loop picks first element, 2) Inner loop checks remaining elements, 3) Compare sum with target
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm bg-black/20 border-white/5 text-white/60 hover:text-white h-auto py-2">
                  [HINT LEVEL 2] Target complexity
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm bg-black/20 border-white/5 text-white/60 hover:text-white h-auto py-2">
                  [HINT LEVEL 3] Implementation guidance
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm bg-black/20 border-white/5 text-white/60 hover:text-white h-auto py-2">
                  [HINT LEVEL 4] Complete approach
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1e293b]/50 border-white/5">
              <CardContent className="p-4">
                <h2 className="font-bold text-sm mb-3">Task Progress:</h2>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="line-through text-white/50">Task 1: Understand the problem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin"></div>
                    <span className="font-bold text-purple-400">Task 2: Explain approach to team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 rounded"></div>
                    <span className="text-white/50">Task 3: Verify solution with team</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

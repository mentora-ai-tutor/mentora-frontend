"use client";

import { Clock, Play, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function VerificationPage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-orange-900/20 p-4 rounded-xl border border-orange-500/30">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-orange-400 shrink-0" />
          <div>
            <h1 className="text-xl font-black text-orange-400 uppercase">Verification Phase - No Teacher Help</h1>
            <p className="text-sm text-orange-200/70 mt-1">
              ⚠️ Teacher cannot help you during this phase ⚠️<br />
              This is a SIMILAR question to test if you truly understood the concept.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 h-fit">
          <Clock className="w-5 h-5 text-yellow-400" />
          <span className="text-xl font-bold font-mono">03:45</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL - QUESTION & EDITOR */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Question */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardContent className="p-5">
              <h2 className="font-bold text-lg mb-2">VERIFICATION QUESTION:</h2>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                Write a for loop that prints all odd numbers from 1 to 15 (inclusive).
              </p>
              <div className="bg-black/30 p-3 rounded-lg border border-white/5 inline-block w-full max-w-sm">
                <h3 className="text-xs font-bold text-white/50 mb-2 uppercase">Expected Output:</h3>
                <pre className="text-xs font-mono text-green-400">1\n3\n5\n7\n9\n11\n13\n15</pre>
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
                <Link href="/peer-learning/pair-session/performance">
                  <Button size="sm" className="h-8 text-xs bg-orange-600 hover:bg-orange-500 text-white">
                    SUBMIT FINAL ANSWER
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 flex-1 font-mono text-sm bg-[#0d1117] text-gray-300 overflow-auto">
              <div className="text-blue-400">public class</div> <div className="text-green-300 inline">OddNumbers</div> {"{\n"}
              {"  "}<div className="text-blue-400 inline">public static void</div> <div className="text-yellow-200 inline">main</div>(String[] args) {"{\n"}
              {"    "}<div className="text-purple-400 inline">for</div>(<div className="text-blue-400 inline">int</div> i = 1; i {"<="} 15; i = i + 2) {"{\n"}
              {"      "}System.out.println(i);\n
              {"    }\n"}
              {"  }\n"}
              {"}"}
            </div>
          </Card>

          {/* Output Console */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardContent className="p-0">
              <div className="p-2 border-b border-white/5 bg-black/20 flex justify-between items-center">
                <h3 className="text-xs font-bold text-white/50 uppercase ml-2">OUTPUT:</h3>
                <span className="text-xs text-white/40 mr-2">Attempts remaining: 2 of 3</span>
              </div>
              <div className="p-4 font-mono text-xs space-y-1">
                <p className="text-white/50">{">"} Running OddNumbers...</p>
                <p>1\n3\n5\n7\n9\n11\n13\n15</p>
                <p className="text-white/50">{">"} Execution completed.</p>
                <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All tests passed!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - CHAT DISABLED */}
        <div className="space-y-6 flex flex-col">
          {/* Live Chat */}
          <Card className="bg-[#1e293b]/50 border-white/5 flex-1 flex flex-col">
            <div className="p-3 border-b border-white/5 bg-black/20 flex items-center justify-between">
              <h2 className="font-bold text-sm text-white/50">LIVE CHAT</h2>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 rounded-lg">
                <ShieldAlert className="w-8 h-8 text-orange-500/50 mb-2" />
                <p className="text-sm font-bold text-white/50">[Teacher cannot respond - verification phase]</p>
                <p className="text-xs text-white/30 mt-2">Your messages will be saved but teacher cannot reply.</p>
              </div>
            </div>

            <div className="p-3 border-t border-white/5 bg-black/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
                />
                <Button size="icon" className="bg-orange-600/50 hover:bg-orange-500/50 text-white shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

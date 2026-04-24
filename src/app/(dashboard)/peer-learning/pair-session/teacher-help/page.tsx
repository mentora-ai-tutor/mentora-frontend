"use client";

import { Clock, Play, Send, AlertCircle, MessageSquare, HelpCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function TeacherHelpPage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#1e293b]/50 p-4 rounded-xl border border-white/5">
        <div>
          <h1 className="text-xl font-black text-purple-400">TEACHER HELP REQUESTED</h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1">
            <span>You have been stuck on this question for: <strong className="text-white">2 minutes 15 seconds</strong></span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1">
        {/* LEFT PANEL - YOUR CODE & ERROR */}
        <div className="space-y-6 flex flex-col">
          {/* Your Code */}
          <Card className="bg-[#1e293b]/50 border-white/5">
            <div className="p-3 border-b border-white/5 bg-black/20">
              <h2 className="font-bold text-sm">YOUR CURRENT CODE:</h2>
            </div>
            <div className="p-4 font-mono text-sm bg-[#0d1117] text-gray-300 overflow-auto">
              <div className="text-purple-400 inline">for</div>(<div className="text-blue-400 inline">int</div> i = 2; i {"<"} 20; i = i + 2) {"{\n"}
              {"  "}System.out.println(i);\n
              {"}"}
            </div>
          </Card>

          {/* Error Detected */}
          <Card className="bg-red-900/10 border-red-500/20">
            <CardContent className="p-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-400 mb-1">Error detected:</h3>
                <p className="text-sm text-white/80">Off-by-one error - Output stops at 18, missing 20</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-3 mt-auto pt-4">
            <Link href="/peer-learning/pair-session/verification" className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-6 h-auto">
                I UNDERSTAND - SHOW VERIFICATION QUESTION
              </Button>
            </Link>
            <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white py-4 h-auto">
              I NEED MORE EXPLANATION
            </Button>
            <Button variant="ghost" className="w-full text-white/50 hover:text-white hover:bg-white/5 py-4 h-auto">
              REQUEST DIFFERENT TEACHER
            </Button>
          </div>
        </div>

        {/* RIGHT PANEL - TEACHER'S EXPLANATION */}
        <div className="space-y-6 flex flex-col">
          <Card className="bg-gradient-to-br from-purple-900/20 to-[#0F172A] border-purple-500/20 flex-1 flex flex-col">
            <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-2 text-purple-400">
                <MessageSquare className="w-4 h-4" /> TEACHER'S EXPLANATION
              </h2>
            </div>
            
            <div className="p-5 flex-1 overflow-auto space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold shrink-0">M</div>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-white/50">Teacher Michael T. is typing...</p>
                  
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-sm leading-relaxed space-y-4 text-white/80">
                    <p>Good attempt! Your loop correctly starts at 2 and increments by 2.</p>
                    
                    <p>However, look at your condition: <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300">i {"<"} 20</code></p>
                    
                    <div>
                      <p className="mb-2 text-white">Let's trace what happens:</p>
                      <ul className="list-disc pl-5 space-y-1 text-white/70">
                        <li>When i=2, prints 2</li>
                        <li>When i=4, prints 4</li>
                        <li>When i=6, prints 6</li>
                        <li>...</li>
                        <li>When i=18, prints 18</li>
                        <li>When i=20, condition <code className="bg-white/10 px-1 py-0.5 rounded">20 {"<"} 20</code> is FALSE, so loop stops</li>
                      </ul>
                    </div>

                    <p>The question asks for numbers up to 20 INCLUSIVE.<br/>
                    To include 20, change the condition from <code className="bg-white/10 px-1 py-0.5 rounded text-red-300">i {"<"} 20</code> to <code className="bg-white/10 px-1 py-0.5 rounded text-green-300">i {"<="} 20</code></p>
                    
                    <div>
                      <p className="text-xs font-bold text-white/50 mb-2 uppercase">Correct code:</p>
                      <pre className="text-xs font-mono bg-[#0d1117] p-3 rounded-lg border border-white/5">
                        <span className="text-purple-400">for</span>(<span className="text-blue-400">int</span> i = 2; i {"<="} 20; i = i + 2) {"{\n"}
                        {"  "}System.out.println(i);\n
                        {"}"}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

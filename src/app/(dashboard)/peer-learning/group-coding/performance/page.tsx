"use client";

import { CheckCircle2, TrendingUp, Users, AlertTriangle, ArrowRight, MessageSquare, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function GroupCodingPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-purple-400 mb-2 uppercase">Group Coding Session Performance</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
          <span>Group: GRP_LOOPS_001</span>
          <span>•</span>
          <span>Session Type: CODING SESSION</span>
          <span>•</span>
          <span>Round: 2 of 4</span>
          <span>•</span>
          <span>Date: April 23, 2026</span>
          <span>•</span>
          <span>Duration: 22 minutes</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* YOUR PERFORMANCE */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-[#0F172A] border-purple-500/20">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-purple-400 tracking-wider">YOUR PERFORMANCE (Role: EXPLAINER)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-6xl font-black text-purple-400">88%</div>
              <div className="flex-1">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "88%" }}></div>
                </div>
                <p className="text-sm text-white/70">Very Good Performance</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <h3 className="font-bold text-white/50 uppercase text-xs mb-2">Points Breakdown:</h3>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Explained problem clearly</span>
                <span className="font-bold text-green-400">+25 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Broke down requirements</span>
                <span className="font-bold text-green-400">+25 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Answered team questions</span>
                <span className="font-bold text-green-400">+20 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400" /> Needed 1 hint</span>
                <span className="font-bold text-red-400">-5 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Peer rating (Solver: 92/100)</span>
                <span className="font-bold text-green-400">+11.5 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Peer rating (Reviewer: 88/100)</span>
                <span className="font-bold text-green-400">+11 points</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TEAM PERFORMANCE */}
        <div className="space-y-6">
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" /> TEAM PERFORMANCE
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-white/80">
                  <thead className="text-xs text-white/50 uppercase bg-black/20">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Role</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Peer Rating</th>
                      <th className="px-4 py-3 rounded-tr-lg">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3 font-bold text-purple-400">Explainer</td>
                      <td className="px-4 py-3 font-medium">You</td>
                      <td className="px-4 py-3 font-bold">88%</td>
                      <td className="px-4 py-3">90/100</td>
                      <td className="px-4 py-3 text-green-400">Good</td>
                    </tr>
                    <tr className="border-b border-white/5 bg-black/10">
                      <td className="px-4 py-3 font-bold text-blue-400">Solver</td>
                      <td className="px-4 py-3 font-medium">Alice</td>
                      <td className="px-4 py-3 font-bold">92%</td>
                      <td className="px-4 py-3">94/100</td>
                      <td className="px-4 py-3 text-green-400">Excellent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-green-400">Reviewer</td>
                      <td className="px-4 py-3 font-medium">Bob</td>
                      <td className="px-4 py-3 font-bold">85%</td>
                      <td className="px-4 py-3">86/100</td>
                      <td className="px-4 py-3 text-green-400">Good</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                <span className="text-sm font-bold text-blue-400">Team Average Score: 88.3%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e293b]/50 border-white/5">
             <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> PROGRESS TRACKING
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-xs text-white/50 mb-1">Round 1 (Previous)</p>
                  <p className="text-xl font-bold text-white/80">82%</p>
                </div>
                <div className="h-px bg-white/10 w-12"></div>
                <div className="text-center">
                  <p className="text-xs text-white/50 mb-1">Round 2 (Current)</p>
                  <p className="text-xl font-bold text-purple-400">88%</p>
                </div>
                <div className="h-px bg-white/10 w-12"></div>
                <div className="text-center">
                  <p className="text-xs text-white/50 mb-1">Improvement</p>
                  <p className="text-xl font-bold text-green-400">+6%</p>
                </div>
              </div>
              <p className="text-xs text-center text-white/50">Trend: <span className="text-green-400 font-bold">📈 Improving</span></p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* TASK & SOLUTION QUALITY */}
        <div className="space-y-6">
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <ListChecks className="w-4 h-4" /> TASK COMPLETION & SOLUTION
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> <span className="text-white/80">Problem understanding</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> <span className="text-white/80">Solution approach design</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> <span className="text-white/80">Code implementation</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> <span className="text-white/80">Code review</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> <span className="text-white/80">Testing</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> <span className="text-white/80">Final submission</span></div>
              </div>
              
              <div className="border-t border-white/5 pt-4 space-y-3 text-sm">
                <h3 className="font-bold text-white/50 uppercase text-xs">Solution Quality:</h3>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <div><span className="font-bold">Correctness:</span> <span className="text-white/70">Solution produces correct output for all test cases</span></div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <div><span className="font-bold">Efficiency:</span> <span className="text-white/70">O(n²) time complexity as expected</span></div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <div><span className="font-bold">Code style:</span> <span className="text-white/70">Clean and readable</span></div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <div><span className="font-bold">Edge cases:</span> <span className="text-white/70">Handles empty array, no pairs found</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PEER FEEDBACK & NEXT STEPS */}
        <div className="space-y-6">
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> PEER FEEDBACK RECEIVED
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl">
                <p className="text-xs font-bold text-blue-400 mb-2">From Alice (Solver):</p>
                <p className="text-sm italic text-white/80 leading-relaxed">
                  "Great explanation! You made the nested loop concept very clear. Helped me understand what to code."
                </p>
              </div>
              <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                <p className="text-xs font-bold text-green-400 mb-2">From Bob (Reviewer):</p>
                <p className="text-sm italic text-white/80 leading-relaxed">
                  "Good breakdown of requirements. Helped us catch the duplicate pair issue. Keep up the good work!"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/20 to-[#0F172A] border-indigo-500/30">
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-3">NEXT SESSION:</h3>
              <div className="space-y-2 text-sm text-white/80 mb-6">
                <p>Session Type: <span className="font-bold text-white">DEBUGGING SESSION</span></p>
                <p>Round: <span className="font-bold text-white">3 of 4</span></p>
                <p>Your Role: <span className="font-bold text-green-400">REVIEWER (Rotating)</span></p>
                <p>Schedule: <span className="font-bold text-white">Tomorrow at 2:00 PM</span></p>
              </div>
              <div className="flex gap-3">
                <Link href="/peer-learning/group-debugging" className="flex-1">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12">
                    CONTINUE TO NEXT ROUND <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="mt-3">
                <Link href="/peer-learning">
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white/70 h-10">
                    RETURN TO DASHBOARD
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

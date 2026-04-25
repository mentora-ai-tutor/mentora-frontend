"use client";

import { CheckCircle2, Users, ArrowRight, MessageSquare, ListChecks, Code2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function MiniProjectPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-blue-400 mb-2 uppercase">Mini Project Session Performance</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
          <span>Group: GRP_LOOPS_001</span>
          <span>•</span>
          <span>Session Type: MINI PROJECT</span>
          <span>•</span>
          <span>Round: 4 of 4</span>
          <span>•</span>
          <span>Date: April 23, 2026</span>
          <span>•</span>
          <span>Duration: 42 minutes</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* YOUR PERFORMANCE */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-[#0F172A] border-blue-500/20">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-blue-400 tracking-wider">YOUR PERFORMANCE (Role: SOLVER)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-6xl font-black text-blue-400">95%</div>
              <div className="flex-1">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "95%" }}></div>
                </div>
                <p className="text-sm text-white/70">Excellent Performance</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <h3 className="font-bold text-white/50 uppercase text-xs mb-2">Points Breakdown:</h3>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Implemented all 6 core features</span>
                <span className="font-bold text-green-400">+60 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Implemented 2 bonus features</span>
                <span className="font-bold text-green-400">+20 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Code quality and optimization</span>
                <span className="font-bold text-green-400">+15 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Helped team members</span>
                <span className="font-bold text-green-400">+10 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Peer rating (Explainer: 94/100)</span>
                <span className="font-bold text-red-400">-? points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Peer rating (Reviewer: 96/100)</span>
                <span className="font-bold text-red-400">-? points</span>
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
                    <tr className="border-b border-white/5 bg-black/10">
                      <td className="px-4 py-3 font-bold text-blue-400">Solver</td>
                      <td className="px-4 py-3 font-medium">You</td>
                      <td className="px-4 py-3 font-bold">95%</td>
                      <td className="px-4 py-3">95/100</td>
                      <td className="px-4 py-3 text-green-400">Excellent</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3 font-bold text-green-400">Reviewer</td>
                      <td className="px-4 py-3 font-medium">Alice</td>
                      <td className="px-4 py-3 font-bold">89%</td>
                      <td className="px-4 py-3">90/100</td>
                      <td className="px-4 py-3 text-green-400">Good</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-purple-400">Explainer</td>
                      <td className="px-4 py-3 font-medium">Bob</td>
                      <td className="px-4 py-3 font-bold">91%</td>
                      <td className="px-4 py-3">92/100</td>
                      <td className="px-4 py-3 text-green-400">Very Good</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                <span className="text-sm font-bold text-blue-400">Team Average Score: 91.7%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e293b]/50 border-white/5">
             <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" /> CODE QUALITY METRICS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div><span className="font-bold">Compilation:</span> <span className="text-white/70">No errors</span></div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div><span className="font-bold">Test coverage:</span> <span className="text-white/70">All features tested</span></div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div><span className="font-bold">Code readability:</span> <span className="text-white/70">Clear variable names, comments added</span></div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div><span className="font-bold">Efficiency:</span> <span className="text-white/70">O(n) for most operations</span></div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div><span className="font-bold">Edge cases handled:</span> <span className="text-white/70">Empty list, single student, duplicate grades</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* FEATURES COMPLETION & TIME */}
        <div className="space-y-6">
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-blue-400" /> FEATURES COMPLETION
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-white/80">
                  <thead className="text-xs text-white/50 uppercase bg-black/20">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Feature</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-tr-lg">Completed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3">Store student names and grades</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Done</span></td>
                      <td className="px-4 py-3 text-white/60">You (Solver)</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3">Calculate average grade</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Done</span></td>
                      <td className="px-4 py-3 text-white/60">You (Solver)</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3">Find highest and lowest grade</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Done</span></td>
                      <td className="px-4 py-3 text-white/60">You (Solver)</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3">Display students above average</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Done</span></td>
                      <td className="px-4 py-3 text-white/60">You (Solver)</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3">Allow user to add new student</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Done</span></td>
                      <td className="px-4 py-3 text-white/60">You (Solver)</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3">Exit with 'quit'</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Done</span></td>
                      <td className="px-4 py-3 text-white/60">You (Solver)</td>
                    </tr>
                    <tr className="border-b border-white/5 bg-yellow-500/5">
                      <td className="px-4 py-3 text-yellow-200">Sort students by grade (Bonus)</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Done</span></td>
                      <td className="px-4 py-3 text-white/60">You (Solver)</td>
                    </tr>
                    <tr className="bg-yellow-500/5">
                      <td className="px-4 py-3 text-yellow-200">Calculate letter grade (Bonus)</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Done</span></td>
                      <td className="px-4 py-3 text-white/60">You (Solver)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4 text-sm font-bold">
                <div className="p-2 bg-black/20 rounded flex-1 text-center">Core Features: <span className="text-green-400">6/6 (100%)</span></div>
                <div className="p-2 bg-black/20 rounded flex-1 text-center">Bonus Features: <span className="text-green-400">2/3 (67%)</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e293b]/50 border-white/5">
             <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> TIME SPENT PER FEATURE
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/80">
              <div className="flex justify-between"><span>Feature 1:</span> <span className="font-bold">5m</span></div>
              <div className="flex justify-between"><span>Feature 2:</span> <span className="font-bold">8m</span></div>
              <div className="flex justify-between"><span>Feature 3:</span> <span className="font-bold">6m</span></div>
              <div className="flex justify-between"><span>Feature 4:</span> <span className="font-bold">7m</span></div>
              <div className="flex justify-between"><span>Feature 5:</span> <span className="font-bold">10m</span></div>
              <div className="flex justify-between"><span>Feature 6:</span> <span className="font-bold">3m</span></div>
              <div className="flex justify-between col-span-2"><span>Bonus features:</span> <span className="font-bold">3m</span></div>
              <div className="col-span-2 mt-2 pt-2 border-t border-white/5 flex justify-between font-bold text-blue-400">
                <span>Total coding time:</span> <span>42 minutes</span>
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
              <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                <p className="text-xs font-bold text-green-400 mb-2">From Alice (Reviewer):</p>
                <p className="text-sm italic text-white/80 leading-relaxed">
                  "Your code was clean and well-structured. All edge cases handled correctly. The bonus features were a nice touch!"
                </p>
              </div>
              <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl">
                <p className="text-xs font-bold text-purple-400 mb-2">From Bob (Explainer):</p>
                <p className="text-sm italic text-white/80 leading-relaxed">
                  "Great collaboration! You implemented exactly what we designed. Code was easy to understand and modify. Excellent work!"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/20 to-[#0F172A] border-indigo-500/30">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-xl text-white mb-2">Session Series Complete!</h3>
              <p className="text-sm text-white/70 mb-6">You have finished all 4 rounds of the group learning session.</p>
              
              <Link href="/peer-learning/session-series-performance" className="block mb-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12">
                  VIEW COMPLETE SERIES PERFORMANCE <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/peer-learning">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white/70 h-10">
                  RETURN TO DASHBOARD
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

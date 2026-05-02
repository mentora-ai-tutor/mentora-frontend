"use client";

import { CheckCircle2, Users, ArrowRight, MessageSquare, Bug, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function GroupDebuggingPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-red-400 mb-2 uppercase">Group Debugging Session Performance</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
          <span>Group: GRP_LOOPS_001</span>
          <span>•</span>
          <span>Session Type: DEBUGGING SESSION</span>
          <span>•</span>
          <span>Round: 3 of 4</span>
          <span>•</span>
          <span>Date: April 23, 2026</span>
          <span>•</span>
          <span>Duration: 18 minutes</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* YOUR PERFORMANCE */}
        <Card className="bg-gradient-to-br from-green-900/20 to-[#0F172A] border-green-500/20">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-green-400 tracking-wider">YOUR PERFORMANCE (Role: REVIEWER)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-6xl font-black text-green-400">94%</div>
              <div className="flex-1">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "94%" }}></div>
                </div>
                <p className="text-sm text-white/70">Excellent Performance</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <h3 className="font-bold text-white/50 uppercase text-xs mb-2">Points Breakdown:</h3>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Found 4 out of 4 bugs</span>
                <span className="font-bold text-green-400">+40 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Identified bug locations correctly</span>
                <span className="font-bold text-green-400">+20 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Provided accurate fix descriptions</span>
                <span className="font-bold text-green-400">+20 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Verified all fixes</span>
                <span className="font-bold text-green-400">+10 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Peer rating (Explainer: 96/100)</span>
                <span className="font-bold text-green-400">+2 points</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Peer rating (Solver: 92/100)</span>
                <span className="font-bold text-green-400">+2 points</span>
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
                      <td className="px-4 py-3 font-bold text-green-400">Reviewer</td>
                      <td className="px-4 py-3 font-medium">You</td>
                      <td className="px-4 py-3 font-bold">94%</td>
                      <td className="px-4 py-3">94/100</td>
                      <td className="px-4 py-3 text-green-400">Excellent</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3 font-bold text-purple-400">Explainer</td>
                      <td className="px-4 py-3 font-medium">Alice</td>
                      <td className="px-4 py-3 font-bold">86%</td>
                      <td className="px-4 py-3">88/100</td>
                      <td className="px-4 py-3 text-green-400">Good</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-blue-400">Solver</td>
                      <td className="px-4 py-3 font-medium">Bob</td>
                      <td className="px-4 py-3 font-bold">91%</td>
                      <td className="px-4 py-3">90/100</td>
                      <td className="px-4 py-3 text-green-400">Very Good</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                <span className="text-sm font-bold text-red-400">Team Average Score: 90.3%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e293b]/50 border-white/5">
             <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> DETAILED BUG FINDING METRICS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm text-white/80">
              <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                <span>Time to find Bug #1:</span>
                <span className="font-bold">1m 30s</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                <span>Time to find Bug #2:</span>
                <span className="font-bold">2m 00s</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                <span>Time to find Bug #3:</span>
                <span className="font-bold">3m 00s</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                <span>Time to find Bug #4:</span>
                <span className="font-bold">4m 30s</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-white/50 uppercase text-xs font-bold">Average time per bug:</span>
                <span className="font-bold text-blue-400">2m 45s</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* BUGS SUMMARY */}
        <div className="space-y-6">
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <Bug className="w-4 h-4 text-red-400" /> BUGS SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
               <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-white/80">
                  <thead className="text-xs text-white/50 uppercase bg-black/20">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Bug</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-center">Found</th>
                      <th className="px-4 py-3 text-center">Fixed</th>
                      <th className="px-4 py-3 rounded-tr-lg">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3 font-medium">#1</td>
                      <td className="px-4 py-3 text-white/60">Line 6</td>
                      <td className="px-4 py-3 text-white">Off-by-one</td>
                      <td className="px-4 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-400 inline" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-400 inline" /></td>
                      <td className="px-4 py-3 text-red-400 font-bold">Critical</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3 font-medium">#2</td>
                      <td className="px-4 py-3 text-white/60">Line 8</td>
                      <td className="px-4 py-3 text-white">Wrong variable</td>
                      <td className="px-4 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-400 inline" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-400 inline" /></td>
                      <td className="px-4 py-3 text-red-400 font-bold">Critical</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3 font-medium">#3</td>
                      <td className="px-4 py-3 text-white/60">Line 11</td>
                      <td className="px-4 py-3 text-white">Missing ;</td>
                      <td className="px-4 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-400 inline" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-400 inline" /></td>
                      <td className="px-4 py-3 text-yellow-400 font-bold">Minor</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">#4</td>
                      <td className="px-4 py-3 text-white/60">Line 14</td>
                      <td className="px-4 py-3 text-white">Logic error</td>
                      <td className="px-4 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-400 inline" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-400 inline" /></td>
                      <td className="px-4 py-3 text-orange-400 font-bold">Major</td>
                    </tr>
                  </tbody>
                </table>
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
              <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl">
                <p className="text-xs font-bold text-purple-400 mb-2">From Alice (Explainer):</p>
                <p className="text-sm italic text-white/80 leading-relaxed">
                  "Excellent bug hunting! You found issues I completely missed. Clear bug reports made explaining easy."
                </p>
              </div>
              <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl">
                <p className="text-xs font-bold text-blue-400 mb-2">From Bob (Solver):</p>
                <p className="text-sm italic text-white/80 leading-relaxed">
                  "Your bug reports were very clear with exact line numbers. Made fixing straightforward. Great teamwork!"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-[#0F172A] border-blue-500/30">
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-3">NEXT SESSION:</h3>
              <div className="space-y-2 text-sm text-white/80 mb-6">
                <p>Session Type: <span className="font-bold text-white">MINI PROJECT SESSION</span></p>
                <p>Round: <span className="font-bold text-white">4 of 4</span></p>
                <p>Your Role: <span className="font-bold text-blue-400">SOLVER (Rotating)</span></p>
                <p>Schedule: <span className="font-bold text-white">Tomorrow at 2:00 PM</span></p>
              </div>
              <div className="flex gap-3">
                <Link href="/peer-learning/mini-project" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12">
                    CONTINUE TO MINI PROJECT <ArrowRight className="w-4 h-4 ml-2" />
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

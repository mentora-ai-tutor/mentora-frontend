"use client";

import { CheckCircle2, Users, ArrowRight, Award, Trophy, Star, BookOpen, UserPlus, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SessionSeriesPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-3">COMPLETE SESSION SERIES PERFORMANCE REPORT</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
          <span>Topic: LOOPS</span>
          <span>•</span>
          <span>Group: GRP_LOOPS_001</span>
          <span>•</span>
          <span>Total Duration: 4 sessions over 4 days</span>
        </div>
      </div>

      {/* FINAL MASTERY STATUS */}
      <Card className="bg-gradient-to-r from-green-900/40 via-[#0F172A] to-blue-900/40 border-green-500/30 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 rounded-full blur-[80px] pointer-events-none" />
        <CardContent className="py-12 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400 mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-sm font-bold text-green-400 tracking-[0.2em] uppercase mb-2">Your Final Mastery Status</h2>
          <div className="text-6xl font-black text-white flex items-center justify-center gap-4">
            MASTERED <span className="text-green-400">(92.3%)</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* SESSION BY SESSION */}
        <Card className="bg-[#1e293b]/50 border-white/5">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider">SESSION BY SESSION PERFORMANCE</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white/80">
                <thead className="text-xs text-white/50 uppercase bg-black/20">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Session</th>
                    <th className="px-4 py-3">Your Role</th>
                    <th className="px-4 py-3">Your Score</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3">Coding Session R1</td>
                    <td className="px-4 py-3 font-medium text-purple-400">Explainer</td>
                    <td className="px-4 py-3 font-bold">82%</td>
                    <td className="px-4 py-3 text-green-400">Good</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3">Coding Session R2</td>
                    <td className="px-4 py-3 font-medium text-purple-400">Explainer</td>
                    <td className="px-4 py-3 font-bold">88%</td>
                    <td className="px-4 py-3 text-green-400">Good</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3">Debugging Session R3</td>
                    <td className="px-4 py-3 font-medium text-green-400">Reviewer</td>
                    <td className="px-4 py-3 font-bold">94%</td>
                    <td className="px-4 py-3 text-blue-400 font-bold">Excellent</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Mini Project R4</td>
                    <td className="px-4 py-3 font-medium text-blue-400">Solver</td>
                    <td className="px-4 py-3 font-bold">95%</td>
                    <td className="px-4 py-3 text-blue-400 font-bold">Excellent</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-black/30 border border-white/10 rounded-lg text-center flex justify-between px-6">
              <span className="text-sm font-medium text-white/70">Your Average Score Across All Roles:</span>
              <span className="text-sm font-bold text-white">89.75%</span>
            </div>
          </CardContent>
        </Card>

        {/* ROLE PERFORMANCE BREAKDOWN */}
        <Card className="bg-[#1e293b]/50 border-white/5">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider">ROLE PERFORMANCE BREAKDOWN</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white/80">
                <thead className="text-xs text-white/50 uppercase bg-black/20">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Role</th>
                    <th className="px-4 py-3">Sessions</th>
                    <th className="px-4 py-3">Average Score</th>
                    <th className="px-4 py-3 rounded-tr-lg">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-medium text-purple-400">Explainer</td>
                    <td className="px-4 py-3">2</td>
                    <td className="px-4 py-3 font-bold">85%</td>
                    <td className="px-4 py-3 text-green-400">Good</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-medium text-green-400">Reviewer</td>
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3 font-bold">94%</td>
                    <td className="px-4 py-3 text-blue-400">Excellent</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-blue-400">Solver</td>
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3 font-bold">95%</td>
                    <td className="px-4 py-3 text-blue-400">Excellent</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-white/50 mb-1">Your strongest role:</p>
                <p className="font-bold text-blue-400">SOLVER (95%)</p>
              </div>
              <div className="flex-1 p-3 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                <p className="text-xs text-white/50 mb-1">Your role to improve:</p>
                <p className="font-bold text-purple-400">EXPLAINER (85%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* TEAM PERFORMANCE */}
        <Card className="bg-[#1e293b]/50 border-white/5">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" /> TEAM PERFORMANCE ACROSS ALL SESSIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white/80">
                <thead className="text-xs text-white/50 uppercase bg-black/20">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Name</th>
                    <th className="px-4 py-3">Role Experience</th>
                    <th className="px-4 py-3">Average</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 bg-black/10">
                    <td className="px-4 py-3 font-bold text-white">You</td>
                    <td className="px-4 py-3 text-xs text-white/60">Explainer, Reviewer, Solver</td>
                    <td className="px-4 py-3 font-bold text-blue-400">89.8%</td>
                    <td className="px-4 py-3 text-blue-400">Excellent</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-medium">Alice</td>
                    <td className="px-4 py-3 text-xs text-white/60">Solver, Explainer, Reviewer</td>
                    <td className="px-4 py-3 font-bold">88.5%</td>
                    <td className="px-4 py-3 text-green-400">Good</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Bob</td>
                    <td className="px-4 py-3 text-xs text-white/60">Reviewer, Solver, Explainer</td>
                    <td className="px-4 py-3 font-bold">87.3%</td>
                    <td className="px-4 py-3 text-green-400">Good</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-black/30 border border-white/10 rounded-lg text-center flex justify-between px-6">
              <span className="text-sm font-medium text-white/70">Team Average:</span>
              <span className="text-sm font-bold text-white">88.5%</span>
            </div>
          </CardContent>
        </Card>

        {/* TOPIC MASTERY CONFIRMATION */}
        <Card className="bg-[#1e293b]/50 border-white/5">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider">TOPIC MASTERY CONFIRMATION</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-3 p-2 bg-green-500/5 rounded">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm">You have achieved 90%+ on Loops</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-green-500/5 rounded">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm">You have completed all required session types</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-green-500/5 rounded">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm">You have demonstrated all 3 roles</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-green-500/5 rounded">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm">Your solutions have been added to Knowledge Base</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* WHAT YOU HAVE EARNED */}
        <Card className="bg-gradient-to-br from-yellow-900/20 to-[#0F172A] border-yellow-500/30">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-yellow-400 tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4" /> WHAT YOU HAVE EARNED
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="font-bold text-white">MASTERY CERTIFICATE</p>
                <p className="text-xs text-white/60">For LOOPS</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <div>
                <p className="font-bold text-white">VERIFIED POOL</p>
                <p className="text-xs text-white/60">Added to Verified Pool for LOOPS</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
              <UserPlus className="w-8 h-8 text-blue-400" />
              <div>
                <p className="font-bold text-white">TEACHING PERMISSION</p>
                <p className="text-xs text-white/60">Permission to TEACH Loops to other students</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <div>
                <p className="font-bold text-white">KNOWLEDGE BASE</p>
                <p className="text-xs text-white/60">Your best solutions added to Knowledge Base</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
              <div>
                <p className="font-bold text-white">NEW BADGE</p>
                <p className="text-xs text-white/60">"Loop Master"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEXT STEPS */}
        <Card className="bg-[#1e293b]/50 border-white/5">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider">NEXT STEPS</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="p-4 bg-black/30 border border-white/10 rounded-xl">
              <p className="text-xs text-white/50 uppercase font-bold mb-1">Your next weak topic:</p>
              <p className="text-lg font-bold text-white flex items-center gap-2">RECURSION <span className="text-sm font-normal text-white/60">(Current score: 30%)</span></p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-bold text-white/80">You will now:</p>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-sm text-white/70">Be paired with a teacher for Recursion</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-sm text-white/70">Start pair sessions as LEARNER for Recursion</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-sm text-white/70">Continue teaching Loops to other students</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold gap-2">
                <Award className="w-4 h-4" /> VIEW CERTIFICATE
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold">
                GO TO NEXT TOPIC (RECURSION)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex gap-4 pt-4 justify-center">
        <Link href="/peer-learning">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white font-bold px-8">
            RETURN TO DASHBOARD
          </Button>
        </Link>
        <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white font-bold px-8">
          VIEW VERIFIED POOL
        </Button>
      </div>
    </div>
  );
}

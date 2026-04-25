"use client";

import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Calendar, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PairSessionPerformancePage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white mb-2">PAIR SESSION PERFORMANCE ANALYSIS</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-white/60">
          <span>Session: SESS_LOOPS_001</span>
          <span>•</span>
          <span>Topic: Loops</span>
          <span>•</span>
          <span>Date: April 23, 2026</span>
          <span>•</span>
          <span>Duration: 28 minutes</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* SCORES */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-[#0F172A] border-blue-500/20 text-center py-6">
          <CardContent>
            <h2 className="text-sm font-bold text-white/50 mb-2 uppercase tracking-wider">Your Score</h2>
            <div className="text-6xl font-black text-blue-400 mb-2">85%</div>
            <p className="text-sm text-white/70">Teacher Score: 92%</p>
          </CardContent>
        </Card>

        {/* MASTERY STATUS */}
        <Card className="bg-[#1e293b]/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider">MASTERY STATUS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm text-white/70 mb-1">Current score for Loops</p>
                <p className="text-2xl font-bold text-white">85%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70 mb-1">Target for mastery</p>
                <p className="text-2xl font-bold text-blue-400">90%</p>
              </div>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }}></div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm font-bold text-yellow-400">NOT YET MASTERED</p>
                <p className="text-xs text-yellow-400/80">1 more session estimated to reach mastery.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QUESTION BREAKDOWN */}
      <Card className="bg-[#1e293b]/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-bold">QUESTION BY QUESTION BREAKDOWN</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { q: 1, title: "Write loop for even numbers 2-10", attempt: "Correct on first attempt", points: "100/100", time: "1m 30s", success: true },
            { q: 2, title: "Write loop for even numbers 2-20", attempt: "Incorrect (off-by-one error)", help: "Needed", points: "70/100", time: "4m 00s", success: false, verification: "Correct" },
            { q: 3, title: "Write loop for odd numbers 1-15", attempt: "Correct on first attempt", points: "100/100", time: "1m 45s", success: true },
            { q: 4, title: "Write loop for numbers divisible by 3 from 3-30", attempt: "Incorrect", help: "Needed", points: "70/100", time: "3m 30s", success: false, verification: "Correct" },
            { q: 5, title: "Write nested loop for multiplication table", attempt: "Correct on first attempt", points: "100/100", time: "2m 15s", success: true },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex gap-3">
                <div className="mt-1">
                  {item.success ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Question {item.q}: {item.title}</h3>
                  <p className="text-xs text-white/60 mb-1">Your attempt: {item.attempt}</p>
                  {!item.success && (
                    <p className="text-xs text-yellow-400/80">Teacher help: {item.help} | Verification: {item.verification}</p>
                  )}
                </div>
              </div>
              <div className="sm:text-right mt-3 sm:mt-0 flex flex-row sm:flex-col justify-between sm:justify-start">
                <span className="font-bold text-blue-400">{item.points}</span>
                <span className="text-xs text-white/50 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {item.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* METRICS & IMPROVEMENT */}
        <div className="space-y-6">
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider">PERFORMANCE METRICS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-sm text-white/80">Correct on first attempt</span>
                <span className="font-bold">3 out of 5 (60%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-sm text-white/80">Correct after teacher help</span>
                <span className="font-bold">2 out of 5 (40%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-sm text-white/80">Hints used</span>
                <span className="font-bold">0 (You didn't need hints)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-sm text-white/80">Average response time</span>
                <span className="font-bold">2m 36s</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> COMPARED TO PREVIOUS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs text-white/50 mb-1">Previous Session</p>
                  <p className="text-2xl font-bold text-white/80">70%</p>
                </div>
                <div className="h-px bg-white/10 w-8"></div>
                <div className="text-center">
                  <p className="text-xs text-white/50 mb-1">Current Session</p>
                  <p className="text-2xl font-bold text-blue-400">85%</p>
                </div>
                <div className="h-px bg-white/10 w-8"></div>
                <div className="text-center">
                  <p className="text-xs text-white/50 mb-1">Improvement</p>
                  <p className="text-2xl font-bold text-green-400">+15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FEEDBACK & AREAS */}
        <div className="space-y-6">
          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" /> TEACHER FEEDBACK
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl italic text-purple-200 leading-relaxed text-sm">
                "Great improvement! Your off-by-one errors are mostly fixed. Next session, focus on nested loops and more complex conditions. You went from 70% to 85% - one more session and you'll reach mastery."
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e293b]/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white/50 tracking-wider">AREAS TO IMPROVE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Nested loops</span>
                <span className="text-xs text-white/50 ml-auto">Need more practice</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Complex loop conditions</span>
                <span className="text-xs text-white/50 ml-auto">Sometimes miss edge cases</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Basic loop syntax</span>
                <span className="text-xs text-white/50 ml-auto">Mastered</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Off-by-one errors</span>
                <span className="text-xs text-white/50 ml-auto">Mostly fixed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4 pt-4 justify-center">
        <Link href="/peer-learning/group-coding/">
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-8 rounded-xl">
          BOOK NEXT SESSION
        </Button>
        </Link>
        <Link href="/peer-learning">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white font-bold py-6 px-8 rounded-xl">
            RETURN TO DASHBOARD
          </Button>
        </Link>
        <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white font-bold py-6 px-8 rounded-xl">
          VIEW DETAILED REPORT
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Calendar, Clock, Award, Activity, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { peerLearningApi } from "@/lib/api/peerLearning";

export default function PairSessionPerformancePage() {
  const [performance, setPerformance] = useState<any>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const sid = payload.student_id || payload.id;
      setStudentId(sid);
      loadPerformance(sid);
    } catch {
      setLoading(false);
    }
  }, []);

  const loadPerformance = async (sid: string) => {
    setLoading(true);
    const result = await peerLearningApi.getStudentPerformance(sid);
    if (result.success) {
      setPerformance(result.data);
    }
    setLoading(false);
  };

  const currentMastery = performance?.current_mastery || 0;
  const initialMastery = performance?.initial_mastery || 0;
  const masteryGain = currentMastery - initialMastery;

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up pb-12 text-white max-w-5xl mx-auto">
        <div className="text-center py-20">
          <div className="w-10 h-10 border-[3px] border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up pb-12 text-white max-w-5xl mx-auto font-sans">
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(13,148,136,0.2)]">
          <Activity className="w-3.5 h-3.5" /> Session Analytics
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">Collaborative Tutoring Session Performance</h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <span>Student: {studentId || "N/A"}</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Status: <span className="text-teal-400">{performance?.status || "N/A"}</span></span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Tutoring: {performance?.pair_sessions_as_learner || 0} learner / {performance?.pair_sessions_as_teacher || 0} teacher</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Group sessions: {performance?.group_sessions_completed || 0}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* YOUR PERFORMANCE */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden hover:bg-[#334155]/40 transition-all shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-6">
            <h2 className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] flex items-center gap-2">
              <Award className="w-4 h-4" /> Mastery Evaluation
            </h2>
          </div>
          <div className="p-10 text-center">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Neural Score Matrix</p>
            <div className="text-8xl font-black text-white tracking-tighter mb-2">{currentMastery}<span className="text-teal-400 text-4xl">%</span></div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/5 border border-teal-500/20 text-[10px] font-black text-teal-400 uppercase tracking-tight">
              Initial Mastery: {initialMastery}%
            </div>
            {masteryGain > 0 && (
              <div className="mt-2 text-[10px] font-black text-teal-400 uppercase tracking-tight">
                Gain: +{masteryGain.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {/* MASTERY STATUS */}
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />
          <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2 mb-8">
            <Target className="w-4 h-4 text-teal-400" /> Mastery Trajectory
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Current Proficiency</p>
                <p className="text-3xl font-black text-white">{currentMastery}%</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-2">Threshold</p>
                <p className="text-3xl font-black text-teal-400">90%</p>
              </div>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[2px]">
              <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_15px_rgba(13,148,136,0.5)] relative" style={{ width: `${Math.min(currentMastery, 100)}%` }}>
                <div className="absolute inset-0 bg-white/10 animate-shimmer" />
              </div>
            </div>
            {currentMastery < 90 && (
              <div className="flex items-center gap-4 p-4 bg-[#B45309]/5 border border-[#B45309]/20 rounded-2xl mt-4">
                <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-[#B45309] uppercase tracking-widest">Protocol Incomplete</p>
                  <p className="text-xs text-[#B45309]/80 font-bold tracking-tight mt-1">Additional sessions required to reach mastery status.</p>
                </div>
              </div>
            )}
            {currentMastery >= 90 && (
              <div className="flex items-center gap-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl mt-4">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Mastery Achieved</p>
                  <p className="text-xs text-teal-400/80 font-bold tracking-tight mt-1">You have reached the mastery threshold!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY METRICS */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Efficiency Metrics</h2>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: "Tutoring sessions (learner)", value: `${performance?.pair_sessions_as_learner || 0}` },
                { label: "Tutoring sessions (teacher)", value: `${performance?.pair_sessions_as_teacher || 0}` },
                { label: "Group sessions completed", value: `${performance?.group_sessions_completed || 0}` },
                { label: "Avg learner score", value: `${performance?.avg_learner_score || 0}%` },
                { label: "Avg teacher score", value: `${performance?.avg_teacher_score || 0}%` },
                { label: "Remaining gaps", value: `${performance?.remaining_gaps || 0}` },
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                  <span className="text-[11px] font-bold text-white/50 uppercase tracking-tight">{m.label}</span>
                  <span className="font-black text-white text-xs">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl p-8 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />
            <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2 mb-8">
              <TrendingUp className="w-4 h-4 text-teal-400" /> Mastery Progression
            </h2>
            <div className="flex items-center justify-between gap-6">
              <div className="text-center">
                <p className="text-[9px] font-black text-white/20 mb-2 uppercase tracking-[0.2em]">Initial</p>
                <p className="text-2xl font-black text-white/40">{initialMastery}%</p>
              </div>
              <div className="flex-1 h-[2px] bg-white/10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(13,148,136,0.8)]" />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-teal-400 mb-2 uppercase tracking-[0.2em]">Current</p>
                <p className="text-2xl font-black text-white">{currentMastery}%</p>
              </div>
              <div className="text-center bg-teal-500/10 p-3 rounded-2xl border border-teal-500/20 min-w-[70px] shadow-inner">
                <p className="text-[9px] font-black text-teal-400 mb-1 uppercase tracking-tighter">Gain</p>
                <p className="text-xl font-black text-teal-400">{masteryGain >= 0 ? '+' : ''}{masteryGain.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* TOPICS & ACHIEVEMENTS */}
        <div className="space-y-8">
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col flex-1">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-400" /> Topics Progress
              </h2>
            </div>
            <div className="p-8 space-y-4">
              {performance?.topics_improved?.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-3">Improved Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {performance.topics_improved.map((t: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs font-bold text-teal-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {performance?.topics_mastered?.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Mastered Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {performance.topics_mastered.map((t: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(!performance?.topics_improved?.length && !performance?.topics_mastered?.length) && (
                <div className="text-white/30 text-sm font-medium italic">
                  No topic data available yet.
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Next Steps</h2>
            </div>
            <div className="p-6 space-y-3">
              {performance?.current_session_id ? (
                <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-tight">
                    Active session: {performance.current_session_id.slice(0, 12)}...
                  </p>
                  <Link href="/peer-learning/pair-session">
                    <Button className="w-full mt-3 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl h-11 text-xs">
                      RETURN TO SESSION
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/peer-learning">
                  <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl h-12 text-xs">
                    <ArrowRight className="w-4 h-4 mr-2" /> BACK TO DASHBOARD
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

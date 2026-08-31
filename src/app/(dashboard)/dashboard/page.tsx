"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Brain, FileText, Target, Users, ChevronRight, Sparkles,
  Activity, Award, Loader2, BookOpen
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { knowledgeProfileApi } from "@/lib/api/knowledgeProfile";
import {
  learningGeneratorApi,
  type LearningMaterial,
  type ProgressStats,
} from "@/lib/api/learningGenerator";

const GAP_STYLES: Record<string, string> = {
  FUNDAMENTAL_GAP: "bg-red-500/10 border-red-500/20 text-red-300",
  PARTIAL_GAP: "bg-amber-500/10 border-amber-500/20 text-amber-300",
  SURFACE_GAP: "bg-blue-500/10 border-blue-500/20 text-blue-300",
  default: "bg-white/5 border-white/10 text-white/70",
};

function masteryLevel(score: number): string {
  if (score >= 90) return "Level 5";
  if (score >= 75) return "Level 4";
  if (score >= 60) return "Level 3";
  if (score >= 40) return "Level 2";
  return "Level 1";
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return new Date(iso).toLocaleDateString();
}

function materialIntro(m: LearningMaterial): string {
  const sm = m.structured_material;
  return (
    sm.lesson?.introduction?.what_is_it ||
    sm.lesson?.concept_explained?.core_definition ||
    sm.lesson?.concept_explained?.analogy ||
    `AI-generated material about ${sm.topic}.`
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [overallMastery, setOverallMastery] = useState<number | null>(null);
  const [gaps, setGaps] = useState<Array<{ topic: string; gap_type: string; mastery_score: number }>>([]);
  const [generalAdvice, setGeneralAdvice] = useState<string | null>(null);
  const [priorityTopic, setPriorityTopic] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [recentMaterials, setRecentMaterials] = useState<LearningMaterial[]>([]);

  const loadDashboard = useCallback(async () => {
    if (!user?.student_id) {
      setLoading(false);
      return;
    }
    const sid = user.student_id;
    try {
      await Promise.all([
        knowledgeProfileApi.getLatestMasteryProfile(sid).then((p) => {
          setOverallMastery(p.overall_mastery_score ?? null);
          setGaps(
            (p.knowledge_gaps || []).map((g) => ({
              topic: g.topic,
              gap_type: g.gap_type,
              mastery_score: g.mastery_score,
            })),
          );
          setGeneralAdvice(p.recommendations?.general_advice ?? null);
          setPriorityTopic(p.recommendations?.priority_order?.[0] ?? p.knowledge_gaps?.[0]?.topic ?? null);
        }).catch(() => {}),
        learningGeneratorApi.getProgressStats(sid).then((res) => {
          if (res.success && res.data) setProgress(res.data as ProgressStats);
        }).catch(() => {}),
        learningGeneratorApi.getMaterials(sid, { limit: 3 }).then((res) => {
          const data = res.data as any;
          const items: LearningMaterial[] = data?.items || [];
          setRecentMaterials(items);
        }).catch(() => {}),
      ]);
    } finally {
      setLoading(false);
    }
  }, [user?.student_id]);

  useEffect(() => {
    setMounted(true);
    loadDashboard();
  }, [loadDashboard]);

  const masteryScore = overallMastery ?? user?.stats?.overall_mastery_score ?? null;
  const visibleGaps = gaps.slice(0, 3);
  const extraGaps = gaps.length - visibleGaps.length;
  const goal = priorityTopic || gaps[0]?.topic || null;

  const totalMaterials = progress?.total_materials ?? 0;
  const completedMaterials = progress?.completed_materials ?? 0;
  const materialsPct = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;
  const overallPct = progress?.progress_percentage ?? null;

  const bars = [
    {
      label: "Overall Progress",
      value: overallPct,
    },
    {
      label: `Materials Completed (${completedMaterials}/${totalMaterials})`,
      value: materialsPct,
    },
    {
      label: "Avg Quiz Score",
      value: progress?.avg_quiz_score ?? null,
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">

      {/* ── WELCOME SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            Welcome back, {mounted ? (user?.name?.split(' ')[0] || "User") : "..."}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
          </h1>
          <p className="text-[#F8FAFC]/60 mt-1">
            {loading
              ? "Loading your latest learning insights..."
              : "Your AI tutor has generated new insights based on your learning activity."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : (
        <>
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── LEARNER INSIGHT CARD (Left/Main Content area) ── */}
        <div className="col-span-1 lg:col-span-2 relative p-[1px] rounded-2xl overflow-hidden group">
          {/* Animated border effect */}
          <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0 group-hover:rotate-180 transition-transform duration-1000 ease-linear animate-pulse" />

          <div className="relative h-full bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl p-6 lg:p-8 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-3 shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                  <Sparkles className="w-3 h-3" /> AI Insight
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {goal || "No goal detected yet"}
                </h2>
                <p className="text-sm text-white/50 mt-1">Current Learning Goal</p>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#B45309]/10 border border-[#B45309]/30 text-[#B45309] font-bold">
                  <Award className="w-4 h-4" /> Mastery {masteryScore !== null ? masteryLevel(masteryScore) : "N/A"}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white/40 mb-3 uppercase tracking-wider">Detected Weak Concepts</p>
              {gaps.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visibleGaps.map((g) => (
                    <span
                      key={g.topic}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${GAP_STYLES[g.gap_type] || GAP_STYLES.default}`}
                    >
                      {g.topic}
                    </span>
                  ))}
                  {extraGaps > 0 && (
                    <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 rounded-lg text-sm font-medium">
                      +{extraGaps} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-white/40">
                  No weak concepts detected yet. Complete a knowledge analysis to generate insights.
                </p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-teal-100">
                {generalAdvice || "Submit a learning profile to get personalized recommendations."}
              </p>
              {goal && (
                <Link
                  href="/learning-generator"
                  className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] transition-all shrink-0"
                >
                  Start Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── PROGRESS OVERVIEW (Right area) ── */}
        <div className="col-span-1 bg-[#334155]/30 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:bg-[#334155]/50 transition-colors">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" /> Course Progress
            </h3>

            <div className="space-y-5">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{bar.label}</span>
                    <span className="text-teal-400 font-bold">{bar.value !== null ? `${bar.value}%` : "—"}</span>
                  </div>
                  <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full relative transition-all duration-700"
                      style={{ width: `${Math.min(Math.max(bar.value ?? 0, 0), 100)}%` }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/assessment"
            className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 font-semibold rounded-xl transition-colors border border-white/5 text-center block"
          >
            View Analytics
          </Link>
        </div>
      </div>

      {/* ── QUICK ACCESS MODULE CARDS ── */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Core Modules</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: "Knowledge Assist", href: "/knowledge-assist", icon: Brain, desc: "Ask questions, get explanations", cta: "Ask AI" },
            { tag: "Material Generator", href: "/learning-generator", icon: FileText, desc: "Personalized tutorials & exercises", cta: "Generate Learning Plan" },
            { tag: "Assessment & Mastery", href: "/assessment", icon: Target, desc: "Evaluate and track mastery", cta: "Start Assessment" },
            { tag: "Peer Learning", href: "/peer-learning", icon: Users, desc: "Collaborate with other learners", cta: "Explore Community" },
          ].map((mod, i) => (
            <Link
              key={i} href={mod.href}
              className="group p-5 bg-[#334155]/20 hover:bg-[#334155]/40 border border-white/5 hover:border-teal-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,148,136,0.1)] flex flex-col h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-teal-500/50 group-hover:bg-teal-500/10 transition-all text-white/70 group-hover:text-teal-400">
                <mod.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white mb-1.5">{mod.tag}</h4>
              <p className="text-xs text-white/50 mb-6 flex-1">{mod.desc}</p>
              <div className="flex items-center text-teal-400 text-sm font-bold mt-auto group-hover:underline">
                {mod.cta} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── AI GENERATED CONTENT PREVIEW ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Just for you</h3>
          <span className="text-xs text-white/40">
            {recentMaterials.length > 0
              ? `Generated ${timeAgo(recentMaterials[0].structured_material.generated_at)}`
              : "No materials yet"}
          </span>
        </div>

        {recentMaterials.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {recentMaterials.map((m) => {
              const sm = m.structured_material;
              return (
                <div key={m._id} className="p-4 rounded-2xl bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border border-white/5 hover:border-teal-500/20 transition-all group">
                  <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> AI Generated
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-white/50 shrink-0" />
                    <span className="truncate" title={sm.topic}>{sm.topic}</span>
                  </h4>
                  <p className="text-xs text-white/50 mb-4 line-clamp-2">{materialIntro(m)}</p>
                  <Link
                    href={`/learning-generator/materials/${m._id}`}
                    className="block w-full py-2 bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 text-xs font-bold rounded-lg transition-colors border border-teal-500/20 text-center"
                  >
                    Read Concept
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 bg-[#334155]/10 border border-white/5 rounded-2xl text-center">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white/60 mb-2">No AI-generated materials yet</h3>
            <p className="text-sm text-white/40 mb-4">
              Submit a learning profile to generate personalized tutorials and exercises.
            </p>
            <Link
              href="/learning-generator"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4" /> Generate Learning Plan
            </Link>
          </div>
        )}
      </div>
        </>
      )}

    </div>
  );
}
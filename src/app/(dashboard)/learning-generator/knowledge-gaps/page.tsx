"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type KnowledgeGap } from "@/lib/api/learningGenerator";
import {
  AlertTriangle, Brain, ChevronLeft, Loader2, BookOpen,
  ExternalLink, TrendingUp, Target, Clock, Filter
} from "lucide-react";

export default function KnowledgeGapsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [expandedGap, setExpandedGap] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.student_id) return;
    try {
      const profileRes = await learningGeneratorApi.getProfile(user.student_id);
      if (profileRes.success) setProfile(profileRes.data);
    } finally {
      setLoading(false);
    }
  }, [user?.student_id]);

  useEffect(() => {
    if (user?.student_id) fetchData();
  }, [user?.student_id, fetchData]);

  const getGapColor = (gapType: string) => {
    switch (gapType) {
      case "FUNDAMENTAL_GAP":
        return { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", dot: "bg-red-500", badge: "bg-red-500/20 text-red-300" };
      case "PARTIAL_GAP":
        return { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-500", badge: "bg-amber-500/20 text-amber-300" };
      case "SURFACE_GAP":
        return { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", dot: "bg-blue-500", badge: "bg-blue-500/20 text-blue-300" };
      default:
        return { bg: "bg-white/5", border: "border-white/10", text: "text-white/50", dot: "bg-white/30", badge: "bg-white/10 text-white/60" };
    }
  };

  const filteredGaps = filter === "ALL"
    ? profile?.knowledge_gaps || []
    : profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === filter) || [];

  const gapCounts = {
    ALL: profile?.knowledge_gaps?.length || 0,
    FUNDAMENTAL_GAP: profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "FUNDAMENTAL_GAP").length || 0,
    PARTIAL_GAP: profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "PARTIAL_GAP").length || 0,
    SURFACE_GAP: profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "SURFACE_GAP").length || 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <Link href="/learning-generator" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-bold mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Overview
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Knowledge Gaps</h1>
            <p className="text-sm text-white/50">Detailed analysis of areas that need improvement.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {profile && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
            <p className="text-3xl font-black text-white">{profile.knowledge_gaps?.length || 0}</p>
            <p className="text-xs text-white/40 mt-1">Total Gaps</p>
          </div>
          <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
            <p className="text-3xl font-black text-red-400">{gapCounts.FUNDAMENTAL_GAP}</p>
            <p className="text-xs text-red-400/60 mt-1">Fundamental</p>
          </div>
          <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
            <p className="text-3xl font-black text-amber-400">{gapCounts.PARTIAL_GAP}</p>
            <p className="text-xs text-amber-400/60 mt-1">Partial</p>
          </div>
          <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <p className="text-3xl font-black text-blue-400">{gapCounts.SURFACE_GAP}</p>
            <p className="text-xs text-blue-400/60 mt-1">Surface</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-white/30" />
        {(["ALL", "FUNDAMENTAL_GAP", "PARTIAL_GAP", "SURFACE_GAP"] as const).map((type) => {
          const isActive = filter === type;
          const colors = type !== "ALL" ? getGapColor(type) : null;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? type === "ALL"
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : `${colors!.bg} ${colors!.text} border ${colors!.border}`
                  : "bg-[#334155]/20 text-white/40 border border-white/5 hover:text-white/60"
              }`}
            >
              {type === "ALL" ? "All" : type.replace("_", " ")}
              <span className="ml-1.5 opacity-60">({gapCounts[type]})</span>
            </button>
          );
        })}
      </div>

      {/* Gaps List */}
      {filteredGaps.length > 0 ? (
        <div className="space-y-4">
          {filteredGaps.map((gap: KnowledgeGap, i: number) => {
            const colors = getGapColor(gap.gap_type);
            const isExpanded = expandedGap === i;
            return (
              <div key={i} className={`bg-[#334155]/20 border rounded-2xl transition-all ${isExpanded ? 'border-white/10' : 'border-white/5'}`}>
                {/* Gap Header */}
                <button
                  onClick={() => setExpandedGap(isExpanded ? null : i)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${colors.dot} ${gap.gap_type === "FUNDAMENTAL_GAP" ? 'animate-pulse' : ''}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white">{gap.topic}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.border} ${colors.text}`}>
                            {gap.gap_type.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-white/40">{gap.topic_id}</p>
                      </div>
                    </div>
                    {gap.confidence && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-white/60">{Math.round(gap.confidence * 100)}%</p>
                        <p className="text-[10px] text-white/30">Confidence</p>
                      </div>
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                    {/* Evidence */}
                    {gap.evidence_summary && (
                      <div>
                        <h4 className="text-[10px] text-white/30 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Target className="w-3 h-3" /> Evidence
                        </h4>
                        <p className="text-sm text-white/70 leading-relaxed bg-[#0F172A]/50 p-3 rounded-lg border border-white/5">
                          {gap.evidence_summary}
                        </p>
                      </div>
                    )}

                    {/* Misconceptions */}
                    {gap.misconceptions && gap.misconceptions.length > 0 && (
                      <div>
                        <h4 className="text-[10px] text-red-400/60 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Brain className="w-3 h-3" /> Misconceptions ({gap.misconceptions.length})
                        </h4>
                        <div className="space-y-2">
                          {gap.misconceptions.map((m: string, mi: number) => (
                            <div key={mi} className="flex items-start gap-2 p-2.5 bg-red-500/5 border border-red-500/10 rounded-lg">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                              <p className="text-sm text-red-200/80">{m}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Error Patterns */}
                    {gap.observed_error_patterns && Object.keys(gap.observed_error_patterns).length > 0 && (
                      <div>
                        <h4 className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <TrendingUp className="w-3 h-3" /> Observed Error Patterns
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {Object.entries(gap.observed_error_patterns).map(([source, errors]: [string, any]) => (
                            <div key={source} className="p-3 bg-[#0F172A]/50 border border-white/5 rounded-lg">
                              <p className="text-xs font-bold text-white/60 capitalize mb-2">{source}</p>
                              <div className="space-y-1">
                                {(Array.isArray(errors) ? errors : [errors]).map((err: string, ei: number) => (
                                  <p key={ei} className="text-xs text-white/50 flex items-start gap-1.5">
                                    <span className="text-amber-500 shrink-0">•</span>
                                    {err}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prerequisites & Related */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {gap.prerequisite_topics && gap.prerequisite_topics.length > 0 && (
                        <div>
                          <h4 className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Prerequisites</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {gap.prerequisite_topics.map((t: string, ti: number) => (
                              <span key={ti} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {gap.related_topics && gap.related_topics.length > 0 && (
                        <div>
                          <h4 className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Related Topics</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {gap.related_topics.map((t: string, ti: number) => (
                              <span key={ti} className="px-2 py-1 bg-teal-500/10 border border-teal-500/10 rounded text-xs text-teal-300/70">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggested Intervention */}
                    {gap.suggested_intervention && (
                      <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                        <h4 className="text-[10px] text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Target className="w-3 h-3" /> Suggested Intervention
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-white/40 mb-1">Primary Approach</p>
                            <p className="text-sm font-bold text-teal-300 capitalize">
                              {gap.suggested_intervention.primary.replace("_", " ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40 mb-1">Estimated Time</p>
                            <p className="text-sm font-bold text-white flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-teal-400" />
                              {gap.suggested_intervention.estimated_time_minutes} minutes
                            </p>
                          </div>
                          {gap.suggested_intervention.secondary && gap.suggested_intervention.secondary.length > 0 && (
                            <div className="sm:col-span-2">
                              <p className="text-xs text-white/40 mb-1.5">Secondary Approaches</p>
                              <div className="flex flex-wrap gap-1.5">
                                {gap.suggested_intervention.secondary.map((s: string, si: number) => (
                                  <span key={si} className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/10 rounded text-xs text-teal-300/70 capitalize">
                                    {s.replace("_", " ")}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {gap.suggested_intervention.learning_objectives && gap.suggested_intervention.learning_objectives.length > 0 && (
                            <div className="sm:col-span-2">
                              <p className="text-xs text-white/40 mb-1.5">Learning Objectives</p>
                              <ul className="space-y-1">
                                {gap.suggested_intervention.learning_objectives.map((obj: string, oi: number) => (
                                  <li key={oi} className="text-xs text-teal-200/70 flex items-start gap-1.5">
                                    <span className="text-teal-400 shrink-0 mt-0.5">→</span>
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-[#334155]/10 border border-white/5 rounded-2xl text-center">
          <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white/60 mb-2">No gaps found</h3>
          <p className="text-sm text-white/40">
            {filter !== "ALL" ? "No gaps match this filter." : "Submit a learning profile to identify knowledge gaps."}
          </p>
        </div>
      )}
    </div>
  );
}

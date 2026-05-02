"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type LearningMaterial, type GenerationJob, type StrengthItem } from "@/lib/api/learningGenerator";
import { BookOpen, Sparkles, Plus, RefreshCw, Layers, TrendingUp, Play, Loader2, AlertCircle, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

type PageState = "hub" | "submit" | "submitting" | "processing";

export default function LearningGeneratorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<PageState>("hub");
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.student_id) return;
    try {
      setError(null);
      const [materialsRes, profileRes, statsRes] = await Promise.all([
        learningGeneratorApi.getMaterials(user.student_id),
        learningGeneratorApi.getProfile(user.student_id),
        learningGeneratorApi.getAgentStats(),
      ]);

      if (materialsRes.success) setMaterials(materialsRes.data || []);
      if (profileRes.success) setProfile(profileRes.data);

      if (statsRes.success && statsRes.data) {
        const jobsRes = await learningGeneratorApi.getAgentStats();
        if (jobsRes.data?.active_jobs && jobsRes.data.active_jobs > 0) {
          const latestJobId = localStorage.getItem(`lmg_job_${user.student_id}`);
          if (latestJobId) {
            const jobRes = await learningGeneratorApi.getJobStatus(latestJobId);
            if (jobRes.success && jobRes.data && ['queued', 'processing'].includes(jobRes.data.status)) {
              setActiveJob(jobRes.data);
              if (!pollingInterval) {
                const interval = setInterval(async () => {
                  const res = await learningGeneratorApi.getJobStatus(latestJobId);
                  if (res.success && res.data) {
                    setActiveJob(res.data);
                    if (['completed', 'failed', 'partial'].includes(res.data.status)) {
                      clearInterval(interval);
                      setPollingInterval(null);
                      fetchData();
                      setState("hub");
                    }
                  }
                }, 5000);
                setPollingInterval(interval);
              }
            }
          }
        }
      }
    } catch {
      setError("Failed to load data. Ensure LMG service is running on port 3002.");
    } finally {
      setLoading(false);
    }
  }, [user?.student_id, pollingInterval]);

  useEffect(() => {
    if (user?.student_id) {
      fetchData();
    }
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [user?.student_id, fetchData]);

  const handleSubmitProfile = async () => {
    if (!user?.student_id) return;
    setState("submitting");
    setError(null);

    try {
      const payload = {
        student_id: user.student_id,
        analysis_timestamp: new Date().toISOString(),
        mastery_profile: {
          overall_mastery_score: 45,
          knowledge_gaps: [
            {
              topic: "Recursion",
              topic_id: "java-recursion-001",
              gap_type: "FUNDAMENTAL_GAP" as const,
              misconceptions: ["Thinks the base case is optional", "Confuses stack frame with heap allocation"],
              evidence_summary: "Student scored 18/60 on Recursion quiz",
            },
          ],
          strengths: ["Understands basic syntax", "Can write simple loops"],
        },
        recommendations: {
          priority_order: ["Recursion"],
          general_advice: "Focus on fundamental gaps first.",
        },
        data_sources: {
          quiz_results: new Date().toISOString().split("T")[0],
        },
      };

      const res = await learningGeneratorApi.submitProfile(payload);

      if (res.success && res.data) {
        localStorage.setItem(`lmg_job_${user.student_id}`, res.data.job_id);
        setActiveJob({
          job_id: res.data.job_id,
          student_id: res.data.student_id,
          profile_id: "",
          status: "processing",
          gaps_total: res.data.gaps_queued,
          gaps_completed: 0,
          gaps_failed: 0,
          materials_generated: 0,
          materials_failed: 0,
          created_at: new Date().toISOString(),
        });
        setState("processing");

        const interval = setInterval(async () => {
          const jobRes = await learningGeneratorApi.getJobStatus(res.data!.job_id);
          if (jobRes.success && jobRes.data) {
            setActiveJob(jobRes.data);
            if (['completed', 'failed', 'partial'].includes(jobRes.data.status)) {
              clearInterval(interval);
              setPollingInterval(null);
              fetchData();
              setState("hub");
            }
          }
        }, 5000);
        setPollingInterval(interval);
      } else {
        setError(res.message || res.error || "Failed to submit profile");
        setState("submit");
      }
    } catch {
      setError("Network error. Check LMG service.");
      setState("submit");
    }
  };

  const getGapColor = (gapType: string) => {
    switch (gapType) {
      case "FUNDAMENTAL_GAP": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "PARTIAL_GAP": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "SURFACE_GAP": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-white/50 bg-white/5 border-white/10";
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "text-green-400 bg-green-500/10";
      case "intermediate": return "text-amber-400 bg-amber-500/10";
      case "advanced": return "text-red-400 bg-red-500/10";
      default: return "text-white/50 bg-white/5";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Material Generator</h1>
            <p className="text-sm text-white/50">AI-powered personalized learning materials.</p>
          </div>
        </div>
        {profile && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-white/40 uppercase tracking-wider">Mastery Score</p>
              <p className="text-2xl font-black text-teal-400">{profile.overall_mastery_score ?? "—"}/100</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-200 text-sm font-medium">{error}</p>
            <button onClick={fetchData} className="text-red-400 text-xs font-bold mt-1 hover:text-red-300">
              Retry
            </button>
          </div>
        </div>
      )}

      {state === "processing" && activeJob && (
        <div className="p-6 bg-gradient-to-br from-teal-900/40 to-[#0F172A] border border-teal-500/30 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-teal-400 animate-spin-slow" />
            <h2 className="text-lg font-bold text-white">Generating Materials...</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Job: {activeJob.job_id}</span>
              <span className="text-teal-400 font-bold capitalize">{activeJob.status}</span>
            </div>
            <div className="flex-1 h-2 bg-[#334155] rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${activeJob.gaps_total > 0 ? (activeJob.gaps_completed / activeJob.gaps_total) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>{activeJob.gaps_completed}/{activeJob.gaps_total} topics completed</span>
              {activeJob.materials_generated > 0 && (
                <span className="text-teal-400">{activeJob.materials_generated} materials ready</span>
              )}
            </div>
          </div>
        </div>
      )}

      {state === "hub" && (
        <div className="space-y-8 animate-fade-in">
          {materials.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-teal-400" /> Your Materials
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((material) => {
                  const sm = material.structured_material;
                  return (
                    <div
                      key={material._id}
                      className="p-5 bg-[#334155]/20 border border-white/5 rounded-xl hover:border-teal-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(sm.difficulty_level)}`}>
                          {sm.difficulty_level}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getGapColor(sm.gap_type)}`}>
                          {sm.gap_type.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors mb-1">
                        {sm.topic}
                      </h3>
                      <p className="text-xs text-white/40 mb-4">
                        {new Date(sm.generated_at).toLocaleDateString()}
                      </p>
                      <Link
                        href={`/learning-generator/workspace/${material._id}`}
                        className="w-full py-2 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg hover:bg-teal-600/30 transition-colors flex items-center justify-center gap-2"
                      >
                        Open Workspace <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 pb-6">
            <div className="space-y-4">
              {profile?.knowledge_gaps && profile.knowledge_gaps.length > 0 && (
                <>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" /> Knowledge Gaps
                  </h2>
                  <div className="space-y-2">
                    {profile.knowledge_gaps.map((gap: any, i: number) => (
                      <div key={i} className="p-3 bg-[#334155]/20 border border-white/5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{gap.topic}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getGapColor(gap.gap_type)}`}>
                            {gap.gap_type.replace("_", " ")}
                          </span>
                        </div>
                        {gap.evidence_summary && (
                          <p className="text-xs text-white/40 mt-1 line-clamp-2">{gap.evidence_summary}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" /> Quick Actions
              </h2>
              <button
                onClick={() => setState("submit")}
                className="w-full p-6 bg-gradient-to-br from-teal-900/40 to-[#0F172A] border border-teal-500/30 rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(13,148,136,0.15)] transition-all text-left flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <Plus className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Generate New Module</h3>
                  <p className="text-sm text-teal-100/60">Submit your mastery profile and let AI generate personalized materials.</p>
                </div>
              </button>
              <button
                onClick={fetchData}
                className="w-full p-4 bg-[#334155]/20 border border-white/5 rounded-xl hover:border-white/20 transition-all flex items-center gap-3 text-left"
              >
                <RefreshCw className="w-4 h-4 text-white/50" />
                <span className="text-sm font-bold text-white/70">Refresh Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {state === "submit" && (
        <div className="max-w-2xl bg-[#334155]/20 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px]" />
          <h2 className="text-xl font-bold text-white mb-2">Submit Mastery Profile</h2>
          <p className="text-sm text-white/50 mb-6">
            This will send your knowledge gaps to the AI engine to generate personalized learning materials. Processing takes 2-10 minutes.
          </p>
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-[#0F172A] border border-white/5 rounded-xl">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">What gets sent:</p>
              <ul className="text-sm text-white/70 space-y-1">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Knowledge gaps with misconceptions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Strengths and skill level</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Evidence from quizzes, sandbox, and GitHub</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setState("hub")}
              className="flex-1 py-3 bg-[#334155]/30 border border-white/10 text-white font-bold rounded-xl hover:bg-[#334155]/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitProfile}
              className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-colors shadow-[0_0_20px_rgba(13,148,136,0.3)]"
            >
              Submit & Generate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type LearningMaterial, type GenerationJob, type KnowledgeGap, type StudentProgress, type ProgressStats } from "@/lib/api/learningGenerator";
import {
  BookOpen, Sparkles, Loader2, AlertCircle, TrendingUp, Target,
  Clock, CheckCircle2, XCircle, AlertTriangle, ChevronRight,
  Brain, Layers, BarChart3, ExternalLink, Plus, RefreshCw, Award, X
} from "lucide-react";

export default function LearningGeneratorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [profileHistory, setProfileHistory] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<GenerationJob[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [materialProgress, setMaterialProgress] = useState<StudentProgress[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [closingJobs, setClosingJobs] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    if (!user?.student_id) return;
    try {
      const [materialsRes, profileRes, historyRes, jobsRes, progressRes, progressStatsRes] = await Promise.all([
        learningGeneratorApi.getMaterials(user.student_id),
        learningGeneratorApi.getProfile(user.student_id),
        learningGeneratorApi.getProfileHistory(user.student_id, 1, 5),
        learningGeneratorApi.getJobsByStudent(user.student_id),
        learningGeneratorApi.getProgressByStudent(user.student_id),
        learningGeneratorApi.getProgressStats(user.student_id),
      ]);

      if (materialsRes.success && materialsRes.data) {
        const matData = materialsRes.data as any;
        setMaterials(matData.items || []);
      }
      if (profileRes.success) setProfile(profileRes.data);
      if (historyRes.success && historyRes.data) {
        const histData = historyRes.data as any;
        setProfileHistory(histData.items || []);
      }
      if (jobsRes.success && jobsRes.data) {
        const jobsData = (jobsRes.data as any) || [];
        const visible = jobsData.filter((j: GenerationJob) => j.status !== 'closed');
        setActiveJobs(visible);

        if (!pollingInterval) {
          const sid = user!.student_id!;
          const interval = setInterval(async () => {
            const [materialsRes, jobsRes] = await Promise.all([
              learningGeneratorApi.getMaterials(sid),
              learningGeneratorApi.getJobsByStudent(sid),
            ]);
            if (materialsRes.success && materialsRes.data) {
              const matData = materialsRes.data as any;
              setMaterials(matData.items || []);
            }
            if (jobsRes.success && jobsRes.data) {
              const allJobs = (jobsRes.data as any) || [];
              const visibleJobs = allJobs.filter((j: GenerationJob) => j.status !== 'closed');
              setActiveJobs(visibleJobs);
            }
          }, 5000);
          setPollingInterval(interval);
        }
      }
      if (progressRes.success && progressRes.data) {
        setMaterialProgress(Array.isArray(progressRes.data) ? progressRes.data : []);
      }
      if (progressStatsRes.success && progressStatsRes.data) {
        setProgressStats(progressStatsRes.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.student_id]);

  useEffect(() => {
    if (user?.student_id) fetchData();
    return () => { if (pollingInterval) clearInterval(pollingInterval); };
  }, [user?.student_id, fetchData]);

  const handleDismissJob = async (jobId: string) => {
    setClosingJobs(prev => [...prev, jobId]);
    try {
      await learningGeneratorApi.closeJob(jobId);
    } catch (err) {
      console.error('Failed to close job:', err);
    } finally {
      setActiveJobs(prev => prev.filter(j => j.job_id !== jobId));
      setClosingJobs(prev => prev.filter(id => id !== jobId));
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSubmitProfile = async () => {
    if (!user?.student_id) return;
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        student_id: user.student_id,
        analysis_timestamp: new Date().toISOString(),
        mastery_profile: {
          overall_mastery_score: 48,
          knowledge_gaps: [
            {
              topic: "Object-Oriented Programming (Polymorphism & Inheritance)",
              topic_id: "CS102-OOP",
              gap_type: "FUNDAMENTAL_GAP" as const,
              misconceptions: [
                "Confuses method overloading with overriding",
                "Does not understand dynamic dispatch",
                "Misuses abstract classes vs interfaces",
              ],
              evidence_summary:
                "GitHub shows a single massive commit (+420 lines) introducing a complete polymorphism implementation (AI probability 91%). Sandbox tasks on OOP had 0% success rate with completion under 60s. Quiz scores on OOP topics are 18%, with specific misconceptions on dynamic dispatch and interface contracts.",
              prerequisite_topics: ["Classes and Objects", "Methods", "Encapsulation"],
              related_topics: ["Design Patterns", "Generics"],
            },
            {
              topic: "Linked Lists",
              topic_id: "CS201-LL",
              gap_type: "FUNDAMENTAL_GAP" as const,
              misconceptions: [
                "Pointer/reference manipulation during insertion/deletion",
                "Handling edge cases (empty list, single node, head/tail updates)",
                "Doubly vs singly linked list differences",
              ],
              evidence_summary:
                "GitHub reveals a single commit with complete linked list implementation (AI probability 89%). Sandbox shows 100% success but suspiciously fast (25s). Quiz scores are 22%, with major misconceptions on pointer updates and edge case handling. Student cannot manually trace insert/delete operations.",
              prerequisite_topics: ["Arrays", "Classes and Objects", "References/Pointers"],
              related_topics: ["Stacks and Queues", "Trees"],
            },
            {
              topic: "Exception Handling",
              topic_id: "CS102-EXC",
              gap_type: "PARTIAL_GAP" as const,
              misconceptions: [
                "Checked vs unchecked exceptions",
                "try-catch-finally flow control",
                "When to throw vs catch vs suppress",
              ],
              evidence_summary:
                "GitHub shows exception handling appearing fully formed without evolution (medium risk). Sandbox success rate 55% with errors on exception types. Quiz score 48%, with misconceptions on checked/unchecked distinction and finally block behavior.",
              prerequisite_topics: ["Control Flow", "Methods", "File I/O"],
              related_topics: ["Logging", "Custom Exceptions"],
            },
            {
              topic: "Generics",
              topic_id: "CS201-GEN",
              gap_type: "PARTIAL_GAP" as const,
              misconceptions: [
                "Type erasure concept",
                "Bounded vs unbounded type parameters",
                "Generic methods vs generic classes",
              ],
              evidence_summary:
                "GitHub commits show generic code appearing complete without prior attempts (medium risk). Sandbox tasks 60% success with type mismatch errors. Quiz score 52%, struggling with bounded type parameters and wildcard usage.",
              prerequisite_topics: ["Object-Oriented Programming", "Inheritance"],
              related_topics: ["Collections Framework", "Polymorphism"],
            },
          ],
          strengths: [
            "Understands basic syntax and can write simple methods",
            "Can implement basic loops and conditionals",
            "Familiar with primitive data types and arrays",
          ],
        },
        recommendations: {
          priority_order: [
            "Object-Oriented Programming (Polymorphism & Inheritance)",
            "Linked Lists",
            "Exception Handling",
            "Generics",
          ],
          general_advice:
            "Focus on fundamental gaps first (OOP and Linked Lists) as they are prerequisites for many advanced topics. Use interactive tutorials and peer tutoring. For Exception Handling and Generics, targeted quizzes and practice exercises should suffice.",
          for_instructor:
            "Student may be using AI for difficult topics. Verify understanding with proctored tasks. Encourage incremental commits and descriptive commit messages.",
        },
        data_sources: {
          github: "available",
          sandbox: "available",
          quizzes: "available",
          quiz_results: new Date().toISOString().split("T")[0],
        },
      };

      const res = await learningGeneratorApi.submitProfile(payload);

      if (res.success && res.data) {
        setActiveJobs(prev => {
          if (prev.find(j => j.job_id === res.data!.job_id)) return prev;
          return [...prev, {
            job_id: res.data!.job_id,
            student_id: res.data!.student_id,
            profile_id: "",
            status: "processing",
            gaps_total: res.data!.gaps_queued,
            gaps_completed: 0,
            gaps_failed: 0,
            materials_generated: 0,
            materials_failed: 0,
            created_at: new Date().toISOString(),
          }];
        });
        setShowSubmitDialog(false);
      } else {
        setError(res.message || res.error || "Failed to submit profile");
      }
    } catch {
      setError("Network error. Check LMG service.");
    } finally {
      setSubmitting(false);
    }
  };

  const getGapColor = (gapType: string) => {
    switch (gapType) {
      case "FUNDAMENTAL_GAP": return { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", dot: "bg-red-500" };
      case "PARTIAL_GAP": return { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-500" };
      case "SURFACE_GAP": return { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", dot: "bg-blue-500" };
      default: return { bg: "bg-white/5", border: "border-white/10", text: "text-white/50", dot: "bg-white/30" };
    }
  };

  const getProgressForMaterial = (materialId: string) => {
    return materialProgress.find(p => p.material_id === materialId);
  };

  const getMaterialByTopic = (topic: string) => {
    return materials.find(m => m.structured_material.topic.toLowerCase() === topic.toLowerCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Generation Jobs */}
      {activeJobs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" /> Active Jobs
          </h2>
          {activeJobs.map((job) => {
            const isProcessing = ['queued', 'processing'].includes(job.status);
            const isCompleted = job.status === 'completed' || job.status === 'partial';

            return (
              <div key={job.job_id} className="p-5 bg-job-card border border-job-ring rounded-2xl animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  {isProcessing ? (
                    <Sparkles className="w-5 h-5 text-job-primary animate-spin-slow" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-job-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-job-failed" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-job-text">
                      {isProcessing ? 'Generating Materials...' : isCompleted ? 'Generation Complete' : 'Generation Failed'}
                    </h3>
                    <p className="text-xs text-job-muted">{job.job_id} • {job.status}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    isProcessing ? 'bg-job-primary/20 text-job-primary' : isCompleted ? 'bg-job-success/20 text-job-success' : 'bg-job-failed/20 text-job-failed'
                  }`}>{job.status}</span>
                  <button
                    onClick={() => handleDismissJob(job.job_id)}
                    disabled={closingJobs.includes(job.job_id)}
                    className="p-1.5 rounded-lg text-job-muted hover:text-job-failed hover:bg-job-failed/10 transition-all disabled:opacity-50"
                    title="Hide from view"
                  >
                    {closingJobs.includes(job.job_id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex-1 h-2 bg-[#334155] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isProcessing ? 'bg-linear-to-r from-teal-600 to-teal-400' : isCompleted ? 'bg-linear-to-r from-green-600 to-green-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${job.gaps_total > 0 ? (job.gaps_completed / job.gaps_total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-job-muted">
                    <span>{job.gaps_completed}/{job.gaps_total} topics processed</span>
                    {job.materials_generated > 0 && (
                      <span className="text-job-primary">{job.materials_generated} materials ready</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{progressStats?.progress_percentage ?? 0}%</p>
          <p className="text-xs text-white/40 mt-1">Overall Progress</p>
        </div>

        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{progressStats?.completed_materials ?? 0}</p>
          <p className="text-xs text-white/40 mt-1">Modules Completed</p>
        </div>

        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{progressStats?.in_progress_materials ?? 0}</p>
          <p className="text-xs text-white/40 mt-1">In Progress</p>
        </div>

        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{progressStats?.avg_quiz_score ?? "—"}</p>
          <p className="text-xs text-white/40 mt-1">Avg Quiz Score</p>
        </div>
      </div>

      {/* Learning Progress Overview */}
      {progressStats && (
        <div className="p-6 bg-linear-to-br from-[#334155]/30 to-[#0F172A] border border-white/5 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" /> Learning Progress
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Steps Completed</span>
                <span className="text-white font-bold">{progressStats.completed_steps} / {progressStats.total_steps}</span>
              </div>
              <div className="w-full h-3 bg-[#334155] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressStats.progress_percentage}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="text-center">
                <p className="text-2xl font-black text-green-400">{progressStats.completed_materials}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-amber-400">{progressStats.in_progress_materials}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white/50">{progressStats.not_started_materials}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Not Started</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Gaps & Materials */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Knowledge Gaps */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Knowledge Gaps
            </h2>
            <Link href="/learning-generator/knowledge-gaps" className="text-xs text-teal-400 font-bold hover:text-teal-300 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {profile?.knowledge_gaps && profile.knowledge_gaps.length > 0 ? (
            <div className="space-y-3">
              {profile.knowledge_gaps.map((gap: KnowledgeGap, i: number) => {
                const colors = getGapColor(gap.gap_type);
                const material = getMaterialByTopic(gap.topic);
                const progress = material ? getProgressForMaterial(material._id) : null;

                return (
                  <div key={i} className="p-5 bg-[#334155]/20 border border-white/5 rounded-xl hover:border-white/10 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${colors.dot}`} />
                        <div>
                          <h3 className="font-bold text-white group-hover:text-teal-300 transition-colors">{gap.topic}</h3>
                          <p className="text-xs text-white/40 mt-0.5">{gap.topic_id}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.border} ${colors.text}`}>
                        {gap.gap_type.replace("_", " ")}
                      </span>
                    </div>

                    {gap.evidence_summary && (
                      <p className="text-sm text-white/60 mb-3 line-clamp-2">{gap.evidence_summary}</p>
                    )}

                    {gap.misconceptions && gap.misconceptions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Misconceptions</p>
                        <div className="flex flex-wrap gap-1.5">
                          {gap.misconceptions.slice(0, 3).map((m: string, mi: number) => (
                            <span key={mi} className="px-2 py-0.5 bg-red-500/10 border border-red-500/10 rounded text-[10px] text-red-300/80">
                              {m.length > 40 ? m.substring(0, 40) + "..." : m}
                            </span>
                          ))}
                          {gap.misconceptions.length > 3 && (
                            <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/40">+{gap.misconceptions.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {material && progress && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-white/40 mb-1">
                          <span>{progress.completed_steps.length} / {progress.total_steps} steps</span>
                          <span className="text-teal-400">{Math.round((progress.completed_steps.length / progress.total_steps) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#334155] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full transition-all"
                            style={{ width: `${(progress.completed_steps.length / progress.total_steps) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        {gap.confidence && (
                          <span className="flex items-center gap-1">
                            <Brain className="w-3 h-3" /> {Math.round(gap.confidence * 100)}% confidence
                          </span>
                        )}
                        {progress?.completed_at && (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        )}
                      </div>
                      {material ? (
                        <Link
                          href={`/learning-generator/materials/${material._id}`}
                          className="px-3 py-1.5 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-[10px] font-bold rounded-lg hover:bg-teal-600/30 transition-colors flex items-center gap-1"
                        >
                          {progress?.completed_at ? 'Review' : 'Continue'} <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      ) : (
                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending generation
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-[#334155]/10 border border-white/5 rounded-xl text-center">
              <Brain className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40 mb-1">No knowledge gaps detected</p>
              <p className="text-xs text-white/30">Submit a learning profile to identify gaps.</p>
            </div>
          )}
        </div>

        {/* Sidebar: Quick Actions + Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" /> Quick Actions
            </h2>
            <button
              onClick={() => setShowSubmitDialog(true)}
              className="w-full p-4 bg-linear-to-br from-teal-900/40 to-[#0F172A] border border-teal-500/30 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(13,148,136,0.15)] transition-all text-left flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">Generate Materials</h3>
                <p className="text-xs text-teal-100/60">Submit mastery profile to AI engine</p>
              </div>
            </button>
            <Link href="/learning-generator/materials" className="w-full p-4 bg-[#334155]/20 border border-white/5 rounded-xl hover:border-white/20 transition-all flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/80 mb-0.5">Browse Materials</h3>
                <p className="text-xs text-white/40">View all generated content</p>
              </div>
            </Link>
          </div>

          {/* Material Progress List */}
          {materialProgress.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-400" /> Your Modules
              </h2>
              <div className="space-y-2">
                {materialProgress.map((p, i) => {
                  const pct = p.total_steps > 0 ? Math.round((p.completed_steps.length / p.total_steps) * 100) : 0;
                  const isComplete = !!p.completed_at;
                  return (
                    <Link key={i} href={`/learning-generator/materials/${p.material_id}`} className="block p-3 bg-[#334155]/20 border border-white/5 rounded-lg hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-white">{p.topic}</p>
                        {isComplete && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#334155] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-teal-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40 font-bold">{pct}%</span>
                      </div>
                      {p.quiz_score !== null && (
                        <p className="text-[10px] text-purple-400 mt-1">Quiz: {p.quiz_score}%</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Profile History */}
          {profileHistory.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" /> Score History
              </h2>
              <div className="space-y-2">
                {profileHistory.map((entry: any, i: number) => {
                  const getScoreColor = (score: number) => {
                    if (score >= 80) return "text-green-400";
                    if (score >= 60) return "text-amber-400";
                    if (score >= 40) return "text-orange-400";
                    return "text-red-400";
                  };
                  return (
                    <div key={i} className="p-3 bg-[#334155]/20 border border-white/5 rounded-lg flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-bold ${getScoreColor(entry.overall_mastery_score || entry.overall_score || 0)}`}>
                          {entry.overall_mastery_score || entry.overall_score || "—"}%
                        </p>
                        <p className="text-[10px] text-white/30">{entry.gaps_count || 0} gaps</p>
                      </div>
                      <p className="text-[10px] text-white/30">
                        {new Date(entry.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strengths */}
          {profile?.strengths && profile.strengths.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" /> Strengths
              </h2>
              <div className="space-y-2">
                {profile.strengths.map((s: any, i: number) => (
                  <div key={i} className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                    <p className="text-sm font-bold text-white">
                      {typeof s === 'string' ? s : s.topic}
                    </p>
                    {typeof s !== 'string' && s.confidence && (
                      <p className="text-[10px] text-green-400/60 mt-0.5">
                        {Math.round(s.confidence * 100)}% confidence • {s.mastery_level || 'proficient'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Profile Dialog */}
      {showSubmitDialog && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setShowSubmitDialog(false)} />
          <div className="relative max-w-lg w-full bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-6 animate-slide-up">
            <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" /> Generate Materials
            </h2>
            <p className="text-sm text-white/50 mb-6">
              This will send your knowledge gaps to the AI engine. Processing takes 2-10 minutes.
            </p>

            <div className="p-4 bg-[#0F172A]/50 border border-white/5 rounded-xl mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">What gets sent:</p>
              <ul className="text-sm text-white/70 space-y-1.5">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Knowledge gaps with misconceptions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Strengths and skill level</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Evidence from quizzes, sandbox, and GitHub</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                disabled={submitting}
                className="flex-1 py-3 bg-[#334155]/30 border border-white/10 text-white font-bold rounded-xl hover:bg-[#334155]/50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProfile}
                disabled={submitting}
                className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-colors shadow-[0_0_20px_rgba(13,148,136,0.3)] disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Submit & Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}

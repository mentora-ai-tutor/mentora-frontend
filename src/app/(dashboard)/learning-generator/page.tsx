"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type LearningMaterial, type GenerationJob, type KnowledgeGap, type StudentProgress, type ProgressStats } from "@/lib/api/learningGenerator";
import { AlertTriangle, ChevronRight, Loader2, Brain, BookOpen, Sparkles, Zap } from "lucide-react";
import { ActiveJobsList } from "@/components/learning-generator/JobCard";
import ProgressStatsCards from "@/components/learning-generator/ProgressStats";
import KnowledgeGapCard from "@/components/learning-generator/KnowledgeGapCard";
import SubmitProfileDialog from "@/components/learning-generator/SubmitProfileDialog";
import { QuickActions, ModuleProgressList, ScoreHistory, StrengthsList } from "@/components/learning-generator/OverviewSidebar";

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
        const visible = jobsData.filter((j: GenerationJob) => j.status !== "closed");
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
              const visibleJobs = allJobs.filter((j: GenerationJob) => j.status !== "closed");
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
    setClosingJobs((prev) => [...prev, jobId]);
    try {
      await learningGeneratorApi.closeJob(jobId);
    } catch (err) {
      console.error("Failed to close job:", err);
    } finally {
      setActiveJobs((prev) => prev.filter((j) => j.job_id !== jobId));
      setClosingJobs((prev) => prev.filter((id) => id !== jobId));
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
        setActiveJobs((prev) => {
          if (prev.find((j) => j.job_id === res.data!.job_id)) return prev;
          return [
            ...prev,
            {
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
            },
          ];
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

  const getProgressForMaterial = (materialId: string) => {
    return materialProgress.find((p) => p.material_id === materialId);
  };

  const getMaterialByTopic = (topic: string) => {
    return materials.find((m) => m.structured_material.topic.toLowerCase() === topic.toLowerCase());
  };

  const totalGaps = profile?.knowledge_gaps?.length || 0;
  const fundamentalGaps = profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "FUNDAMENTAL_GAP").length || 0;

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
    <div className="space-y-8 animate-slide-up">

      {/* ── HERO CARD ── */}
      <div className="relative p-[1px] rounded-3xl overflow-hidden group">
        <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0 group-hover:rotate-180 transition-transform duration-1000 ease-linear animate-pulse" />
        <div className="relative bg-[#1e293b]/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-3 shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                <Sparkles className="w-3 h-3" /> AI-Powered Learning
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white mb-2">
                Material Generator
              </h1>
              <p className="text-white/50 text-sm lg:text-base max-w-xl">
                Personalized tutorials, exercises, and assessments generated by AI based on your unique knowledge gaps and learning patterns.
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-4 text-center min-w-[100px]">
                <p className="text-2xl font-black text-teal-400">{totalGaps}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Gaps Found</p>
              </div>
              {fundamentalGaps > 0 && (
                <div className="bg-[#0F172A] border border-red-500/20 rounded-2xl p-4 text-center min-w-[100px]">
                  <p className="text-2xl font-black text-red-400">{fundamentalGaps}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Critical</p>
                </div>
              )}
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-4 text-center min-w-[100px]">
                <p className="text-2xl font-black text-amber-400">{materials.length}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Materials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTIVE JOBS ── */}
      {activeJobs.length > 0 && (
        <ActiveJobsList jobs={activeJobs} onDismiss={handleDismissJob} closingJobs={closingJobs} />
      )}

      {/* ── PROGRESS STATS ── */}
      <ProgressStatsCards stats={progressStats} progress={materialProgress} materials={materials} />

      {/* ── MAIN CONTENT ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── LEFT: Knowledge Gaps ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Knowledge Gaps
            </h2>
            <Link href="/learning-generator/knowledge-gaps" className="text-xs text-teal-400 font-bold hover:text-teal-300 flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {profile?.knowledge_gaps && profile.knowledge_gaps.length > 0 ? (
            <div className="space-y-3">
              {profile.knowledge_gaps.map((gap: KnowledgeGap, i: number) => {
                const material = getMaterialByTopic(gap.topic);
                const progress = material ? getProgressForMaterial(material._id) : null;
                return (
                  <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}>
                    <KnowledgeGapCard gap={gap} index={i} material={material} progress={progress || null} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">All Clear!</h3>
              <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">No knowledge gaps detected yet. Submit a learning profile to start your personalized journey.</p>
              <button
                onClick={() => setShowSubmitDialog(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(13,148,136,0.4)]"
              >
                <Zap className="w-4 h-4" /> Submit Profile
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="space-y-6">
          <QuickActions onGenerateClick={() => setShowSubmitDialog(true)} />
          <ModuleProgressList progress={materialProgress} />
          <ScoreHistory history={profileHistory} />
          <StrengthsList strengths={profile?.strengths || []} />
        </div>
      </div>

      <SubmitProfileDialog
        isOpen={showSubmitDialog}
        isSubmitting={submitting}
        onSubmit={handleSubmitProfile}
        onClose={() => setShowSubmitDialog(false)}
      />
    </div>
  );
}

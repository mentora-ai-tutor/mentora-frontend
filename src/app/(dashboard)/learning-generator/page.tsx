"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type LearningMaterial, type GenerationJob, type KnowledgeGap, type StudentProgress, type ProgressStats, type ConceptCoverage as ConceptCoverageData, type SubmitProfilePayload } from "@/lib/api/learningGenerator";
import { knowledgeProfileApi, type CanonicalMasteryProfile } from "@/lib/api/knowledgeProfile";
import { AlertTriangle, ChevronRight, Loader2, Brain, Sparkles, Zap, GitBranch } from "lucide-react";
import { ActiveJobsList } from "@/components/learning-generator/JobCard";
import ProgressStatsCards from "@/components/learning-generator/ProgressStats";
import KnowledgeGapCard from "@/components/learning-generator/KnowledgeGapCard";
import MaterialCard from "@/components/learning-generator/MaterialCard";
import { QuickActions, ModuleProgressList, ScoreHistory, StrengthsList, ConceptCoverage } from "@/components/learning-generator/OverviewSidebar";

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
  const [masteryGenerating, setMasteryGenerating] = useState(false);
  const [closingJobs, setClosingJobs] = useState<string[]>([]);
  const [conceptCoverage, setConceptCoverage] = useState<ConceptCoverageData | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.student_id) return;
    try {
      const [materialsRes, profileRes, historyRes, jobsRes, progressRes, progressStatsRes, coverageRes] = await Promise.all([
        learningGeneratorApi.getMaterials(user.student_id),
        learningGeneratorApi.getProfile(user.student_id),
        learningGeneratorApi.getProfileHistory(user.student_id, 1, 5),
        learningGeneratorApi.getJobsByStudent(user.student_id),
        learningGeneratorApi.getProgressByStudent(user.student_id),
        learningGeneratorApi.getProgressStats(user.student_id),
        learningGeneratorApi.getConceptCoverage(user.student_id),
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
      if (coverageRes.success && coverageRes.data) {
        setConceptCoverage(coverageRes.data);
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

  const addJobToActive = (job: { job_id: string; student_id: string; gaps_queued: number }) => {
    setActiveJobs((prev) => {
      if (prev.find((j) => j.job_id === job.job_id)) return prev;
      return [
        ...prev,
        {
          job_id: job.job_id,
          student_id: job.student_id,
          profile_id: "",
          status: "processing",
          gaps_total: job.gaps_queued,
          gaps_completed: 0,
          gaps_failed: 0,
          materials_generated: 0,
          materials_failed: 0,
          created_at: new Date().toISOString(),
        },
      ];
    });
  };

  const masteryToSubmitPayload = (mastery: CanonicalMasteryProfile, studentId: string): SubmitProfilePayload => ({
    student_id: studentId,
    analysis_timestamp: mastery.analysis_timestamp || new Date().toISOString(),
    mastery_profile: {
      overall_mastery_score: mastery.mastery_profile.overall_mastery_score,
      knowledge_gaps: mastery.mastery_profile.knowledge_gaps.map((gap) => ({
        topic: gap.topic,
        topic_id: gap.topic_id,
        gap_type: gap.gap_type,
        confidence: gap.confidence,
        misconceptions: gap.misconceptions,
        observed_error_patterns: gap.observed_error_patterns,
        evidence_summary: gap.evidence_summary,
        prerequisite_topics: gap.prerequisite_topics,
        related_topics: gap.related_topics,
        suggested_intervention: gap.suggested_intervention,
      })),
      strengths: mastery.mastery_profile.strengths.map((s) => ({
        topic: s.topic,
        topic_id: s.topic_id,
        confidence: s.confidence,
        mastery_level: s.mastery_level,
        evidence_summary: s.evidence_summary,
        can_teach_others: s.can_teach_others,
      })),
    },
    recommendations: mastery.recommendations,
    data_sources: mastery.data_sources,
  });

  const handleGenerateFromMastery = async () => {
    if (!user?.student_id) return;
    setMasteryGenerating(true);
    setError(null);

    try {
      const mastery = await knowledgeProfileApi.getLatestMasteryProfile(user.student_id);
      const gaps = mastery.mastery_profile?.knowledge_gaps || [];
      if (gaps.length === 0) {
        setError("No knowledge gaps found in the saved mastery profile. Run KAA /analyze first.");
        return;
      }

      const res = await learningGeneratorApi.submitProfile(masteryToSubmitPayload(mastery, user.student_id));

      if (res.success && res.data) {
        addJobToActive(res.data);
      } else {
        setError(res.message || res.error || "Failed to submit mastery profile");
      }
    } catch (err: any) {
      setError(err?.message || "Could not load the saved mastery profile. Run KAA /analyze first.");
    } finally {
      setMasteryGenerating(false);
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
  const implicitMaterials = materials.filter(
    (m) => m.structured_material.generation_source === "implicit_prerequisite"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-500 dark:text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-[var(--lmg-text-muted)] text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">

      {/* ── HERO CARD ── */}
      <div className="relative p-[1px] rounded-3xl overflow-hidden group">
        <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500/10 dark:via-teal-500/30 to-teal-500/0 group-hover:rotate-180 transition-transform duration-1000 ease-linear animate-pulse" />
        <div className="relative bg-white/95 dark:bg-[#1a2332]/95 border border-teal-500/25 dark:border-white/10 shadow-md dark:shadow-2xl rounded-3xl p-6 lg:p-7 transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-500/30 text-teal-800 dark:text-teal-300 text-[10px] font-bold tracking-wider uppercase mb-2 shadow-xs">
                <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" /> AI-Powered Learning
              </div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white mb-1">
                Material Generator
              </h1>
              <p className="text-slate-600 dark:text-white/70 text-sm lg:text-base max-w-xl leading-relaxed">
                Personalized tutorials, exercises, and assessments generated by AI based on your unique knowledge gaps and learning patterns.
              </p>
            </div>

            <div className="flex gap-2.5 shrink-0">
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs rounded-xl p-3.5 text-center min-w-[90px] transition-colors">
                <p className="text-xl font-black text-teal-700 dark:text-teal-400">{totalGaps}</p>
                <p className="text-[10px] text-slate-600 dark:text-white/60 font-bold uppercase tracking-wider mt-0.5">Gaps Found</p>
              </div>
              {fundamentalGaps > 0 && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-3.5 text-center min-w-[90px] transition-colors">
                  <p className="text-xl font-black text-red-700 dark:text-red-400">{fundamentalGaps}</p>
                  <p className="text-[10px] text-red-700 dark:text-red-300 font-bold uppercase tracking-wider mt-0.5">Critical</p>
                </div>
              )}
              <div className="bg-amber-50/60 dark:bg-white/5 border border-amber-200/80 dark:border-white/10 shadow-xs rounded-xl p-3.5 text-center min-w-[90px] transition-colors">
                <p className="text-xl font-black text-amber-700 dark:text-amber-400">{materials.length}</p>
                <p className="text-[10px] text-slate-600 dark:text-white/60 font-bold uppercase tracking-wider mt-0.5">Materials</p>
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
            <h2 className="text-lg font-bold text-[var(--lmg-text-primary)] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" /> Knowledge Gaps
            </h2>
            <Link href="/learning-generator/knowledge-gaps" className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:text-teal-500 flex items-center gap-1 transition-colors">
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
            <div className="bg-[var(--lmg-bg-surface)] border border-[var(--lmg-border)] shadow-sm dark:shadow-md rounded-2xl p-10 text-center transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-teal-500 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-[var(--lmg-text-primary)] mb-2">All Clear!</h3>
              <p className="text-sm text-[var(--lmg-text-muted)] mb-6 max-w-sm mx-auto">No knowledge gaps detected in your saved profile yet. Generate materials from your real Knowledge Assist gaps to start your personalized journey.</p>
              <button
                onClick={handleGenerateFromMastery}
                disabled={masteryGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] disabled:cursor-wait disabled:opacity-60 cursor-pointer"
              >
                {masteryGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Generate from Mastery
              </button>
            </div>
          )}

          {/* ── PREREQUISITE MATERIALS (concept-graph injected) ── */}
          {implicitMaterials.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--lmg-text-primary)] flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Prerequisite Materials
                </h2>
                <span className="text-xs text-blue-500 dark:text-blue-400/70 font-medium">essential foundations you&apos;re missing — master these first</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {implicitMaterials.map((m) => (
                  <MaterialCard key={m._id} material={m} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}
          <QuickActions
            onMasteryGenerateClick={handleGenerateFromMastery}
            masteryGenerating={masteryGenerating}
          />
          <ConceptCoverage coverage={conceptCoverage} />
          <ModuleProgressList progress={materialProgress} />
          <ScoreHistory history={profileHistory} />
          <StrengthsList strengths={profile?.strengths || []} />
        </div>
      </div>
    </div>
  );
}

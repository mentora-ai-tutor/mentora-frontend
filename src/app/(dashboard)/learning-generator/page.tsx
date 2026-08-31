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
        <div className="relative bg-[#1e293b]/90 backdrop-blur-xl rounded-3xl p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-2 shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                <Sparkles className="w-3 h-3" /> AI-Powered Learning
              </div>
              <h1 className="text-xl lg:text-2xl font-black text-white mb-1">
                Material Generator
              </h1>
              <p className="text-white/50 text-sm lg:text-base max-w-xl">
                Personalized tutorials, exercises, and assessments generated by AI based on your unique knowledge gaps and learning patterns.
              </p>
            </div>

            <div className="flex gap-2.5 shrink-0">
              <div className="bg-[#0F172A] border border-white/10 rounded-xl p-3.5 text-center min-w-[90px]">
                <p className="text-xl font-black text-teal-400">{totalGaps}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Gaps Found</p>
              </div>
              {fundamentalGaps > 0 && (
                <div className="bg-[#0F172A] border border-red-500/20 rounded-xl p-3.5 text-center min-w-[90px]">
                  <p className="text-xl font-black text-red-400">{fundamentalGaps}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Critical</p>
                </div>
              )}
              <div className="bg-[#0F172A] border border-white/10 rounded-xl p-3.5 text-center min-w-[90px]">
                <p className="text-xl font-black text-amber-400">{materials.length}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Materials</p>
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
              <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">No knowledge gaps detected in your saved profile yet. Generate materials from your real Knowledge Assist gaps to start your personalized journey.</p>
              <button
                onClick={handleGenerateFromMastery}
                disabled={masteryGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] disabled:cursor-wait disabled:opacity-60"
              >
                {masteryGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Generate from Mastery
              </button>
            </div>
          )}

          {/* ── PREREQUISITE MATERIALS (concept-graph injected) ── */}
          {implicitMaterials.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-400" /> Prerequisite Materials
                </h2>
                <span className="text-xs text-blue-400/70">essential foundations you&apos;re missing — master these first</span>
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

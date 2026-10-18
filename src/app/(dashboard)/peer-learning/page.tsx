'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Sparkles, ListChecks, ArrowRight, Award, FolderKanban } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { peerLearningApi, type StudentAnalysisDocument, type QuizSummaryResponse } from '@/lib/api/peerLearning';
import { knowledgeProfileApi, type CanonicalMasteryProfile } from '@/lib/api/knowledgeProfile';
import type { PeerSessionData } from '@/components/peer-learning/PeerMatchSection';
import StudentProfileCard from '@/components/peer-learning/StudentProfileCard';
import AgentWorkflow from '@/components/peer-learning/AgentWorkflow';
import PeerMatchSection from '@/components/peer-learning/PeerMatchSection';
import AiAssistantSection from '@/components/peer-learning/AiAssistantSection';

export default function PeerLearningHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<StudentAnalysisDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState<QuizSummaryResponse | null>(null);

  const studentId = user?.student_id || user?._id || '';

  useEffect(() => {
    if (!studentId) return;
    try {
      const raw = localStorage.getItem(`quizResult:${studentId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.score_percentage === 'number') {
          setQuizResult(parsed as QuizSummaryResponse);
        }
      }
    } catch {
      // ignore malformed stored value
    }
  }, [studentId]);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    // Map the Knowledge Assist profile to the shape Peer Learning's import endpoint accepts
    const toImportPayload = (kaa: CanonicalMasteryProfile) => {
      const mp = kaa.mastery_profile;
      const patterns = (p?: Record<string, string[]>) => ({
        github: p?.github ?? [],
        sandbox: p?.sandbox ?? [],
        quizzes: p?.quizzes ?? [],
      });
      const knowledge_gaps = (mp.knowledge_gaps ?? []).map((g) => {
        const si = g.suggested_intervention;
        return {
          topic: g.topic,
          topic_id: g.topic_id,
          gap_type: g.gap_type,
          confidence: g.confidence,
          mastery_score: Math.round(g.mastery_score ?? 0),
          weak_subskills: g.weak_subskills ?? [],
          known_subskills: g.known_subskills ?? [],
          misconceptions: g.misconceptions ?? [],
          observed_error_patterns: patterns(g.observed_error_patterns),
          evidence_summary: g.evidence_summary,
          ...(si && si.primary && si.difficulty_level && si.estimated_time_minutes != null
            ? {
                suggested_intervention: {
                  primary: si.primary,
                  secondary: si.secondary ?? [],
                  difficulty_level: si.difficulty_level,
                  estimated_time_minutes: Math.round(si.estimated_time_minutes),
                  learning_objectives: si.learning_objectives ?? [],
                },
              }
            : {}),
        };
      });
      const strengths = (mp.strengths ?? []).map((st) => ({
        topic: st.topic,
        topic_id: st.topic_id,
        confidence: st.confidence,
        mastery_score: Math.round(st.mastery_score ?? 0),
        mastery_level: st.mastery_level,
        can_teach_others: !!st.can_teach_others,
      }));
      return {
        schema_version: kaa.schema_version,
        student_id: studentId,
        analysis_timestamp: kaa.analysis_timestamp,
        data_sources: {
          github: kaa.data_sources?.github ?? 'unavailable',
          sandbox: kaa.data_sources?.sandbox ?? 'unavailable',
          quizzes: kaa.data_sources?.quizzes ?? 'unavailable',
        },
        mastery_profile: {
          overall_mastery_score: Math.round(mp.overall_mastery_score ?? 0),
          knowledge_gaps,
          strengths,
        },
        recommendations: {
          priority_order: kaa.recommendations?.priority_order ?? [],
          general_advice: kaa.recommendations?.general_advice,
          for_instructor: kaa.recommendations?.for_instructor,
        },
        gap_topic_ids: kaa.gap_topic_ids ?? knowledge_gaps.map((g) => g.topic_id),
      };
    };

    const fetchAnalysis = async () => {
      try {
        // Primary: latest Knowledge Assist profile, imported into Peer Learning's own store
        try {
          const kaa = await knowledgeProfileApi.getLatestMasteryProfile(studentId);
          if (kaa?.mastery_profile?.knowledge_gaps?.length) {
            const imported = await peerLearningApi.importAnalysis(toImportPayload(kaa));
            if (imported.success && imported.data?.imported_document) {
              setAnalysis(imported.data.imported_document);
              return;
            }
          }
        } catch (err) {
          console.error('Knowledge Assist profile unavailable, using stored analysis', err);
        }

        // Fallback: whatever Peer Learning already has stored
        const res = await peerLearningApi.getStudentAnalysis(studentId);
        if (res.success && res.data?.analysis) {
          setAnalysis(res.data.analysis);
        }
      } catch (err) {
        console.error('Failed to load peer learning analysis', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [studentId]);

  const handleStartSession = useCallback(
    (data: PeerSessionData) => {
      const params = new URLSearchParams({
        roomId: data.roomId,
        peerId: data.peerId,
        peerName: data.peerName,
        topic: data.topic,
        knowledgeGap: data.knowledgeGap,
        weakSubskill: data.weakSubskill,
        ai: data.isAiSession ? '1' : '0',
      });
      router.push(`/peer-learning/pair-session?${params.toString()}`);
    },
    [router],
  );

  const currentStage = analysis ? (analysis.mastery_profile.knowledge_gaps.length > 0 ? 1 : 0) : 0;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-teal-700 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-2">
              Collaborative Peer Learning
              <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Our system analyzes your learning profile and finds the most suitable peer who can help with
          your current knowledge gap. Learn together through collaborative coding and guided discussions.
        </p>
      </div>

      {/* Student Profile */}
      <StudentProfileCard analysis={analysis} loading={loading} user={user} />

      {/* Two-column layout: Workflow + Peer Matching */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] gap-6">
        {/* Agent Workflow */}
        <div className="rounded-2xl border border-border bg-card/55 p-6">
          <AgentWorkflow currentStage={currentStage} />
        </div>

        {/* Right column: Peer Matching + AI Assistant */}
        <div className="space-y-4">
          {/* Peer Matching */}
          {analysis ? (
            <PeerMatchSection analysis={analysis} onStartSession={handleStartSession} />
          ) : !loading ? (
            <PeerMatchSection
              analysis={{
                _id: '',
                schema_version: '',
                student_id: studentId,
                analysis_timestamp: '',
                data_sources: { github: 'unavailable', sandbox: 'unavailable', quizzes: 'unavailable' },
                mastery_profile: {
                  overall_mastery_score: 0,
                  knowledge_gaps: [],
                  strengths: [],
                },
                recommendations: { priority_order: [] },
                overall_mastery_score: 0,
                knowledge_gaps: [],
                strengths: [],
                gap_topic_ids: [],
                created_at: '',
                updated_at: '',
                saved_at: '',
              }}
              onStartSession={handleStartSession}
            />
          ) : null}

          {/* AI Assistant Teacher */}
          <AiAssistantSection analysis={analysis} user={user} onStartSession={handleStartSession} />
        </div>
      </div>

      {/* Project Workspaces */}
      <button
        type="button"
        onClick={() => router.push('/peer-learning/workspaces')}
        className="w-full group flex items-center justify-between gap-4 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-card/80 to-teal-500/[0.04] p-5 text-left transition-all hover:border-teal-500/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-teal-700 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Project Workspaces</h3>
            <p className="text-sm text-muted-foreground">
              Code together in real time, chat, assign tasks, and get AI help in shared group project rooms.
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-teal-700 dark:text-teal-400 group-hover:translate-x-1 transition-transform shrink-0" />
      </button>

      {/* Individual Verification Quiz */}
      <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-card/80 to-teal-500/[0.04] p-6 transition-all hover:border-teal-500/40">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">Verify Your Mastery</h3>
              <p className="text-sm text-muted-foreground">
                Take a 7-question code-based quiz targeting your knowledge gap, receive instant feedback, and get your mastery score.
              </p>
            </div>
          </div>
          {quizResult && (
            <div className="flex items-center gap-3 rounded-xl bg-background border border-amber-500/20 px-4 py-3">
              <Award className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              <div>
                <p className="text-[10px] text-subtle-foreground uppercase tracking-wider font-bold">Last Mastery Score</p>
                <p className="text-xl font-black text-amber-700 dark:text-amber-400">{quizResult.score_percentage}%</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right">
                <p className="text-[10px] text-subtle-foreground uppercase tracking-wider font-bold">Correct</p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{quizResult.correct_answers}/{quizResult.total_questions}</p>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => router.push('/peer-learning/quiz')}
          className="mt-4 w-full group flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-xl transition-all"
        >
          {quizResult ? 'Retake Verification Quiz' : 'Start Verification Quiz'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
}

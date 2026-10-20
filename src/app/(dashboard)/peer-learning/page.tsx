'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Sparkles,
  BookOpen,
  CircleHelp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { peerLearningApi, type StudentAnalysisDocument } from '@/lib/api/peerLearning';
import { knowledgeProfileApi, type CanonicalMasteryProfile } from '@/lib/api/knowledgeProfile';
import type { PeerSessionData } from '@/components/peer-learning/PeerMatchSection';
import StudentProfileCard from '@/components/peer-learning/StudentProfileCard';
import PeerMatchSection from '@/components/peer-learning/PeerMatchSection';
import AiAssistantSection from '@/components/peer-learning/AiAssistantSection';

const masteryScoresStorageKey = (studentId: string) => `masteryScores:${studentId}`;
const verifiedTopicsStorageKey = (studentId: string) => `masteryVerifiedTopics:${studentId}`;

export default function PeerLearningHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<StudentAnalysisDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationScores, setVerificationScores] = useState<Record<string, number>>({});
  const [verifiedTopicIds, setVerifiedTopicIds] = useState<string[]>([]);

  const studentId = user?.student_id || user?._id || '';

  useEffect(() => {
    if (!studentId) return;

    try {
      const storedScores = localStorage.getItem(masteryScoresStorageKey(studentId));
      if (storedScores) {
        const parsedScores: unknown = JSON.parse(storedScores);
        if (parsedScores && typeof parsedScores === 'object' && !Array.isArray(parsedScores)) {
          setVerificationScores(
            Object.fromEntries(
              Object.entries(parsedScores).filter(
                (entry): entry is [string, number] =>
                  typeof entry[1] === 'number' && Number.isFinite(entry[1]),
              ),
            ),
          );
        }
      }
    } catch (error) {
      console.error('Failed to load saved mastery scores', error);
    }

    try {
      const rawVerifiedTopics = localStorage.getItem(verifiedTopicsStorageKey(studentId));
      if (rawVerifiedTopics) {
        const parsedTopics: unknown = JSON.parse(rawVerifiedTopics);
        if (Array.isArray(parsedTopics)) {
          setVerifiedTopicIds(parsedTopics.filter((topicId): topicId is string => typeof topicId === 'string'));
        }
      }
    } catch (error) {
      console.error('Failed to load verified mastery topics', error);
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
      if (data.topicId) params.set('topicId', data.topicId);
      params.set('baselineScore', String(data.baselineScore));
      router.push(`/peer-learning/pair-session?${params.toString()}`);
    },
    [router],
  );

  const knowledgeGaps = analysis?.mastery_profile.knowledge_gaps ?? [];
  const firstUnmasteredGapIndex = knowledgeGaps.findIndex(
    (gap) =>
      !verifiedTopicIds.includes(gap.topic_id) &&
      (verificationScores[gap.topic_id] ?? gap.mastery_score) <= gap.mastery_score,
  );
  const activeGapIndex = firstUnmasteredGapIndex === -1 ? null : firstUnmasteredGapIndex;
  const activeGap = activeGapIndex === null ? null : knowledgeGaps[activeGapIndex];
  const activeGapAnalysis =
    analysis && activeGap
      ? {
          ...analysis,
          mastery_profile: {
            ...analysis.mastery_profile,
            knowledge_gaps: [activeGap],
          },
          knowledge_gaps: [activeGap],
          gap_topic_ids: [activeGap.topic_id],
        }
      : null;

  const completedGaps = activeGapIndex ?? knowledgeGaps.length;
  const journeyProgress = knowledgeGaps.length
    ? Math.round((completedGaps / knowledgeGaps.length) * 100)
    : 100;

  return (
    <div className="relative isolate space-y-6 overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_76%_2%,rgba(16,185,129,0.12),transparent_42%)] p-1 animate-slide-up">
      {/* Header */}
      <div className="relative">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10">
            <Users className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-foreground md:text-3xl">
              Collaborative Peer Learning
              <Sparkles className="h-5 w-5 text-amber-500" />
            </h1>
          </div>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Strengthen one knowledge gap at a time through collaborative peer learning. Complete each gap with verified
          improvement to unlock the next step in your learning journey.
        </p>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <StudentProfileCard
          analysis={analysis}
          loading={loading}
          user={user}
          activeGapIndex={activeGapIndex}
          verificationScores={verificationScores}
          verifiedTopicIds={verifiedTopicIds}
          completedGaps={completedGaps}
          journeyProgress={journeyProgress}
          gapActions={
            activeGapAnalysis && activeGap ? (
              <div className="grid gap-2">
                <PeerMatchSection analysis={activeGapAnalysis} onStartSession={handleStartSession} />
                <AiAssistantSection
                  analysis={activeGapAnalysis}
                  user={user}
                  onStartSession={handleStartSession}
                />
              </div>
            ) : null
          }
        />

        <aside className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm xl:sticky xl:top-6">
          <div className="mb-5 flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-extrabold text-foreground">Your learning flow</h2>
          </div>

          <ol className="space-y-0">
            {[
              {
                title: 'Find a suitable peer',
                description: 'We’ll match you with a peer who is also working on this knowledge gap.',
              },
              {
                title: 'Learn together',
                description: 'Collaborate through coding and guided discussions.',
              },
              {
                title: 'Verify independently',
                description: 'Complete a short assessment to confirm your improvement.',
              },
              {
                title: 'Unlock the next gap',
                description: 'Move to the next knowledge gap in your learning journey.',
              },
            ].map((step, index) => {
              const isCurrent = index === 0 && activeGap !== null;
              return (
                <li key={step.title} className="relative flex gap-3 pb-5 last:pb-0">
                  {index < 3 && (
                    <span className="absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-px bg-border" />
                  )}
                  <span
                    className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-border bg-background text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <h3 className={`text-sm font-bold ${isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <CircleHelp className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-bold text-foreground">No peer available?</p>
            </div>
            <p className="mt-2 pl-6 text-xs leading-relaxed text-muted-foreground">
              Connect with the AI Assistant Teacher whenever a suitable peer cannot be found.
            </p>
          </div>
        </aside>
      </div>

      {analysis && knowledgeGaps.length > 0 && (
        <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/70 px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />
            Strengths
          </div>
          {analysis.mastery_profile.strengths.length > 0 ? (
            analysis.mastery_profile.strengths.map((strength) => (
              <span
                key={strength.topic_id}
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
              >
                {strength.topic} ({strength.mastery_score}%)
              </span>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">Your strengths will appear here as your profile grows.</p>
          )}
        </section>
      )}

    </div>
  );
}

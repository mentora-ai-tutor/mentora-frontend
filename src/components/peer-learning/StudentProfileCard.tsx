'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, Check, CheckCircle2, Code2, Lock, Shield, User } from 'lucide-react';
import type { StudentAnalysisDocument } from '@/lib/api/peerLearning';
import type { User as AuthUser } from '@/lib/api/auth';

interface StudentProfileCardProps {
  analysis: StudentAnalysisDocument | null;
  loading: boolean;
  user?: AuthUser | null;
  activeGapIndex: number | null;
  verificationScores: Record<string, number>;
  verifiedTopicIds: string[];
  completedGaps: number;
  journeyProgress: number;
  gapActions?: ReactNode;
}

function ScoreBar({ value, color = 'bg-emerald-500' }: { value: number; color?: string }) {
  const score = Math.max(0, Math.min(100, value));

  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-label="Mastery score"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full ${color} transition-[width] duration-500`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function StudentProfileCard({
  analysis,
  loading,
  user,
  activeGapIndex,
  verificationScores,
  verifiedTopicIds,
  completedGaps,
  journeyProgress,
  gapActions,
}: StudentProfileCardProps) {
  const studentName = user?.name || 'Student';
  const initials = studentName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0].toUpperCase())
    .join('');

  if (loading) {
    return (
      <section className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
        <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          Loading your learning profile...
        </div>
      </section>
    );
  }

  if (!analysis) {
    return (
      <section className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
            {initials || <User className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-foreground">Student Learning Profile</h2>
            <p className="text-xs text-muted-foreground">{studentName}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-foreground">Your learning profile is not ready yet</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Complete a diagnostic quiz or import your learning data to identify your knowledge gaps.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const knowledgeGaps = analysis.mastery_profile.knowledge_gaps;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm">
      <header className="p-5 pb-4 sm:p-6 sm:pb-4">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
            {initials || <User className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-foreground">Student Learning Profile</h2>
            <p className="truncate text-xs text-muted-foreground">{studentName}</p>
          </div>
          <span className="ml-auto hidden rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground sm:inline-flex">
            {analysis.student_id}
          </span>
        </div>

        <div className="rounded-xl border border-border bg-background/70 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-foreground">Learning Journey Progress</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {knowledgeGaps.length
                  ? completedGaps >= knowledgeGaps.length
                    ? 'All gaps completed'
                    : `Gap ${completedGaps + 1} of ${knowledgeGaps.length}`
                  : 'No open knowledge gaps'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {completedGaps} of {knowledgeGaps.length} completed
              </p>
              <p className="mt-1 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{journeyProgress}%</p>
            </div>
          </div>
          <ScoreBar value={journeyProgress} />
        </div>
      </header>

      {knowledgeGaps.length ? (
        <div className="grid gap-3 px-5 pb-5 sm:px-6 sm:pb-6 md:grid-cols-2">
          {knowledgeGaps.map((gap, gapIdx) => {
            const savedScore = verificationScores[gap.topic_id];
            const isMastered =
              verifiedTopicIds.includes(gap.topic_id) ||
              (typeof savedScore === 'number' && savedScore > gap.mastery_score);
            const isCurrent = activeGapIndex === gapIdx;
            const isLocked = activeGapIndex !== null && gapIdx > activeGapIndex;
            const masteryScore = Math.round(Math.max(gap.mastery_score, savedScore ?? gap.mastery_score));
            const confidence = Math.round(gap.confidence * 100);
            const weakSubskills = gap.weak_subskills ?? [];
            const misconceptions = gap.misconceptions ?? [];

            return (
              <article
                key={gap.topic_id || gapIdx}
                aria-current={isCurrent ? 'step' : undefined}
                aria-disabled={isLocked}
                className={`min-w-0 overflow-hidden rounded-2xl border transition-colors ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-500/[0.04] shadow-[0_0_0_1px_rgba(16,185,129,0.12)] md:col-span-2'
                    : isMastered
                      ? 'border-border bg-background/70 md:col-span-2'
                      : 'border-border bg-background/50'
                } ${isLocked ? 'opacity-65' : ''}`}
              >
                <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        isCurrent || isMastered
                          ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-border bg-muted text-muted-foreground'
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="h-5 w-5" />
                      ) : isMastered ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Code2 className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-extrabold text-foreground">{gap.topic}</h3>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            isCurrent
                              ? 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                              : isMastered
                                ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                : 'border-border bg-muted text-muted-foreground'
                          }`}
                        >
                          {isCurrent ? 'Active · Current focus' : isMastered ? 'Completed' : 'Locked'}
                        </span>
                      </div>

                      {!isLocked && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div>
                            <div className="mb-1.5 flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">Current Mastery</span>
                              <span className="font-bold text-foreground">{masteryScore}%</span>
                            </div>
                            <ScoreBar value={masteryScore} />
                          </div>
                          <div>
                            <div className="mb-1.5 flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">Your Confidence</span>
                              <span className="font-bold text-foreground">{confidence}%</span>
                            </div>
                            <ScoreBar value={confidence} color="bg-sky-500" />
                          </div>
                        </div>
                      )}

                      {isCurrent && (weakSubskills.length > 0 || misconceptions.length > 0) && (
                        <div className="mt-3 space-y-2">
                          {weakSubskills.length > 0 && (
                            <div>
                              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Weak Subskills
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {weakSubskills.map((item, index) => (
                                  <span
                                    key={`${item.subskill}-${index}`}
                                    className="rounded-full border border-amber-500/25 bg-amber-500/5 px-2.5 py-1 text-[11px] text-foreground"
                                  >
                                    {item.subskill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {misconceptions.length > 0 && (
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                              <span className="font-semibold text-foreground">Common misconception: </span>
                              {misconceptions[0]}
                            </p>
                          )}
                        </div>
                      )}

                      {isLocked && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          Complete the previous gap to unlock
                        </p>
                      )}
                      {isMastered && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified improvement · Peer session
                        </p>
                      )}
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="border-t border-emerald-500/15 pt-4 lg:w-[260px] lg:shrink-0 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Saved baseline: {Math.round(gap.mastery_score)}%
                      </div>
                      {gapActions}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:mx-6 sm:mb-6">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-foreground">No knowledge gaps detected</p>
            <p className="mt-1 text-xs text-muted-foreground">You’re all caught up. Great work!</p>
          </div>
        </div>
      )}
    </section>
  );
}

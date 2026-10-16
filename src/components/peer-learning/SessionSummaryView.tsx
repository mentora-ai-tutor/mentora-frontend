'use client';

import { CheckCircle2, XCircle, Target, Lightbulb, ListOrdered } from 'lucide-react';
import type { SessionSummary, TaskProgressEntry, SessionSummaryItem } from '@/lib/api/peerLearning';

interface SessionSummaryViewProps {
  topic: string;
  peerName: string;
  learnerName: string;
  summary: SessionSummary;
  onVerifyMastery: () => void;
}

export default function SessionSummaryView({
  topic,
  peerName,
  learnerName,
  summary,
  onVerifyMastery,
}: SessionSummaryViewProps) {
  const totalTasks = summary.total_tasks ?? summary.task_progress?.length ?? 0;
  const taskProgress = summary.task_progress ?? [];
  const passed = taskProgress.filter((t: TaskProgressEntry) => t.passed).length;
  const results = summary.results ?? [];

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 animate-slide-up">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black text-foreground">Session Completed</h1>
        <p className="text-sm text-muted-foreground">
          The live session has been closed. Here is your {topic} session summary.
        </p>
      </div>

      {/* Progress overview */}
      <div className="rounded-2xl border border-border bg-card/55 p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Session Summary</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-background border border-border p-4 text-center">
            <p className="text-[10px] text-subtle-foreground uppercase mb-1">Tasks</p>
            <p className="text-2xl font-black text-foreground">{totalTasks}</p>
          </div>
          <div className="rounded-xl bg-background border border-border p-4 text-center">
            <p className="text-[10px] text-subtle-foreground uppercase mb-1">Passed</p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{passed}</p>
          </div>
          <div className="rounded-xl bg-background border border-border p-4 text-center">
            <p className="text-[10px] text-subtle-foreground uppercase mb-1">Peer Teacher</p>
            <p className="text-sm font-black text-amber-700 dark:text-amber-400">{peerName}</p>
          </div>
        </div>
        <div className="rounded-xl bg-background border border-border p-3">
          <p className="text-[10px] text-subtle-foreground uppercase mb-1">Learner</p>
          <p className="text-teal-700 dark:text-teal-400 text-sm font-semibold">{learnerName}</p>
        </div>

        {/* Key points */}
        {summary.key_points && summary.key_points.length > 0 && (
          <div className="rounded-xl bg-background border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Key Points</p>
            </div>
            <ul className="space-y-1.5">
              {summary.key_points.map((point, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-700 dark:text-amber-400 mt-0.5">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Verification questions breakdown */}
      <div className="rounded-2xl border border-border bg-card/55 p-5">
        <h3 className="text-sm font-black text-foreground mb-1 flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          Verification Questions Breakdown
        </h3>
        <p className="text-xs text-subtle-foreground mb-4">Review each question, your submitted answer, and the expected solution.</p>

        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((item: SessionSummaryItem, i) => (
              <div key={i} className="rounded-xl bg-background border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0" />
                    )}
                    <p className="text-xs font-bold text-foreground">
                      Task {item.task_number ?? i + 1}
                      <span className="ml-2 text-[10px] text-subtle-foreground uppercase">Grade: {item.grade ?? '—'}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${item.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                    {item.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg bg-muted border border-border p-2">
                    <p className="text-[9px] text-subtle-foreground uppercase mb-0.5">Your Answer</p>
                    <pre className="text-muted-foreground whitespace-pre-wrap font-mono">{item.submitted_code || '—'}</pre>
                  </div>
                  {item.sample_approach && (
                    <div className="rounded-lg bg-muted border border-border p-2">
                      <p className="text-[9px] text-subtle-foreground uppercase mb-0.5">Sample Approach</p>
                      <pre className="text-amber-700 dark:text-amber-300/80 whitespace-pre-wrap font-mono">{item.sample_approach}</pre>
                    </div>
                  )}
                </div>

                {item.feedback && (
                  <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">{item.feedback}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-subtle-foreground text-center py-4">No detailed task results available.</p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card/55 p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Ready to check your understanding? Answer a few short questions to verify your mastery of {topic}.
        </p>
      </div>

      <button
        onClick={onVerifyMastery}
        className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white text-base font-black rounded-2xl transition-all border border-teal-400/20 shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2"
      >
        <Target className="w-5 h-5" />
        Verify Mastery
      </button>
    </div>
  );
}

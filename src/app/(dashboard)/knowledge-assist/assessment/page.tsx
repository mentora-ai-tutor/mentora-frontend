"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  FileQuestion,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import SkillCheckPanel from "@/components/sandbox/SkillCheckPanel";
import {
  ClientQuestion,
  QuestionSetSummary,
  QuestionSetView,
  QuizSource,
  quizApi,
} from "@/lib/api/quiz";

const sourceStyle: Record<QuizSource, string> = {
  generated: "border-teal-500/30 bg-teal-500/10 text-teal-200",
  seed: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  mixed: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
};

const difficultyText: Record<string, string> = {
  easy: "text-emerald-200",
  medium: "text-cyan-200",
  hard: "text-amber-200",
};

function ReadOnlyQuestion({ question }: { question: ClientQuestion }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F172A] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {question.topic}
          {question.type === "predict_output" ? " · predict the output" : ""}
        </p>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${difficultyText[question.difficulty]}`}>
          {question.difficulty}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-white">
        {question.question}
      </p>
      {question.code_snippet && (
        <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-[#050A16] p-3 font-mono text-xs leading-5 text-cyan-50">
          {question.code_snippet}
        </pre>
      )}
      <div className="mt-3 space-y-2">
        {question.options.map((option) => (
          <div
            key={option.id}
            className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left text-sm text-white/70"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-current text-[11px] font-bold">
              {option.id}
            </span>
            <span className="min-w-0 flex-1 break-words font-mono">{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SetView({ view }: { view: QuestionSetView }) {
  return (
    <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-[#0F172A]/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
        <span>
          {view.total_questions} question{view.total_questions === 1 ? "" : "s"} ·{" "}
          {view.topics.length} topic{view.topics.length === 1 ? "" : "s"} covered
        </span>
        {view.status === "completed" && view.results && (
          <span className="inline-flex items-center gap-1 text-teal-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {view.results.score_percent}% · {view.results.correct}/{view.results.total}
          </span>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {view.questions.map((question) => (
          <ReadOnlyQuestion key={question.qid} question={question} />
        ))}
      </div>
    </div>
  );
}

export default function KnowledgeAssistAssessmentPage() {
  const [sets, setSets] = useState<QuestionSetSummary[]>([]);
  const [loadingSets, setLoadingSets] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [openView, setOpenView] = useState<QuestionSetView | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [expandedSet, setExpandedSet] = useState<string | null>(null);

  const loadSets = useCallback(async () => {
    setLoadingSets(true);
    setListError(null);
    try {
      setSets(await quizApi.listSets());
    } catch (error) {
      setListError(
        error instanceof Error ? error.message : "Could not load previous assessments.",
      );
    } finally {
      setLoadingSets(false);
    }
  }, []);

  useEffect(() => {
    loadSets();
  }, [loadSets]);

  const openSet = useCallback(
    async (sessionId: string) => {
      if (openView?.session_id === sessionId) {
        setOpenView(null);
        setExpandedSet(null);
        return;
      }
      setOpeningId(sessionId);
      try {
        const view = await quizApi.getSet(sessionId);
        setOpenView(view);
        setExpandedSet(sessionId);
      } catch (error) {
        setListError(
          error instanceof Error
            ? error.message
            : "Could not open this question set.",
        );
      } finally {
        setOpeningId(null);
      }
    },
    [openView],
  );

  return (
    <div className="space-y-4 pb-4">
      <section className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-400/10 text-teal-200">
            <Brain className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-3xl font-black text-white">Java Skill Check</h1>
            <p className="text-sm text-white/50">
              Comprehensive assessment spanning every concept in the Java syllabus.
            </p>
          </div>
        </div>
      </section>

      <SkillCheckPanel
        mode="assessment"
        maxQuestions={20}
        title="Comprehensive Java skills assessment"
        subtitle="Questions are generated to cover every topic in the course — re-generate anytime for a fresh set. Your generated sets are stored and can be re-opened below."
        onGenerated={loadSets}
      />

      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Database className="h-5 w-5 text-cyan-300" />
            Previous assessments
          </h2>
          <div className="flex items-center gap-2">
            {listError && (
              <p className="max-w-xs truncate text-xs text-red-300">{listError}</p>
            )}
            <button
              type="button"
              onClick={loadSets}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingSets ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <p className="mt-1 text-sm text-white/45">
          Every set you generate is stored in the database — open one to see its
          questions again, or regenerate a fresh set above.
        </p>

        {sets.length === 0 && !loadingSets && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 bg-[#0F172A]/50 p-8 text-center">
            <FileQuestion className="h-7 w-7 text-white/25" />
            <p className="text-sm text-white/45">
              No assessments yet. Click “Start skill check” above to generate your
              first set — it will appear here automatically.
            </p>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {sets.map((set) => {
            const isOpen = expandedSet === set.session_id;
            return (
              <div
                key={set.session_id}
                className="rounded-xl border border-white/10 bg-[#0F172A]"
              >
                <button
                  type="button"
                  onClick={() => openSet(set.session_id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">
                        {new Date(set.created_at).toLocaleString()}
                      </p>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${sourceStyle[set.source]}`}
                      >
                        {set.source}
                      </span>
                      {set.status === "completed" && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> completed
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-white/45">
                      {set.total_questions} questions across {set.covered_count} topic
                      {set.covered_count === 1 ? "" : "s"}
                      {set.status === "completed" && set.score_percent !== null
                        ? ` · score ${set.score_percent}%`
                        : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-white/40">
                    {openingId === set.session_id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    )}
                  </div>
                </button>
                {isOpen && (openView?.session_id === set.session_id ? (
                  <SetView view={openView} />
                ) : (
                  <p className="px-4 pb-4 text-xs text-white/40">Loading questions…</p>
                ))}
              </div>
            );
          })}
        </div>

        {sets.length > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
            <Sparkles className="h-3.5 w-3.5" />
            Answer options are shown as stored. Regenerating creates a brand-new set —
            previous sets stay saved.
          </p>
        )}
      </section>
    </div>
  );
}
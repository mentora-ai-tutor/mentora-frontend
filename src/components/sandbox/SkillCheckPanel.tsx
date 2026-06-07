"use client";

import { useCallback, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle2,
  CircleDashed,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  AnswerResult,
  ClientQuestion,
  OptionId,
  QuizDifficulty,
  QuizMode,
  QuizResults,
  QuizSource,
  quizApi,
} from "@/lib/api/quiz";

const difficultyStyle: Record<QuizDifficulty, string> = {
  easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  medium: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  hard: "border-amber-500/30 bg-amber-500/10 text-amber-200",
};

type Phase = "idle" | "starting" | "question" | "answered" | "completed";

type SkillCheckPanelProps = {
  mode?: QuizMode;
  jobId?: string;
  topics?: string[];
  maxQuestions?: number;
  className?: string;
};

const getMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error";

export default function SkillCheckPanel({
  mode = "sandbox",
  jobId,
  topics,
  maxQuestions,
  className = "",
}: SkillCheckPanelProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<ClientQuestion | null>(null);
  const [pendingNext, setPendingNext] = useState<ClientQuestion | null>(null);
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("easy");
  const [answered, setAnswered] = useState(0);
  const [totalPlanned, setTotalPlanned] = useState(0);
  const [source, setSource] = useState<QuizSource>("generated");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState(0);

  const start = useCallback(async () => {
    setPhase("starting");
    setError(null);
    setResult(null);
    setResults(null);
    setSelected(null);
    try {
      const session = await quizApi.startSession({
        mode,
        job_id: jobId,
        topics,
        max_questions: maxQuestions,
      });
      setSessionId(session.session_id);
      setSource(session.source);
      setTotalPlanned(session.total_planned);
      setAnswered(0);
      setDifficulty(session.difficulty);
      if (!session.question) {
        throw new Error("No questions were returned for this skill check.");
      }
      setQuestion(session.question);
      setQuestionStartedAt(Date.now());
      setPhase("question");
    } catch (err) {
      setError(getMessage(err));
      setPhase("idle");
    }
  }, [mode, jobId, topics, maxQuestions]);

  const submit = useCallback(async () => {
    if (!sessionId || !question || !selected || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const elapsed = (Date.now() - questionStartedAt) / 1000;
      const response = await quizApi.submitAnswer(sessionId, question.qid, selected, elapsed);
      setResult(response.result);
      setAnswered(response.answered);
      setTotalPlanned(response.total_planned);
      setDifficulty(response.difficulty);
      setPendingNext(response.next_question);
      setResults(response.results);
      setPhase("answered");
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [sessionId, question, selected, submitting, questionStartedAt]);

  const advance = useCallback(() => {
    if (pendingNext) {
      setQuestion(pendingNext);
      setPendingNext(null);
      setSelected(null);
      setResult(null);
      setQuestionStartedAt(Date.now());
      setPhase("question");
    } else {
      setPhase("completed");
    }
  }, [pendingNext]);

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-400/10 text-teal-200">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-300">
              Java Skill Check
            </p>
            <h2 className="mt-1 text-lg font-black text-white">
              Do this quiz while your code is being reviewed
            </h2>
            <p className="mt-1 max-w-xl text-sm text-white/55">
              Adaptive questions that start simple and get harder as you answer correctly.
            </p>
          </div>
        </div>

        {phase !== "idle" && (
          <div className="flex items-center gap-2">
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase ${difficultyStyle[difficulty]}`}
            >
              {difficulty}
            </span>
            <span className="rounded-lg border border-white/10 bg-[#0F172A] px-2.5 py-1 text-xs text-white/55">
              {Math.min(answered + (phase === "question" ? 1 : 0), totalPlanned)} / {totalPlanned}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
          <span>{error}</span>
        </div>
      )}

      {/* ── IDLE ── */}
      {phase === "idle" && (
        <button
          type="button"
          onClick={start}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-3 text-sm font-bold text-[#061016] transition-all hover:shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" />
          Start skill check
        </button>
      )}

      {/* ── STARTING ── */}
      {phase === "starting" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0F172A] p-4 text-sm text-white/55">
          <CircleDashed className="h-4 w-4 animate-spin text-teal-300" />
          Generating your Java questions...
        </div>
      )}

      {/* ── QUESTION / ANSWERED ── */}
      {(phase === "question" || phase === "answered") && question && (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-white/10 bg-[#0F172A] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                {question.topic}
                {question.type === "predict_output" ? " · predict the output" : ""}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                {source === "seed" ? "Offline practice set" : (
                  <>
                    <Sparkles className="h-3 w-3 text-teal-300" />
                    Mentora AI
                  </>
                )}
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
          </div>

          <div className="space-y-2">
            {question.options.map((option) => {
              const isSelected = selected === option.id;
              const showAnswers = phase === "answered" && result;
              const isCorrect = showAnswers && result.correct_option_id === option.id;
              const isChosenWrong =
                showAnswers && isSelected && !result.correct;

              let optionClass =
                "border-white/10 bg-[#0F172A] text-white/75 hover:border-white/20 hover:bg-white/[0.04]";
              if (showAnswers) {
                if (isCorrect) {
                  optionClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
                } else if (isChosenWrong) {
                  optionClass = "border-red-500/40 bg-red-500/10 text-red-100";
                } else {
                  optionClass = "border-white/10 bg-[#0F172A] text-white/40";
                }
              } else if (isSelected) {
                optionClass =
                  "border-teal-500/50 bg-teal-500/10 text-teal-50 shadow-[0_0_12px_rgba(13,148,136,0.1)]";
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={phase === "answered"}
                  onClick={() => phase === "question" && setSelected(option.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-all disabled:cursor-default ${optionClass}`}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-current text-[11px] font-bold">
                    {option.id}
                  </span>
                  <span className="min-w-0 flex-1 break-words font-mono">{option.text}</span>
                  {showAnswers && isCorrect && (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  )}
                  {isChosenWrong && (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                  )}
                </button>
              );
            })}
          </div>

          {phase === "answered" && result && (
            <div
              className={`rounded-xl border p-3 text-sm ${
                result.correct
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-100"
              }`}
            >
              <p className="flex items-center gap-2 font-semibold">
                {result.correct ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {result.correct ? "Correct" : "Not quite"}
              </p>
              <p className="mt-1 leading-6 text-white/75">{result.explanation}</p>
            </div>
          )}

          <div className="flex justify-end">
            {phase === "question" ? (
              <button
                type="button"
                onClick={submit}
                disabled={!selected || submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 px-5 py-2.5 text-sm font-bold text-[#061016] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/10 disabled:text-white/35"
              >
                {submitting ? (
                  <CircleDashed className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Submit answer
              </button>
            ) : (
              <button
                type="button"
                onClick={advance}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold text-cyan-100 transition-colors hover:bg-cyan-400/15 hover:text-white"
              >
                {pendingNext ? "Next question" : "See results"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── COMPLETED ── */}
      {phase === "completed" && results && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/10 p-5 text-center">
            <Trophy className="h-7 w-7 text-amber-300" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-300">
              Skill check complete
            </p>
            <p className="text-4xl font-black text-white">{results.score_percent}%</p>
            <p className="text-sm text-white/60">
              {results.correct} of {results.total} correct
            </p>
          </div>

          {results.quiz_performance.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                By topic
              </p>
              {results.quiz_performance.map((perf) => {
                const pct = perf.total
                  ? Math.round((perf.correct / perf.total) * 100)
                  : 0;
                return (
                  <div
                    key={perf.topic}
                    className="rounded-xl border border-white/10 bg-[#0F172A] p-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-white">{perf.topic}</span>
                      <span className="text-white/55">
                        {perf.correct}/{perf.total}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={start}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            New skill check
          </button>
        </div>
      )}
    </section>
  );
}

"use client";

import {
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Code2,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { aiEngineApi, CodeExecutionResult } from "@/lib/api/aiEngine";
import { ActiveReviewState, useActiveReview } from "@/contexts/ActiveReviewContext";
import { useAuth } from "@/contexts/AuthContext";
import { knowledgeProfileApi } from "@/lib/api/knowledgeProfile";

type SandboxChallenge = {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  prompt: string;
  expectedOutput: string;
  starterCode: string;
  stdin?: string;
};

const SANDBOX_CHALLENGES: SandboxChallenge[] = [
  {
    id: "sum-even",
    title: "Sum even numbers",
    topic: "Loops",
    difficulty: "Warm-up",
    prompt: "Print the sum of all even numbers from 1 to 10.",
    expectedOutput: "30",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int total = 0;

        for (int i = 1; i <= 10; i++) {
            // add only even numbers
        }

        System.out.println(total);
    }
}`,
  },
  {
    id: "reverse-word",
    title: "Reverse a word",
    topic: "Strings",
    difficulty: "Loop practice",
    prompt: "Read one word from input and print it in reverse order.",
    expectedOutput: "arotnem",
    stdin: "mentora",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String word = scanner.next();
        String reversed = "";

        for (int i = word.length() - 1; i >= 0; i--) {
            // build the reversed string
        }

        System.out.println(reversed);
    }
}`,
  },
  {
    id: "max-array",
    title: "Find max value",
    topic: "Arrays",
    difficulty: "Array practice",
    prompt: "Print the largest number in the array.",
    expectedOutput: "42",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] values = { 12, 7, 42, 19, 3 };
        int max = values[0];

        for (int i = 1; i < values.length; i++) {
            // update max when needed
        }

        System.out.println(max);
    }
}`,
  },
];

const normalizeOutput = (value: string | null) =>
  (value ?? "").replace(/\r\n/g, "\n").trim();

const getRunStatus = (
  result: CodeExecutionResult | null,
  expectedOutput: string,
) => {
  if (!result) return null;
  if (!result.success) return "failed";
  return normalizeOutput(result.output) === normalizeOutput(expectedOutput)
    ? "passed"
    : "mismatch";
};

const noReviewSources = new Set(["github-dialog", "github-required"]);

type SandboxBlockedEvent =
  | ClipboardEvent<HTMLElement>
  | DragEvent<HTMLElement>
  | MouseEvent<HTMLElement>;

const blockSandboxClipboard = (event: SandboxBlockedEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const blockSandboxClipboardShortcuts = (event: KeyboardEvent<HTMLElement>) => {
  const key = event.key.toLowerCase();
  const clipboardShortcut =
    ((event.metaKey || event.ctrlKey) && ["c", "v", "x"].includes(key)) ||
    (event.shiftKey && event.key === "Insert") ||
    (event.ctrlKey && event.key === "Insert");

  if (!clipboardShortcut) return;

  event.preventDefault();
  event.stopPropagation();
};

export default function KnowledgeAssistSandboxPage() {
  const searchParams = useSearchParams();
  const reviewJobId = searchParams.get("reviewJobId");
  const source = searchParams.get("source");
  const { user } = useAuth();
  const {
    activeReview,
    clearActiveReview,
    forensicsHref,
    refreshActiveReview,
  } = useActiveReview();
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [code, setCode] = useState(SANDBOX_CHALLENGES[0].starterCode);
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const challenge = SANDBOX_CHALLENGES[challengeIndex];
  const runStatus = getRunStatus(result, challenge.expectedOutput);
  const suppressReviewBanner = source ? noReviewSources.has(source) : false;
  const reviewForThisSandboxVisit = suppressReviewBanner
    ? null
    : reviewJobId
      ? activeReview?.jobId === reviewJobId ? activeReview : null
      : user?.github?.linked
        ? activeReview
        : null;

  useEffect(() => {
    if (!suppressReviewBanner) return;
    clearActiveReview();
  }, [clearActiveReview, suppressReviewBanner]);

  useEffect(() => {
    if (!reviewJobId) return;
    void refreshActiveReview(reviewJobId);
  }, [reviewJobId, refreshActiveReview]);

  const selectChallenge = (nextIndex: number) => {
    const next = SANDBOX_CHALLENGES[nextIndex];
    setChallengeIndex(nextIndex);
    setCode(next.starterCode);
    setResult(null);
    setAttempts(0);
    setError(null);
  };

  const runCode = async () => {
    if (running || !code.trim()) return;

    const startedAt = Date.now();
    setRunning(true);
    setError(null);

    try {
      const response = await aiEngineApi.executeCode(
        code,
        `github-fallback:${challenge.id}`,
        challenge.stdin,
      );

      if (!response.data) {
        throw new Error("Sandbox returned an empty response");
      }

      setResult(response.data);
      setAttempts((current) => current + 1);

      const passed =
        response.data.success &&
        normalizeOutput(response.data.output) === normalizeOutput(challenge.expectedOutput);

      try {
        await knowledgeProfileApi.saveSandboxAttempt({
          challenge_id: challenge.id,
          title: challenge.title,
          topic: challenge.topic,
          difficulty: challenge.difficulty,
          code,
          stdin: challenge.stdin,
          expected_output: challenge.expectedOutput,
          output: response.data.output,
          error: response.data.error,
          success: response.data.success,
          passed,
          attempt_number: attempts + 1,
          runtime_ms: Date.now() - startedAt,
          review_job_id: reviewJobId ?? activeReview?.jobId,
        });
      } catch {
        // Execution feedback should remain visible even if profile evidence sync is unavailable.
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sandbox backend is unavailable. Start Docker again and retry.",
      );
    } finally {
      setRunning(false);
    }
  };

  const retry = () => {
    setResult(null);
    setError(null);
  };

  const resetCode = () => {
    setCode(challenge.starterCode);
    setResult(null);
    setError(null);
  };

  return (
    <div
      className="space-y-4 pb-4"
      onCopyCapture={blockSandboxClipboard}
      onCutCapture={blockSandboxClipboard}
      onPasteCapture={blockSandboxClipboard}
      onDropCapture={blockSandboxClipboard}
      onDragOverCapture={blockSandboxClipboard}
      onContextMenuCapture={blockSandboxClipboard}
      onKeyDownCapture={blockSandboxClipboardShortcuts}
    >
      {reviewForThisSandboxVisit && (
        <ReviewProgressBanner
          review={reviewForThisSandboxVisit}
          forensicsHref={forensicsHref(reviewForThisSandboxVisit.jobId)}
        />
      )}

      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Sandbox Practice
            </p>
            <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">
              Coding questions without GitHub
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-white/55">
              Solve Java prompts, run your code, compare the output, and retry until the answer is correct.
            </p>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Attempts
            </p>
            <p className="mt-1 text-2xl font-black text-white">{attempts}</p>
          </div>
        </div>
      </section>

      {error && (
        <section className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-100">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            <span>{error}</span>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Code2 className="h-4 w-4 text-cyan-300" />
            Questions
          </h2>

          <div className="mt-3 space-y-2">
            {SANDBOX_CHALLENGES.map((item, index) => {
              const active = index === challengeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectChallenge(index)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    active
                      ? "border-teal-500/40 bg-teal-500/10 text-teal-100"
                      : "border-white/10 bg-[#0F172A] text-white/65 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="block text-sm font-semibold text-white">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-white/40">
                    {item.difficulty}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-4">
          <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                  Current question
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  {challenge.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-white/65">
                  {challenge.prompt}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Expected output
                </p>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-cyan-200">
                  {challenge.expectedOutput}
                </pre>
              </div>
            </div>

            {challenge.stdin && (
              <div className="mt-3 rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Input
                </p>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-white/75">
                  {challenge.stdin}
                </pre>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Terminal className="h-4 w-4 text-cyan-300" />
                Main.java
              </h2>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-cyan-200 sm:inline-flex">
                  Typing only
                </span>
                <button
                  type="button"
                  onClick={resetCode}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={runCode}
                  disabled={running || !code.trim()}
                  className="inline-flex items-center gap-2 rounded-lg border border-teal-400/30 bg-teal-400 px-4 py-2 text-sm font-bold text-[#08111f] transition-colors hover:bg-teal-300 disabled:cursor-wait disabled:opacity-60"
                >
                  <Play className="h-4 w-4" />
                  {running ? "Running..." : "Run code"}
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onCopy={blockSandboxClipboard}
              onCut={blockSandboxClipboard}
              onPaste={blockSandboxClipboard}
              onDrop={blockSandboxClipboard}
              onDragOver={blockSandboxClipboard}
              onContextMenu={blockSandboxClipboard}
              onKeyDown={blockSandboxClipboardShortcuts}
              aria-label="Java code editor"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-h-[360px] w-full resize-y border-0 bg-[#050A16] p-4 font-mono text-sm leading-6 text-cyan-50 outline-none placeholder:text-white/30"
            />
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-white">Result</h2>

              {runStatus && (
                <span
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                    runStatus === "passed"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                  }`}
                >
                  {runStatus === "passed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {runStatus === "passed"
                    ? "Correct"
                    : result?.success
                      ? "Output mismatch"
                      : "Needs fix"}
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0F172A] p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Output
                </p>
                <pre className="mt-2 min-h-24 whitespace-pre-wrap font-mono text-sm text-white/75">
                  {result?.output ?? "Run your code to see output."}
                </pre>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0F172A] p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Error
                </p>
                <pre className="mt-2 min-h-24 whitespace-pre-wrap font-mono text-sm text-red-200">
                  {result?.error ?? "No error yet."}
                </pre>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/55">
                {runStatus === "passed"
                  ? "Move to another question or keep experimenting with your solution."
                  : "Edit the code and retry until the output matches the expected answer."}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={() =>
                    selectChallenge((challengeIndex + 1) % SANDBOX_CHALLENGES.length)
                  }
                  className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15 hover:text-white"
                >
                  Next question
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function ReviewProgressBanner({
  review,
  forensicsHref,
}: {
  review: ActiveReviewState;
  forensicsHref: string;
}) {
  const reviewed = review.repos.filter((repo) => repo.status === "done").length;
  const failed = review.repos.filter((repo) => repo.status === "error").length;
  const total = review.repos.length;
  const running = review.status === "running";
  const completed = review.status === "done";

  return (
    <section
      className={`sticky top-3 z-30 rounded-2xl border p-4 backdrop-blur-xl ${
        running
          ? "border-cyan-400/30 bg-cyan-950/85 shadow-[0_0_26px_rgba(34,211,238,0.16)]"
          : completed
            ? "border-emerald-400/30 bg-emerald-950/85 shadow-[0_0_22px_rgba(52,211,153,0.12)]"
            : "border-amber-400/30 bg-amber-950/85 shadow-[0_0_22px_rgba(251,191,36,0.12)]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              running
                ? "border-cyan-300/35 bg-cyan-300/10 text-cyan-200"
                : completed
                  ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-200"
                  : "border-amber-300/35 bg-amber-300/10 text-amber-200"
            }`}
          >
            {running ? (
              <CircleDashed className="h-5 w-5 animate-spin" />
            ) : completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
              Repository Forensics
            </p>
            <h2 className="mt-1 text-xl font-black text-white">
              {running
                ? "GitHub review running in Forensics"
                : completed
                  ? "Review completed"
                  : "Review finished with issues"}
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Keep practicing Java while Mentora reviews your repositories.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-3 gap-2 text-center">
            <ReviewCount label="Reviewed" value={reviewed} />
            <ReviewCount label="Failed" value={failed} />
            <ReviewCount label="Total" value={total} />
          </div>
          <Link
            href={forensicsHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15"
          >
            View Forensics results
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReviewCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-xl border border-white/10 bg-[#0F172A]/70 px-3 py-2">
      <p className="text-lg font-black text-white">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
        {label}
      </p>
    </div>
  );
}

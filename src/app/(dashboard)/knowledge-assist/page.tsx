"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Code2,
  GitBranch,
  RefreshCw,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import {
  KnowledgeProfile,
  SandboxAttempt,
  knowledgeProfileApi,
} from "@/lib/api/knowledgeProfile";
import { ReviewJob, ReviewRepoResult } from "@/lib/api/review";

const statusTone = {
  running: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  done: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  partial: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  failed: "border-red-400/30 bg-red-400/10 text-red-200",
  queued: "border-white/10 bg-white/5 text-white/45",
  error: "border-red-400/30 bg-red-400/10 text-red-200",
} as const;

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const formatDateTime = (value?: string) => {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const codePreview = (value?: string) => {
  if (!value) return "No code captured.";
  return value.length > 520 ? `${value.slice(0, 520)}\n...` : value;
};

export default function KnowledgeAssistPage() {
  const [profile, setProfile] = useState<KnowledgeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    setError(null);

    try {
      const next = await knowledgeProfileApi.getMine();
      setProfile(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load the knowledge profile evidence.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1e293b]/55 px-5 py-4 text-white/65">
          <CircleDashed className="h-5 w-5 animate-spin text-cyan-300" />
          Loading knowledge profile...
        </div>
      </div>
    );
  }

  const review = profile?.review_summary;
  const sandbox = profile?.sandbox_summary;

  return (
    <div className="space-y-4 pb-4">
      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              Knowledge Profile
            </p>
            <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">
              Saved learning evidence
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              GitHub review results and Sandbox Java attempts are saved here as
              profile evidence. This is the layer your future AI terminal can read
              to explain progress, weaknesses, and next practice tasks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadProfile("refresh")}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-100 transition-all hover:bg-cyan-400/15 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh profile
          </button>
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

      <section className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <MetricCard
          icon={<GitBranch className="h-4 w-4" />}
          label="Reviewed repos"
          value={String(review?.reviewed ?? 0)}
          helper={`${review?.failed ?? 0} failed`}
          tone="text-emerald-300"
        />
        <MetricCard
          icon={<AlertCircle className="h-4 w-4" />}
          label="Review findings"
          value={String(review?.findings ?? 0)}
          helper={`${review?.high_risk ?? 0} high risk`}
          tone="text-amber-300"
        />
        <MetricCard
          icon={<TerminalSquare className="h-4 w-4" />}
          label="Sandbox attempts"
          value={String(sandbox?.total_attempts ?? 0)}
          helper={`${sandbox?.recent_passed ?? 0} recent passed`}
          tone="text-cyan-300"
        />
        <MetricCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Recent pass rate"
          value={formatPercent(sandbox?.recent_pass_rate ?? 0)}
          helper="latest 20 attempts"
          tone="text-teal-300"
        />
      </section>

      {review?.latest_java_level && (
        <section className="rounded-2xl border border-teal-400/25 bg-teal-400/10 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 h-5 w-5 text-teal-200" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-200">
                Latest Java signal
              </p>
              <h2 className="mt-1 text-xl font-black text-white">
                {review.latest_java_level}
              </h2>
              {review.latest_evidence && (
                <p className="mt-1 text-sm leading-6 text-white/65">
                  {review.latest_evidence}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {!profile || ((review?.jobs ?? 0) === 0 && (sandbox?.total_attempts ?? 0) === 0) ? (
        <EmptyProfileState />
      ) : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <GitBranch className="h-4 w-4 text-cyan-300" />
                Repository review evidence
              </h2>
              <div className="mt-3 space-y-3">
                {profile.latest_reviews.length === 0 ? (
                  <p className="rounded-xl border border-white/10 bg-[#0F172A] p-4 text-sm text-white/50">
                    No GitHub reviews are saved yet.
                  </p>
                ) : (
                  profile.latest_reviews.map((job) => (
                    <ReviewEvidence key={job.job_id} job={job} />
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <Code2 className="h-4 w-4 text-cyan-300" />
                Sandbox code evidence
              </h2>
              <div className="mt-3 space-y-3">
                {profile.latest_sandbox_attempts.length === 0 ? (
                  <p className="rounded-xl border border-white/10 bg-[#0F172A] p-4 text-sm text-white/50">
                    No Sandbox attempts are saved yet.
                  </p>
                ) : (
                  profile.latest_sandbox_attempts.map((attempt) => (
                    <SandboxEvidence key={attempt.attempt_id} attempt={attempt} />
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
              <h2 className="text-lg font-bold text-white">Knowledge topics</h2>
              <div className="mt-3 space-y-2">
                {sandbox?.topics.length ? (
                  sandbox.topics.map((topic) => (
                    <div
                      key={`${topic.topic}-${topic.challenge_id}`}
                      className="rounded-xl border border-white/10 bg-[#0F172A] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">{topic.topic}</p>
                        <span className="rounded-lg border border-teal-400/25 bg-teal-400/10 px-2 py-1 text-xs font-bold text-teal-200">
                          {topic.passed}/{topic.attempts}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/45">
                        Latest: {formatDateTime(topic.latest_at)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-white/10 bg-[#0F172A] p-4 text-sm text-white/50">
                    Topics will appear after Sandbox attempts.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
              <h2 className="text-lg font-bold text-white">Evidence timeline</h2>
              <div className="mt-3 space-y-2">
                {profile.timeline.length ? (
                  profile.timeline.map((event) => (
                    <div
                      key={`${event.type}-${event.id}`}
                      className="rounded-xl border border-white/10 bg-[#0F172A] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{event.label}</p>
                        <span className="text-xs text-white/35">
                          {formatDateTime(event.time)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-wider text-cyan-200/70">
                        {event.type.replace("_", " ")} / {event.status}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-white/10 bg-[#0F172A] p-4 text-sm text-white/50">
                    No evidence events yet.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </section>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
  tone: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
      <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${tone}`}>
        {icon}
        {label}
      </div>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-white/40">{helper}</p>
    </article>
  );
}

function ReviewEvidence({ job }: { job: ReviewJob }) {
  return (
    <article className="rounded-xl border border-white/10 bg-[#0F172A] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            {job.gh_login ? `@${job.gh_login}` : "GitHub review"}
          </p>
          <p className="mt-1 text-xs text-white/40">
            {formatDateTime(job.updated_at ?? job.created_at)}
          </p>
        </div>
        <span
          className={`w-fit rounded-lg border px-2 py-1 text-xs font-bold uppercase ${
            statusTone[job.status]
          }`}
        >
          {job.status}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {job.repos.map((repo) => (
          <RepoLine key={repo.full_name} repo={repo} />
        ))}
      </div>
    </article>
  );
}

function RepoLine({ repo }: { repo: ReviewRepoResult }) {
  const findings = repo.review?.errors.length ?? 0;
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{repo.full_name}</p>
          {repo.review?.summary && (
            <p className="mt-1 text-sm leading-6 text-white/55">{repo.review.summary}</p>
          )}
          {repo.error && <p className="mt-1 text-sm text-red-200">{repo.error}</p>}
        </div>
        <span
          className={`w-fit shrink-0 rounded-lg border px-2 py-1 text-xs font-bold uppercase ${
            statusTone[repo.status]
          }`}
        >
          {repo.status} / {findings} findings
        </span>
      </div>
    </div>
  );
}

function SandboxEvidence({ attempt }: { attempt: SandboxAttempt }) {
  return (
    <article className="rounded-xl border border-white/10 bg-[#0F172A] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{attempt.title}</p>
          <p className="mt-1 text-xs text-white/40">
            {attempt.topic} / attempt {attempt.attempt_number} /{" "}
            {formatDateTime(attempt.created_at)}
          </p>
        </div>
        <span
          className={`w-fit rounded-lg border px-2 py-1 text-xs font-bold uppercase ${
            attempt.passed
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-amber-400/30 bg-amber-400/10 text-amber-200"
          }`}
        >
          {attempt.passed ? "passed" : "needs fix"}
        </span>
      </div>
      <pre className="mt-3 max-h-44 overflow-auto rounded-lg border border-white/10 bg-[#050A16] p-3 font-mono text-xs leading-5 text-cyan-50">
        {codePreview(attempt.code)}
      </pre>
      {(attempt.output || attempt.error) && (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <pre className="min-h-16 rounded-lg border border-white/10 bg-white/[0.03] p-3 font-mono text-xs text-white/65">
            {attempt.output || "No output"}
          </pre>
          <pre className="min-h-16 rounded-lg border border-white/10 bg-white/[0.03] p-3 font-mono text-xs text-red-200">
            {attempt.error || "No error"}
          </pre>
        </div>
      )}
    </article>
  );
}

function EmptyProfileState() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-6 text-center">
      <h2 className="text-xl font-black text-white">No saved evidence yet</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/55">
        Run a GitHub review or complete Sandbox Java attempts. Once those finish,
        this page will show saved repositories, code attempts, timing, outputs,
        and profile metrics.
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/knowledge-assist/forensics"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-100 transition-colors hover:bg-cyan-400/15"
        >
          Open Forensics
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/knowledge-assist/sandbox?source=profile-empty"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-400/25 bg-teal-400/10 px-4 py-3 text-sm font-bold text-teal-100 transition-colors hover:bg-teal-400/15"
        >
          Practice Sandbox
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

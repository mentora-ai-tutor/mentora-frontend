"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  GitBranch,
  Lock,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ReviewJob,
  ReviewRepo,
  ReviewRepoResult,
  reviewApi,
} from "@/lib/api/review";

const MAX_SELECTED_REPOS = 5;

const statusStyle = {
  queued: "border-white/10 bg-white/5 text-white/50",
  running: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  done: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  error: "border-red-500/30 bg-red-500/10 text-red-200",
  partial: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  failed: "border-red-500/30 bg-red-500/10 text-red-200",
} as const;

const severityStyle = {
  low: "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
  medium: "border-amber-500/25 bg-amber-500/10 text-amber-200",
  high: "border-red-500/25 bg-red-500/10 text-red-200",
} as const;

const getMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error";

function formatRepoMeta(repo: ReviewRepo) {
  const bits = [
    repo.language || "Mixed",
    repo.private ? "Private" : "Public",
    `${repo.size} KB`,
  ];
  return bits.join(" / ");
}

function mergeSingleRepoResult(current: ReviewJob | null, next: ReviewJob): ReviewJob {
  const replacement = next.repos[0];
  if (!current || !replacement) return next;

  return {
    ...current,
    updated_at: next.updated_at,
    repos: current.repos.map((repo) =>
      repo.full_name === replacement.full_name ? replacement : repo,
    ),
  };
}

export default function KnowledgeAssistForensicsPage() {
  const { user, isLoading } = useAuth();
  const githubLinked = user?.github?.linked === true;
  const githubLogin = user?.github?.gh_login;

  const [repos, setRepos] = useState<ReviewRepo[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [runningReview, setRunningReview] = useState(false);
  const [rerunningRepo, setRerunningRepo] = useState<string | null>(null);
  const [job, setJob] = useState<ReviewJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCount = selectedRepos.length;

  const reportStats = useMemo(() => {
    const reports = job?.repos ?? [];
    const completed = reports.filter((repo) => repo.status === "done").length;
    const failed = reports.filter((repo) => repo.status === "error").length;
    const defects = reports.reduce(
      (sum, repo) => sum + (repo.review?.errors.length ?? 0),
      0,
    );
    const high = reports.reduce(
      (sum, repo) =>
        sum + (repo.review?.errors.filter((item) => item.severity === "high").length ?? 0),
      0,
    );
    return { completed, failed, defects, high };
  }, [job]);

  const orderedRepos = useMemo(() => {
    return [...repos].sort((a, b) => {
      const aSelected = selectedRepos.includes(a.full_name) ? 0 : 1;
      const bSelected = selectedRepos.includes(b.full_name) ? 0 : 1;
      if (aSelected !== bSelected) return aSelected - bSelected;
      if (a.language === "Java" && b.language !== "Java") return -1;
      if (a.language !== "Java" && b.language === "Java") return 1;
      return a.full_name.localeCompare(b.full_name);
    });
  }, [repos, selectedRepos]);

  useEffect(() => {
    if (!githubLinked || isLoading) return;

    const loadRepos = async () => {
      setLoadingRepos(true);
      setError(null);
      try {
        const selection = await reviewApi.selectRepos();
        setRepos(selection.repos);
        setSelectedRepos(selection.selected.map((repo) => repo.full_name));
      } catch (err) {
        setError(getMessage(err));
      } finally {
        setLoadingRepos(false);
      }
    };

    loadRepos();
  }, [githubLinked, isLoading]);

  const toggleRepo = (repoFullName: string) => {
    setError(null);
    setSelectedRepos((current) => {
      if (current.includes(repoFullName)) {
        return current.filter((name) => name !== repoFullName);
      }
      if (current.length >= MAX_SELECTED_REPOS) {
        setError(`Select at most ${MAX_SELECTED_REPOS} repositories.`);
        return current;
      }
      return [...current, repoFullName];
    });
  };

  const runReview = async () => {
    if (selectedRepos.length === 0 || runningReview) return;

    setRunningReview(true);
    setError(null);
    try {
      const nextJob = await reviewApi.reviewTopFive(selectedRepos);
      setJob(nextJob);
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setRunningReview(false);
    }
  };

  const rerunRepo = async (repoFullName: string) => {
    if (rerunningRepo) return;

    setRerunningRepo(repoFullName);
    setError(null);
    try {
      const nextJob = await reviewApi.reReview(repoFullName);
      setJob((current) => mergeSingleRepoResult(current, nextJob));
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setRerunningRepo(null);
    }
  };

  if (!isLoading && !githubLinked) {
    return (
      <div className="space-y-4 pb-4">
        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
          <div className="flex items-start gap-3">
            <Lock className="mt-1 h-5 w-5 text-amber-300" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300 font-bold">
                GitHub required
              </p>
              <h1 className="mt-1 text-2xl md:text-3xl font-black text-white">
                Connect GitHub to review repositories
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/60">
                Use the GitHub status control at the bottom of the sidebar. After it is connected,
                this page will load your eligible repositories without needing a manual refresh.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300 font-bold">
              Repository Forensics
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-black text-white">
              Gemini Code Review Pipeline
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-white/55">
              Select up to five linked GitHub repositories. Mentora bundles source files server-side,
              reviews them through the Gemini fallback router, and stores the report for recovery.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              GitHub connected
            </p>
            <p className="mt-1 text-sm text-white">
              {githubLogin ? `@${githubLogin}` : "Linked account"}
            </p>
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

      <section className="grid grid-cols-1 xl:grid-cols-[390px_minmax(0,1fr)] gap-4">
        <article className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <GitBranch className="h-4 w-4 text-cyan-300" />
              Repository Selection
            </h2>
            <span className="rounded-lg border border-white/10 bg-[#0F172A] px-2 py-1 text-xs text-white/55">
              {selectedCount} / {MAX_SELECTED_REPOS}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {loadingRepos && (
              <div className="rounded-xl border border-white/10 bg-[#0F172A] p-4 text-sm text-white/50">
                Loading GitHub repositories...
              </div>
            )}

            {!loadingRepos && repos.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-[#0F172A] p-4 text-sm text-white/50">
                No eligible repositories were found for this GitHub account.
              </div>
            )}

            {orderedRepos.map((repo) => {
              const checked = selectedRepos.includes(repo.full_name);
              return (
                <button
                  key={repo.full_name}
                  type="button"
                  onClick={() => toggleRepo(repo.full_name)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    checked
                      ? "border-teal-500/40 bg-teal-500/10"
                      : "border-white/10 bg-[#0F172A] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-4 w-4 rounded border flex items-center justify-center ${
                        checked
                          ? "border-teal-400 bg-teal-400 text-[#0F172A]"
                          : "border-white/25"
                      }`}
                    >
                      {checked && <CheckCircle2 className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">
                        {repo.full_name}
                      </span>
                      <span className="mt-1 block text-xs text-white/45">
                        {formatRepoMeta(repo)}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={runReview}
            disabled={selectedCount === 0 || runningReview}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-[#061016] transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          >
            {runningReview ? (
              <CircleDashed className="h-4 w-4 animate-spin" />
            ) : (
              <ScanSearch className="h-4 w-4" />
            )}
            {runningReview ? "Review running..." : "Run Gemini review"}
          </button>
        </article>

        <div className="space-y-4">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="Reviewed" value={reportStats.completed} tone="text-emerald-300" />
            <MetricCard label="Failed" value={reportStats.failed} tone="text-red-300" />
            <MetricCard label="Findings" value={reportStats.defects} tone="text-cyan-300" />
            <MetricCard label="High Risk" value={reportStats.high} tone="text-amber-300" />
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Review Results
              </h2>
              {job && (
                <span
                  className={`w-fit rounded-lg border px-2 py-1 text-xs font-semibold uppercase ${
                    statusStyle[job.status]
                  }`}
                >
                  {job.status}
                </span>
              )}
            </div>

            {!job && (
              <div className="mt-4 rounded-xl border border-white/10 bg-[#0F172A] p-5 text-sm text-white/50">
                Run a review to see repository summaries, defects, Java level signals, and fix hints.
              </div>
            )}

            {job && (
              <div className="mt-4 space-y-4">
                {job.java_level_inferred && (
                  <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                      Inferred Java level
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {job.java_level_inferred}
                      {job.signals_evidence ? ` - ${job.signals_evidence}` : ""}
                    </p>
                  </div>
                )}

                {job.repos.map((repo) => (
                  <RepoReport
                    key={repo.full_name}
                    repo={repo}
                    rerunning={rerunningRepo === repo.full_name}
                    onRerun={() => rerunRepo(repo.full_name)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-[#1e293b]/55 p-3">
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className={`mt-1 text-2xl font-black ${tone}`}>{value}</p>
    </article>
  );
}

function RepoReport({
  repo,
  rerunning,
  onRerun,
}: {
  repo: ReviewRepoResult;
  rerunning: boolean;
  onRerun: () => void;
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-[#0F172A] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-white">{repo.full_name}</p>
          <span
            className={`mt-2 inline-flex rounded-lg border px-2 py-1 text-xs font-semibold uppercase ${
              statusStyle[repo.status]
            }`}
          >
            {repo.status}
          </span>
        </div>

        <button
          type="button"
          onClick={onRerun}
          disabled={rerunning}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:text-white/30"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${rerunning ? "animate-spin" : ""}`} />
          Re-review
        </button>
      </div>

      {repo.error && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
          {repo.error}
        </div>
      )}

      {repo.review && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Summary
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">{repo.review.summary}</p>
          </div>

          {repo.review.errors.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-[#111827] text-xs uppercase text-white/40">
                  <tr>
                    <th className="p-3 text-left">Severity</th>
                    <th className="p-3 text-left">Location</th>
                    <th className="p-3 text-left">Finding</th>
                    <th className="p-3 text-left">Fix hint</th>
                  </tr>
                </thead>
                <tbody>
                  {repo.review.errors.map((item, index) => (
                    <tr key={`${item.file}-${index}`} className="border-t border-white/5 align-top">
                      <td className="p-3">
                        <span
                          className={`rounded-md border px-2 py-1 text-xs font-semibold uppercase ${
                            severityStyle[item.severity]
                          }`}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-xs text-white/60">
                        {item.file}
                        {item.line ? `:${item.line}` : ""}
                      </td>
                      <td className="p-3 text-white/75">{item.why}</td>
                      <td className="p-3 text-cyan-100/80">{item.fix_hint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {repo.review.suggestions.length > 0 && (
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3">
              <p className="text-sm font-semibold text-cyan-100">Suggestions</p>
              <ul className="mt-2 space-y-2 text-sm text-cyan-100/75">
                {repo.review.suggestions.map((suggestion) => (
                  <li key={suggestion} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

"use client";

import { Loader2, X, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import type { GenerationJob } from "@/lib/api/learningGenerator";

interface JobCardProps {
  job: GenerationJob;
  onDismiss: (jobId: string) => void;
  closingJobs: string[];
}

export default function JobCard({ job, onDismiss, closingJobs }: JobCardProps) {
  const isProcessing = ["queued", "processing"].includes(job.status);
  const isCompleted = job.status === "completed" || job.status === "partial";
  const pct = job.gaps_total > 0 ? (job.gaps_completed / job.gaps_total) * 100 : 0;

  const title = isProcessing ? "Generating Materials..." : isCompleted ? "Generation Complete" : "Generation Failed";
  const badgeColor = isProcessing ? "bg-teal-500/20 text-teal-400" : isCompleted ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";
  const barColor = isProcessing ? "bg-linear-to-r from-teal-600 to-teal-400" : isCompleted ? "bg-linear-to-r from-green-600 to-green-400" : "bg-red-500";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--lmg-bg-surface)] backdrop-blur-xl border border-[var(--lmg-border)] hover:border-teal-500/40 shadow-xs dark:shadow-md transition-all">
      <div className="flex items-center gap-3 px-4 py-4">
        {isProcessing ? (
          <Sparkles className="w-5 h-5 text-teal-500 dark:text-teal-400 animate-spin-slow shrink-0" />
        ) : isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[var(--lmg-text-primary)] truncate">{title}</p>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${badgeColor}`}>{job.status}</span>
          </div>
          <p className="text-xs text-[var(--lmg-text-muted)] truncate mt-0.5">{job.job_id}</p>
        </div>
        <span className="text-xs text-[var(--lmg-text-secondary)] shrink-0">{job.gaps_completed}/{job.gaps_total} topics</span>
        {job.materials_generated > 0 && (
          <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold shrink-0">{job.materials_generated} materials</span>
        )}
        <button
          onClick={() => onDismiss(job.job_id)}
          disabled={closingJobs.includes(job.job_id)}
          className="p-1.5 rounded-md text-[var(--lmg-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
          title="Hide from view"
        >
          {closingJobs.includes(job.job_id) ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="h-1.5 bg-[var(--lmg-bg-card-subtle)]">
        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface ActiveJobsListProps {
  jobs: GenerationJob[];
  onDismiss: (jobId: string) => void;
  closingJobs: string[];
}

export function ActiveJobsList({ jobs, onDismiss, closingJobs }: ActiveJobsListProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <h2 className="text-[11px] font-bold text-[var(--lmg-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" /> Active Jobs
      </h2>
      {jobs.map((job) => (
        <JobCard key={job.job_id} job={job} onDismiss={onDismiss} closingJobs={closingJobs} />
      ))}
    </div>
  );
}

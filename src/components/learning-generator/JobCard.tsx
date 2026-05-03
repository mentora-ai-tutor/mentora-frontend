"use client";

import { Loader2, X, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { learningGeneratorApi, type GenerationJob } from "@/lib/api/learningGenerator";
import { useState } from "react";

interface JobCardProps {
  job: GenerationJob;
  onDismiss: (jobId: string) => void;
  closingJobs: string[];
}

export default function JobCard({ job, onDismiss, closingJobs }: JobCardProps) {
  const isProcessing = ["queued", "processing"].includes(job.status);
  const isCompleted = job.status === "completed" || job.status === "partial";

  return (
    <div className="p-5 bg-job-card border border-job-ring rounded-2xl animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        {isProcessing ? (
          <Sparkles className="w-5 h-5 text-job-primary animate-spin-slow" />
        ) : isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-job-success" />
        ) : (
          <XCircle className="w-5 h-5 text-job-failed" />
        )}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-job-text">
            {isProcessing ? "Generating Materials..." : isCompleted ? "Generation Complete" : "Generation Failed"}
          </h3>
          <p className="text-xs text-job-muted">{job.job_id} • {job.status}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
          isProcessing ? "bg-job-primary/20 text-job-primary" : isCompleted ? "bg-job-success/20 text-job-success" : "bg-job-failed/20 text-job-failed"
        }`}>{job.status}</span>
        <button
          onClick={() => onDismiss(job.job_id)}
          disabled={closingJobs.includes(job.job_id)}
          className="p-1.5 rounded-lg text-job-muted hover:text-job-failed hover:bg-job-failed/10 transition-all disabled:opacity-50"
          title="Hide from view"
        >
          {closingJobs.includes(job.job_id) ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex-1 h-2 bg-[#334155] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isProcessing ? "bg-linear-to-r from-teal-600 to-teal-400" : isCompleted ? "bg-linear-to-r from-green-600 to-green-400" : "bg-red-500"
            }`}
            style={{ width: `${job.gaps_total > 0 ? (job.gaps_completed / job.gaps_total) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-job-muted">
          <span>{job.gaps_completed}/{job.gaps_total} topics processed</span>
          {job.materials_generated > 0 && (
            <span className="text-job-primary">{job.materials_generated} materials ready</span>
          )}
        </div>
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
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-teal-400" /> Active Jobs
      </h2>
      {jobs.map((job) => (
        <JobCard key={job.job_id} job={job} onDismiss={onDismiss} closingJobs={closingJobs} />
      ))}
    </div>
  );
}

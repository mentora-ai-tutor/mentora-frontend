"use client";

import Link from "next/link";
import { Brain, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import type { KnowledgeGap, LearningMaterial, StudentProgress } from "@/lib/api/learningGenerator";

interface KnowledgeGapCardProps {
  gap: KnowledgeGap;
  index: number;
  material?: LearningMaterial;
  progress?: StudentProgress | null;
}

const gapColorMap: Record<string, { badge: string }> = {
  FUNDAMENTAL_GAP: { badge: "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 font-bold" },
  PARTIAL_GAP: { badge: "bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold" },
  SURFACE_GAP: { badge: "bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold" },
  default: { badge: "bg-slate-100 dark:bg-[var(--lmg-bg-subtle)] border-slate-300 dark:border-[var(--lmg-border)] text-slate-700 dark:text-[var(--lmg-text-muted)] font-bold" },
};

export default function KnowledgeGapCard({ gap, index, material, progress }: KnowledgeGapCardProps) {
  const colors = gapColorMap[gap.gap_type] || gapColorMap.default;
  const isFundamental = gap.gap_type === "FUNDAMENTAL_GAP";

  return (
    <div className="bg-[var(--lmg-bg-surface)] backdrop-blur-xl border border-[var(--lmg-border)] hover:border-[var(--lmg-border-strong)] shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden relative group">
      <div className={`absolute top-0 left-0 w-full h-1 ${isFundamental ? 'bg-gradient-to-r from-transparent via-red-500/20 to-transparent' : 'bg-gradient-to-r from-transparent via-amber-500/15 to-transparent'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="font-bold text-[var(--lmg-text-primary)] group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors text-base">{gap.topic}</h3>
              <p className="text-[11px] text-slate-500 dark:text-white/40 mt-0.5 font-mono font-medium">{gap.topic_id}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider border ${colors.badge} shrink-0`}>
            {gap.gap_type.replace("_", " ")}
          </span>
        </div>

        {gap.evidence_summary && (
          <p className="text-sm text-slate-700 dark:text-white/70 mb-3 line-clamp-2 leading-relaxed">{gap.evidence_summary}</p>
        )}

        {gap.misconceptions && gap.misconceptions.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-slate-600 dark:text-white/60 uppercase tracking-wider mb-2 flex items-center gap-1 font-semibold">
              <Brain className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Misconceptions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {gap.misconceptions.slice(0, 3).map((m, mi) => (
                <span key={mi} className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-lg text-[10px] font-semibold">
                  {m.length > 40 ? m.substring(0, 40) + "..." : m}
                </span>
              ))}
              {gap.misconceptions.length > 3 && (
                <span className="px-2 py-1 bg-slate-100 dark:bg-[var(--lmg-bg-subtle)] border border-slate-200 dark:border-[var(--lmg-border)] rounded-lg text-[10px] text-slate-600 dark:text-[var(--lmg-text-muted)] font-medium">+{gap.misconceptions.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {material && progress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-600 dark:text-white/60 mb-1.5 font-medium">
              <span>{progress.completed_steps.length} / {progress.total_steps} steps</span>
              <span className="text-teal-700 dark:text-teal-400 font-bold">{Math.round((progress.completed_steps.length / progress.total_steps) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${(progress.completed_steps.length / progress.total_steps) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[var(--lmg-border)]">
          <div className="flex items-center gap-4 text-xs text-[var(--lmg-text-muted)]">
            {gap.confidence && (
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3 text-teal-600 dark:text-teal-400" /> {Math.round(gap.confidence * 100)}% confidence
              </span>
            )}
            {progress?.completed_at && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
          </div>
          {material ? (
            <Link
              href={`/learning-generator/materials/${material._id}`}
              className="px-3 py-1.5 bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-400 text-[10px] font-bold rounded-lg hover:bg-teal-500/25 transition-colors flex items-center gap-1"
            >
              {progress?.completed_at ? "Review" : "Continue"} <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          ) : (
            <span className="text-[10px] text-[var(--lmg-text-muted)] flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending generation
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

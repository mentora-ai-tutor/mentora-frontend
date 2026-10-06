"use client";

import { Brain, Target, TrendingUp, Clock } from "lucide-react";
import type { KnowledgeGap } from "@/lib/api/learningGenerator";
import { getGapColors } from "./GapFilters";

interface ExpandableGapCardProps {
  gap: KnowledgeGap;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ExpandableGapCard({ gap, index, isExpanded, onToggle }: ExpandableGapCardProps) {
  const colors = getGapColors(gap.gap_type);

  return (
    <div className={`bg-[var(--lmg-bg-surface)] border rounded-2xl shadow-xs transition-all ${isExpanded ? "border-[var(--lmg-border-strong)]" : "border-[var(--lmg-border)]"}`}>
      <button onClick={onToggle} className="w-full p-5 text-left cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${colors.dot} ${gap.gap_type === "FUNDAMENTAL_GAP" ? "animate-pulse" : ""}`} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-[var(--lmg-text-primary)]">{gap.topic}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.border} ${colors.text}`}>
                  {gap.gap_type.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-[var(--lmg-text-muted)] font-mono">{gap.topic_id}</p>
            </div>
          </div>
          {gap.confidence && (
            <div className="text-right">
              <p className="text-sm font-bold text-[var(--lmg-text-secondary)]">{Math.round(gap.confidence * 100)}%</p>
              <p className="text-[10px] text-[var(--lmg-text-muted)]">Confidence</p>
            </div>
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-[var(--lmg-border)] pt-4">
          {gap.evidence_summary && (
            <div>
              <h4 className="text-[10px] text-[var(--lmg-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
                <Target className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Evidence
              </h4>
              <p className="text-sm text-[var(--lmg-text-secondary)] leading-relaxed bg-[var(--lmg-bg-card-subtle)] p-3 rounded-lg border border-[var(--lmg-border)]">
                {gap.evidence_summary}
              </p>
            </div>
          )}

          {gap.misconceptions && gap.misconceptions.length > 0 && (
            <div>
              <h4 className="text-[10px] text-red-600 dark:text-red-400/80 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
                <Brain className="w-3 h-3" /> Misconceptions ({gap.misconceptions.length})
              </h4>
              <div className="space-y-2">
                {gap.misconceptions.map((m, mi) => (
                  <div key={mi} className="flex items-start gap-2 p-2.5 bg-red-500/5 border border-red-500/15 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    <p className="text-sm text-red-700 dark:text-red-200/80">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gap.observed_error_patterns && Object.keys(gap.observed_error_patterns).length > 0 && (
            <div>
              <h4 className="text-[10px] text-amber-600 dark:text-amber-400/80 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
                <TrendingUp className="w-3 h-3" /> Observed Error Patterns
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(gap.observed_error_patterns).map(([source, errors]) => (
                  <div key={source} className="p-3 bg-[var(--lmg-bg-card-subtle)] border border-[var(--lmg-border)] rounded-lg">
                    <p className="text-xs font-bold text-[var(--lmg-text-primary)] capitalize mb-2">{source}</p>
                    <div className="space-y-1">
                      {(Array.isArray(errors) ? errors : [errors]).map((err, ei) => (
                        <p key={ei} className="text-xs text-[var(--lmg-text-secondary)] flex items-start gap-1.5">
                          <span className="text-amber-500 shrink-0">•</span>
                          {err}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            {gap.prerequisite_topics && gap.prerequisite_topics.length > 0 && (
              <div>
                <h4 className="text-[10px] text-[var(--lmg-text-muted)] uppercase tracking-wider mb-2 font-semibold">Prerequisites</h4>
                <div className="flex flex-wrap gap-1.5">
                  {gap.prerequisite_topics.map((t, ti) => (
                    <span key={ti} className="px-2 py-1 bg-[var(--lmg-bg-subtle)] border border-[var(--lmg-border)] rounded text-xs text-[var(--lmg-text-secondary)]">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {gap.related_topics && gap.related_topics.length > 0 && (
              <div>
                <h4 className="text-[10px] text-[var(--lmg-text-muted)] uppercase tracking-wider mb-2 font-semibold">Related Topics</h4>
                <div className="flex flex-wrap gap-1.5">
                  {gap.related_topics.map((t, ti) => (
                    <span key={ti} className="px-2 py-1 bg-teal-500/10 border border-teal-500/20 rounded text-xs text-teal-700 dark:text-teal-300/80">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {gap.suggested_intervention && (
            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
              <h4 className="text-[10px] text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-bold">
                <Target className="w-3 h-3" /> Suggested Intervention
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--lmg-text-muted)] mb-1">Primary Approach</p>
                  <p className="text-sm font-bold text-teal-700 dark:text-teal-300 capitalize">
                    {gap.suggested_intervention.primary.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--lmg-text-muted)] mb-1">Estimated Time</p>
                  <p className="text-sm font-bold text-[var(--lmg-text-primary)] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {gap.suggested_intervention.estimated_time_minutes} minutes
                  </p>
                </div>
                {gap.suggested_intervention.secondary && gap.suggested_intervention.secondary.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[var(--lmg-text-muted)] mb-1.5">Secondary Approaches</p>
                    <div className="flex flex-wrap gap-1.5">
                      {gap.suggested_intervention.secondary.map((s, si) => (
                        <span key={si} className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded text-xs text-teal-700 dark:text-teal-300/80 capitalize">
                          {s.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {gap.suggested_intervention.learning_objectives && gap.suggested_intervention.learning_objectives.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[var(--lmg-text-muted)] mb-1.5">Learning Objectives</p>
                    <ul className="space-y-1">
                      {gap.suggested_intervention.learning_objectives.map((obj, oi) => (
                        <li key={oi} className="text-xs text-teal-800 dark:text-teal-200/80 flex items-start gap-1.5">
                          <span className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5 font-bold">→</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

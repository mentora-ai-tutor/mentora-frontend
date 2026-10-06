"use client";

import { Filter } from "lucide-react";
import type { KnowledgeGap } from "@/lib/api/learningGenerator";

const gapColorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  FUNDAMENTAL_GAP: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-700 dark:text-red-400 font-bold", badge: "bg-red-500/20 text-red-800 dark:text-red-300", dot: "bg-red-500" },
  PARTIAL_GAP: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-800 dark:text-amber-400 font-bold", badge: "bg-amber-500/20 text-amber-800 dark:text-amber-300", dot: "bg-amber-500" },
  SURFACE_GAP: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-700 dark:text-blue-400 font-bold", badge: "bg-blue-500/20 text-blue-800 dark:text-blue-300", dot: "bg-blue-500" },
  default: { bg: "bg-[var(--lmg-bg-subtle)]", border: "border-[var(--lmg-border)]", text: "text-[var(--lmg-text-muted)]", badge: "bg-[var(--lmg-bg-subtle)] text-[var(--lmg-text-muted)]", dot: "bg-slate-400" },
};

interface GapFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  gapCounts: Record<string, number>;
}

export default function GapFilters({ filter, onFilterChange, gapCounts }: GapFiltersProps) {
  const types = ["ALL", "FUNDAMENTAL_GAP", "PARTIAL_GAP", "SURFACE_GAP"] as const;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-4 h-4 text-[var(--lmg-text-muted)]" />
      {types.map((type) => {
        const isActive = filter === type;
        const colors = type !== "ALL" ? gapColorMap[type] : null;
        return (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? type === "ALL"
                  ? "bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30 shadow-xs"
                  : `${colors!.bg} ${colors!.text} border ${colors!.border} shadow-xs`
                : "bg-[var(--lmg-bg-surface)] text-[var(--lmg-text-muted)] border border-[var(--lmg-border)] hover:text-[var(--lmg-text-primary)] hover:border-[var(--lmg-border-strong)]"
            }`}
          >
            {type === "ALL" ? "All" : type.replace("_", " ")}
            <span className="ml-1.5 opacity-60">({gapCounts[type]})</span>
          </button>
        );
      })}
    </div>
  );
}

export function getGapCounts(profile: any): Record<string, number> {
  return {
    ALL: profile?.knowledge_gaps?.length || 0,
    FUNDAMENTAL_GAP: profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "FUNDAMENTAL_GAP").length || 0,
    PARTIAL_GAP: profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "PARTIAL_GAP").length || 0,
    SURFACE_GAP: profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "SURFACE_GAP").length || 0,
  };
}

export function getFilteredGaps(profile: any, filter: string): KnowledgeGap[] {
  return filter === "ALL"
    ? profile?.knowledge_gaps || []
    : profile?.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === filter) || [];
}

export function getGapColors(gapType: string) {
  return gapColorMap[gapType] || gapColorMap.default;
}

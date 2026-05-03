"use client";

import { Filter } from "lucide-react";
import type { KnowledgeGap } from "@/lib/api/learningGenerator";

const gapColorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  FUNDAMENTAL_GAP: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", badge: "bg-red-500/20 text-red-300", dot: "bg-red-500" },
  PARTIAL_GAP: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-300", dot: "bg-amber-500" },
  SURFACE_GAP: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300", dot: "bg-blue-500" },
  default: { bg: "bg-white/5", border: "border-white/10", text: "text-white/50", badge: "bg-white/10 text-white/60", dot: "bg-white/40" },
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
      <Filter className="w-4 h-4 text-white/30" />
      {types.map((type) => {
        const isActive = filter === type;
        const colors = type !== "ALL" ? gapColorMap[type] : null;
        return (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? type === "ALL"
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                  : `${colors!.bg} ${colors!.text} border ${colors!.border}`
                : "bg-[#334155]/20 text-white/40 border border-white/5 hover:text-white/60"
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

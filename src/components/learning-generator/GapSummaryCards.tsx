"use client";

import type { KnowledgeGap } from "@/lib/api/learningGenerator";

interface GapSummaryCardsProps {
  profile: any;
}

export default function GapSummaryCards({ profile }: GapSummaryCardsProps) {
  if (!profile) return null;

  const gapCounts = {
    ALL: profile.knowledge_gaps?.length || 0,
    FUNDAMENTAL_GAP: profile.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "FUNDAMENTAL_GAP").length || 0,
    PARTIAL_GAP: profile.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "PARTIAL_GAP").length || 0,
    SURFACE_GAP: profile.knowledge_gaps?.filter((g: KnowledgeGap) => g.gap_type === "SURFACE_GAP").length || 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
        <p className="text-3xl font-black text-white">{gapCounts.ALL}</p>
        <p className="text-xs text-white/40 mt-1">Total Gaps</p>
      </div>
      <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
        <p className="text-3xl font-black text-red-400">{gapCounts.FUNDAMENTAL_GAP}</p>
        <p className="text-xs text-red-400/60 mt-1">Fundamental</p>
      </div>
      <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
        <p className="text-3xl font-black text-amber-400">{gapCounts.PARTIAL_GAP}</p>
        <p className="text-xs text-amber-400/60 mt-1">Partial</p>
      </div>
      <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
        <p className="text-3xl font-black text-blue-400">{gapCounts.SURFACE_GAP}</p>
        <p className="text-xs text-blue-400/60 mt-1">Surface</p>
      </div>
    </div>
  );
}

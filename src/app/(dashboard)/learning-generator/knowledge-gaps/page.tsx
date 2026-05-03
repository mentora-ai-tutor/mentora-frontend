"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi } from "@/lib/api/learningGenerator";
import { AlertTriangle, Brain, ChevronLeft, Loader2 } from "lucide-react";
import GapSummaryCards from "@/components/learning-generator/GapSummaryCards";
import GapFilters, { getGapCounts, getFilteredGaps } from "@/components/learning-generator/GapFilters";
import ExpandableGapCard from "@/components/learning-generator/ExpandableGapCard";

export default function KnowledgeGapsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [expandedGap, setExpandedGap] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.student_id) return;
    try {
      const profileRes = await learningGeneratorApi.getProfile(user.student_id);
      if (profileRes.success) setProfile(profileRes.data);
    } finally {
      setLoading(false);
    }
  }, [user?.student_id]);

  useEffect(() => {
    if (user?.student_id) fetchData();
  }, [user?.student_id, fetchData]);

  const filteredGaps = getFilteredGaps(profile, filter);
  const gapCounts = getGapCounts(profile);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <Link href="/learning-generator" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-bold mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Overview
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Knowledge Gaps</h1>
            <p className="text-sm text-white/50">Detailed analysis of areas that need improvement.</p>
          </div>
        </div>
      </div>

      <GapSummaryCards profile={profile} />

      <GapFilters filter={filter} onFilterChange={setFilter} gapCounts={gapCounts} />

      {filteredGaps.length > 0 ? (
        <div className="space-y-4">
          {filteredGaps.map((gap, i) => (
            <ExpandableGapCard
              key={i}
              gap={gap}
              index={i}
              isExpanded={expandedGap === i}
              onToggle={() => setExpandedGap(expandedGap === i ? null : i)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 bg-[#334155]/10 border border-white/5 rounded-2xl text-center">
          <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white/60 mb-2">No gaps found</h3>
          <p className="text-sm text-white/40">
            {filter !== "ALL" ? "No gaps match this filter." : "Submit a learning profile to identify knowledge gaps."}
          </p>
        </div>
      )}
    </div>
  );
}

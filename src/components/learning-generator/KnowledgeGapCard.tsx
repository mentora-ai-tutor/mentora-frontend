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

const gapColorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  FUNDAMENTAL_GAP: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", dot: "bg-red-500" },
  PARTIAL_GAP: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-500" },
  SURFACE_GAP: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", dot: "bg-blue-500" },
  default: { bg: "bg-white/5", border: "border-white/10", text: "text-white/50", dot: "bg-white/30" },
};

export default function KnowledgeGapCard({ gap, index, material, progress }: KnowledgeGapCardProps) {
  const colors = gapColorMap[gap.gap_type] || gapColorMap.default;

  return (
    <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-xl hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${colors.dot}`} />
          <div>
            <h3 className="font-bold text-white group-hover:text-teal-300 transition-colors">{gap.topic}</h3>
            <p className="text-xs text-white/40 mt-0.5">{gap.topic_id}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.border} ${colors.text}`}>
          {gap.gap_type.replace("_", " ")}
        </span>
      </div>

      {gap.evidence_summary && (
        <p className="text-sm text-white/60 mb-3 line-clamp-2">{gap.evidence_summary}</p>
      )}

      {gap.misconceptions && gap.misconceptions.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Misconceptions</p>
          <div className="flex flex-wrap gap-1.5">
            {gap.misconceptions.slice(0, 3).map((m, mi) => (
              <span key={mi} className="px-2 py-0.5 bg-red-500/10 border border-red-500/10 rounded text-[10px] text-red-300/80">
                {m.length > 40 ? m.substring(0, 40) + "..." : m}
              </span>
            ))}
            {gap.misconceptions.length > 3 && (
              <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/40">+{gap.misconceptions.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {material && progress && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>{progress.completed_steps.length} / {progress.total_steps} steps</span>
            <span className="text-teal-400">{Math.round((progress.completed_steps.length / progress.total_steps) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#334155] rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${(progress.completed_steps.length / progress.total_steps) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-4 text-xs text-white/40">
          {gap.confidence && (
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3" /> {Math.round(gap.confidence * 100)}% confidence
            </span>
          )}
          {progress?.completed_at && (
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          )}
        </div>
        {material ? (
          <Link
            href={`/learning-generator/materials/${material._id}`}
            className="px-3 py-1.5 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-[10px] font-bold rounded-lg hover:bg-teal-600/30 transition-colors flex items-center gap-1"
          >
            {progress?.completed_at ? "Review" : "Continue"} <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        ) : (
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending generation
          </span>
        )}
      </div>
    </div>
  );
}

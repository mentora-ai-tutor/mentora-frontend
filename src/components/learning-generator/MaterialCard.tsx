"use client";

import Link from "next/link";
import { ExternalLink, FileText, Calendar, Sparkles, Eye } from "lucide-react";
import type { LearningMaterial } from "@/lib/api/learningGenerator";

interface MaterialCardProps {
  material: LearningMaterial;
}

const gapColorMap: Record<string, { bg: string; border: string; text: string }> = {
  FUNDAMENTAL_GAP: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  PARTIAL_GAP: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  SURFACE_GAP: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  default: { bg: "bg-white/5", border: "border-white/10", text: "text-white/50" },
};

const difficultyColorMap: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
  default: "bg-white/5 text-white/50 border-white/10",
};

export default function MaterialCard({ material }: MaterialCardProps) {
  const sm = material.structured_material;
  const colors = gapColorMap[sm.gap_type] || gapColorMap.default;
  const diffColor = difficultyColorMap[sm.difficulty_level] || difficultyColorMap.default;

  return (
    <div className="group p-5 bg-[#334155]/20 border border-white/5 rounded-2xl hover:border-teal-500/30 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]">
      <div className="flex items-start justify-between mb-3">
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
          {sm.difficulty_level}
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.border} ${colors.text}`}>
          {sm.gap_type.replace("_", " ")}
        </span>
      </div>

      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors mb-1">
        {sm.topic}
      </h3>
      <p className="text-xs text-white/30 mb-4 font-mono">{sm.topic_id}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <FileText className="w-3.5 h-3.5" />
          <span>{sm.lesson?.concept_explained ? "Concepts" : ""}{sm.lesson?.examples ? " + Examples" : ""}{sm.assessment?.quiz ? " + Quiz" : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(sm.generated_at).toLocaleDateString()}</span>
        </div>
        {sm.generation_models && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{sm.generation_models.llm || "N/A"}</span>
          </div>
        )}
      </div>

      <Link
        href={`/learning-generator/materials/${material._id}`}
        className="w-full py-2.5 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-xl hover:bg-teal-600/30 transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-3.5 h-3.5" /> Open Workspace
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Sparkles, Plus, BookOpen, Target, BarChart3, CheckCircle2, Layers, ChevronRight, Brain, Loader2 } from "lucide-react";
import type { ConceptCoverage as ConceptCoverageData } from "@/lib/api/learningGenerator";

interface QuickActionsProps {
  onGenerateClick: () => void;
  onMasteryGenerateClick: () => void;
  masteryGenerating?: boolean;
}

export function QuickActions({ onGenerateClick, onMasteryGenerateClick, masteryGenerating }: QuickActionsProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-teal-400" /> Quick Actions
      </h2>
      <button
        onClick={onGenerateClick}
        className="w-full p-4 bg-[#1e293b]/90 backdrop-blur-xl border border-teal-500/20 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(13,148,136,0.15)] transition-all text-left flex items-start gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
          <Plus className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white mb-0.5">Generate Materials</h3>
          <p className="text-xs text-teal-100/60">Submit mastery profile to AI engine</p>
        </div>
      </button>
      <button
        onClick={onMasteryGenerateClick}
        disabled={masteryGenerating}
        className="w-full p-4 bg-[#1e293b]/90 backdrop-blur-xl border border-cyan-500/25 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all text-left flex items-start gap-3 disabled:cursor-wait disabled:opacity-60"
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
          {masteryGenerating ? (
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          ) : (
            <Brain className="w-5 h-5 text-cyan-400" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white mb-0.5">Material from Mastery</h3>
          <p className="text-xs text-cyan-100/60">
            {masteryGenerating ? "Reading saved mastery gaps..." : "Generate from Knowledge Assist saved gaps"}
          </p>
        </div>
      </button>
      <Link href="/learning-generator/materials" className="w-full p-4 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-xl hover:scale-[1.02] hover:border-white/20 transition-all flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-white/60" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white/80 mb-0.5">Browse Materials</h3>
          <p className="text-xs text-white/40">View all generated content</p>
        </div>
      </Link>
    </div>
  );
}

interface ModuleProgressListProps {
  progress: Array<{
    material_id: string;
    topic: string;
    total_steps: number;
    completed_steps: number[];
    quiz_score: number | null;
    completed_at: string | null;
  }>;
}

export function ModuleProgressList({ progress }: ModuleProgressListProps) {
  if (progress.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Target className="w-5 h-5 text-teal-400" /> Your Modules
      </h2>
      <div className="space-y-2">
        {progress.map((p, i) => {
          const pct = p.total_steps > 0 ? Math.round((p.completed_steps.length / p.total_steps) * 100) : 0;
          const isComplete = !!p.completed_at;
          return (
            <Link key={i} href={`/learning-generator/materials/${p.material_id}`} className="block p-3 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-lg hover:scale-[1.01] hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">{p.topic}</p>
                {isComplete && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isComplete ? "bg-linear-to-r from-green-600 to-green-400" : "bg-linear-to-r from-teal-600 to-teal-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-white/40 font-bold">{pct}%</span>
              </div>
              {p.quiz_score !== null && (
                <p className="text-[10px] text-purple-400 mt-1">Quiz: {p.quiz_score}%</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

interface ScoreHistoryProps {
  history: Array<{
    id?: string;
    overall_mastery_score?: number;
    overall_score?: number;
    gaps_count?: number;
    submitted_at: string;
  }>;
}

interface ConceptCoverageProps {
  coverage: ConceptCoverageData | null;
}

export function ConceptCoverage({ coverage }: ConceptCoverageProps) {
  if (!coverage || typeof coverage.totalNodes !== "number") return null;

  const { totalNodes, coveredNodes, coveragePct, implicitGapsCount, unverifiedCount } = coverage;

  const getCoverageColor = (pct: number) => {
    if (pct >= 80) return "text-green-400";
    if (pct >= 60) return "text-amber-400";
    if (pct >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Layers className="w-5 h-5 text-teal-400" /> Concept Coverage
      </h2>
      <Link href="/learning-generator/coverage" className="block p-4 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-xl hover:scale-[1.02] hover:border-teal-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-white">Mastered concepts</span>
          <span className={`text-2xl font-black ${getCoverageColor(coveragePct)}`}>{coveragePct}%</span>
        </div>
        <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all ${coveragePct >= 60 ? "bg-linear-to-r from-green-600 to-green-400" : "bg-linear-to-r from-teal-600 to-teal-400"}`}
            style={{ width: `${Math.min(100, coveragePct)}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-white/5 rounded-lg">
            <p className="font-bold text-white">{coveredNodes}</p>
            <p className="text-white/40">of {totalNodes} nodes</p>
          </div>
          {implicitGapsCount > 0 && (
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="font-bold text-blue-400">{implicitGapsCount}</p>
              <p className="text-blue-300/60">prerequisite gaps</p>
            </div>
          )}
        </div>
        {unverifiedCount > 0 && (
          <p className="text-[10px] text-amber-400/70 mt-3">
            {unverifiedCount} unresolved concept{unverifiedCount === 1 ? "" : "s"} — generated as generic materials.
          </p>
        )}
        <p className="text-[10px] text-teal-400/70 mt-3 flex items-center gap-1">
          View details <ChevronRight className="w-3 h-3" />
        </p>
      </Link>
    </div>
  );
}

export function ScoreHistory({ history }: ScoreHistoryProps) {
  if (history.length === 0) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-teal-400" /> Score History
      </h2>
      <div className="space-y-2">
        {history.map((entry, i) => {
          const score = entry.overall_mastery_score || entry.overall_score || 0;
          const content = (
            <>
              <div>
                <p className={`text-sm font-bold ${getScoreColor(score)}`}>
                  {entry.overall_mastery_score || entry.overall_score || "—"}%
                </p>
                <p className="text-[10px] text-white/30">{entry.gaps_count || 0} gaps</p>
              </div>
              <p className="text-[10px] text-white/30">
                {new Date(entry.submitted_at).toLocaleDateString()}
              </p>
            </>
          );
          const cardClasses = "p-3 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-lg flex items-center justify-between hover:scale-[1.01] transition-all";
          return entry.id ? (
            <Link
              key={i}
              href={`/learning-generator/knowledge-gaps?id=${entry.id}`}
              className={`${cardClasses} hover:border-teal-500/40`}
            >
              {content}
            </Link>
          ) : (
            <div key={i} className={cardClasses}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface StrengthsListProps {
  strengths: Array<string | { topic: string; confidence?: number; mastery_level?: string }>;
}

export function StrengthsList({ strengths }: StrengthsListProps) {
  if (strengths.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-400" /> Strengths
      </h2>
      <div className="space-y-2">
        {strengths.map((s, i) => (
          <div key={i} className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg hover:scale-[1.01] transition-all">
            <p className="text-sm font-bold text-white">
              {typeof s === "string" ? s : s.topic}
            </p>
            {typeof s !== "string" && s.confidence && (
              <p className="text-[10px] text-green-400/60 mt-0.5">
                {Math.round(s.confidence * 100)}% confidence • {s.mastery_level || "proficient"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { TrendingUp, CheckCircle2, BookOpen, Award, BarChart3 } from "lucide-react";
import type { ProgressStats, StudentProgress, LearningMaterial } from "@/lib/api/learningGenerator";

interface ProgressStatsProps {
  stats: ProgressStats | null;
  progress?: StudentProgress[];
  materials?: LearningMaterial[];
}

export default function ProgressStatsCards({ stats, progress, materials }: ProgressStatsProps) {
  if (!stats) return null;

  const totalMaterials = materials?.length ?? stats.total_materials ?? 0;

  const progressMap = new Map<string, StudentProgress>();
  (progress ?? []).forEach((p) => progressMap.set(p.material_id, p));

  let completedMaterials = 0;
  let inProgressMaterials = 0;
  let completedSteps = 0;
  let totalSteps = 0;
  const quizScores: number[] = [];

  (materials ?? []).forEach((mat) => {
    const prog = progressMap.get(mat._id);
    const total = prog?.total_steps ?? mat.structured_material?.lesson?.step_by_step_guide?.steps?.length ?? 0;
    const completed = prog?.completed_steps?.length ?? 0;
    totalSteps += total;
    completedSteps += completed;
    if (prog && prog.quiz_score !== null && prog.quiz_score !== undefined) {
      quizScores.push(prog.quiz_score);
    }
    if (prog?.completed_at) {
      completedMaterials++;
    } else if (prog && prog.completed_steps.length > 0) {
      inProgressMaterials++;
    }
  });

  const notStartedMaterials = totalMaterials - completedMaterials - inProgressMaterials;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : null;

  const tiles = [
    { label: "Overall Progress", value: `${progressPercentage}%`, color: "text-teal-400", icon: TrendingUp, iconColor: "text-teal-400 bg-teal-500/10" },
    { label: "Modules Completed", value: String(completedMaterials), color: "text-green-400", icon: CheckCircle2, iconColor: "text-green-400 bg-green-500/10" },
    { label: "In Progress", value: String(inProgressMaterials), color: "text-amber-400", icon: BookOpen, iconColor: "text-amber-400 bg-amber-500/10" },
    { label: "Avg Quiz Score", value: avgQuizScore === null ? "—" : String(avgQuizScore), color: "text-purple-400", icon: Award, iconColor: "text-purple-400 bg-purple-500/10" },
  ];

  return (
    <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
        {tiles.map((t) => (
          <div key={t.label} className="flex items-center gap-3 px-4 py-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${t.iconColor}`}>
              <t.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className={`text-2xl font-black leading-none ${t.color}`}>{t.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1 truncate">{t.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60 font-medium flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-teal-400" /> Learning Progress
          </span>
          <span className="text-xs text-white font-bold">{completedSteps} / {totalSteps} steps</span>
        </div>
        <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-linear-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-sm font-black text-green-400">{completedMaterials}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Completed</p>
          </div>
          <div>
            <p className="text-sm font-black text-amber-400">{inProgressMaterials}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">In Progress</p>
          </div>
          <div>
            <p className="text-sm font-black text-white/60">{notStartedMaterials}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Not Started</p>
          </div>
        </div>
      </div>
    </div>
  );
}

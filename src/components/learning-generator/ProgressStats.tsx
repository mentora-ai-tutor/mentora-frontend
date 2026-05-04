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
  let quizScores: number[] = [];

  (materials ?? []).forEach((mat) => {
    const prog = progressMap.get(mat._id);
    if (prog) {
      completedSteps += prog.completed_steps.length;
      totalSteps += prog.total_steps;
      if (prog.quiz_score !== null && prog.quiz_score !== undefined) {
        quizScores.push(prog.quiz_score);
      }
      if (prog.completed_at) {
        completedMaterials++;
      } else if (prog.completed_steps.length > 0) {
        inProgressMaterials++;
      }
    }
  });

  const notStartedMaterials = totalMaterials - completedMaterials - inProgressMaterials;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : null;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{progressPercentage}%</p>
          <p className="text-xs text-white/40 mt-1">Overall Progress</p>
        </div>

        <div className="p-5 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{completedMaterials}</p>
          <p className="text-xs text-white/40 mt-1">Modules Completed</p>
        </div>

        <div className="p-5 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{inProgressMaterials}</p>
          <p className="text-xs text-white/40 mt-1">In Progress</p>
        </div>

        <div className="p-5 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{avgQuizScore ?? "—"}</p>
          <p className="text-xs text-white/40 mt-1">Avg Quiz Score</p>
        </div>
      </div>

      <div className="p-6 bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl transition-all hover:scale-[1.01]">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-400" /> Learning Progress
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Steps Completed</span>
              <span className="text-white font-bold">{completedSteps} / {totalSteps}</span>
            </div>
            <div className="w-full h-3 bg-[#0F172A] rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-2xl font-black text-green-400">{completedMaterials}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-amber-400">{inProgressMaterials}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white/50">{notStartedMaterials}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Not Started</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

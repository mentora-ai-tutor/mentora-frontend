"use client";

import { TrendingUp, CheckCircle2, BookOpen, Award, BarChart3 } from "lucide-react";
import type { ProgressStats } from "@/lib/api/learningGenerator";

interface ProgressStatsProps {
  stats: ProgressStats | null;
}

export default function ProgressStatsCards({ stats }: ProgressStatsProps) {
  if (!stats) return null;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats.progress_percentage ?? 0}%</p>
          <p className="text-xs text-white/40 mt-1">Overall Progress</p>
        </div>

        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats.completed_materials ?? 0}</p>
          <p className="text-xs text-white/40 mt-1">Modules Completed</p>
        </div>

        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats.in_progress_materials ?? 0}</p>
          <p className="text-xs text-white/40 mt-1">In Progress</p>
        </div>

        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats.avg_quiz_score ?? "—"}</p>
          <p className="text-xs text-white/40 mt-1">Avg Quiz Score</p>
        </div>
      </div>

      <div className="p-6 bg-linear-to-br from-[#334155]/30 to-[#0F172A] border border-white/5 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-400" /> Learning Progress
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Steps Completed</span>
              <span className="text-white font-bold">{stats.completed_steps} / {stats.total_steps}</span>
            </div>
            <div className="w-full h-3 bg-[#334155] rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${stats.progress_percentage}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-2xl font-black text-green-400">{stats.completed_materials}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-amber-400">{stats.in_progress_materials}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white/50">{stats.not_started_materials}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Not Started</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

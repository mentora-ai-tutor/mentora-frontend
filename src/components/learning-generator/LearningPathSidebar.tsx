"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Lock, ChevronLeft } from "lucide-react";
import type { LearningMaterial } from "@/lib/api/learningGenerator";

interface LearningPathSidebarProps {
  material: LearningMaterial;
  steps: Array<{ id: string; title: string; type: string }>;
  activeStep: number;
  completedSteps: number[];
  onStepSelect: (index: number) => void;
  saveProgress: (stepIndex: number, isComplete?: boolean) => void;
}

export default function LearningPathSidebar({
  material,
  steps,
  activeStep,
  completedSteps,
  onStepSelect,
  saveProgress,
}: LearningPathSidebarProps) {
  const sm = material.structured_material;

  return (
    <div className="w-72 shrink-0 bg-[#0F172A] border-r border-white/5 flex-col z-10 hidden xl:flex">
      <div className="p-6 pb-2">
        <Link href="/learning-generator" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-bold mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Plan
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-3">
          {sm.difficulty_level} Module
        </div>
        <h2 className="text-xl font-black mb-1 text-white">{sm.topic}</h2>
        <p className="text-white/40 text-xs mb-2">{steps.length} steps • {completedSteps.length} completed</p>

        <div className="w-full h-1.5 bg-[#334155]/50 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1 custom-scrollbar">
        {steps.map((step, idx) => {
          const isCompleted = completedSteps.includes(idx);
          const isActive = activeStep === idx;
          const maxUnlocked = Math.max(...completedSteps, -1) + 1;
          const isLocked = idx > maxUnlocked;

          return (
            <button
              key={step.id}
              disabled={isLocked}
              onClick={() => {
                onStepSelect(idx);
                saveProgress(idx);
              }}
              className={`w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all ${
                isActive
                  ? "bg-[#334155]/40 border border-teal-500/30 shadow-[0_0_15px_rgba(13,148,136,0.1)]"
                  : isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className={`shrink-0 flex items-center justify-center ${isActive ? 'text-teal-400' : isCompleted ? 'text-teal-500' : 'text-white/20'}`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : <Circle className="w-5 h-5" />}
              </div>
              <div>
                <p className={`text-sm font-bold ${isActive ? 'text-teal-300' : isLocked ? 'text-white/40' : 'text-white/80'}`}>
                  {idx + 1}. {step.title}
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{step.type}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

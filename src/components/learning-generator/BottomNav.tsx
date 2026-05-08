"use client";

import { Loader2, ChevronRight } from "lucide-react";

interface BottomNavProps {
  activeStep: number;
  steps: Array<{ id: string; title: string; type: string }>;
  savingProgress: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function BottomNav({
  activeStep,
  steps,
  savingProgress,
  onPrevious,
  onNext,
}: BottomNavProps) {
  return (
    <div className="h-20 bg-[#0F172A] border-t border-white/5 flex items-center justify-between px-6 lg:px-10 shrink-0 z-20">
      <button
        onClick={onPrevious}
        disabled={activeStep === 0}
        className="px-5 py-2.5 text-white/50 font-semibold hover:text-white disabled:opacity-30 transition-colors"
      >
        Previous
      </button>

      {activeStep < steps.length - 1 && (
        <button
          onClick={onNext}
          disabled={savingProgress}
          className="px-8 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(13,148,136,0.2)] flex items-center gap-2 group"
        >
          {savingProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Next Concept <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}

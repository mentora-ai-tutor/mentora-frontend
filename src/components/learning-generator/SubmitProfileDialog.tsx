"use client";

import { createPortal } from "react-dom";
import { Sparkles, Loader2, CheckCircle2, Plus } from "lucide-react";

interface SubmitProfileDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export default function SubmitProfileDialog({ isOpen, isSubmitting, onSubmit, onClose }: SubmitProfileDialogProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />
      <div className="relative max-w-lg w-full bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-6 animate-slide-up">
        <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" /> Generate Materials
        </h2>
        <p className="text-sm text-white/50 mb-6">
          This will send your knowledge gaps to the AI engine. Processing takes 2-10 minutes.
        </p>

        <div className="p-4 bg-[#0F172A]/50 border border-white/5 rounded-xl mb-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">What gets sent:</p>
          <ul className="text-sm text-white/70 space-y-1.5">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Knowledge gaps with misconceptions</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Strengths and skill level</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Evidence from quizzes, sandbox, and GitHub</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-[#334155]/30 border border-white/10 text-white font-bold rounded-xl hover:bg-[#334155]/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-colors shadow-[0_0_20px_rgba(13,148,136,0.3)] disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Submit & Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

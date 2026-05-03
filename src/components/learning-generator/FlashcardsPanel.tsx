"use client";

import { Layers, Loader2, X } from "lucide-react";
import type { Flashcard } from "@/lib/api/aiEngine";

interface FlashcardsPanelProps {
  show: boolean;
  flashcards: Flashcard[];
  isLoading: boolean;
  activeCard: number;
  onClose: () => void;
  onCardSelect: (index: number) => void;
  onRegenerate: () => void;
}

export default function FlashcardsPanel({
  show, flashcards, isLoading, activeCard,
  onClose, onCardSelect, onRegenerate,
}: FlashcardsPanelProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-96 h-full bg-[#0F172A] border-l border-white/10 animate-slide-up flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white">Concept Flashcards</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-teal-400/60 justify-center py-12"><Loader2 className="w-4 h-4 animate-spin" /> Generating flashcards...</div>
          ) : flashcards.length > 0 ? (
            <div className="space-y-3">
              {flashcards.map((card, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    i === activeCard ? "bg-teal-500/10 border-teal-500/30" : "bg-[#334155]/20 border-white/5 hover:border-white/20"
                  }`}
                  onClick={() => onCardSelect(i)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{card.concept}</h3>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      card.difficulty === "beginner" ? "bg-green-500/20 text-green-400" : card.difficulty === "intermediate" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                    }`}>{card.difficulty}</span>
                  </div>
                  {i === activeCard && (
                    <div className="space-y-2 animate-fade-in">
                      <p className="text-xs text-white/60">{card.definition}</p>
                      <pre className="text-[10px] font-mono text-teal-200/70 bg-black/30 p-2 rounded-lg whitespace-pre-wrap">{card.example}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Layers className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/40 mb-3">No concepts detected.</p>
              <button onClick={onRegenerate} className="px-4 py-2 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg hover:bg-teal-600/30">
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

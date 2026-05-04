"use client";

import { useState } from "react";
import { Sparkles, X, Wand2, Loader2 } from "lucide-react";
import type { CodeReviewAnnotation } from "@/lib/api/aiEngine";

interface WorkspaceEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextSelection: () => void;
  showExplanation: boolean;
  highlightedCode: string;
  aiExplanation: string | null;
  isExplaining: boolean;
  explanationPosition: { top: number; left: number };
  onExplainSelected: () => void;
  onCloseExplanation: () => void;
  reviewMode: boolean;
  reviewData: { annotations: CodeReviewAnnotation[] } | null;
}

export default function WorkspaceEditor({
  code, onCodeChange, onKeyDown, onTextSelection,
  showExplanation, highlightedCode, aiExplanation, isExplaining,
  explanationPosition, onExplainSelected, onCloseExplanation,
  reviewMode, reviewData,
}: WorkspaceEditorProps) {
  const renderAnnotations = () => {
    if (!reviewMode || !reviewData) return null;
    const lines = code.split("\n");
    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        {reviewData.annotations.map((ann, i) => (
          <div
            key={i}
            className={`absolute left-0 right-0 border-l-2 ${
              ann.severity === "high" ? "border-red-500 bg-red-500/10" : ann.severity === "medium" ? "border-amber-500 bg-amber-500/10" : "border-blue-500 bg-blue-500/10"
            }`}
            style={{
              top: `${((ann.line_start - 1) / lines.length) * 100}%`,
              height: `${Math.max(ann.line_end - ann.line_start + 1, 1) / lines.length * 100}%`,
            }}
          >
            <div className="absolute left-1 top-0 pointer-events-auto">
              <div className="relative group">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                  ann.severity === "high" ? "bg-red-500" : ann.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                }`}>
                  {i + 1}
                </div>
                <div className="absolute left-6 top-0 w-64 p-3 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-auto">
                  <p className="text-xs font-bold text-white mb-1">{ann.category}</p>
                  <p className="text-xs text-white/70 mb-2">{ann.message}</p>
                  <p className="text-[10px] text-teal-400">{ann.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative">
      <div className="flex items-center justify-between px-4 py-1 bg-[#0F172A] border-b border-white/5 shrink-0">
        <span className="text-[10px] font-mono text-white/40">Main.java</span>
        <span className="text-[9px] text-white/15">Ctrl+Enter to run</span>
      </div>
      <div className="flex-1 relative">
        {renderAnnotations()}
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={onKeyDown}
          onMouseUp={onTextSelection}
          spellCheck={false}
          placeholder="// Write your Java code here..."
          className="absolute inset-0 w-full h-full p-4 bg-transparent text-white/90 font-mono text-sm leading-relaxed resize-none outline-none focus:ring-0 custom-scrollbar whitespace-pre placeholder:text-white/20"
          style={{ tabSize: 4 }}
        />
      </div>

      {showExplanation && highlightedCode && (
        <div
          className="absolute z-50 w-80 bg-[#1e293b] border border-teal-500/30 rounded-xl shadow-2xl animate-slide-up"
          style={{ top: explanationPosition.top, left: Math.max(0, explanationPosition.left - 80) }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-teal-500/20 bg-teal-500/5 rounded-t-xl">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[10px] font-bold text-teal-400 uppercase">AI Explainer</span>
            </div>
            <button onClick={onCloseExplanation} className="text-white/30 hover:text-white"><X className="w-3 h-3" /></button>
          </div>
          <div className="p-3">
            <pre className="text-[10px] text-white/40 bg-black/30 p-2 rounded-lg font-mono mb-2 overflow-x-auto whitespace-pre-wrap">{highlightedCode}</pre>
            {isExplaining ? (
              <div className="flex items-center gap-2 text-xs text-teal-400/60">
                <Loader2 className="w-3 h-3 animate-spin" /> Explaining...
              </div>
            ) : aiExplanation ? (
              <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{aiExplanation}</p>
            ) : (
              <button onClick={onExplainSelected} className="w-full py-1.5 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg hover:bg-teal-600/30 flex items-center justify-center gap-1">
                <Wand2 className="w-3 h-3" /> Explain This
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

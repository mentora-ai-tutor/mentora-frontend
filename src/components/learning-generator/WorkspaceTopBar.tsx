"use client";

import Link from "next/link";
import { ChevronLeft, Code2, Play, RotateCcw, Loader2, Terminal, Layers, TestTube, BarChart3, Eye } from "lucide-react";

interface WorkspaceTopBarProps {
  showStdin: boolean;
  reviewMode: boolean;
  showTimeline: boolean;
  code: string;
  isExecuting: boolean;
  onToggleStdin: () => void;
  onOpenFlashcards: () => void;
  onOpenTests: () => void;
  onToggleTimeline: () => void;
  onCodeReview: () => void;
  onResetCode: () => void;
  onRunCode: () => void;
}

export default function WorkspaceTopBar({
  showStdin, reviewMode, showTimeline, code, isExecuting,
  onToggleStdin, onOpenFlashcards, onOpenTests,
  onToggleTimeline, onCodeReview, onResetCode, onRunCode,
}: WorkspaceTopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[var(--lmg-code-header)] border-b border-[var(--lmg-border)] shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <Link href="/learning-generator/materials" className="text-[var(--lmg-text-muted)] hover:text-[var(--lmg-text-primary)] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h1 className="text-sm font-bold text-[var(--lmg-text-primary)]">Code Sandbox</h1>
        </div>
        <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">
          Java
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={onToggleStdin} className={`p-1.5 rounded-lg transition-colors text-xs ${showStdin ? "bg-teal-500/20 text-teal-600 dark:text-teal-400" : "text-[var(--lmg-text-muted)] hover:text-[var(--lmg-text-primary)] hover:bg-[var(--lmg-bg-surface-hover)]"}`} title="Stdin Input">
          <Terminal className="w-3.5 h-3.5" />
        </button>
        <button onClick={onOpenFlashcards} className="p-1.5 rounded-lg text-[var(--lmg-text-muted)] hover:text-teal-600 dark:hover:text-teal-400 hover:bg-[var(--lmg-bg-surface-hover)] transition-colors" title="Concept Flashcards">
          <Layers className="w-3.5 h-3.5" />
        </button>
        <button onClick={onOpenTests} className="p-1.5 rounded-lg text-[var(--lmg-text-muted)] hover:text-teal-600 dark:hover:text-teal-400 hover:bg-[var(--lmg-bg-surface-hover)] transition-colors" title="JUnit Test Generator">
          <TestTube className="w-3.5 h-3.5" />
        </button>
        <button onClick={onToggleTimeline} className={`p-1.5 rounded-lg transition-colors text-xs ${showTimeline ? "bg-teal-500/20 text-teal-600 dark:text-teal-400" : "text-[var(--lmg-text-muted)] hover:text-[var(--lmg-text-primary)] hover:bg-[var(--lmg-bg-surface-hover)]"}`} title="Execution Timeline">
          <BarChart3 className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-[var(--lmg-border)] mx-1" />
        <button onClick={onCodeReview} className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 ${reviewMode ? "bg-purple-500/20 text-purple-600 dark:text-purple-400" : "text-[var(--lmg-text-muted)] hover:text-[var(--lmg-text-primary)] hover:bg-[var(--lmg-bg-surface-hover)]"}`} title="Code Review">
          <Eye className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Review</span>
        </button>
        <button onClick={onResetCode} className="p-1.5 text-[var(--lmg-text-muted)] hover:text-[var(--lmg-text-primary)] hover:bg-[var(--lmg-bg-surface-hover)] rounded-lg transition-colors" title="Reset All">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button onClick={onRunCode} disabled={!code.trim() || isExecuting} className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-wait text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
          {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          {isExecuting ? "Running..." : "Run"}
        </button>
      </div>
    </div>
  );
}

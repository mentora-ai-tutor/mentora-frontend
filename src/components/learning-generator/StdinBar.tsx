"use client";

import { Terminal } from "lucide-react";

interface StdinBarProps {
  stdinInput: string;
  onInputChange: (value: string) => void;
  onClear: () => void;
}

export default function StdinBar({ stdinInput, onInputChange, onClear }: StdinBarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/5 border-b border-amber-500/20 shrink-0">
      <Terminal className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase shrink-0">stdin:</span>
      <input
        type="text"
        value={stdinInput}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Enter input for Scanner (press Enter for newlines)..."
        className="flex-1 bg-transparent text-xs text-[var(--lmg-text-primary)] outline-none font-mono placeholder:text-[var(--lmg-text-muted)]/50"
      />
      <button onClick={onClear} className="text-[var(--lmg-text-muted)] hover:text-[var(--lmg-text-secondary)] text-xs">Clear</button>
    </div>
  );
}

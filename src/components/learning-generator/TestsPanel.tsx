"use client";

import { TestTube, Loader2, X, Copy } from "lucide-react";

interface TestsPanelProps {
  show: boolean;
  testCode: string | null;
  testExplanation: string | null;
  isGenerating: boolean;
  onClose: () => void;
  onGenerate: () => void;
  onCopy: () => void;
}

export default function TestsPanel({
  show, testCode, testExplanation, isGenerating,
  onClose, onGenerate, onCopy,
}: TestsPanelProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-112.5 h-full bg-[#0F172A] border-l border-white/10 animate-slide-up flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <TestTube className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white">JUnit Test Generator</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {isGenerating ? (
            <div className="flex items-center gap-2 text-sm text-teal-400/60 justify-center py-12"><Loader2 className="w-4 h-4 animate-spin" /> Generating tests...</div>
          ) : testCode ? (
            <div className="space-y-3">
              {testExplanation && <p className="text-xs text-white/50">{testExplanation}</p>}
              <div className="relative">
                <pre className="text-xs font-mono text-teal-200/80 bg-black/30 p-4 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">{testCode}</pre>
                <button
                  onClick={onCopy}
                  className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/30 hover:text-white transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TestTube className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <button onClick={onGenerate} className="px-4 py-2 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg hover:bg-teal-600/30">
                Generate JUnit Tests
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

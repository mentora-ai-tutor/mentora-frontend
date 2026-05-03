"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { aiEngineApi, type CodeExecutionResult } from "@/lib/api/aiEngine";
import {
  Play, RotateCcw, Terminal, Sparkles, Brain, Loader2,
  CheckCircle2, XCircle, ChevronLeft, Code2,
} from "lucide-react";

export default function WorkspaceSandbox() {
  const { user } = useAuth();
  const [code, setCode] = useState(
    `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Mentora!");\n    }\n}`
  );
  const [output, setOutput] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompilationError, setIsCompilationError] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "feedback">("output");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsExecuting(true);
    setOutput(null);
    setExecutionError(null);
    setAiFeedback(null);
    setActiveTab("output");

    try {
      const res = await aiEngineApi.executeCode(code, "sandbox");
      if (res.data) {
        const { success, output: runOutput, error: runError, is_compilation_error: isCompError } = res.data;

        setIsCompilationError(isCompError);

        if (runError) {
          setExecutionError(runError);
        } else {
          setOutput(runOutput);
        }

        try {
          setIsAiLoading(true);
          const fbRes = await aiEngineApi.getFeedback(code, runOutput || undefined, runError || undefined, "sandbox");
          if (fbRes.data) {
            setAiFeedback(fbRes.data.feedback);
          }
        } catch {
          setAiFeedback("AI feedback unavailable right now.");
        } finally {
          setIsAiLoading(false);
        }
      }
    } catch {
      setExecutionError("Execution service unavailable. Please try again.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetCode = () => {
    setCode(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Mentora!");\n    }\n}`);
    setOutput(null);
    setExecutionError(null);
    setAiFeedback(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      setCode((prev) => prev.substring(0, start) + "    " + prev.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunCode();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0F172A] text-white overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0b1021] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/learning-generator/workspace" className="text-white/30 hover:text-white/60 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-teal-400" />
            <h1 className="text-sm font-bold text-white">Code Sandbox</h1>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded text-[10px] font-bold text-teal-400 uppercase tracking-wider">
            Java
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCode}
            className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRunCode}
            disabled={!code.trim() || isExecuting}
            className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-wait text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-teal-900/20"
          >
            {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {isExecuting ? "Compiling..." : "Run Code"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/5">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border-b border-white/5 shrink-0">
            <span className="text-xs font-mono text-white/40">Main.java</span>
            <span className="text-[10px] text-white/20 ml-auto">Ctrl+Enter to run</span>
          </div>
          <div className="flex-1 relative">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="// Write your Java code here..."
              className="absolute inset-0 w-full h-full p-6 bg-transparent text-white/90 font-mono text-sm leading-relaxed resize-none outline-none focus:ring-0 custom-scrollbar whitespace-pre placeholder:text-white/20"
              style={{ tabSize: 4 }}
            />
          </div>
        </div>

        {/* Output & AI Feedback Panel */}
        <div className="w-[45%] flex flex-col bg-[#0F172A]">
          {/* Tab Headers */}
          <div className="flex border-b border-white/5 shrink-0">
            <button
              onClick={() => setActiveTab("output")}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === "output"
                  ? "border-teal-500 text-teal-400"
                  : "border-transparent text-white/30 hover:text-white/50"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Output {executionError && <span className="w-2 h-2 rounded-full bg-red-500" />}
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === "feedback"
                  ? "border-teal-500 text-teal-400"
                  : "border-transparent text-white/30 hover:text-white/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Feedback {isAiLoading && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />} {!isAiLoading && aiFeedback && <span className="w-2 h-2 rounded-full bg-green-500" />}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {activeTab === "output" && (
              <div className="space-y-3">
                {isExecuting && !output && !executionError && (
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Compiling and running...
                  </div>
                )}

                {!isExecuting && !output && !executionError && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Terminal className="w-8 h-8 text-white/10 mb-3" />
                    <p className="text-sm text-white/30 italic">Hit Run Code to see output here.</p>
                  </div>
                )}

                {output && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400 font-bold">Exit code: 0 — Execution successful</span>
                    </div>
                    <pre className="font-mono text-xs text-white/70 bg-black/30 p-4 rounded-xl border border-white/5 whitespace-pre-wrap wrap-break-word leading-relaxed">
                      {output}
                    </pre>
                  </div>
                )}

                {executionError && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className={`text-xs font-bold ${isCompilationError ? "text-amber-400" : "text-red-400"}`}>
                        {isCompilationError ? "Compilation Error" : "Runtime Error"}
                      </span>
                    </div>
                    <pre className="font-mono text-xs text-red-200/80 bg-red-950/40 p-4 rounded-xl border border-red-500/20 whitespace-pre-wrap wrap-break-word leading-relaxed">
                      {executionError}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="space-y-3">
                {isAiLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Brain className="w-4 h-4 text-teal-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-teal-400/60 uppercase tracking-wider font-bold mb-2">Mentora AI is Thinking</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                {!isExecuting && !aiFeedback && !isAiLoading && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="w-8 h-8 text-white/10 mb-3" />
                    <p className="text-sm text-white/30 italic">Run your code to get AI feedback.</p>
                  </div>
                )}

                {aiFeedback && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Brain className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-teal-400/60 uppercase tracking-wider font-bold mb-1">Mentora AI</p>
                      <p className="text-sm text-teal-50 leading-relaxed whitespace-pre-wrap">{aiFeedback}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

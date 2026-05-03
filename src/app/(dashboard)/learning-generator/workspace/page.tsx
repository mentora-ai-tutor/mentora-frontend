"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { aiEngineApi, type CodeExecutionResult, type CodeReviewAnnotation, type Flashcard, type CodeReviewResult } from "@/lib/api/aiEngine";
import {
  Play, RotateCcw, Terminal, Sparkles, Brain, Loader2,
  CheckCircle2, XCircle, ChevronLeft, Code2,
  Zap, FileText, Lightbulb, AlertTriangle, Eye,
  BarChart3, Layers, FlaskConical, ChevronRight, ChevronDown,
  X, Copy, Check, ArrowRight, Wand2, Monitor,
  Clock, TestTube, MemoryStick,
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
  const [activeTab, setActiveTab] = useState<"output" | "feedback" | "review" | "fix">("output");
  const [stdinInput, setStdinInput] = useState("");
  const [showStdin, setShowStdin] = useState(false);

  const [highlightedCode, setHighlightedCode] = useState("");
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationPosition, setExplanationPosition] = useState({ top: 0, left: 0 });

  const [fixSuggestion, setFixSuggestion] = useState<{ suggested_fix: string; fixed_code: string; explanation: string } | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  const [reviewMode, setReviewMode] = useState(false);
  const [reviewData, setReviewData] = useState<CodeReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false);
  const [activeFlashcard, setActiveFlashcard] = useState(0);

  const [testCode, setTestCode] = useState<string | null>(null);
  const [testExplanation, setTestExplanation] = useState<string | null>(null);
  const [showTests, setShowTests] = useState(false);
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);

  const [structuredOutput, setStructuredOutput] = useState<object | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [executionTimeline, setExecutionTimeline] = useState<{ method: string; duration: string }[]>([]);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsExecuting(true);
    setOutput(null);
    setExecutionError(null);
    setAiFeedback(null);
    setStructuredOutput(null);
    setFixSuggestion(null);
    setReviewData(null);
    setActiveTab("output");

    try {
      const res = await aiEngineApi.executeCode(code, "sandbox", stdinInput || undefined);
      if (res.data) {
        const { success, output: runOutput, error: runError, is_compilation_error: isCompError } = res.data;
        setIsCompilationError(isCompError);

        if (runError) {
          setExecutionError(runError);
          setActiveTab("fix");
        } else if (runOutput) {
          setOutput(runOutput);
          tryAutoFormatOutput(runOutput);
          extractTimeline(runOutput);
        }

        try {
          setIsAiLoading(true);
          const fbRes = await aiEngineApi.getFeedback(code, runOutput || undefined, runError || undefined, "sandbox");
          if (fbRes.data) setAiFeedback(fbRes.data.feedback);
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

  const tryAutoFormatOutput = (raw: string) => {
    const trimmed = raw.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        setStructuredOutput(JSON.parse(trimmed));
      } catch {
        setStructuredOutput(null);
      }
    }
  };

  const extractTimeline = (raw: string) => {
    const lines = raw.split("\n").filter(Boolean);
    const timeline = lines.map((line, i) => ({
      method: i === 0 ? "main()" : `line ${i + 1}`,
      duration: `${Math.floor(Math.random() * 50 + 5)}ms`,
    }));
    setExecutionTimeline(timeline);
  };

  const handleResetCode = () => {
    setCode(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Mentora!");\n    }\n}`);
    setOutput(null);
    setExecutionError(null);
    setAiFeedback(null);
    setFixSuggestion(null);
    setReviewData(null);
    setStructuredOutput(null);
    setShowExplanation(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      setCode((prev) => prev.substring(0, start) + "    " + prev.substring(end));
      setTimeout(() => { target.selectionStart = target.selectionEnd = start + 4; }, 0);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunCode();
    }
  };

  const handleTextSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      const selected = sel.toString().trim();
      if (selected.length > 5 && selected.length < 500 && code.includes(selected)) {
        setHighlightedCode(selected);
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setExplanationPosition({ top: rect.bottom + 8, left: rect.left });
      }
    } else {
      setHighlightedCode("");
    }
  }, [code]);

  const handleExplainSelected = async () => {
    if (!highlightedCode) return;
    setIsExplaining(true);
    setShowExplanation(true);
    setAiExplanation(null);
    try {
      const res = await aiEngineApi.explainHighlightedCode(code, highlightedCode);
      if (res.data) setAiExplanation(res.data.explanation);
    } catch {
      setAiExplanation("Unable to explain right now.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleFixError = async () => {
    if (!executionError) return;
    setIsFixing(true);
    setFixSuggestion(null);
    try {
      const res = await aiEngineApi.fixError(code, executionError);
      if (res.data) setFixSuggestion({ suggested_fix: res.data.suggested_fix, fixed_code: res.data.fixed_code, explanation: res.data.explanation });
    } catch {
      setFixSuggestion({ suggested_fix: "Unable to generate fix.", fixed_code: code, explanation: "Try reviewing the error message." });
    } finally {
      setIsFixing(false);
    }
  };

  const handleApplyFix = () => {
    if (fixSuggestion?.fixed_code) {
      setCode(fixSuggestion.fixed_code);
      setFixSuggestion(null);
      setExecutionError(null);
    }
  };

  const handleCodeReview = async () => {
    setReviewMode(!reviewMode);
    if (!reviewData && !isReviewing) {
      setIsReviewing(true);
      try {
        const res = await aiEngineApi.codeReview(code);
        if (res.data) setReviewData(res.data);
      } catch {
        setReviewData({ annotations: [], summary: "Review unavailable.", overall_score: 0, model: "" });
      } finally {
        setIsReviewing(false);
      }
    }
  };

  const handleGenerateFlashcards = async () => {
    setShowFlashcards(true);
    setIsLoadingFlashcards(true);
    try {
      const res = await aiEngineApi.getFlashcards(code);
      if (res.data) setFlashcards(res.data.flashcards);
    } catch {
      setFlashcards([]);
    } finally {
      setIsLoadingFlashcards(false);
    }
  };

  const handleGenerateTests = async () => {
    setShowTests(true);
    setIsGeneratingTests(true);
    setTestCode(null);
    try {
      const res = await aiEngineApi.generateTests(code, "Main");
      if (res.data) {
        setTestCode(res.data.test_code);
        setTestExplanation(res.data.test_explanation);
      }
    } catch {
      setTestCode("// Unable to generate tests.");
    } finally {
      setIsGeneratingTests(false);
    }
  };

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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0F172A] text-white overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0b1021] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/learning-generator/materials" className="text-white/30 hover:text-white/60 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-teal-400" />
            <h1 className="text-sm font-bold text-white">Code Sandbox</h1>
          </div>
          <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded text-[10px] font-bold text-teal-400 uppercase">
            Java
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowStdin(!showStdin)} className={`p-1.5 rounded-lg transition-colors text-xs ${showStdin ? "bg-teal-500/20 text-teal-400" : "text-white/30 hover:text-white hover:bg-white/5"}`} title="Stdin Input">
            <Terminal className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleGenerateFlashcards} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors" title="Concept Flashcards">
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleGenerateTests} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors" title="Generate Tests">
            <TestTube className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setShowTimeline(!showTimeline)} className={`p-1.5 rounded-lg transition-colors text-xs ${showTimeline ? "bg-teal-500/20 text-teal-400" : "text-white/30 hover:text-white hover:bg-white/5"}`} title="Execution Timeline">
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button onClick={handleCodeReview} className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 ${reviewMode ? "bg-purple-500/20 text-purple-400" : "text-white/30 hover:text-white hover:bg-white/5"}`} title="Code Review">
            <Eye className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Review</span>
          </button>
          <button onClick={handleResetCode} className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Reset">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleRunCode} disabled={!code.trim() || isExecuting} className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-wait text-white text-xs font-bold rounded-lg transition-colors">
            {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isExecuting ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Stdin Bar */}
      {showStdin && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/5 border-b border-amber-500/20 shrink-0">
          <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] text-amber-400 font-bold uppercase shrink-0">stdin:</span>
          <input
            type="text"
            value={stdinInput}
            onChange={(e) => setStdinInput(e.target.value)}
            placeholder="Enter input for Scanner (press Enter for newlines)..."
            className="flex-1 bg-transparent text-xs text-white/70 outline-none font-mono placeholder:text-white/20"
          />
          <button onClick={() => setStdinInput("")} className="text-white/20 hover:text-white/50 text-xs">Clear</button>
        </div>
      )}

      {/* Main Area */}
      <div className="flex flex-1 min-h-0">
        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative">
          <div className="flex items-center justify-between px-4 py-1 bg-[#0F172A] border-b border-white/5 shrink-0">
            <span className="text-[10px] font-mono text-white/40">Main.java</span>
            <span className="text-[9px] text-white/15">Ctrl+Enter to run</span>
          </div>
          <div className="flex-1 relative">
            {renderAnnotations()}
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onMouseUp={handleTextSelection}
              spellCheck={false}
              placeholder="// Write your Java code here..."
              className="absolute inset-0 w-full h-full p-4 bg-transparent text-white/90 font-mono text-sm leading-relaxed resize-none outline-none focus:ring-0 custom-scrollbar whitespace-pre placeholder:text-white/20"
              style={{ tabSize: 4 }}
            />
          </div>

          {/* Floating Explainer */}
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
                <button onClick={() => { setShowExplanation(false); setAiExplanation(null); }} className="text-white/30 hover:text-white"><X className="w-3 h-3" /></button>
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
                  <button onClick={handleExplainSelected} className="w-full py-1.5 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg hover:bg-teal-600/30 flex items-center justify-center gap-1">
                    <Wand2 className="w-3 h-3" /> Explain This
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-[40%] flex flex-col bg-[#0F172A]">
          {/* Tabs */}
          <div className="flex border-b border-white/5 shrink-0">
            {([
              { id: "output" as const, icon: Terminal, label: "Output", hasIndicator: !!executionError },
              { id: "feedback" as const, icon: Sparkles, label: "AI", hasIndicator: !!aiFeedback },
              { id: "review" as const, icon: Eye, label: "Review", hasIndicator: reviewData?.annotations?.length },
              { id: "fix" as const, icon: Zap, label: "Fix", hasIndicator: !!executionError },
            ]).map(({ id, icon: Icon, label, hasIndicator }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 px-2 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 border-b-2 transition-colors ${
                  activeTab === id ? "border-teal-500 text-teal-400" : "border-transparent text-white/30 hover:text-white/50"
                }`}
              >
                <Icon className="w-3 h-3" /> {label}
                {hasIndicator && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
            {activeTab === "output" && (
              <div className="space-y-2">
                {isExecuting && !output && !executionError && (
                  <div className="flex items-center gap-2 text-white/40 text-xs"><Loader2 className="w-3 h-3 animate-spin" /> Compiling...</div>
                )}
                {!isExecuting && !output && !executionError && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Terminal className="w-6 h-6 text-white/10 mb-2" />
                    <p className="text-xs text-white/30">Hit Run to see output.</p>
                  </div>
                )}
                {output && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span className="text-[10px] text-green-400 font-bold">Exit 0</span>
                    </div>
                    {structuredOutput ? (
                      <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Layers className="w-3 h-3 text-amber-400" />
                          <span className="text-[10px] text-amber-400 font-bold">Structured View</span>
                        </div>
                        <pre className="text-xs font-mono text-amber-200/80 whitespace-pre-wrap leading-relaxed">
                          {JSON.stringify(structuredOutput, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <pre className="text-xs font-mono text-white/70 bg-black/30 p-3 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">{output}</pre>
                    )}
                  </div>
                )}
                {executionError && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <XCircle className="w-3 h-3 text-red-400" />
                      <span className="text-[10px] font-bold text-red-400">{isCompilationError ? "Compile Error" : "Runtime Error"}</span>
                    </div>
                    <pre className="text-xs font-mono text-red-200/80 bg-red-950/40 p-3 rounded-lg border border-red-500/20 whitespace-pre-wrap leading-relaxed">{executionError}</pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="space-y-2">
                {isAiLoading && (
                  <div className="flex items-center gap-2 text-xs text-teal-400/60"><Loader2 className="w-3 h-3 animate-spin" /> AI thinking...</div>
                )}
                {!isAiLoading && !aiFeedback && (
                  <p className="text-xs text-white/30 text-center py-8">Run code to get AI feedback.</p>
                )}
                {aiFeedback && (
                  <div className="flex gap-2">
                    <Brain className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-teal-400/60 font-bold uppercase mb-1">Mentora AI</p>
                      <p className="text-xs text-teal-50 leading-relaxed whitespace-pre-wrap">{aiFeedback}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "review" && (
              <div className="space-y-2">
                {isReviewing && (
                  <div className="flex items-center gap-2 text-xs text-purple-400/60"><Loader2 className="w-3 h-3 animate-spin" /> Analyzing code...</div>
                )}
                {!isReviewing && !reviewData && (
                  <div className="text-center py-6">
                    <Eye className="w-6 h-6 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/30 mb-3">Click Review in the toolbar to analyze your code.</p>
                    <button onClick={handleCodeReview} className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-500/30">
                      Start Review
                    </button>
                  </div>
                )}
                {reviewData && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-purple-400 font-bold uppercase">Score: {reviewData.overall_score}/10</span>
                      <div className="w-20 h-1.5 bg-[#334155] rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${reviewData.overall_score * 10}%` }} />
                      </div>
                    </div>
                    <p className="text-xs text-white/60">{reviewData.summary}</p>
                    {reviewData.annotations.map((ann, i) => (
                      <div key={i} className={`p-2 rounded-lg border ${
                        ann.severity === "high" ? "bg-red-500/10 border-red-500/20" : ann.severity === "medium" ? "bg-amber-500/10 border-amber-500/20" : "bg-blue-500/10 border-blue-500/20"
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold text-white/40">L{ann.line_start}{ann.line_end !== ann.line_start ? `-L${ann.line_end}` : ""}</span>
                          <span className={`text-[9px] font-bold px-1 rounded ${
                            ann.severity === "high" ? "bg-red-500/30 text-red-300" : ann.severity === "medium" ? "bg-amber-500/30 text-amber-300" : "bg-blue-500/30 text-blue-300"
                          }`}>{ann.severity}</span>
                          <span className="text-[9px] text-white/30">{ann.category}</span>
                        </div>
                        <p className="text-xs text-white/70">{ann.message}</p>
                        <p className="text-[10px] text-teal-400/70 mt-1">{ann.suggestion}</p>
                      </div>
                    ))}
                    {reviewData.annotations.length === 0 && <p className="text-xs text-white/30 text-center py-4">No issues found. Great code!</p>}
                  </div>
                )}
              </div>
            )}

            {activeTab === "fix" && (
              <div className="space-y-2">
                {executionError ? (
                  <>
                    {!isFixing && !fixSuggestion && (
                      <button onClick={handleFixError} className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/20 flex items-center justify-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5" /> AI Fix This Error
                      </button>
                    )}
                    {isFixing && (
                      <div className="flex items-center gap-2 text-xs text-red-400/60"><Loader2 className="w-3 h-3 animate-spin" /> Analyzing error...</div>
                    )}
                    {fixSuggestion && (
                      <div className="space-y-2">
                        <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <p className="text-[10px] text-green-400 font-bold mb-1">Suggested Fix</p>
                          <p className="text-xs text-white/70">{fixSuggestion.suggested_fix}</p>
                        </div>
                        <div className="relative">
                          <div className="bg-black/30 p-3 rounded-lg border border-teal-500/20 max-h-48 overflow-y-auto">
                            {fixSuggestion.fixed_code.split("\n").map((line, i) => {
                              const isFix = line.includes("// FIX:");
                              const [codePart, comment] = isFix ? line.split("// FIX:") : [line, null];
                              return (
                                <div key={i} className={`flex ${isFix ? "bg-amber-500/10 -mx-3 px-3 py-0.5 border-l-2 border-amber-500" : ""}`}>
                                  <span className="text-[9px] text-white/15 w-6 text-right mr-3 shrink-0 select-none">{i + 1}</span>
                                  <code className="text-xs font-mono text-teal-200/80 whitespace-pre-wrap leading-relaxed">
                                    {codePart}
                                    {comment && <span className="text-amber-400/90">// FIX:{comment}</span>}
                                  </code>
                                </div>
                              );
                            })}
                          </div>
                          <button onClick={handleApplyFix} className="absolute top-2 right-2 px-3 py-1.5 bg-teal-600 text-white text-[10px] font-bold rounded-lg hover:bg-teal-500 flex items-center gap-1.5 shadow-lg">
                            <Check className="w-3 h-3" /> Apply Fix
                          </button>
                        </div>
                        <div className="p-2 bg-[#334155]/20 border border-white/5 rounded-lg">
                          <p className="text-[10px] text-white/40 font-bold uppercase mb-1">How it works</p>
                          <p className="text-xs text-white/60 leading-relaxed">{fixSuggestion.explanation}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-white/30 text-center py-8">No errors to fix.</p>
                )}
              </div>
            )}
          </div>

          {/* Execution Timeline */}
          {showTimeline && executionTimeline.length > 0 && (
            <div className="border-t border-white/5 p-2 shrink-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3 h-3 text-white/30" />
                <span className="text-[10px] text-white/40 font-bold uppercase">Execution Timeline</span>
              </div>
              <div className="flex gap-0.5">
                {executionTimeline.map((item, i) => (
                  <div key={i} className="flex-1 h-6 bg-teal-500/20 rounded-sm flex items-center justify-center" title={`${item.method} — ${item.duration}`}>
                    <span className="text-[8px] text-teal-300/60 truncate px-0.5">{item.method}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flashcards Slide Panel */}
      {showFlashcards && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFlashcards(false)} />
          <div className="relative w-96 h-full bg-[#0F172A] border-l border-white/10 animate-slide-up flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold text-white">Concept Flashcards</h2>
              </div>
              <button onClick={() => setShowFlashcards(false)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {isLoadingFlashcards ? (
                <div className="flex items-center gap-2 text-sm text-teal-400/60 justify-center py-12"><Loader2 className="w-4 h-4 animate-spin" /> Generating flashcards...</div>
              ) : flashcards.length > 0 ? (
                <div className="space-y-3">
                  {flashcards.map((card, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        i === activeFlashcard ? "bg-teal-500/10 border-teal-500/30" : "bg-[#334155]/20 border-white/5 hover:border-white/20"
                      }`}
                      onClick={() => setActiveFlashcard(i)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-white">{card.concept}</h3>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          card.difficulty === "beginner" ? "bg-green-500/20 text-green-400" : card.difficulty === "intermediate" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                        }`}>{card.difficulty}</span>
                      </div>
                      {i === activeFlashcard && (
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
                  <button onClick={handleGenerateFlashcards} className="px-4 py-2 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg hover:bg-teal-600/30">
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Slide Panel */}
      {showTests && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTests(false)} />
          <div className="relative w-[450px] h-full bg-[#0F172A] border-l border-white/10 animate-slide-up flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold text-white">JUnit Test Generator</h2>
              </div>
              <button onClick={() => setShowTests(false)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {isGeneratingTests ? (
                <div className="flex items-center gap-2 text-sm text-teal-400/60 justify-center py-12"><Loader2 className="w-4 h-4 animate-spin" /> Generating tests...</div>
              ) : testCode ? (
                <div className="space-y-3">
                  {testExplanation && <p className="text-xs text-white/50">{testExplanation}</p>}
                  <div className="relative">
                    <pre className="text-xs font-mono text-teal-200/80 bg-black/30 p-4 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">{testCode}</pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(testCode)}
                      className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/30 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TestTube className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <button onClick={handleGenerateTests} className="px-4 py-2 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg hover:bg-teal-600/30">
                    Generate JUnit Tests
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

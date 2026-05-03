"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { aiEngineApi, type CodeExecutionResult, type CodeReviewResult, type Flashcard } from "@/lib/api/aiEngine";
import WorkspaceTopBar from "@/components/learning-generator/WorkspaceTopBar";
import StdinBar from "@/components/learning-generator/StdinBar";
import WorkspaceEditor from "@/components/learning-generator/WorkspaceEditor";
import WorkspaceTabs from "@/components/learning-generator/WorkspaceTabs";
import ExecutionTimeline from "@/components/learning-generator/ExecutionTimeline";
import FlashcardsPanel from "@/components/learning-generator/FlashcardsPanel";
import TestsPanel from "@/components/learning-generator/TestsPanel";

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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0F172A] text-white overflow-hidden font-sans">
      <WorkspaceTopBar
        showStdin={showStdin}
        reviewMode={reviewMode}
        showTimeline={showTimeline}
        code={code}
        isExecuting={isExecuting}
        onToggleStdin={() => setShowStdin(!showStdin)}
        onGenerateFlashcards={handleGenerateFlashcards}
        onGenerateTests={handleGenerateTests}
        onToggleTimeline={() => setShowTimeline(!showTimeline)}
        onCodeReview={handleCodeReview}
        onResetCode={handleResetCode}
        onRunCode={handleRunCode}
      />

      {showStdin && (
        <StdinBar
          stdinInput={stdinInput}
          onInputChange={setStdinInput}
          onClear={() => setStdinInput("")}
        />
      )}

      <div className="flex flex-1 min-h-0">
        <WorkspaceEditor
          code={code}
          onCodeChange={setCode}
          onKeyDown={handleKeyDown}
          onTextSelection={handleTextSelection}
          showExplanation={showExplanation}
          highlightedCode={highlightedCode}
          aiExplanation={aiExplanation}
          isExplaining={isExplaining}
          explanationPosition={explanationPosition}
          onExplainSelected={handleExplainSelected}
          onCloseExplanation={() => { setShowExplanation(false); setAiExplanation(null); }}
          reviewMode={reviewMode}
          reviewData={reviewData}
        />

        <WorkspaceTabs
          activeTab={activeTab}
          output={output}
          executionError={executionError}
          isExecuting={isExecuting}
          isCompilationError={isCompilationError}
          aiFeedback={aiFeedback}
          isAiLoading={isAiLoading}
          reviewMode={reviewMode}
          reviewData={reviewData}
          isReviewing={isReviewing}
          fixSuggestion={fixSuggestion}
          isFixing={isFixing}
          structuredOutput={structuredOutput}
          onTabChange={setActiveTab}
          onStartReview={handleCodeReview}
          onFixError={handleFixError}
          onApplyFix={handleApplyFix}
        />
      </div>

      <ExecutionTimeline timeline={executionTimeline} />

      <FlashcardsPanel
        show={showFlashcards}
        flashcards={flashcards}
        isLoading={isLoadingFlashcards}
        activeCard={activeFlashcard}
        onClose={() => setShowFlashcards(false)}
        onCardSelect={setActiveFlashcard}
        onRegenerate={handleGenerateFlashcards}
      />

      <TestsPanel
        show={showTests}
        testCode={testCode}
        testExplanation={testExplanation}
        isGenerating={isGeneratingTests}
        onClose={() => setShowTests(false)}
        onGenerate={handleGenerateTests}
        onCopy={() => { if (testCode) navigator.clipboard.writeText(testCode); }}
      />
    </div>
  );
}

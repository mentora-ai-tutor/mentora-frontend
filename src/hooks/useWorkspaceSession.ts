"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "mentora-workspace-session";

interface WorkspaceSession {
  code: string;
  output: string | null;
  executionError: string | null;
  isExecuting: boolean;
  isCompilationError: boolean;
  aiFeedback: string | null;
  isAiLoading: boolean;
  activeTab: "output" | "feedback" | "review" | "fix";
  stdinInput: string;
  showStdin: boolean;
  highlightedCode: string;
  aiExplanation: string | null;
  isExplaining: boolean;
  showExplanation: boolean;
  explanationPosition: { top: number; left: number };
  fixSuggestion: { suggested_fix: string; fixed_code: string; explanation: string } | null;
  isFixing: boolean;
  reviewMode: boolean;
  reviewData: any | null;
  isReviewing: boolean;
  flashcards: any[];
  showFlashcards: boolean;
  isLoadingFlashcards: boolean;
  activeFlashcard: number;
  testCode: string | null;
  testExplanation: string | null;
  showTests: boolean;
  isGeneratingTests: boolean;
  structuredOutput: object | null;
  showTimeline: boolean;
  executionTimeline: { method: string; duration: string }[];
}

const DEFAULT_STATE: WorkspaceSession = {
  code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Mentora!");\n    }\n}`,
  output: null,
  executionError: null,
  isExecuting: false,
  isCompilationError: false,
  aiFeedback: null,
  isAiLoading: false,
  activeTab: "output",
  stdinInput: "",
  showStdin: false,
  highlightedCode: "",
  aiExplanation: null,
  isExplaining: false,
  showExplanation: false,
  explanationPosition: { top: 0, left: 0 },
  fixSuggestion: null,
  isFixing: false,
  reviewMode: false,
  reviewData: null,
  isReviewing: false,
  flashcards: [],
  showFlashcards: false,
  isLoadingFlashcards: false,
  activeFlashcard: 0,
  testCode: null,
  testExplanation: null,
  showTests: false,
  isGeneratingTests: false,
  structuredOutput: null,
  showTimeline: false,
  executionTimeline: [],
};

function loadSession(): WorkspaceSession {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_STATE;
}

export function useWorkspaceSession() {
  const [session, setSession] = useState<WorkspaceSession>(loadSession);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // storage full or blocked
    }
  }, [session, initialized]);

  const update = useCallback((patch: Partial<WorkspaceSession>) => {
    setSession((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setSession({ ...DEFAULT_STATE });
  }, []);

  return { session, update, reset };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type LearningMaterial, type StudentProgress } from "@/lib/api/learningGenerator";
import { aiEngineApi } from "@/lib/api/aiEngine";
import {
  CheckCircle2, Circle, Lock, Play, RotateCcw, Sparkles,
  Lightbulb, ChevronRight, Check, Target, Brain, Award,
  XCircle, ChevronLeft, Code2, Terminal, ShieldAlert, Loader2, ArrowLeft
} from "lucide-react";

export default function MaterialWorkspace() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const materialId = params.materialId as string;

  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<Array<{ id: string; title: string; type: string }>>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompilationError, setIsCompilationError] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "feedback">("output");
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [insightType, setInsightType] = useState<"simpler" | "analogy" | null>(null);
  const [insightActiveTab, setInsightActiveTab] = useState<"simpler" | "analogy" | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [savingProgress, setSavingProgress] = useState(false);

  const buildSteps = useCallback((mat: LearningMaterial) => {
    const s = mat.structured_material;
    const result: Array<{ id: string; title: string; type: string }> = [];

    if (s.lesson.introduction) result.push({ id: "intro", title: "Introduction", type: "read" });
    if (s.lesson.concept_explained) result.push({ id: "concepts", title: "Concepts & Syntax", type: "read" });
    if (s.lesson.step_by_step_guide) result.push({ id: "guide", title: "Step-by-Step Guide", type: "read" });
    if (s.lesson.examples?.example_1) result.push({ id: "example", title: "Code Examples", type: "code" });
    if (s.lesson.common_mistakes && s.lesson.common_mistakes.length > 0) result.push({ id: "mistakes", title: "Common Mistakes", type: "read" });
    if (s.assessment.practice_challenge) result.push({ id: "practice", title: "Practice Challenge", type: "code" });
    if (s.lesson.debugging_exercise) result.push({ id: "debug", title: "Debugging", type: "code" });
    if (s.assessment.quiz && s.assessment.quiz.length > 0) result.push({ id: "quiz", title: "Mastery Quiz", type: "quiz" });

    return result;
  }, []);

  const storageKey = (key: string) => `mentora_${materialId}_${activeStep}_${key}`;

  const saveInsightToStorage = (type: string, text: string) => {
    try {
      sessionStorage.setItem(storageKey(type), text);
    } catch {}
  };

  const loadInsightFromStorage = (type: string): string | null => {
    try {
      return sessionStorage.getItem(storageKey(type));
    } catch {
      return null;
    }
  };

  const formatInsightText = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.map((para, idx) => {
      const trimmed = para.trim();
      const bulletMatch = trimmed.match(/^(\d+\.\s|[-*•]\s)/);
      const isList = bulletMatch !== null;
      const bullet = isList ? bulletMatch![1] : '';
      const content = isList ? trimmed.substring(bullet.length) : trimmed;

      const parts: React.ReactNode[] = [];
      const segments = content.split(/(\*\*[^*]+\*\*)/g);

      segments.forEach((seg, segIdx) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          parts.push(
            <span key={`${idx}-${segIdx}`} className="text-teal-300 font-bold">
              {seg.slice(2, -2)}
            </span>
          );
        } else {
          parts.push(<span key={`${idx}-${segIdx}`}>{seg}</span>);
        }
      });

      return (
        <div key={idx} className={`${idx > 0 ? 'mt-3' : ''} ${isList ? 'flex gap-2 items-start' : ''}`}>
          {isList && (
            <span className="text-teal-500 font-bold shrink-0 text-xs mt-0.5">{typeof bullet === 'string' ? bullet.replace(/\s$/, '') : bullet}</span>
          )}
          <span className="text-sm text-white/80 leading-relaxed">{parts}</span>
        </div>
      );
    });
  };

  useEffect(() => {
    const loadMaterial = async () => {
      if (!materialId) return;
      try {
        setLoading(true);
        const [materialRes, progressRes] = await Promise.all([
          learningGeneratorApi.getMaterial(materialId),
          learningGeneratorApi.getProgressByMaterial(materialId),
        ]);

        if (materialRes.success && materialRes.data) {
          setMaterial(materialRes.data);
          const builtSteps = buildSteps(materialRes.data);
          setSteps(builtSteps);

          if (progressRes.success && progressRes.data) {
            setCompletedSteps(progressRes.data.completed_steps);
            setActiveStep(progressRes.data.last_active_step || 0);
            if (progressRes.data.quiz_score !== null && progressRes.data.quiz_score !== undefined) {
              setQuizScore(progressRes.data.quiz_score);
            }
          }
        } else {
          setError(materialRes.message || "Material not found");
        }
      } catch {
        setError("Failed to load material. Check LMG service.");
      } finally {
        setLoading(false);
      }
    };
    loadMaterial();
  }, [materialId, buildSteps]);

  useEffect(() => {
    if (!material) return;
    const currentStepId = steps[activeStep]?.id;

    if (currentStepId === "practice" && material.structured_material.assessment.practice_challenge) {
      setCode(material.structured_material.assessment.practice_challenge.starter_code);
    } else if (currentStepId === "debug" && material.structured_material.lesson.debugging_exercise) {
      setCode(material.structured_material.lesson.debugging_exercise.broken_code);
    } else {
      setCode("");
    }
    setOutput(null);
    setExecutionError(null);
    setAiFeedback(null);
    setIsCompilationError(false);
    setActiveTab("output");
    setShowCodeEditor(false);

    const storedSimpler = loadInsightFromStorage("simpler");
    const storedAnalogy = loadInsightFromStorage("analogy");
    const storedFeedback = loadInsightFromStorage("code_feedback");

    if (storedSimpler) {
      setAiInsight(storedSimpler);
      setInsightActiveTab("simpler");
    } else if (storedAnalogy) {
      setAiInsight(storedAnalogy);
      setInsightActiveTab("analogy");
    } else {
      setAiInsight(null);
      setInsightActiveTab(null);
    }

    if (storedFeedback) {
      setAiFeedback(storedFeedback);
    } else {
      setAiFeedback(null);
    }
  }, [activeStep, material, steps]);

  const saveProgress = useCallback(async (stepIndex: number, isComplete?: boolean) => {
    if (!materialId) return;
    try {
      const payload: any = {
        total_steps: steps.length,
        active_step: stepIndex,
      };
      if (isComplete && !completedSteps.includes(stepIndex)) {
        payload.completed_step = stepIndex;
      }
      setSavingProgress(true);
      await learningGeneratorApi.updateProgress(materialId, payload);
    } catch {
    } finally {
      setSavingProgress(false);
    }
  }, [materialId, steps.length, completedSteps]);

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsExecuting(true);
    setOutput(null);
    setExecutionError(null);
    setAiFeedback(null);
    setActiveTab("output");

    const currentStepId = steps[activeStep]?.id;

    try {
      const res = await aiEngineApi.executeCode(code, currentStepId);
      if (res.data) {
        const { success, output: runOutput, error: runError, is_compilation_error: isCompError } = res.data;

        setIsCompilationError(isCompError);

        if (runError) {
          setExecutionError(runError);
        } else {
          setOutput(runOutput);
        }

        if (success && currentStepId === "practice") {
          if (!completedSteps.includes(activeStep)) {
            setCompletedSteps(prev => [...prev, activeStep]);
            saveProgress(activeStep, true);
          }
        }

        try {
          setIsAiLoading(true);
          const fbRes = await aiEngineApi.getFeedback(code, runOutput || undefined, runError || undefined, currentStepId);
          if (fbRes.data) {
            setAiFeedback(fbRes.data.feedback);
            saveInsightToStorage("code_feedback", fbRes.data.feedback);
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
    if (!material) return;
    const currentStepId = steps[activeStep]?.id;
    if (currentStepId === "practice" && material.structured_material.assessment.practice_challenge) {
      setCode(material.structured_material.assessment.practice_challenge.starter_code);
    } else if (currentStepId === "debug" && material.structured_material.lesson.debugging_exercise) {
      setCode(material.structured_material.lesson.debugging_exercise.broken_code);
    } else {
      setCode("");
    }
    setOutput(null);
    setExecutionError(null);
    setAiFeedback(null);
    setActiveTab("output");
    saveInsightToStorage("code_feedback", "");
  };

  const handleExplainSimpler = async () => {
    const lesson = material?.structured_material.lesson;
    const stepId = steps[activeStep]?.id;
    let contextText = "";

    if (stepId === "example" && lesson?.examples?.example_1) {
      contextText = lesson.examples.example_1.code;
    } else if (stepId === "intro" && lesson?.introduction) {
      contextText = `${lesson.introduction.what_is_it}\n\nWhy learn this: ${lesson.introduction.why_learn_it}`;
    } else if (stepId === "concepts" && lesson?.concept_explained) {
      contextText = `${lesson.concept_explained.core_definition}\n\n${lesson.concept_explained.how_java_handles_it || ""}\n\n${lesson.concept_explained.misconceptions_corrected || ""}`;
    } else if (stepId === "guide" && lesson?.step_by_step_guide) {
      contextText = lesson.step_by_step_guide.steps.map((s: any) => `Step ${s.step_number}: ${s.instruction}`).join("\n\n");
    } else if (stepId === "mistakes" && lesson?.common_mistakes && lesson.common_mistakes.length > 0) {
      contextText = lesson.common_mistakes.map((m: any) => `Mistake: ${m.title}\n${m.description}\nBad: ${m.bad_code}\nGood: ${m.good_code}`).join("\n\n");
    } else if (stepId === "practice" && material?.structured_material.assessment.practice_challenge) {
      contextText = `${material.structured_material.assessment.practice_challenge.problem_statement}\n\nStarter code:\n${material.structured_material.assessment.practice_challenge.starter_code}`;
    } else if (stepId === "debug" && lesson?.debugging_exercise) {
      contextText = `Scenario: ${lesson.debugging_exercise.scenario}\n\nBroken code:\n${lesson.debugging_exercise.broken_code}`;
    } else {
      contextText = code;
    }

    if (!contextText) return;
    setInsightType("simpler");
    setInsightActiveTab("simpler");
    setAiInsight(null);
    try {
      const res = await aiEngineApi.explainSimpler(contextText, sm?.topic, stepId);
      if (res.data) {
        setAiInsight(res.data.insight);
        saveInsightToStorage("simpler", res.data.insight);
        saveInsightToStorage("analogy", "");
      }
    } catch {
      setAiInsight("Unable to generate explanation. Try again.");
    } finally {
      setInsightType(null);
    }
  };

  const handleRealLifeAnalogy = async () => {
    const lesson = material?.structured_material.lesson;
    const stepId = steps[activeStep]?.id;
    let contextText = "";

    if (stepId === "example" && lesson?.examples?.example_1) {
      contextText = lesson.examples.example_1.code;
    } else if (stepId === "intro" && lesson?.introduction) {
      contextText = `${lesson.introduction.what_is_it}\n\nWhy learn this: ${lesson.introduction.why_learn_it}`;
    } else if (stepId === "concepts" && lesson?.concept_explained) {
      contextText = `${lesson.concept_explained.core_definition}\n\n${lesson.concept_explained.how_java_handles_it || ""}\n\n${lesson.concept_explained.misconceptions_corrected || ""}`;
    } else if (stepId === "guide" && lesson?.step_by_step_guide) {
      contextText = lesson.step_by_step_guide.steps.map((s: any) => `Step ${s.step_number}: ${s.instruction}`).join("\n\n");
    } else if (stepId === "mistakes" && lesson?.common_mistakes && lesson.common_mistakes.length > 0) {
      contextText = lesson.common_mistakes.map((m: any) => `Mistake: ${m.title}\n${m.description}\nBad: ${m.bad_code}\nGood: ${m.good_code}`).join("\n\n");
    } else if (stepId === "practice" && material?.structured_material.assessment.practice_challenge) {
      contextText = `${material.structured_material.assessment.practice_challenge.problem_statement}\n\nStarter code:\n${material.structured_material.assessment.practice_challenge.starter_code}`;
    } else if (stepId === "debug" && lesson?.debugging_exercise) {
      contextText = `Scenario: ${lesson.debugging_exercise.scenario}\n\nBroken code:\n${lesson.debugging_exercise.broken_code}`;
    } else {
      contextText = code;
    }

    if (!contextText) return;
    setInsightType("analogy");
    setInsightActiveTab("analogy");
    setAiInsight(null);
    try {
      const res = await aiEngineApi.getAnalogy(contextText, sm?.topic, stepId);
      if (res.data) {
        setAiInsight(res.data.insight);
        saveInsightToStorage("analogy", res.data.insight);
        saveInsightToStorage("simpler", "");
      }
    } catch {
      setAiInsight("Unable to generate analogy. Try again.");
    } finally {
      setInsightType(null);
    }
  };

  const handleNextStep = async () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps(prev => [...prev, activeStep]);
    }
    await saveProgress(activeStep, true);
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      await saveProgress(nextStep);
    }
  };

  const handleQuizSubmit = async () => {
    if (!material) return;
    const assessment = material.structured_material.assessment;
    let correct = 0;
    assessment.quiz.forEach(q => {
      if (answers[q.question_number] === q.correct) correct++;
    });
    const score = Math.round((correct / assessment.quiz.length) * 100);
    setQuizScore(score);

    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps(prev => [...prev, activeStep]);
    }
    await learningGeneratorApi.updateProgress(materialId, {
      total_steps: steps.length,
      quiz_score: score,
      completed_all: true,
    });
  };

  const currentStepId = steps[activeStep]?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading material...</p>
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{error || "Material not found"}</h2>
          <Link
            href="/learning-generator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Generator
          </Link>
        </div>
      </div>
    );
  }

  const sm = material.structured_material;
  const lesson = sm.lesson;
  const assessment = sm.assessment;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0F172A] text-white overflow-hidden font-sans">
      <div className="flex flex-1 min-h-0">
      {/* ── SIDEBAR: LEARNING PATH ── */}
      <div className="w-72 shrink-0 bg-[#0F172A] border-r border-white/5 flex-col z-10 hidden xl:flex">
        <div className="p-6 pb-2">
          <Link href="/learning-generator" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-bold mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Plan
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-3">
            {sm.difficulty_level} Module
          </div>
          <h2 className="text-xl font-black mb-1 text-white">{sm.topic}</h2>
          <p className="text-white/40 text-xs mb-2">{steps.length} steps • {completedSteps.length} completed</p>

          <div className="w-full h-1.5 bg-[#334155]/50 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1 custom-scrollbar">
          {steps.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx);
            const isActive = activeStep === idx;
            const maxUnlocked = Math.max(...completedSteps, -1) + 1;
            const isLocked = idx > maxUnlocked;

            return (
              <button
                key={step.id}
                disabled={isLocked}
                onClick={() => {
                  setActiveStep(idx);
                  saveProgress(idx);
                }}
                className={`w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all ${
                  isActive
                    ? "bg-[#334155]/40 border border-teal-500/30 shadow-[0_0_15px_rgba(13,148,136,0.1)]"
                    : isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className={`shrink-0 flex items-center justify-center ${isActive ? 'text-teal-400' : isCompleted ? 'text-teal-500' : 'text-white/20'}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : <Circle className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${isActive ? 'text-teal-300' : isLocked ? 'text-white/40' : 'text-white/80'}`}>
                    {idx + 1}. {step.title}
                  </p>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{step.type}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0F172A] relative min-h-0">
        {currentStepId === "quiz" ? (
          <div className={`flex-1 overflow-y-auto p-8 lg:p-12 animate-fade-in flex justify-center ${quizScore === null ? 'items-start' : 'items-center'}`}>
            {quizScore === null ? (
              <div className="max-w-3xl w-full my-auto pb-10">
                <div className="text-center mb-10">
                  <div className="inline-flex w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-teal-400" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Knowledge Check</h2>
                  <p className="text-white/50 mt-2">Pass this quick assessment to achieve mastery in {sm.topic}.</p>
                </div>

                <div className="space-y-6">
                  {assessment.quiz.filter(Boolean).map((q, qIndex) => (
                    <div key={qIndex} className="p-6 bg-[#334155]/20 border border-white/10 rounded-2xl">
                      <p className="text-sm font-bold text-teal-400 mb-2">Question {q.question_number} ({typeof q.type === 'string' ? q.type.replace('_', ' ') : q.type})</p>
                      <h3 className="text-lg font-medium text-white mb-4 whitespace-pre-wrap">{q.question}</h3>
                      {q.code_snippet && (
                        <pre className="p-3 bg-[#0F172A] rounded-xl text-teal-200 text-sm font-mono mb-4 border border-white/5">
                          {q.code_snippet}
                        </pre>
                      )}
                      <div className="space-y-3">
                        {q.options.map((opt, i) => {
                          const letter = opt.substring(0, 1);
                          const isSelected = answers[q.question_number] === letter;
                          return (
                            <div
                              key={i}
                              onClick={() => setAnswers({ ...answers, [q.question_number]: letter })}
                              className={`p-4 border rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
                                isSelected ? 'border-teal-500 bg-teal-500/10' : 'border-white/5 bg-[#0F172A] hover:border-teal-500/50 hover:bg-teal-500/5'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${isSelected ? 'border-teal-400 bg-teal-400' : 'border-white/20'}`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-[#0F172A] rounded-full" />}
                              </div>
                              <span className="text-sm text-white/80">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(answers).length < assessment.quiz.length || savingProgress}
                    className="px-6 py-3 bg-teal-600 disabled:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:bg-teal-500 transition-all flex items-center gap-2"
                  >
                    {savingProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Submit Answers
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-md w-full text-center space-y-6 animate-slide-up">
                <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#B45309]/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute inset-2 border-2 border-[#B45309]/50 rounded-full animate-spin-slow" />
                  <Award className="w-16 h-16 text-[#B45309] relative z-10" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-[#B45309]">{quizScore >= 80 ? "Mastery Achieved!" : "Good Try!"}</h2>
                  <p className="text-white/60 mt-3">You scored <span className="text-white font-bold">{quizScore}%</span> on the {sm.topic} module.</p>
                </div>

                <div className="p-4 bg-linear-to-br from-[#B45309]/10 to-transparent border border-[#B45309]/20 rounded-xl inline-block mx-auto text-left">
                  <p className="text-xs text-[#B45309] font-bold uppercase tracking-wider mb-1">Rewards Gained</p>
                  <p className="text-sm text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> +{quizScore} Mastery Points</p>
                  {quizScore >= 80 && <p className="text-sm text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Badge: {sm.topic} Initiate</p>}
                </div>

                <div className="pt-4">
                  <Link href="/learning-generator" className="px-8 py-3 bg-white text-[#0F172A] font-black rounded-xl hover:bg-teal-50 transition-colors w-full flex items-center justify-center gap-2">
                    Return to Hub
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* INTERACTIVE LEARNING */
          <div className="flex flex-col lg:flex-row min-h-0">
            {/* LEFT PANE: Content & Explanation */}
            <div className={`${showCodeEditor ? 'flex-1' : 'flex-[2.5]'} p-6 lg:p-10 overflow-y-auto border-b lg:border-b-0 ${showCodeEditor ? 'lg:border-r' : ''} border-white/5 custom-scrollbar`}>
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    {currentStepId === "debug" ? <ShieldAlert className="w-5 h-5 text-red-400" /> : <Brain className="w-5 h-5 text-teal-400" />}
                  </div>
                  <h1 className="text-2xl font-black text-white">{steps[activeStep]?.title}</h1>
                </div>

                <div className="prose prose-invert prose-teal max-w-none">
                  {currentStepId === "intro" && lesson.introduction && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                        {lesson.introduction.what_is_it}
                      </p>
                      <h3 className="text-teal-400 font-bold mt-8 mb-2">Why learn this?</h3>
                      <p className="text-white/70 leading-relaxed text-sm">
                        {lesson.introduction.why_learn_it}
                      </p>
                      {lesson.introduction.prerequisite_note && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl my-6">
                          <p className="text-amber-200/80 font-medium text-sm m-0">
                            <strong>Prerequisites:</strong> {lesson.introduction.prerequisite_note}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {currentStepId === "concepts" && lesson.concept_explained && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed mb-6">
                        <strong>Core Definition:</strong> {lesson.concept_explained.core_definition}
                      </p>
                      {lesson.concept_explained.analogy && (
                        <div className="p-4 bg-[#334155]/30 border border-white/10 rounded-xl my-6 text-sm text-white/70">
                          <strong>Analogy:</strong> {lesson.concept_explained.analogy}
                        </div>
                      )}
                      {lesson.syntax_reference && (
                        <>
                          <h3 className="text-teal-400 font-bold mt-8 mb-4">Syntax Reference</h3>
                          <pre className="p-4 bg-[#0F172A] border border-white/5 rounded-xl text-teal-200 font-mono text-sm">
                            {lesson.syntax_reference.basic_syntax}
                          </pre>
                            {lesson.syntax_reference.syntax_breakdown && lesson.syntax_reference.syntax_breakdown.length > 0 && (
                              <ul className="space-y-3 mt-4 text-white/70 text-sm list-decimal pl-5">
                                {lesson.syntax_reference.syntax_breakdown.map((rule, i) => (
                                  <li key={i}>{typeof rule === 'string' ? rule.replace(/^\d+\.\s*/, '') : String(rule)}</li>
                                ))}
                              </ul>
                            )}
                        </>
                      )}
                    </>
                  )}

                  {currentStepId === "guide" && lesson.step_by_step_guide && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                        {lesson.step_by_step_guide.overview}
                      </p>
                      <div className="space-y-4 mt-6">
                        {lesson.step_by_step_guide.steps.map((step, idx) => (
                          <div key={idx} className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl hover:border-teal-500/30 transition-colors">
                            <h4 className="text-teal-400 font-bold mb-2">Step {step.step_number}: {step.title}</h4>
                            <p className="text-white/70 text-sm mb-4 leading-relaxed">{step.instruction}</p>
                            {step.java_tip && (
                              <div className="px-3 py-2 bg-amber-500/10 text-amber-200/70 border border-amber-500/20 text-xs font-mono rounded inline-block">
                                💡 Tip: {step.java_tip}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {currentStepId === "example" && lesson.examples?.example_1 && (
                    <>
                      <p className="text-white/70 text-lg leading-relaxed mb-6">
                        {lesson.examples.example_1.description}
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed border-l-2 border-teal-500 pl-4 py-1 mb-8">
                        {lesson.examples.example_1.explanation}
                      </p>
                      <div className="mb-4 relative group">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-bold">Reference Code</p>
                        <button
                           onClick={() => {
                             if (lesson.examples) {
                               navigator.clipboard.writeText(lesson.examples.example_1.code);
                               setCopiedCode(true);
                               setTimeout(() => setCopiedCode(false), 2000);
                             }
                           }}
                           className="absolute top-8 right-3 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                           title="Copy Code"
                         >
                           {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Code2 className="w-3.5 h-3.5 text-white/50" />}
                         </button>
                         <pre className="p-4 bg-[#0F172A] border border-white/10 rounded-xl font-mono text-sm text-teal-200/90 whitespace-pre-wrap wrap-break-word leading-relaxed overflow-x-auto">
                           {lesson.examples?.example_1.code}
                         </pre>
                      </div>
                      <p className="text-xs text-white/40 italic">Use the code editor on the right to type, run, or modify this example.</p>
                    </>
                  )}

                  {currentStepId === "mistakes" && lesson.common_mistakes && lesson.common_mistakes.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold text-white mb-6">Common Pitfalls</h3>
                      <div className="space-y-6">
                        {lesson.common_mistakes.map((mistake, idx) => (
                          <div key={idx} className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
                            <h4 className="text-red-400 font-bold mb-2">{mistake.title}</h4>
                            <p className="text-white/70 text-sm mb-5 leading-relaxed">{mistake.description}</p>

                            <div className="flex flex-col gap-3 mb-3">
                              <div className="p-4 bg-red-950/40 rounded-xl border border-red-500/20 font-mono text-xs">
                                <div className="flex items-center gap-2 mb-2">
                                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                                  <span className="text-[10px] uppercase text-red-500 font-black tracking-widest">Bad Pattern</span>
                                </div>
                                <code className="text-red-200/80 whitespace-pre-wrap wrap-break-word leading-relaxed block">{mistake.bad_code}</code>
                              </div>
                              <div className="p-4 bg-teal-900/40 rounded-xl border border-teal-500/20 font-mono text-xs">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                                  <span className="text-[10px] uppercase text-teal-400 font-black tracking-widest">Correct Pattern</span>
                                </div>
                                <code className="text-teal-100/90 whitespace-pre-wrap wrap-break-word leading-relaxed block">{mistake.good_code}</code>
                              </div>
                            </div>
                            <p className="text-white/50 text-xs mt-3 italic">{mistake.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {currentStepId === "practice" && assessment.practice_challenge && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed mb-6">
                        {assessment.practice_challenge.problem_statement.split("\n")[0]}
                      </p>
                      <h3 className="text-teal-400 font-bold mt-6 mb-2">Requirements</h3>
                      {assessment.practice_challenge.requirements && (
                        <ul className="space-y-2 text-white/70 text-sm list-disc pl-5 mb-6">
                          {assessment.practice_challenge.requirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                      )}
                      <div className="p-3 bg-[#0F172A] rounded-xl text-white/50 text-xs font-mono border border-white/5">
                        {assessment.practice_challenge.example_input} <br />
                        {assessment.practice_challenge.expected_output}
                      </div>
                    </>
                  )}

                  {currentStepId === "debug" && lesson.debugging_exercise && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed">
                        {lesson.debugging_exercise.scenario}
                      </p>
                      <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-xl my-6">
                        <p className="text-red-200 font-medium m-0 text-sm">
                          <strong>Runtime Error:</strong> {lesson.debugging_exercise.error_output}
                        </p>
                      </div>
                      <p className="text-white/70 text-sm">
                        Use the interactive environment to step through the logic. Can you spot the bug?
                      </p>
                    </>
                  )}
                </div>

                {/* AI Actions */}
                <div className="mt-10 flex flex-wrap gap-3">
                  <button
                    onClick={handleExplainSimpler}
                    disabled={insightType !== null}
                    className={`px-4 py-2 border text-sm font-bold rounded-xl flex items-center gap-2 transition-all disabled:cursor-wait ${
                      insightActiveTab === "simpler"
                        ? "bg-teal-600/30 border-teal-400 text-teal-200 shadow-[0_0_15px_rgba(13,148,136,0.2)]"
                        : "bg-linear-to-r from-teal-600/20 to-teal-800/20 border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
                    }`}
                  >
                    {insightType === "simpler" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Explain Simpler
                  </button>
                  <button
                    onClick={handleRealLifeAnalogy}
                    disabled={insightType !== null}
                    className={`px-4 py-2 border text-sm font-bold rounded-xl flex items-center gap-2 transition-all disabled:cursor-wait ${
                      insightActiveTab === "analogy"
                        ? "bg-amber-600/30 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(180,83,9,0.2)]"
                        : "bg-[#334155]/30 border-white/10 text-white/70 hover:bg-[#334155]/50"
                    }`}
                  >
                    {insightType === "analogy" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />} Give a Real-life Analogy
                  </button>
                  {!showCodeEditor && (currentStepId === "example" || currentStepId === "practice" || currentStepId === "debug") && (
                    <button
                      onClick={() => setShowCodeEditor(true)}
                      className="px-4 py-2 bg-teal-600/20 border border-teal-500/30 hover:bg-teal-600/30 text-teal-300 text-sm font-bold rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Code2 className="w-4 h-4" /> Open Code Editor
                    </button>
                  )}
                </div>

                {/* AI Insight Panel */}
                {(aiInsight || insightType) && insightActiveTab && (
                  <div className="mt-6 bg-[#334155]/20 border border-white/5 rounded-2xl overflow-hidden animate-slide-up">
                    {/* Insight Type Header */}
                    <div className={`px-6 py-3 border-b ${insightActiveTab === "simpler" ? "bg-teal-500/10 border-teal-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${insightActiveTab === "simpler" ? "bg-teal-500/20" : "bg-amber-500/20"}`}>
                            {insightActiveTab === "simpler" ? <Sparkles className="w-3.5 h-3.5 text-teal-400" /> : <Lightbulb className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${insightActiveTab === "simpler" ? "text-teal-400" : "text-amber-400"}`}>
                            {insightActiveTab === "simpler" ? "Simplified Explanation" : "Real-life Analogy"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (insightActiveTab) saveInsightToStorage(insightActiveTab, "");
                            setAiInsight(null);
                            setInsightActiveTab(null);
                          }}
                          className="text-white/30 hover:text-white/50 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {insightType && !aiInsight ? (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                            <Brain className="w-4 h-4 text-teal-400 animate-pulse" />
                          </div>
                          <div>
                            <p className="text-xs text-teal-400/60 font-bold">Mentora AI is Thinking</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-100" />
                              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-200" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {formatInsightText(aiInsight || "")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANE: Code Editor & Output/Feedback Tabs (only for code steps) */}
            {(currentStepId === "example" || currentStepId === "practice" || currentStepId === "debug") && showCodeEditor && (
            <div className="flex-[1.2] flex flex-col bg-[#0b1021]">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#0F172A] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-mono text-white/60">Main.java</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCodeEditor(false)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs font-medium"
                    title="Close Code Editor"
                  >
                    <ChevronRight className="w-3.5 h-3.5" /> Close
                  </button>
                  <button
                    onClick={handleResetCode}
                    className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Reset Code"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={!code.trim() || isExecuting}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-wait text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-teal-900/20"
                  >
                    {isExecuting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                    {isExecuting ? "Compiling..." : "Run Code"}
                  </button>
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                  placeholder={currentStepId === "practice" ? "// Write your solution here..." : currentStepId === "debug" ? "// Fix the bug in this code..." : "// Type or paste code to run..."}
                  className="absolute inset-0 w-full h-full p-6 bg-transparent text-white/90 font-mono text-sm leading-relaxed resize-none outline-none focus:ring-0 custom-scrollbar whitespace-pre placeholder:text-white/20"
                  style={{ tabSize: 4 }}
                />
              </div>

              {/* Tabbed Output & AI Feedback Panel */}
              <div className="h-64 flex flex-col bg-[#0F172A] border-t border-white/5 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                {/* Tab Headers */}
                <div className="flex border-b border-white/5">
                  <button
                    onClick={() => setActiveTab("output")}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
                      activeTab === "output"
                        ? "border-teal-500 text-teal-400"
                        : "border-transparent text-white/30 hover:text-white/50"
                    }`}
                  >
                    <Terminal className="w-3 h-3" /> Output {executionError && <span className="w-2 h-2 rounded-full bg-red-500" />}
                  </button>
                  <button
                    onClick={() => setActiveTab("feedback")}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
                      activeTab === "feedback"
                        ? "border-teal-500 text-teal-400"
                        : "border-transparent text-white/30 hover:text-white/50"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" /> AI Feedback {isAiLoading && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />} {!isAiLoading && aiFeedback && <span className="w-2 h-2 rounded-full bg-green-500" />}
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
                        <p className="text-sm text-white/30 italic">Hit Run Code to see output here.</p>
                      )}

                      {output && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs text-green-400 font-bold">Exit code: 0</span>
                          </div>
                          <pre className="font-mono text-xs text-white/70 bg-black/30 p-3 rounded-lg border border-white/5 whitespace-pre-wrap wrap-break-word leading-relaxed">
                            {output}
                          </pre>
                        </div>
                      )}

                      {executionError && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            <span className={`text-xs font-bold ${isCompilationError ? "text-amber-400" : "text-red-400"}`}>
                              {isCompilationError ? "Compilation Error" : "Runtime Error"}
                            </span>
                          </div>
                          <pre className="font-mono text-xs text-red-200/80 bg-red-950/40 p-3 rounded-lg border border-red-500/20 whitespace-pre-wrap wrap-break-word leading-relaxed">
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
                        <p className="text-sm text-white/30 italic">Run your code to get AI feedback.</p>
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
            )}
          </div>
        )}

        {/* ── BOTTOM NAVIGATION PROGRESS ── */}
        <div className="h-20 bg-[#0F172A] border-t border-white/5 flex items-center justify-between px-6 lg:px-10 shrink-0 z-20">
          <button
            onClick={async () => {
              const prev = Math.max(0, activeStep - 1);
              setActiveStep(prev);
              await saveProgress(prev);
            }}
            disabled={activeStep === 0}
            className="px-5 py-2.5 text-white/50 font-semibold hover:text-white disabled:opacity-30 transition-colors"
          >
            Previous
          </button>

          {activeStep < steps.length - 1 && (
            <button
              onClick={handleNextStep}
              disabled={savingProgress}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(13,148,136,0.2)] flex items-center gap-2 group"
            >
              {savingProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Next Concept <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

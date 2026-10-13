"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Send,
  Copy,
  AlertTriangle,
  Target,
  Code,
  Zap,
  Trophy,
  TrendingUp,
  BarChart3,
  Play,
  Terminal
} from "lucide-react";
import FeedbackPanel from "../components/FeedbackPanel";
import SandboxCodeEditor from "../components/SandboxCodeEditor";
import { assessmentApi } from "@/lib/api/assessment";
import type { SandboxResult } from "@/lib/api/assessment";

interface StoredQA {
  id: string;
  number: number;
  question: string;
  type: "mcq" | "code_completion" | "code_tracing" | "debugging" | "coding_challenge";
  code_snippet?: string;
  options?: string[] | Option[];
  learner_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time_spent: number;
  timestamp: number;
}

const saveQA = (qa: StoredQA) => {
  const stored = localStorage.getItem("assessment_qa");
  const qaList: StoredQA[] = stored ? JSON.parse(stored) : [];
  qaList.push(qa);
  localStorage.setItem("assessment_qa", JSON.stringify(qaList));
};

interface Topic {
  name: string;
  mastery: number;
  status: "mastered" | "current" | "pending";
  gap_type: "FUNDAMENTAL_GAP" | "PARTIAL_GAP";
}

interface Option {
  letter: string;
  text: string;
}

interface Question {
  id: string;
  number: number;
  text: string;
  type: "mcq" | "code_completion" | "code_tracing" | "debugging" | "coding_challenge";
  code_snippet?: string;
  options?: Option[];
  requires_sandbox?: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  hints: string[];
}

const SANDBOX_QUESTION_TYPES = ["code_completion", "code_tracing", "debugging", "coding_challenge"];

const questionRequiresSandbox = (type: string, flag?: boolean) =>
  flag ?? SANDBOX_QUESTION_TYPES.includes(type);

interface SessionData {
  sessionId: string;
  learnerId: string;
  currentTopic: Topic;
  allTopics: Topic[];
  currentQuestion: Question;
  stats: {
    questionsAsked: number;
    correctAnswers: number;
    accuracy: number;
    streak: number;
  };
  remediationMode: boolean;
}

export default function SessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [codeAnswer, setCodeAnswer] = useState<string>("");
  const [showHint, setShowHint] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<SandboxResult | null>(null);
  const [traceRunCode, setTraceRunCode] = useState<string>("");
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    const buildSessionState = (data: any) => {
      const session = data.updated_session || data;
      const question = session.current_question || data.question || (session.questions && session.questions[0]) || null;

      if (!question) {
        return false;
      }

      const options = question.options
        ? (Array.isArray(question.options)
            ? (typeof question.options[0] === 'string'
                ? (question.options as string[]).map((text, i) => ({ letter: String.fromCharCode(65 + i), text }))
                : question.options)
            : Object.entries(question.options).map(([letter, text]) => ({ letter, text: text as string })))
        : undefined;

      const allTopics = session.all_topics || session.topics || [
        { name: question.topic || 'Topic', mastery: session.current_topic_mastery || 0, status: 'current', gap_type: 'FUNDAMENTAL_GAP' }
      ];

      const sessInfo = data.session_info || session;

      setSessionData({
        sessionId: session.session_id || sessInfo.session_id || sessionId || 'unknown',
        learnerId: session.learner_id || data.learner_id || 'unknown',
        currentTopic: {
          name: question.topic || session.topic || sessInfo.topic || 'Topic',
          mastery: session.current_topic_mastery || sessInfo.mastery_score || 0,
          status: 'current',
          gap_type: question.gap_type || 'FUNDAMENTAL_GAP',
        },
        allTopics: allTopics.map((t: any) => {
          const topicName = typeof t === 'string' ? t : (t.name || t.topic_name || t.topic);
          return {
            name: topicName,
            mastery: t.mastery || t.mastery_percentage || 0,
            status: topicName === (session.selected_topic || question.topic) ? 'current' : (t.mastery >= 85 ? 'mastered' : 'pending'),
            gap_type: t.gap_type || 'PARTIAL_GAP',
          };
        }),
        currentQuestion: {
          id: question.question_id || question.id || `q-${Date.now()}`,
          number: questionNumber,
          text: question.question_text || question.text || '',
          type: question.question_type || question.type || 'mcq',
          code_snippet: question.code_snippet,
          options: options,
          requires_sandbox: questionRequiresSandbox(question.question_type || question.type || 'mcq', question.requires_sandbox),
          difficulty: question.difficulty || 'Medium',
          topic: question.topic || 'General',
          hints: question.hints || [],
        },
        stats: {
          questionsAsked: session.total_questions_asked || session.questions_asked || sessInfo.question_number || 0,
          correctAnswers: session.correct_answers || 0,
          accuracy: session.accuracy_percentage || session.accuracy || 0,
          streak: session.current_streak || session.streak || 0,
        },
        remediationMode: session.remediation_mode || data.remediation_mode || false,
      });
      return true;
    };

    const fetchSession = async () => {
      // Try API first if we have a sessionId
      if (sessionId) {
        try {
          const res = await assessmentApi.getSession(sessionId);
          if (res.success && res.data) {
            if (buildSessionState(res.data)) {
              setLoading(false);
              return;
            }
          }
        } catch {}
      }

      // Fallback to localStorage (start-session response)
      const stored = localStorage.getItem('assessment_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (buildSessionState(parsed)) {
            setLoading(false);
            return;
          }
        } catch {}
      }

      // Fallback to saved next_question (after topic transition)
      const nextQ = localStorage.getItem('assessment_next_question');
      if (nextQ) {
        try {
          const question = JSON.parse(nextQ);
          const sessStored = localStorage.getItem('assessment_session');
          const sess = sessStored ? JSON.parse(sessStored) : {};
          const options = question.options
            ? (Array.isArray(question.options)
                ? (typeof question.options[0] === 'string'
                    ? (question.options as string[]).map((text, i) => ({ letter: String.fromCharCode(65 + i), text }))
                    : question.options)
                : Object.entries(question.options).map(([letter, text]) => ({ letter, text: text as string })))
            : undefined;
          const allTopics = (sess.all_topics || []).map((t: any) => ({
            name: typeof t === 'string' ? t : (t.name || t.topic_name || t.topic),
            mastery: t.mastery || t.mastery_percentage || 0,
            status: (typeof t === 'string' ? t : (t.name || t.topic_name || t.topic)) === (sess.selected_topic || question.topic) ? 'current' : (t.mastery >= 85 ? 'mastered' : 'pending'),
            gap_type: t.gap_type || 'PARTIAL_GAP',
          }));
          setSessionData({
            sessionId: sess.session_id || sessionId || 'unknown',
            learnerId: sess.learner_id || 'unknown',
            currentTopic: {
              name: question.topic || sess.selected_topic || 'Topic',
              mastery: sess.mastery_score || 0,
              status: 'current',
              gap_type: 'PARTIAL_GAP',
            },
            allTopics,
            currentQuestion: {
              id: question.question_id || question.id || `q-${Date.now()}`,
              number: (sess.total_questions_asked || 0) + 1,
              text: question.question_text || question.text || question.question || '',
              type: question.question_type || question.type || 'mcq',
              code_snippet: question.code_snippet,
              options,
              requires_sandbox: questionRequiresSandbox(question.question_type || question.type || 'mcq', question.requires_sandbox),
              difficulty: question.difficulty || 'Medium',
              topic: question.topic || 'General',
              hints: question.hints || [],
            },
            stats: {
              questionsAsked: sess.total_questions_asked || 0,
              correctAnswers: sess.correct_answers || 0,
              accuracy: sess.accuracy_percentage || 0,
              streak: sess.consecutive_correct || 0,
            },
            remediationMode: sess.remediation_mode || false,
          });
          setLoading(false);
          return;
        } catch {}
      }

      setError('No questions available in this session');
      setLoading(false);
    };

    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sessionData) {
      setQuestionNumber(sessionData.stats.questionsAsked + 1);
    }
  }, [sessionData]);

  const lastQuestionIdRef = useRef<string | null>(null);
  useEffect(() => {
    const qId = sessionData?.currentQuestion.id ?? null;
    if (qId !== lastQuestionIdRef.current) {
      lastQuestionIdRef.current = qId;
      setTraceRunCode(sessionData?.currentQuestion.code_snippet ?? "");
      setRunResult(null);
    }
  }, [sessionData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 85) return { text: "text-emerald-400", bg: "bg-emerald-500", ring: "stroke-emerald-400" };
    if (mastery >= 60) return { text: "text-blue-400", bg: "bg-blue-500", ring: "stroke-blue-400" };
    if (mastery >= 40) return { text: "text-amber-400", bg: "bg-amber-500", ring: "stroke-amber-400" };
    return { text: "text-red-400", bg: "bg-red-500", ring: "stroke-red-400" };
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" };
      case "Medium": return { color: "bg-amber-500/10 text-amber-400 border-amber-500/30", dot: "bg-amber-400" };
      case "Hard": return { color: "bg-red-500/10 text-red-400 border-red-500/30", dot: "bg-red-400" };
      default: return { color: "bg-slate-500/10 text-slate-400 border-slate-500/30", dot: "bg-slate-400" };
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "mcq": return { label: "Multiple Choice", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
      case "code_completion": return { label: "Code Completion", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
      case "code_tracing": return { label: "Code Tracing", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" };
      case "debugging": return { label: "Debugging", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" };
      case "coding_challenge": return { label: "Coding Challenge", color: "bg-red-500/10 text-red-400 border-red-500/30" };
      default: return { label: type, color: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
    }
  };

  const handleSubmit = async () => {
    const answer = sessionData!.currentQuestion.type === "mcq" ? selectedAnswer : codeAnswer;
    setIsEvaluating(true);

    try {
      const storedSession = JSON.parse(localStorage.getItem('assessment_session') || '{}');
      const sid = sessionId || storedSession.session_id || storedSession.sessionId || sessionData!.sessionId;

      const result = await assessmentApi.submitAnswer({
        session_id: sid,
        question_id: sessionData!.currentQuestion.id,
        answer,
      });

      const data = result.data || result;
      if (result.success && data) {
        const fb = data.feedback || data.evaluation || data;

        const is_correct = data.evaluation?.is_correct ?? fb.is_correct ?? false;
        const partial_credit = data.evaluation?.partial_credit ?? fb.partial_credit ?? false;

        const feedback = {
          is_correct,
          partial_credit,
          correctness_score: data.evaluation?.correctness_score ?? (is_correct ? 100 : 0),
          evaluation_summary: data.evaluation?.evaluation_summary || fb.evaluation_summary || fb.summary || '',
          immediate_feedback: fb.immediate_feedback || fb.feedback || '',
          concept_explanation: fb.concept_explanation || '',
          what_is_correct: fb.what_is_correct || data.evaluation?.what_is_correct,
          mistake_analysis: fb.mistake_analysis || data.evaluation?.what_is_wrong,
          correct_explanation: fb.correct_explanation || '',
          improvement_tip: fb.improvement_tip || '',
          hint_for_retry: fb.hint_for_retry,
          deeper_insight: fb.deeper_insight,
          remediation_note: data.mastery_update?.remediation_note || fb.remediation_note,
          encouragement: fb.encouragement || '',
          suggested_resources: fb.suggested_resources || [],
          mastery_update: data.mastery_update ? {
            topic: data.mastery_update.topic,
            before_mastery: data.mastery_update.previous_mastery,
            after_mastery: data.mastery_update.current_mastery,
            target: data.mastery_update.mastery_threshold,
          } : {
            topic: sessionData!.currentTopic.name,
            before_mastery: sessionData!.currentTopic.mastery,
            after_mastery: sessionData!.currentTopic.mastery,
            target: 85,
          },
          remediation_status: data.mastery_update?.remediation_mode ? { entered: data.mastery_update.remediation_entered, exited: data.mastery_update.remediation_exited, message: '' } : undefined,
          difficulty_change: undefined,
          next_action: (data.session_progress?.session_complete || data.mastery_update?.session_complete) ? 'complete' : 'continue',
          next_topic_name: data.next_question?.topic,
          question_text: sessionData!.currentQuestion.text,
          learner_answer: answer,
          sandbox_execution: data.sandbox_execution || data.sandbox_result || null,
        };

        const correctAnswer = data.evaluation?.correct_answer || data.next_question?.correct_answer || '';
        const qaItem: StoredQA = {
          id: sessionData!.currentQuestion.id,
          number: questionNumber,
          question: sessionData!.currentQuestion.text,
          type: sessionData!.currentQuestion.type,
          code_snippet: sessionData!.currentQuestion.code_snippet,
          options: sessionData!.currentQuestion.options,
          learner_answer: answer,
          correct_answer: correctAnswer,
          is_correct,
          explanation: feedback.correct_explanation,
          topic: sessionData!.currentQuestion.topic,
          difficulty: sessionData!.currentQuestion.difficulty,
          time_spent: timeElapsed,
          timestamp: Date.now()
        };
        saveQA(qaItem);
        localStorage.setItem('assessment_qa_learner', sessionData!.learnerId);

        if (data.next_question || data.session_progress) {
          const sessionState = data.session_progress?.session_state || data;
          localStorage.setItem('assessment_session', JSON.stringify(sessionState));
        }

        if (data.next_question) {
          localStorage.setItem('assessment_next_question', JSON.stringify(data.next_question));
        }

        if (data.feedback_report) {
          localStorage.setItem('assessment_feedback_report', JSON.stringify(data.feedback_report));
        }
        if (data.qa_review) {
          localStorage.setItem('assessment_qa_review', JSON.stringify(data.qa_review));
        }
        if (data.session_summary) {
          localStorage.setItem('assessment_session_summary', JSON.stringify(data.session_summary));
        }

        const state = data.session_progress?.session_state;
        if (data.session_progress || data.mastery_update) {
          setSessionData(prev => prev ? {
            ...prev,
            currentTopic: {
              name: state?.selected_topic || data.mastery_update?.topic || prev.currentTopic.name,
              mastery: data.mastery_update?.current_mastery ?? prev.currentTopic.mastery,
              status: 'current',
              gap_type: prev.currentTopic.gap_type,
            },
            allTopics: state?.all_topics
              ? state.all_topics.map((t: any) => {
                  const topicName = typeof t === 'string' ? t : (t.name || t.topic_name || t.topic);
                  return {
                    name: topicName,
                    mastery: t.mastery || t.mastery_percentage || 0,
                    status: topicName === (state.selected_topic || data.mastery_update?.topic) ? 'current' : (t.mastery >= 85 ? 'mastered' : 'pending'),
                    gap_type: t.gap_type || 'PARTIAL_GAP',
                  };
                })
              : prev.allTopics,
            stats: {
              questionsAsked: state?.total_questions_asked ?? data.session_progress?.question_number ?? prev.stats.questionsAsked,
              correctAnswers: state?.correct_answers ?? prev.stats.correctAnswers,
              accuracy: data.session_progress?.overall_accuracy ?? prev.stats.accuracy,
              streak: state?.consecutive_correct ?? prev.stats.streak,
            },
            remediationMode: state?.remediation_mode ?? prev.remediationMode,
          } : prev);
        }

        if (data.session_progress?.session_complete || data.mastery_update?.session_complete || feedback.next_action === 'complete') {
          router.push('/assessment/summary');
          return;
        }

        if (data.mastery_update?.topic_mastered) {
          const ss = data.session_progress?.session_state;
          const completedName = data.mastery_update.topic;
          // n8n has already switched current_topic to the next topic
          const nextTopicName = data.session_progress?.current_topic
            || ss?.selected_topic
            || (ss?.remaining_topics?.length > 0
              ? (typeof ss.remaining_topics[0] === 'string' ? ss.remaining_topics[0] : (ss.remaining_topics[0].name || ss.remaining_topics[0].topic_name || ss.remaining_topics[0].topic))
              : '')
            || data.next_question?.topic
            || '';
          const topicHistory = (ss?.session_history || []).filter((h: any) => h.topic === completedName || h.selected_topic === completedName);
          const bloomLevels = [...new Set(topicHistory.map((h: any) => h.blooms_level || h.difficulty_level || 1))];
          const nextGapType = ss?.mastery_profile?.knowledge_gaps?.find(
            (g: any) => (g.topic || g.topic_name) === nextTopicName
          )?.gap_type || 'PARTIAL_GAP';

          localStorage.setItem('assessment_transition', JSON.stringify({
            completedTopic: {
              name: completedName,
              finalMastery: data.mastery_update.current_mastery,
              mastered: true,
              questionsAnswered: topicHistory.length || ss?.total_questions_asked || 0,
              accuracy: data.session_progress?.overall_accuracy || 0,
              bloomLevels: bloomLevels.length > 0 ? bloomLevels : [1],
            },
            nextTopic: {
              name: nextTopicName,
              gap_type: nextGapType,
              startingDifficulty: data.next_question?.difficulty === 'easy' ? 'Easy' : data.next_question?.difficulty === 'medium' ? 'Medium' : 'Easy',
            },
            sessionId: data.session_id || sessionId || 'unknown',
            learnerId: ss?.learner_id || 'unknown',
          }));

          router.push('/assessment/transition');
          return;
        }

        setFeedbackData(feedback);
        setShowFeedback(true);
      } else {
        throw new Error(result.message || 'Failed to submit answer');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      const fallbackFeedback = {
        is_correct: false,
        partial_credit: false,
        correctness_score: 0,
        evaluation_summary: 'Error submitting answer. Please try again.',
        immediate_feedback: 'There was an error processing your answer.',
        concept_explanation: '',
        correct_explanation: '',
        improvement_tip: '',
        encouragement: 'Keep going!',
        suggested_resources: [],
        mastery_update: {
          topic: sessionData!.currentTopic.name,
          before_mastery: sessionData!.currentTopic.mastery,
          after_mastery: sessionData!.currentTopic.mastery,
          target: 85
        },
        next_action: 'continue' as const,
        question_text: sessionData!.currentQuestion.text,
        learner_answer: answer
      };
      setFeedbackData(fallbackFeedback);
      setShowFeedback(true);
    }
    setIsEvaluating(false);
  };

  const handleRunCode = async () => {
    const question = sessionData!.currentQuestion;
    const isTraceRunner = question.type === "code_tracing";
    const source = isTraceRunner ? traceRunCode : codeAnswer;
    if (!source.trim() || isRunning) return;
    setIsRunning(true);
    setRunResult(null);

    try {
      const storedSession = JSON.parse(localStorage.getItem('assessment_session') || '{}');
      const sid = sessionId || storedSession.session_id || storedSession.sessionId || sessionData!.sessionId;

      const result = await assessmentApi.runCode({
        session_id: sid,
        question_id: question.id,
        code: source,
      });

      const data: any = result.data || result;
      if (result.success !== false && data) {
        setRunResult(data.run_result || null);
      } else {
        throw new Error(result.message || 'Failed to run code');
      }
    } catch (err: any) {
      console.error('Run code error:', err);
      setRunResult({
        attempted: true,
        compiled: false,
        executed_successfully: false,
        status: 'sandbox_unavailable',
        stderr: err?.message || 'Could not reach the code execution service.',
      });
    }
    setIsRunning(false);
  };

  const handleContinue = async () => {
    setShowFeedback(false);
    setSelectedAnswer("");
    setCodeAnswer("");
    setShowHint(0);
    setTimeElapsed(0);
    setRunResult(null);

    const parseOptions = (opts: any): Option[] | undefined => {
      if (!opts) return undefined;
      if (Array.isArray(opts)) {
        if (typeof opts[0] === 'string') {
          return (opts as string[]).map((text, i) => ({ letter: String.fromCharCode(65 + i), text }));
        }
        return opts as Option[];
      }
      return Object.entries(opts).map(([letter, text]) => ({ letter, text: text as string }));
    };

    const applyNextQuestion = (question: any) => {
      const options = parseOptions(question.options);
      const qType = question.question_type || question.type || 'mcq';
      setSessionData(prev => prev ? {
        ...prev,
        currentQuestion: {
          id: question.question_id || question.id || `q-${Date.now()}`,
          number: prev.stats.questionsAsked + 2,
          text: question.question_text || question.text || '',
          type: qType,
          code_snippet: question.code_snippet,
          options,
          requires_sandbox: questionRequiresSandbox(qType, question.requires_sandbox),
          difficulty: question.difficulty || 'Medium',
          topic: question.topic || prev.currentQuestion.topic,
          hints: question.hints || [],
        },
      } : prev);
    };

    const nextQ = localStorage.getItem('assessment_next_question');
    if (nextQ) {
      localStorage.removeItem('assessment_next_question');
      try {
        const question = JSON.parse(nextQ);
        applyNextQuestion(question);
        return;
      } catch {}
    }

    const tryUpdateFromApi = async (sid: string) => {
      try {
        const res = await assessmentApi.getSession(sid);
        if (res.success && res.data) {
          const session = res.data.updated_session || res.data;
          const question = session.current_question || res.data.question;
          if (question) {
            const options = parseOptions(question.options);
            const qType = question.question_type || question.type || 'mcq';

            setSessionData(prev => prev ? {
              ...prev,
              currentTopic: {
                name: question.topic || prev.currentTopic.name,
                mastery: session.current_topic_mastery || prev.currentTopic.mastery,
                status: 'current',
                gap_type: question.gap_type || prev.currentTopic.gap_type,
              },
              currentQuestion: {
                id: question.question_id || question.id || `q-${Date.now()}`,
                number: prev.stats.questionsAsked + 2,
                text: question.question_text || question.text || '',
                type: qType,
                code_snippet: question.code_snippet,
                options,
                requires_sandbox: questionRequiresSandbox(qType, question.requires_sandbox),
                difficulty: question.difficulty || 'Medium',
                topic: question.topic || prev.currentQuestion.topic,
                hints: question.hints || [],
              },
              stats: {
                questionsAsked: session.total_questions_asked || prev.stats.questionsAsked + 1,
                correctAnswers: session.correct_answers || prev.stats.correctAnswers,
                accuracy: session.accuracy_percentage || prev.stats.accuracy,
                streak: session.current_streak || prev.stats.streak,
              },
              remediationMode: session.remediation_mode || false,
            } : prev);
          }
        }
      } catch {}
    };

    if (sessionId) {
      await tryUpdateFromApi(sessionId);
    } else {
      const stored = localStorage.getItem('assessment_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const question = parsed.question || parsed.current_question;
          if (question) {
            const options = parseOptions(question.options);
            applyNextQuestion(question);
          }
        } catch {}
      }
    }
  };

  const copyCode = () => {
    if (sessionData?.currentQuestion.code_snippet) {
      navigator.clipboard.writeText(sessionData.currentQuestion.code_snippet);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70 font-semibold">Loading assessment session...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Session Error</h2>
          <p className="text-white/60 mb-6">{error || 'Failed to load session data'}</p>
          <Button onClick={() => router.push('/assessment')} className="bg-teal-600 hover:bg-teal-500 text-white">
            Back to Assessment
          </Button>
        </div>
      </div>
    );
  }

  const masteryColors = getMasteryColor(sessionData.currentTopic.mastery);
  const difficultyConfig = getDifficultyConfig(sessionData.currentQuestion.difficulty);
  const typeConfig = getTypeConfig(sessionData.currentQuestion.type);
  const requiresSandbox = questionRequiresSandbox(
    sessionData.currentQuestion.type,
    sessionData.currentQuestion.requires_sandbox
  );
  const isCodeAnswerType =
    sessionData.currentQuestion.type === "code_completion" ||
    sessionData.currentQuestion.type === "debugging" ||
    sessionData.currentQuestion.type === "coding_challenge";
  const isTraceQuestion = sessionData.currentQuestion.type === "code_tracing";
  const runSource = isTraceQuestion ? traceRunCode : codeAnswer;

  const runCodeButton = (
    <Button
      onClick={handleRunCode}
      disabled={isRunning || isEvaluating || !runSource.trim()}
      variant="outline"
      className="border-teal-500/40 text-teal-300 hover:bg-teal-500/10 px-5 py-2 font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      {isRunning ? (
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
          <span className="text-sm">Running...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Play className="w-3.5 h-3.5" />
          <span className="text-sm">Run Code</span>
        </div>
      )}
    </Button>
  );

  const consoleOutput = (isRunning || runResult) && (
    <div className="rounded-xl border border-white/10 bg-[#0F172A] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Console Output
          </span>
        </div>
        {runResult?.status && (
          <Badge
            variant="outline"
            className={
              runResult.executed_successfully
                ? "border-emerald-500/30 text-emerald-400"
                : "border-red-500/30 text-red-400"
            }
          >
            {runResult.status}
          </Badge>
        )}
      </div>
      <div className="p-4 max-h-64 overflow-y-auto font-mono text-sm space-y-3">
        {isRunning && (
          <p className="text-white/40 flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin inline-block" />
            Compiling &amp; executing your code...
          </p>
        )}
        {!isRunning && runResult && (
          <>
            {runResult.compile_output && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">Compile Output</p>
                <pre className="whitespace-pre-wrap break-words text-amber-300 leading-relaxed">{runResult.compile_output}</pre>
              </div>
            )}
            {runResult.stdout && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">stdout</p>
                <pre className="whitespace-pre-wrap break-words text-white leading-relaxed">{runResult.stdout}</pre>
              </div>
            )}
            {runResult.stderr && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">stderr</p>
                <pre className="whitespace-pre-wrap break-words text-red-300 leading-relaxed">{runResult.stderr}</pre>
              </div>
            )}
            {!runResult.stdout && !runResult.stderr && !runResult.compile_output && (
              <p className="text-white/30 italic">No output produced.</p>
            )}
            {(runResult.time_seconds || runResult.memory_kb) && (
              <p className="text-white/25 text-xs pt-1 border-t border-white/5">
                {runResult.time_seconds ? `Time: ${runResult.time_seconds}s` : ''}
                {runResult.time_seconds && runResult.memory_kb ? ' · ' : ''}
                {runResult.memory_kb ? `Memory: ${runResult.memory_kb} KB` : ''}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <div className="w-72 bg-[#1e293b]/95 backdrop-blur-xl border-r border-white/5 p-5 overflow-y-auto flex flex-col">
        {/* Sidebar header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
            <Target className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Assessment Session</p>
            <p className="text-[10px] text-white/40 mt-1">Overview</p>
          </div>
        </div>

        {/* Session IDs */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#0F172A] p-3.5">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Copy className="w-3 h-3" /> Session IDs
          </p>
          <div className="space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">Learner ID</span>
                <button
                  onClick={() => navigator.clipboard.writeText(sessionData.learnerId)}
                  className="p-1 hover:bg-white/5 rounded transition-colors"
                  title="Copy Learner ID"
                >
                  <Copy className="w-3 h-3 text-white/30 hover:text-white/60" />
                </button>
              </div>
              <p className="text-[12px] leading-snug text-white/80 font-mono bg-white/5 rounded-md px-2.5 py-2 break-all">
                {sessionData.learnerId}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">Session ID</span>
                <button
                  onClick={() => navigator.clipboard.writeText(sessionData.sessionId)}
                  className="p-1 hover:bg-white/5 rounded transition-colors"
                  title="Copy Session ID"
                >
                  <Copy className="w-3 h-3 text-white/30 hover:text-white/60" />
                </button>
              </div>
              <p className="text-[12px] leading-snug text-white/80 font-mono bg-white/5 rounded-md px-2.5 py-2 break-all">
                {sessionData.sessionId}
              </p>
            </div>
          </div>
        </div>

        {/* Session Stats */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-[#0F172A] p-4">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" /> Session Stats
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2.5 text-center">
              <p className="text-xl font-extrabold text-white leading-none tabular-nums">{sessionData.stats.questionsAsked}</p>
              <p className="text-[9px] text-white/40 font-medium uppercase tracking-wider mt-1.5">Asked</p>
            </div>
            <div className="rounded-xl bg-emerald-500/[0.08] border border-emerald-500/15 p-2.5 text-center">
              <p className="text-xl font-extrabold text-emerald-400 leading-none tabular-nums">{sessionData.stats.correctAnswers}</p>
              <p className="text-[9px] text-emerald-400/50 font-medium uppercase tracking-wider mt-1.5">Correct</p>
            </div>
            <div className={`rounded-xl p-2.5 text-center border ${
              sessionData.stats.accuracy >= 70 ? "bg-emerald-500/[0.08] border-emerald-500/15" :
              sessionData.stats.accuracy >= 40 ? "bg-amber-500/[0.08] border-amber-500/15" :
              "bg-red-500/[0.08] border-red-500/15"
            }`}>
              <p className={`text-xl font-extrabold leading-none tabular-nums ${
                sessionData.stats.accuracy >= 70 ? "text-emerald-400" :
                sessionData.stats.accuracy >= 40 ? "text-amber-400" : "text-red-400"
              }`}>{sessionData.stats.accuracy}%</p>
              <p className="text-[9px] text-white/40 font-medium uppercase tracking-wider mt-1.5">Accuracy</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/5 p-2.5">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Streak</span>
            <span className="text-sm font-extrabold text-blue-400 tabular-nums">{sessionData.stats.streak}</span>
            <span className="text-[10px] text-white/30">🔥 in a row</span>
          </div>
        </div>

        {/* Mastery ring */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-[#0F172A] p-5">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 text-center flex items-center justify-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${masteryColors.bg}`} /> Current Topic
          </h4>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                className="text-white/15"
              />
              <path
                d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeDasharray={`${sessionData.currentTopic.mastery}, 100`}
                className={masteryColors.ring}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold leading-none tabular-nums ${masteryColors.text}`}>{sessionData.currentTopic.mastery}</span>
              <span className="text-[9px] text-white/40 font-semibold uppercase tracking-[0.15em] mt-1">% Mastery</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h4 className="text-sm font-bold text-white leading-tight">{sessionData.currentTopic.name}</h4>
            <div className="mt-1.5">
              <span className={`text-[11px] font-semibold ${masteryColors.text}`}>Target: 85% mastery</span>
            </div>
          </div>
        </div>

        {sessionData.remediationMode && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <p className="text-amber-300 font-semibold text-xs">Remediation Active</p>
            </div>
            <p className="text-amber-200/70 text-[11px]">Extra support enabled</p>
          </div>
        )}
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {showFeedback && feedbackData ? (
          <div className="max-w-4xl mx-auto">
            <FeedbackPanel data={feedbackData} onNext={handleContinue} />
          </div>
        ) : (
           <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              {/* Question meta bar */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/25 font-bold text-sm text-teal-300 tabular-nums">
                    {sessionData.currentQuestion.number}
                  </span>
                  <span className="text-[13px] font-medium text-white/50">
                    Question {sessionData.currentQuestion.number}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Badge className={typeConfig.color}>
                    {typeConfig.label}
                  </Badge>
                  <Badge className={difficultyConfig.color}>
                    <div className={`w-1.5 h-1.5 rounded-full ${difficultyConfig.dot} mr-1.5`} />
                    {sessionData.currentQuestion.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Topic card */}
              <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 mb-5">
                <Code className="w-4 h-4 text-teal-400/70 shrink-0" />
                <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">Topic</span>
                <span className="text-sm font-semibold text-white/80 truncate">{sessionData.currentQuestion.topic}</span>
              </div>

              <Card className="bg-[#1e293b]/90 backdrop-blur-xl border-white/[0.07] shadow-xl overflow-hidden">
                <CardContent className="p-7 lg:p-8">
                  {/* Question text with accent */}
                  <div className="mb-7">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-white/35 uppercase tracking-widest">
                        <Target className="w-3.5 h-3.5 text-teal-400/70" />
                        Question
                      </div>
                      <div className="h-px flex-1 bg-white/[0.06]" />
                    </div>
                    <h2 className="text-[15px] font-medium text-white/90 leading-relaxed">
                      {sessionData.currentQuestion.text}
                    </h2>
                  </div>

                  {sessionData.currentQuestion.code_snippet && (
                    <div className="mb-8 bg-[#0F172A] rounded-xl border border-white/5 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-teal-400" />
                          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Code</span>
                        </div>
                        <button
                          onClick={copyCode}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-xs"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 text-emerald-400 text-sm overflow-x-auto font-mono whitespace-pre-wrap break-words leading-relaxed">
                        <code>{sessionData.currentQuestion.code_snippet}</code>
                      </pre>
                    </div>
                  )}

                  <div className="mb-8">
                    {sessionData.currentQuestion.type === "mcq" && sessionData.currentQuestion.options && (
                      <div className="space-y-3">
                        {sessionData.currentQuestion.options.map((option) => (
                          <button
                            key={option.letter}
                            onClick={() => setSelectedAnswer(option.letter)}
                            className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                              selectedAnswer === option.letter
                                ? "border-teal-500 bg-teal-500/10 text-white shadow-[0_0_20px_rgba(13,148,136,0.15)]"
                                : "border-white/10 bg-white/[0.02] text-white/80 hover:border-teal-500/30 hover:bg-teal-500/5"
                            }`}
                            disabled={isEvaluating}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                                selectedAnswer === option.letter
                                  ? "border-teal-500 bg-teal-500 text-white"
                                  : "border-white/20 text-white/40"
                              }`}>
                                {option.letter}
                              </div>
                              <span className="font-medium">{option.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {isCodeAnswerType && (
                      <div>
                        {requiresSandbox ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <p className="text-white/70 text-sm">
                                Write your solution in the editor and test it before submitting:
                              </p>
                              {runCodeButton}
                            </div>

                            <SandboxCodeEditor
                              value={codeAnswer}
                              onChange={setCodeAnswer}
                              readOnly={isEvaluating || isRunning}
                            />

                            {consoleOutput}

                            <p className="text-white/30 text-xs">
                              Running your code executes it in a secure sandbox — it does not submit or grade your answer.
                            </p>
                          </div>
                        ) : (
                          <textarea
                            value={codeAnswer}
                            onChange={(e) => setCodeAnswer(e.target.value)}
                            placeholder={
                              sessionData.currentQuestion.type === "code_completion"
                                ? "// Complete the missing code here..."
                                : sessionData.currentQuestion.type === "debugging"
                                ? "// Fix the bugs in the code above..."
                                : "// Write your complete solution here..."
                            }
                            className="w-full h-52 bg-[#0F172A] border border-white/10 rounded-xl p-5 text-emerald-400 font-mono text-sm resize-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 focus:outline-none transition-all"
                            disabled={isEvaluating}
                          />
                        )}
                      </div>
                    )}

                    {isTraceQuestion && (
                      <div className="space-y-5">
                        <div>
                          <p className="text-white/70 text-sm mb-3">Trace through the code and write the expected output:</p>
                          <textarea
                            value={codeAnswer}
                            onChange={(e) => setCodeAnswer(e.target.value)}
                            placeholder="Enter expected output..."
                            className="w-full h-32 bg-[#0F172A] border border-white/10 rounded-xl p-5 text-white font-mono text-sm resize-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 focus:outline-none transition-all"
                            disabled={isEvaluating}
                          />
                        </div>

                        {sessionData.currentQuestion.code_snippet && (
                          <div className="space-y-4 pt-5 border-t border-white/5">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                                Sandbox — run the provided snippet to verify your trace
                              </p>
                              {runCodeButton}
                            </div>

                            <SandboxCodeEditor
                              value={traceRunCode}
                              onChange={setTraceRunCode}
                              readOnly={isEvaluating || isRunning}
                            />

                            {consoleOutput}

                            <p className="text-white/30 text-xs">
                              Runs the provided snippet in a secure sandbox — only your traced output above is submitted for grading.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <button
                      onClick={() => setShowHint(prev => prev < sessionData.currentQuestion.hints.length ? prev + 1 : prev)}
                      className="inline-flex items-center gap-2.5 text-teal-400 hover:text-teal-300 transition-colors group"
                      disabled={isEvaluating}
                    >
                      <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/15 group-hover:bg-teal-500/20 transition-colors">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">
                        {showHint === 0 ? "Need a hint?" :
                         showHint < sessionData.currentQuestion.hints.length ? `Hint ${showHint} of ${sessionData.currentQuestion.hints.length}` :
                         "All hints revealed"}
                      </span>
                    </button>

                    {showHint > 0 && (
                      <div className="mt-4 space-y-3">
                        {sessionData.currentQuestion.hints.slice(0, showHint).map((hint, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-amber-500/[0.05] border border-amber-500/15 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-amber-400 text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-amber-100/80 text-sm leading-relaxed">{hint}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 text-xs text-white/30">
                      <Zap className="w-3.5 h-3.5 text-teal-400/60" />
                      <span>AI-powered evaluation</span>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        isEvaluating ||
                        (sessionData.currentQuestion.type === "mcq" && !selectedAnswer) ||
                        (sessionData.currentQuestion.type !== "mcq" && !codeAnswer.trim())
                      }
                      className="bg-teal-600 hover:bg-teal-500 text-white px-7 py-2.5 font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/20"
                    >
                      {isEvaluating ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-sm">
                            {sessionData.currentQuestion.type === "mcq"
                              ? "Checking answer..."
                              : "Evaluating code... (30-90s)"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <Send className="w-4 h-4" />
                          <span className="text-sm">Submit Answer</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

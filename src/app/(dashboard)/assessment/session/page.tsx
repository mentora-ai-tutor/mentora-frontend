"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Circle,
  Lightbulb,
  Send,
  Copy,
  AlertTriangle,
  Target,
  Code,
  Zap,
  Trophy,
  TrendingUp,
  BarChart3
} from "lucide-react";
import FeedbackPanel from "../components/FeedbackPanel";

interface StoredQA {
  id: string;
  number: number;
  question: string;
  type: "mcq" | "code_completion" | "code_tracing" | "debugging" | "coding_challenge";
  code_snippet?: string;
  options?: string[];
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

interface Question {
  id: string;
  number: number;
  text: string;
  type: "mcq" | "code_completion" | "code_tracing" | "debugging" | "coding_challenge";
  code_snippet?: string;
  options?: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  hints: string[];
}

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

interface SessionPageProps {
  sessionData?: SessionData;
  onSubmitAnswer?: (answer: string) => void;
  isEvaluating?: boolean;
}

export default function SessionPage({
  sessionData = {
    sessionId: "SESSION_001",
    learnerId: "STU-2026-1147",
    currentTopic: {
      name: "Binary Search Trees",
      mastery: 65,
      status: "current",
      gap_type: "FUNDAMENTAL_GAP"
    },
    allTopics: [
      { name: "Basic Syntax", mastery: 95, status: "mastered", gap_type: "PARTIAL_GAP" },
      { name: "Binary Search Trees", mastery: 65, status: "current", gap_type: "FUNDAMENTAL_GAP" },
      { name: "Java Collections", mastery: 0, status: "pending", gap_type: "PARTIAL_GAP" },
      { name: "OOP Design", mastery: 0, status: "pending", gap_type: "PARTIAL_GAP" }
    ],
    currentQuestion: {
      id: "q1",
      number: 3,
      text: "What is the time complexity of inserting an element into a balanced binary search tree?",
      type: "mcq",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      difficulty: "Medium",
      topic: "Binary Search Trees",
      hints: ["Consider how the tree maintains balance", "Think about the height of the tree"]
    },
    stats: {
      questionsAsked: 7,
      correctAnswers: 5,
      accuracy: 71,
      streak: 2
    },
    remediationMode: false
  },
  onSubmitAnswer = () => {},
  isEvaluating = false
}: SessionPageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [codeAnswer, setCodeAnswer] = useState<string>("");
  const [showHint, setShowHint] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const getTopicIcon = (status: string) => {
    switch (status) {
      case "mastered": return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "current": return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <Circle className="w-4 h-4 text-slate-500" />;
    }
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

  const handleSubmit = () => {
    const answer = sessionData.currentQuestion.type === "mcq" ? selectedAnswer : codeAnswer;

    const isCorrect = Math.random() > 0.5;
    const mockFeedback = {
      is_correct: isCorrect,
      partial_credit: false,
      correctness_score: isCorrect ? 100 : 0,
      evaluation_summary: isCorrect ? "Correct answer selected." : "Incorrect answer selected.",
      immediate_feedback: isCorrect
        ? "Great job! You correctly identified the time complexity of BST insertion."
        : "The answer needs some work. Let's review the concept.",
      concept_explanation: "Binary Search Trees maintain their efficiency through balancing algorithms that ensure the tree height remains logarithmic relative to the number of nodes.",
      what_is_correct: isCorrect ? "You correctly recognized that BST operations depend on tree height." : undefined,
      mistake_analysis: !isCorrect ? "The common mistake here is misunderstanding time complexity." : undefined,
      correct_explanation: "The correct answer is O(log n) because balanced BSTs guarantee that search, insertion, and deletion operations take time proportional to the height of the tree, which is O(log n) for n nodes.",
      improvement_tip: "Remember that BST performance depends entirely on tree balance - always consider the height factor.",
      hint_for_retry: !isCorrect ? "Consider how the tree maintains balance." : undefined,
      deeper_insight: "Advanced BST implementations like AVL trees and Red-Black trees use rotation operations to maintain balance automatically.",
      remediation_note: undefined,
      encouragement: isCorrect
        ? "Excellent analytical thinking! You're developing a strong intuition for algorithmic complexity."
        : "Keep practicing! Understanding algorithmic complexity takes time but you're on the right track.",
      suggested_resources: ["Java TreeMap Documentation", "GeeksforGeeks BST Tutorial"],
      mastery_update: {
        topic: sessionData.currentTopic.name,
        before_mastery: sessionData.currentTopic.mastery,
        after_mastery: Math.min(100, sessionData.currentTopic.mastery + (isCorrect ? 5 : -2)),
        target: 85
      },
      remediation_status: undefined,
      difficulty_change: {
        next_difficulty: isCorrect ? "Harder" : "Simpler",
      },
      next_action: "continue",
      next_topic_name: "Java Collections Framework",
      question_text: sessionData.currentQuestion.text,
      learner_answer: answer
    };

    const qaItem: StoredQA = {
      id: sessionData.currentQuestion.id,
      number: sessionData.currentQuestion.number,
      question: sessionData.currentQuestion.text,
      type: sessionData.currentQuestion.type,
      code_snippet: sessionData.currentQuestion.code_snippet,
      options: sessionData.currentQuestion.options,
      learner_answer: answer,
      correct_answer: sessionData.currentQuestion.type === "mcq"
        ? sessionData.currentQuestion.options![sessionData.currentQuestion.options!.indexOf(answer)]
        : "See explanation",
      is_correct: isCorrect,
      explanation: mockFeedback.correct_explanation,
      topic: sessionData.currentQuestion.topic,
      difficulty: sessionData.currentQuestion.difficulty,
      time_spent: timeElapsed,
      timestamp: Date.now()
    };
    saveQA(qaItem);

    setFeedbackData(mockFeedback);
    setShowFeedback(true);
    onSubmitAnswer(answer);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedAnswer("");
    setCodeAnswer("");
    setShowHint(0);
    setTimeElapsed(0);
  };

  const copyCode = () => {
    if (sessionData.currentQuestion.code_snippet) {
      navigator.clipboard.writeText(sessionData.currentQuestion.code_snippet);
    }
  };

  const masteryColors = getMasteryColor(sessionData.currentTopic.mastery);
  const difficultyConfig = getDifficultyConfig(sessionData.currentQuestion.difficulty);
  const typeConfig = getTypeConfig(sessionData.currentQuestion.type);

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <div className="w-72 bg-[#1e293b]/95 backdrop-blur-xl border-r border-white/5 p-5 overflow-y-auto flex flex-col">
        {/* Session Info Card */}
        <div className="mb-6 bg-[#0F172A] rounded-xl border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-teal-500/10">
              <Target className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Assessment Session</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Learner</span>
                <button
                  onClick={() => navigator.clipboard.writeText(sessionData.learnerId)}
                  className="p-0.5 hover:bg-white/5 rounded transition-colors"
                  title="Copy Learner ID"
                >
                  <Copy className="w-3 h-3 text-white/30 hover:text-white/60" />
                </button>
              </div>
              <p className="text-xs text-white/70 font-mono bg-white/5 rounded px-2 py-1.5 truncate">
                {sessionData.learnerId}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Session ID</span>
                <button
                  onClick={() => navigator.clipboard.writeText(sessionData.sessionId)}
                  className="p-0.5 hover:bg-white/5 rounded transition-colors"
                  title="Copy Session ID"
                >
                  <Copy className="w-3 h-3 text-white/30 hover:text-white/60" />
                </button>
              </div>
              <p className="text-xs text-white/70 font-mono bg-white/5 rounded px-2 py-1.5 truncate">
                {sessionData.sessionId}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/5"
              />
              <path
                d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${sessionData.currentTopic.mastery}, 100`}
                className={masteryColors.ring}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${masteryColors.text}`}>{sessionData.currentTopic.mastery}%</span>
              <span className="text-[10px] text-white/40">Mastery</span>
            </div>
          </div>
          <h4 className="text-white font-bold text-sm mb-1">{sessionData.currentTopic.name}</h4>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${masteryColors.bg}`} />
            <span className="text-xs text-white/50">Target: 85%</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Topic Progress
          </h4>
          <div className="space-y-2">
            {sessionData.allTopics.map((topic, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  topic.status === "current"
                    ? "bg-blue-500/10 border border-blue-500/20"
                    : topic.status === "mastered"
                    ? "bg-emerald-500/5 border border-emerald-500/10"
                    : "bg-white/[0.02] border border-transparent"
                }`}
              >
                {getTopicIcon(topic.status)}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    topic.status === "current" ? "text-blue-300" :
                    topic.status === "mastered" ? "text-emerald-400" : "text-white/50"
                  }`}>
                    {topic.name}
                  </p>
                  {topic.mastery > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getMasteryColor(topic.mastery).bg}`}
                          style={{ width: `${topic.mastery}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40">{topic.mastery}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="bg-[#0F172A] rounded-xl p-4 border border-white/5">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Session Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xl font-black text-white">{sessionData.stats.questionsAsked}</p>
                <p className="text-[10px] text-white/40 uppercase">Asked</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-emerald-400">{sessionData.stats.correctAnswers}</p>
                <p className="text-[10px] text-white/40 uppercase">Correct</p>
              </div>
              <div className="text-center">
                <p className={`text-xl font-black ${
                  sessionData.stats.accuracy >= 70 ? "text-emerald-400" :
                  sessionData.stats.accuracy >= 40 ? "text-amber-400" : "text-red-400"
                }`}>{sessionData.stats.accuracy}%</p>
                <p className="text-[10px] text-white/40 uppercase">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-blue-400">{sessionData.stats.streak}</p>
                <p className="text-[10px] text-white/40 uppercase">Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40 uppercase">Time</span>
            </div>
            <span className="text-lg font-mono font-bold text-teal-400">{formatTime(timeElapsed)}</span>
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
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <Badge className={difficultyConfig.color}>
                  <div className={`w-1.5 h-1.5 rounded-full ${difficultyConfig.dot} mr-1.5`} />
                  {sessionData.currentQuestion.difficulty}
                </Badge>
                <Badge className={typeConfig.color}>
                  {typeConfig.label}
                </Badge>
                <Badge variant="outline" className="border-teal-500/30 text-teal-300">
                  {sessionData.currentQuestion.topic}
                </Badge>
                <span className="text-sm text-white/40 ml-auto">
                  Question {sessionData.currentQuestion.number}
                </span>
              </div>

              <Card className="bg-[#1e293b]/90 backdrop-blur-xl border-white/5 shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-white leading-relaxed">
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
                      <pre className="p-4 text-emerald-400 text-sm overflow-x-auto font-mono">
                        <code>{sessionData.currentQuestion.code_snippet}</code>
                      </pre>
                    </div>
                  )}

                  <div className="mb-8">
                    {sessionData.currentQuestion.type === "mcq" && sessionData.currentQuestion.options && (
                      <div className="space-y-3">
                        {sessionData.currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnswer(option)}
                            className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                              selectedAnswer === option
                                ? "border-teal-500 bg-teal-500/10 text-white shadow-[0_0_20px_rgba(13,148,136,0.15)]"
                                : "border-white/10 bg-white/[0.02] text-white/80 hover:border-teal-500/30 hover:bg-teal-500/5"
                            }`}
                            disabled={isEvaluating}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                                selectedAnswer === option
                                  ? "border-teal-500 bg-teal-500 text-white"
                                  : "border-white/20 text-white/40"
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="font-medium">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {(sessionData.currentQuestion.type === "code_completion" ||
                      sessionData.currentQuestion.type === "debugging" ||
                      sessionData.currentQuestion.type === "coding_challenge") && (
                      <div>
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
                      </div>
                    )}

                    {sessionData.currentQuestion.type === "code_tracing" && (
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
                    )}
                  </div>

                  <div className="mb-8">
                    <button
                      onClick={() => setShowHint(prev => prev < sessionData.currentQuestion.hints.length ? prev + 1 : prev)}
                      className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors group"
                      disabled={isEvaluating}
                    >
                      <div className="p-2 rounded-lg bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors">
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
                          <div key={index} className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-amber-400 text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-amber-200/90 text-sm">{hint}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-white/30">
                      <Zap className="w-3.5 h-3.5" />
                      <span>AI-powered evaluation</span>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        isEvaluating ||
                        (sessionData.currentQuestion.type === "mcq" && !selectedAnswer) ||
                        (sessionData.currentQuestion.type !== "mcq" && !codeAnswer.trim())
                      }
                      className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/20"
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

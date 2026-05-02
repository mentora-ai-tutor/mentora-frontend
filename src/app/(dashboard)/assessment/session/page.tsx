"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Circle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Send,
  Copy,
  AlertTriangle,
  Target,
  BookOpen,
  Code,
  Zap
} from "lucide-react";
import FeedbackPanel from "../components/FeedbackPanel";

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
  bloomLevel: number;
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
    bloomLevel: 3,
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

  const getRingColor = (mastery: number) => {
    if (mastery >= 85) return "stroke-green-400";
    if (mastery >= 60) return "stroke-blue-400";
    if (mastery >= 40) return "stroke-yellow-400";
    return "stroke-red-400";
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 85) return "text-green-400";
    if (mastery >= 60) return "text-blue-400";
    if (mastery >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getTopicIcon = (status: string) => {
    switch (status) {
      case "mastered": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "current": return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "mcq": return "bg-blue-500";
      case "code_completion": return "bg-purple-500";
      case "code_tracing": return "bg-indigo-500";
      case "debugging": return "bg-orange-500";
      case "coding_challenge": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "mcq": return "Multiple Choice";
      case "code_completion": return "Code Completion";
      case "code_tracing": return "Code Tracing";
      case "debugging": return "Debugging";
      case "coding_challenge": return "Coding Challenge";
      default: return type;
    }
  };

  const handleSubmit = () => {
    const answer = sessionData.currentQuestion.type === "mcq" ? selectedAnswer : codeAnswer;

    // Mock feedback data - in real app this would come from API
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
        bloom_level_change: isCorrect ? "Moving to Analyzing (L4)" : "Staying at Applying (L3)"
      },
      next_action: "continue",
      next_topic_name: "Java Collections Framework"
    };

    setFeedbackData(mockFeedback);
    setShowFeedback(true);
    onSubmitAnswer(answer);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedAnswer("");
    setCodeAnswer("");
    setShowHint(0);
    // In real app, this would load the next question
  };

  const copyCode = () => {
    if (sessionData.currentQuestion.code_snippet) {
      navigator.clipboard.writeText(sessionData.currentQuestion.code_snippet);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">

      {/* Left Sidebar */}
      <div className="w-80 bg-slate-800/50 border-r border-slate-700 p-6 overflow-y-auto">

        {/* Session Identity */}
        <div className="mb-6 p-3 bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-400 font-mono">Session ID: {sessionData.sessionId}</p>
          <p className="text-xs text-slate-400 font-mono">Learner: {sessionData.learnerId}</p>
        </div>

        {/* Current Topic Mastery Ring */}
        <div className="mb-6 text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-600"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${sessionData.currentTopic.mastery}, 100`}
                className={getRingColor(sessionData.currentTopic.mastery)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getMasteryColor(sessionData.currentTopic.mastery)}`}>
                {sessionData.currentTopic.mastery}%
              </span>
            </div>
          </div>
          <h4 className="text-white font-semibold text-sm">{sessionData.currentTopic.name}</h4>
          <p className="text-slate-400 text-xs">Target: 85%</p>
        </div>

        {/* Bloom's Level Indicator */}
        <div className="mb-6">
          <h4 className="text-white font-semibold text-sm mb-3">Bloom's Level</h4>
          <div className="space-y-1">
            {[
              { level: 1, name: "Remembering", active: sessionData.bloomLevel >= 1 },
              { level: 2, name: "Understanding", active: sessionData.bloomLevel >= 2 },
              { level: 3, name: "Applying", active: sessionData.bloomLevel >= 3 },
              { level: 4, name: "Analyzing", active: sessionData.bloomLevel >= 4 },
              { level: 5, name: "Evaluating", active: sessionData.bloomLevel >= 5 },
              { level: 6, name: "Creating", active: sessionData.bloomLevel >= 6 }
            ].map((bloom) => (
              <div key={bloom.level} className={`flex items-center gap-2 p-2 rounded text-xs ${
                bloom.active ? "bg-teal-500/20 border border-teal-500/30" : "bg-slate-700/30"
              }`}>
                <div className={`w-2 h-2 rounded-full ${bloom.active ? "bg-teal-400" : "bg-slate-500"}`} />
                <span className={bloom.active ? "text-teal-300" : "text-slate-400"}>
                  L{bloom.level} {bloom.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Roadmap */}
        <div className="mb-6">
          <h4 className="text-white font-semibold text-sm mb-3">Topic Roadmap</h4>
          <div className="space-y-2">
            {sessionData.allTopics.map((topic, index) => (
              <div key={index} className={`flex items-center gap-2 p-2 rounded text-xs ${
                topic.status === "current" ? "bg-blue-500/20 border border-blue-500/30" : "bg-slate-700/30"
              }`}>
                {getTopicIcon(topic.status)}
                <div className="flex-1">
                  <p className={topic.status === "current" ? "text-blue-300" : "text-slate-300"}>
                    {topic.name}
                  </p>
                  {topic.mastery > 0 && (
                    <p className="text-slate-400 text-xs">{topic.mastery}%</p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                  {topic.gap_type === "FUNDAMENTAL_GAP" ? "Fundamental" : "Partial"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Session Statistics */}
        <div className="mb-6">
          <h4 className="text-white font-semibold text-sm mb-3">Session Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/30 p-2 rounded text-center">
              <p className="text-white font-bold text-lg">{sessionData.stats.questionsAsked}</p>
              <p className="text-slate-400 text-xs">Questions</p>
            </div>
            <div className="bg-slate-700/30 p-2 rounded text-center">
              <p className="text-white font-bold text-lg">{sessionData.stats.correctAnswers}</p>
              <p className="text-slate-400 text-xs">Correct</p>
            </div>
            <div className="bg-slate-700/30 p-2 rounded text-center">
              <p className="text-white font-bold text-lg">{sessionData.stats.accuracy}%</p>
              <p className="text-slate-400 text-xs">Accuracy</p>
            </div>
            <div className="bg-slate-700/30 p-2 rounded text-center">
              <p className="text-white font-bold text-lg">{sessionData.stats.streak}</p>
              <p className="text-slate-400 text-xs">Streak</p>
            </div>
          </div>
        </div>

        {/* Remediation Mode Banner */}
        {sessionData.remediationMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <p className="text-amber-300 font-semibold text-sm">Remediation Mode Active</p>
            </div>
            <p className="text-amber-200 text-xs">
              Extra support questions are being provided to help build your foundation.
            </p>
          </div>
        )}

      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {showFeedback && feedbackData ? (
          <FeedbackPanel
            data={feedbackData}
            onNext={handleContinue}
          />
        ) : (
          <>
            {/* Question Header Bar */}
            <div className="mb-6 flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="flex items-center gap-4">
                <span className="text-white font-semibold">Question {sessionData.currentQuestion.number} of session</span>
                <Badge className={`${getDifficultyColor(sessionData.currentQuestion.difficulty)} text-white`}>
                  {sessionData.currentQuestion.difficulty}
                </Badge>
                <Badge className={`${getQuestionTypeColor(sessionData.currentQuestion.type)} text-white`}>
                  {getQuestionTypeLabel(sessionData.currentQuestion.type)}
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-300">
                  {sessionData.currentQuestion.topic}
                </Badge>
              </div>
            </div>

            {/* Question Card */}
            <Card className="bg-slate-800/30 border-slate-700 mb-6">
              <CardContent className="p-6">

                {/* Question Text */}
                <div className="mb-6">
                  <p className="text-white text-lg leading-relaxed">{sessionData.currentQuestion.text}</p>
                </div>

                {/* Code Block */}
                {sessionData.currentQuestion.code_snippet && (
                  <div className="mb-6 bg-slate-900 p-4 rounded-lg border border-slate-600 relative">
                    <button
                      onClick={copyCode}
                      className="absolute top-2 right-2 p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{sessionData.currentQuestion.code_snippet}</code>
                    </pre>
                  </div>
                )}

                {/* Answer Input Area */}
                <div className="mb-6">

                  {/* MCQ Options */}
                  {sessionData.currentQuestion.type === "mcq" && sessionData.currentQuestion.options && (
                    <div className="space-y-3">
                      {sessionData.currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(option)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selectedAnswer === option
                              ? "border-teal-500 bg-teal-500/10 text-teal-300"
                              : "border-slate-600 bg-slate-700/30 text-white hover:border-slate-500"
                          }`}
                          disabled={isEvaluating}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                              selectedAnswer === option ? "border-teal-500 text-teal-300" : "border-slate-500 text-slate-400"
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Code Input */}
                  {(sessionData.currentQuestion.type === "code_completion" ||
                    sessionData.currentQuestion.type === "debugging" ||
                    sessionData.currentQuestion.type === "coding_challenge") && (
                    <div>
                      <textarea
                        value={codeAnswer}
                        onChange={(e) => setCodeAnswer(e.target.value)}
                        placeholder={
                          sessionData.currentQuestion.type === "code_completion"
                            ? "// Complete the missing code here"
                            : sessionData.currentQuestion.type === "debugging"
                            ? "// Fix the bugs in the code above"
                            : "// Write your complete solution here"
                        }
                        className="w-full h-48 bg-slate-900 border border-slate-600 rounded-lg p-4 text-green-400 font-mono text-sm resize-none focus:border-teal-500 focus:outline-none"
                        disabled={isEvaluating}
                      />
                    </div>
                  )}

                  {/* Code Tracing Input */}
                  {sessionData.currentQuestion.type === "code_tracing" && (
                    <div>
                      <p className="text-slate-300 text-sm mb-3">Trace through the code above and write what will be printed/returned:</p>
                      <textarea
                        value={codeAnswer}
                        onChange={(e) => setCodeAnswer(e.target.value)}
                        placeholder="Expected output..."
                        className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white font-mono text-sm resize-none focus:border-teal-500 focus:outline-none"
                        disabled={isEvaluating}
                      />
                    </div>
                  )}

                </div>

                {/* Hint System */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowHint(prev => prev < sessionData.currentQuestion.hints.length ? prev + 1 : prev)}
                    className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
                    disabled={isEvaluating}
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-sm">
                      {showHint === 0 ? "Need a hint?" :
                       showHint < sessionData.currentQuestion.hints.length ? `Hint ${showHint} of ${sessionData.currentQuestion.hints.length}` :
                       "All hints shown"}
                    </span>
                  </button>

                  {showHint > 0 && (
                    <div className="mt-3 space-y-3">
                      {sessionData.currentQuestion.hints.slice(0, showHint).map((hint, index) => (
                        <div key={index} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <p className="text-amber-200 text-sm"><span className="font-semibold mr-2">Hint {index + 1}:</span>{hint}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isEvaluating ||
                      (sessionData.currentQuestion.type === "mcq" && !selectedAnswer) ||
                      (sessionData.currentQuestion.type !== "mcq" && !codeAnswer.trim())
                    }
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEvaluating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {sessionData.currentQuestion.type === "mcq" ? "Checking your answer..." : "AI is evaluating your code answer... this may take 30–90 seconds"}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Submit Answer
                      </div>
                    )}
                  </Button>
                </div>

              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
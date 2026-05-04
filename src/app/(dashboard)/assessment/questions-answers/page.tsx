"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code,
  Lightbulb,
  Target,
  Star,
  Clock,
  TrendingUp,
  HelpCircle,
  Trash2
} from "lucide-react";

interface QAItem {
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
  bloom_level: number;
  time_spent: number;
  timestamp?: number;
}

export default function QuestionsAnswersPage() {
  const [qaData, setQaData] = useState<QAItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");

  useEffect(() => {
    const stored = localStorage.getItem("assessment_qa");
    if (stored) {
      const parsed: QAItem[] = JSON.parse(stored);
      setQaData(parsed.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)));
    }
  }, []);

  const clearAll = () => {
    localStorage.removeItem("assessment_qa");
    setQaData([]);
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "mcq": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "code_completion": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "code_tracing": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      case "debugging": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "coding_challenge": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "mcq": return "Multiple Choice";
      case "code_completion": return "Code Completion";
      case "code_tracing": return "Code Tracing";
      case "debugging": return "Debugging";
      case "coding_challenge": return "Coding Challenge";
      default: return type;
    }
  };

  const filteredData = qaData.filter(item => {
    if (filter === "correct") return item.is_correct;
    if (filter === "incorrect") return !item.is_correct;
    return true;
  });

  const correctCount = qaData.filter(q => q.is_correct).length;
  const totalCount = qaData.length;
  const accuracy = Math.round((correctCount / totalCount) * 100);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 animate-pulse" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-white mb-2">Questions & Answers</h1>
              <p className="text-white/60">Review all the questions you've answered with detailed explanations</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[#0F172A] rounded-xl border border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-wider">Accuracy</p>
                <p className={`text-xl font-black ${accuracy >= 70 ? "text-teal-400" : accuracy >= 40 ? "text-amber-400" : "text-red-400"}`}>{accuracy}%</p>
              </div>
              <div className="px-4 py-2 bg-[#0F172A] rounded-xl border border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-wider">Questions</p>
                <p className="text-xl font-black text-white">{totalCount}</p>
              </div>
              {totalCount > 0 && (
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {[
              { key: "all", label: "All Questions", count: totalCount },
              { key: "correct", label: "Correct", count: correctCount },
              { key: "incorrect", label: "Incorrect", count: totalCount - correctCount },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  filter === key
                    ? "bg-teal-500/10 text-teal-400 border-teal-500/30"
                    : "bg-[#0F172A]/50 text-white/50 border-white/5 hover:text-white/80 hover:border-white/10"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      {totalCount === 0 ? (
        <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center">
          <HelpCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Questions Answered Yet</h3>
          <p className="text-white/50 mb-6">
            Complete an assessment to see your questions and answers here.
          </p>
          <a
            href="/assessment/launch"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold transition-colors"
          >
            Start Assessment
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((item) => {
          const isExpanded = expandedItems[item.id];

          return (
            <div
              key={item.id}
              className={`bg-[#1e293b]/90 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${
                item.is_correct ? "border-teal-500/20" : "border-red-500/20"
              }`}
            >
              {/* Question Header */}
              <div
                className="p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.is_correct ? "bg-teal-500/10" : "bg-red-500/10"
                  }`}>
                    {item.is_correct ? (
                      <CheckCircle className="w-5 h-5 text-teal-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-bold text-white/40">Q{item.number}</span>
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}
                      </Badge>
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeLabel(item.type)}
                      </Badge>
                      <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                        {item.topic}
                      </Badge>
                      <Badge variant="outline" className="border-white/10 text-white/40">
                        L{item.bloom_level}
                      </Badge>
                    </div>

                    <h3 className="text-white font-semibold mb-2">{item.question}</h3>

                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time_spent}s
                      </span>
                      <span className={`flex items-center gap-1 font-semibold ${
                        item.is_correct ? "text-teal-400" : "text-red-400"
                      }`}>
                        {item.is_correct ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Incorrect
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-white/40" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-0 border-t border-white/5">
                  <div className="mt-4 space-y-4">

                    {/* Code Snippet */}
                    {item.code_snippet && (
                      <div className="bg-[#0F172A] rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="w-4 h-4 text-teal-400" />
                          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Code</span>
                        </div>
                        <pre className="text-green-400 text-sm overflow-x-auto">
                          <code>{item.code_snippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* MCQ Options */}
                    {item.options && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Options</p>
                        {item.options.map((option, idx) => {
                          const isLearnerAnswer = option === item.learner_answer;
                          const isCorrectAnswer = option === item.correct_answer;
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border text-sm ${
                                isCorrectAnswer
                                  ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                                  : isLearnerAnswer
                                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                                  : "bg-[#0F172A] border-white/5 text-white/60"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{String.fromCharCode(65 + idx)}.</span>
                                <span>{option}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle className="w-4 h-4 text-teal-400 ml-auto shrink-0" />
                                )}
                                {isLearnerAnswer && !isCorrectAnswer && (
                                  <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Learner Answer */}
                    <div className="bg-[#0F172A] rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        {item.is_correct ? (
                          <CheckCircle className="w-4 h-4 text-teal-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Your Answer
                        </span>
                      </div>
                      <p className={`text-sm ${item.is_correct ? "text-teal-300" : "text-red-300"}`}>
                        {item.learner_answer}
                      </p>
                    </div>

                    {/* Correct Answer (only if incorrect) */}
                    {!item.is_correct && (
                      <div className="bg-teal-500/5 rounded-xl p-4 border border-teal-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-teal-400" />
                          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                            Correct Answer
                          </span>
                        </div>
                        <p className="text-sm text-teal-300">{item.correct_answer}</p>
                      </div>
                    )}

                     {/* Explanation */}
                    <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                          Explanation
                        </span>
                      </div>
                      <p className="text-sm text-amber-200/80 leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Summary Footer */}
      <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Assessment Summary</h3>
            <p className="text-sm text-white/50">
              You answered {correctCount} out of {totalCount} questions correctly
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-bold text-teal-400">{correctCount} Correct</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">{totalCount - correctCount} Incorrect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

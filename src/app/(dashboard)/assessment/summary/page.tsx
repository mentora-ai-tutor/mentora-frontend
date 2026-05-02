"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Target, TrendingUp, Award, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface TopicSummary {
  name: string;
  finalMastery: number;
  questionsAnswered: number;
  accuracy: number;
  status: "mastered" | "needs_work";
}

interface QASummary {
  number: number;
  topic: string;
  difficulty: string;
  questionText: string;
  learnerAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface SummaryData {
  overallMastery: number;
  overallAccuracy: number;
  totalQuestions: number;
  sessionDuration: number; // in minutes
  overallGrade: string;
  topics: TopicSummary[];
  qaReview: QASummary[];
  sessionId: string;
  learnerId: string;
}

interface SummaryPageProps {
  data?: SummaryData;
  onViewReport?: () => void;
  isGeneratingReport?: boolean;
}

export default function SummaryPage({
  data = {
    overallMastery: 72,
    overallAccuracy: 68,
    totalQuestions: 25,
    sessionDuration: 45,
    overallGrade: "Good",
    topics: [
      { name: "Basic Syntax", finalMastery: 95, questionsAnswered: 5, accuracy: 100, status: "mastered" },
      { name: "Binary Search Trees", finalMastery: 78, questionsAnswered: 8, accuracy: 75, status: "needs_work" },
      { name: "Java Collections", finalMastery: 65, questionsAnswered: 7, accuracy: 57, status: "needs_work" },
      { name: "OOP Design", finalMastery: 58, questionsAnswered: 5, accuracy: 60, status: "needs_work" }
    ],
    qaReview: [
      { number: 1, topic: "Basic Syntax", difficulty: "Easy", questionText: "What is the correct way to declare a variable in Java?", learnerAnswer: "int x = 5;", correctAnswer: "int x = 5;", isCorrect: true },
      { number: 2, topic: "Basic Syntax", difficulty: "Easy", questionText: "Which keyword is used to define a class in Java?", learnerAnswer: "class", correctAnswer: "class", isCorrect: true },
      { number: 3, topic: "Binary Search Trees", difficulty: "Medium", questionText: "What is the time complexity of BST insertion?", learnerAnswer: "O(n)", correctAnswer: "O(log n)", isCorrect: false },
      { number: 4, topic: "Binary Search Trees", difficulty: "Medium", questionText: "What property must BSTs maintain?", learnerAnswer: "Left child < parent < right child", correctAnswer: "Left child ≤ parent < right child", isCorrect: false },
      { number: 5, topic: "Java Collections", difficulty: "Hard", questionText: "What is the difference between ArrayList and LinkedList?", learnerAnswer: "ArrayList is faster for random access", correctAnswer: "ArrayList is faster for random access, LinkedList is faster for insertions/deletions", isCorrect: false }
    ],
    sessionId: "SESSION_001",
    learnerId: "STU-2026-1147"
  },
  onViewReport = () => {},
  isGeneratingReport = false
}: SummaryPageProps) {

  const [showQAReview, setShowQAReview] = useState(true);

  const getGradeBanner = () => {
    if (data.overallMastery >= 85) {
      return {
        title: "Outstanding Performance",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/30"
      };
    } else if (data.overallMastery >= 70) {
      return {
        title: "Good Performance",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/30"
      };
    } else if (data.overallMastery >= 55) {
      return {
        title: "Satisfactory Performance",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10 border-yellow-500/30"
      };
    } else {
      return {
        title: "Needs Further Practice",
        color: "text-red-400",
        bgColor: "bg-red-500/10 border-red-500/30"
      };
    }
  };

  const gradeBanner = getGradeBanner();

  const masteredTopics = data.topics.filter(t => t.status === "mastered");
  const needsWorkTopics = data.topics.filter(t => t.status === "needs_work");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Session Complete</h1>
          <p className="text-slate-300">Session {data.sessionId} • Learner {data.learnerId}</p>
        </div>

        {/* Hero Result Banner */}
        <Card className={gradeBanner.bgColor}>
          <CardContent className="p-8 text-center">
            <h2 className={`text-4xl font-bold mb-2 ${gradeBanner.color}`}>{gradeBanner.title}</h2>
            <p className="text-slate-300 text-lg">Overall Grade: {data.overallGrade}</p>
          </CardContent>
        </Card>

        {/* Four Key Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{data.overallMastery}%</p>
              <p className="text-slate-400 text-sm">Overall Mastery</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{data.overallAccuracy}%</p>
              <p className="text-slate-400 text-sm">Overall Accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{data.totalQuestions}</p>
              <p className="text-slate-400 text-sm">Total Questions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{data.sessionDuration}</p>
              <p className="text-slate-400 text-sm">Minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* Topic-by-topic Performance Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Topic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold">{topic.name}</h4>
                      <Badge className={topic.status === "mastered" ? "bg-green-500" : "bg-red-500"}>
                        {topic.status === "mastered" ? "Mastered ✓" : "Needs Work"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{topic.questionsAnswered} questions</span>
                      <span>{topic.accuracy}% accuracy</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 bg-slate-600 rounded-full h-2 mb-1">
                      <div
                        className={`h-2 rounded-full ${topic.finalMastery >= 85 ? 'bg-green-500' : topic.finalMastery >= 60 ? 'bg-blue-500' : topic.finalMastery >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${topic.finalMastery}%` }}
                      />
                    </div>
                    <p className="text-white font-bold">{topic.finalMastery}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mastered vs Needs Work */}
        <div className="grid md:grid-cols-2 gap-6">

          <Card className="bg-green-500/10 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Topics Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              {masteredTopics.length > 0 ? (
                <ul className="space-y-2">
                  {masteredTopics.map((topic, index) => (
                    <li key={index} className="text-green-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {topic.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-200/70">No topics mastered yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-red-500/10 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center gap-2">
                <X className="w-5 h-5" />
                Topics for Further Study
              </CardTitle>
            </CardHeader>
            <CardContent>
              {needsWorkTopics.length > 0 ? (
                <ul className="space-y-2">
                  {needsWorkTopics.map((topic, index) => (
                    <li key={index} className="text-red-200 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {topic.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-200/70">All topics mastered!</p>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Q&A Review Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Q&A Review</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQAReview(!showQAReview)}
                className="text-slate-400 hover:text-white"
              >
                {showQAReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {showQAReview && (
            <CardContent>
              <div className="space-y-4">
                {data.qaReview.map((qa, index) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">#{qa.number}</span>
                        <Badge variant="outline" className="border-slate-500 text-slate-300">
                          {qa.topic}
                        </Badge>
                        <Badge className={`${
                          qa.difficulty === "Easy" ? "bg-green-500" :
                          qa.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
                        } text-white`}>
                          {qa.difficulty}
                        </Badge>
                        {qa.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-white font-medium">{qa.questionText}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Your answer:</p>
                          <p className={`font-mono p-2 rounded ${qa.isCorrect ? 'bg-green-500/10 text-green-200' : 'bg-red-500/10 text-red-200'}`}>
                            {qa.learnerAnswer}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Correct answer:</p>
                          <p className="font-mono p-2 rounded bg-slate-700/50 text-slate-200">
                            {qa.correctAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Loading State for AI Report */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg">Generating AI Feedback Report</h3>
              <p className="text-slate-400 mt-2">
                Your personalized AI feedback report is being generated... This may take 60–120 seconds.
              </p>
            </div>

            {isGeneratingReport ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-teal-400">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                  <span>Processing...</span>
                </div>
              </div>
            ) : (
              <Button
                onClick={onViewReport}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 font-semibold rounded-lg"
              >
                View My Assessment Report →
              </Button>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
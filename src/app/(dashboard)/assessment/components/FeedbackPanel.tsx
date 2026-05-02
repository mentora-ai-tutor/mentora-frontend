"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  X,
  Minus,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Pencil,
  ArrowRight,
  Trophy,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  AlertTriangle,
  Target
} from "lucide-react";

interface FeedbackData {
  is_correct: boolean;
  partial_credit: boolean;
  correctness_score?: number;
  evaluation_summary: string;
  immediate_feedback: string;
  concept_explanation: string;
  what_is_correct?: string;
  mistake_analysis?: string;
  correct_explanation: string;
  improvement_tip: string;
  hint_for_retry?: string;
  deeper_insight?: string;
  remediation_note?: string;
  encouragement: string;
  suggested_resources: string[];
  mastery_update: {
    topic: string;
    before_mastery: number;
    after_mastery: number;
    target: number;
  };
  remediation_status?: {
    entered: boolean;
    exited: boolean;
    message: string;
  };
  difficulty_change?: {
    next_difficulty: "Harder" | "Simpler";
    bloom_level_change: string;
  };
  next_action: "continue" | "next_topic" | "complete";
  next_topic_name?: string;
}

interface FeedbackPanelProps {
  data?: FeedbackData;
  onNext?: () => void;
}

export default function FeedbackPanel({
  data = {
    is_correct: true,
    partial_credit: false,
    evaluation_summary: "Correct answer selected.",
    immediate_feedback: "Great job! You correctly identified the time complexity of BST insertion.",
    concept_explanation: "Binary Search Trees maintain their efficiency through balancing algorithms that ensure the tree height remains logarithmic relative to the number of nodes.",
    what_is_correct: "You correctly recognized that BST operations depend on tree height.",
    correct_explanation: "The correct answer is O(log n) because balanced BSTs guarantee that search, insertion, and deletion operations take time proportional to the height of the tree, which is O(log n) for n nodes.",
    improvement_tip: "Remember that BST performance depends entirely on tree balance - always consider the height factor.",
    deeper_insight: "Advanced BST implementations like AVL trees and Red-Black trees use rotation operations to maintain balance automatically.",
    encouragement: "Excellent analytical thinking! You're developing a strong intuition for algorithmic complexity.",
    suggested_resources: ["Java TreeMap Documentation", "GeeksforGeeks BST Tutorial"],
    mastery_update: {
      topic: "Binary Search Trees",
      before_mastery: 65,
      after_mastery: 78,
      target: 85
    },
    difficulty_change: {
      next_difficulty: "Harder",
      bloom_level_change: "Moving to Analyzing (L4)"
    },
    next_action: "continue",
    next_topic_name: "Java Collections Framework"
  },
  onNext = () => {}
}: FeedbackPanelProps) {

  const getResultBanner = () => {
    if (data.is_correct) {
      return {
        icon: <CheckCircle className="w-8 h-8 text-green-400" />,
        title: "Correct!",
        bgColor: "bg-green-500/10 border-green-500/30",
        textColor: "text-green-200"
      };
    } else if (data.partial_credit) {
      return {
        icon: <Minus className="w-8 h-8 text-yellow-400" />,
        title: `Partially Correct (${data.correctness_score}%)`,
        bgColor: "bg-yellow-500/10 border-yellow-500/30",
        textColor: "text-yellow-200"
      };
    } else {
      return {
        icon: <X className="w-8 h-8 text-red-400" />,
        title: "Incorrect",
        bgColor: "bg-red-500/10 border-red-500/30",
        textColor: "text-red-200"
      };
    }
  };

  const result = getResultBanner();

  return (
    <div className="space-y-6">

      {/* Result Banner */}
      <Card className={`${result.bgColor} border`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {result.icon}
            <div>
              <h3 className="text-xl font-bold text-white">{result.title}</h3>
              <p className={result.textColor}>{data.evaluation_summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Sections */}
      <div className="space-y-4">

        {/* Immediate Feedback */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4">
            <p className="text-white">{data.immediate_feedback}</p>
          </CardContent>
        </Card>

        {/* Concept Explanation */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h4 className="text-blue-300 font-semibold">Concept Explanation</h4>
            </div>
            <p className="text-blue-200">{data.concept_explanation}</p>
          </CardContent>
        </Card>

        {/* What You Got Right */}
        {data.what_is_correct && (
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-4 h-4 text-green-400" />
                <h4 className="text-green-300 font-semibold">What You Got Right</h4>
              </div>
              <p className="text-green-200">{data.what_is_correct}</p>
            </CardContent>
          </Card>
        )}

        {/* What Was Wrong */}
        {data.mistake_analysis && (
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsDown className="w-4 h-4 text-red-400" />
                <h4 className="text-red-300 font-semibold">What Was Wrong</h4>
              </div>
              <p className="text-red-200">{data.mistake_analysis}</p>
            </CardContent>
          </Card>
        )}

        {/* The Correct Answer */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-2">The Correct Answer</h4>
            <p className="text-slate-200">{data.correct_explanation}</p>
          </CardContent>
        </Card>

        {/* Improvement Tip */}
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Pencil className="w-4 h-4 text-amber-400" />
              <h4 className="text-amber-300 font-semibold">Improvement Tip</h4>
            </div>
            <p className="text-amber-200">{data.improvement_tip}</p>
          </CardContent>
        </Card>

        {/* Hint for Next Attempt */}
        {data.hint_for_retry && (
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <h4 className="text-slate-300 font-semibold mb-2">Hint for Next Attempt</h4>
              <p className="text-slate-400">{data.hint_for_retry}</p>
            </CardContent>
          </Card>
        )}

        {/* Deeper Insight */}
        {data.deeper_insight && (
          <Card className="bg-indigo-500/10 border-indigo-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-indigo-400" />
                <h4 className="text-indigo-300 font-semibold">Deeper Insight</h4>
              </div>
              <p className="text-indigo-200">{data.deeper_insight}</p>
            </CardContent>
          </Card>
        )}

        {/* Remediation Note */}
        {data.remediation_note && (
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-amber-300 font-semibold">Remediation Update</h4>
              </div>
              <p className="text-amber-200">{data.remediation_note}</p>
            </CardContent>
          </Card>
        )}

        {/* Encouragement */}
        <Card className="bg-teal-500/10 border-teal-500/30">
          <CardContent className="p-4">
            <p className="text-teal-200 italic">{data.encouragement}</p>
          </CardContent>
        </Card>

        {/* Suggested Resources */}
        {data.suggested_resources.length > 0 && (
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-4">
              <h4 className="text-white font-semibold mb-3">Suggested Resources</h4>
              <div className="flex flex-wrap gap-2">
                {data.suggested_resources.map((resource, index) => (
                  <Badge key={index} variant="outline" className="border-slate-500 text-slate-300 cursor-pointer hover:border-teal-500 hover:text-teal-300">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {resource}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* Mastery Progress Update */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardContent className="p-6">
          <h4 className="text-white font-semibold mb-4">Mastery Progress Update</h4>

          <div className="mb-4">
            <p className="text-white font-medium">{data.mastery_update.topic}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-slate-400">Before: {data.mastery_update.before_mastery}%</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="text-white font-bold">After: {data.mastery_update.after_mastery}%</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.mastery_update.after_mastery}%` }}
              />
              <div
                className="w-1 h-4 bg-amber-400 absolute -mt-1"
                style={{ left: `${data.mastery_update.target}%`, marginLeft: '-2px' }}
              />
            </div>
            <p className="text-slate-400 text-sm mt-1">
              {data.mastery_update.after_mastery >= data.mastery_update.target
                ? "Topic Mastered!"
                : `${data.mastery_update.target - data.mastery_update.after_mastery}% more to master this topic`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Remediation Status Notifications */}
      {data.remediation_status && (
        <Card className={`${data.remediation_status.entered ? 'bg-amber-500/10 border-amber-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {data.remediation_status.entered ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <Trophy className="w-5 h-5 text-green-400" />
              )}
              <p className={`font-semibold ${data.remediation_status.entered ? 'text-amber-300' : 'text-green-300'}`}>
                {data.remediation_status.entered ? "Entered Remediation Mode" : "Exited Remediation Mode"}
              </p>
            </div>
            <p className={`mt-2 ${data.remediation_status.entered ? 'text-amber-200' : 'text-green-200'}`}>
              {data.remediation_status.message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Difficulty Change Notification */}
      {data.difficulty_change && (
        <div className={`p-3 rounded-lg border text-center ${
          data.difficulty_change.next_difficulty === "Harder"
            ? "bg-green-500/10 border-green-500/30"
            : "bg-amber-500/10 border-amber-500/30"
        }`}>
          <p className={`text-sm font-medium ${
            data.difficulty_change.next_difficulty === "Harder" ? "text-green-300" : "text-amber-300"
          }`}>
            Next question: {data.difficulty_change.next_difficulty} ({data.difficulty_change.bloom_level_change})
          </p>
        </div>
      )}

      {/* Next Action Button */}
      <div className="text-center">
        <Button
          onClick={onNext}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 font-semibold rounded-lg"
        >
          {data.next_action === "continue" && "Next Question →"}
          {data.next_action === "next_topic" && `Next Topic: ${data.next_topic_name} →`}
          {data.next_action === "complete" && "View My Assessment Report →"}
        </Button>
      </div>

    </div>
  );
}
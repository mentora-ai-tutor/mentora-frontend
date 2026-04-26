"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, Trophy, ArrowRight } from "lucide-react";

interface TransitionData {
  completedTopic: {
    name: string;
    finalMastery: number;
    mastered: boolean;
    questionsAnswered: number;
    accuracy: number;
    bloomLevels: number[];
  };
  nextTopic: {
    name: string;
    gap_type: "FUNDAMENTAL_GAP" | "PARTIAL_GAP";
    startingDifficulty: "Easy" | "Medium" | "Hard";
  };
  sessionId: string;
  learnerId: string;
}

interface TransitionPageProps {
  data?: TransitionData;
  onContinue?: () => void;
}

export default function TransitionPage({
  data = {
    completedTopic: {
      name: "Binary Search Trees",
      finalMastery: 87,
      mastered: true,
      questionsAnswered: 8,
      accuracy: 75,
      bloomLevels: [1, 2, 3, 4]
    },
    nextTopic: {
      name: "Java Collections Framework",
      gap_type: "PARTIAL_GAP",
      startingDifficulty: "Medium"
    },
    sessionId: "SESSION_001",
    learnerId: "STU-2026-1147"
  },
  onContinue = () => {}
}: TransitionPageProps) {

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

  const getAchievementContent = () => {
    if (data.completedTopic.mastered) {
      return {
        icon: <Trophy className="w-12 h-12 text-green-400" />,
        title: "Topic Mastered!",
        message: `You demonstrated strong understanding of ${data.completedTopic.name}.`,
        bgColor: "bg-green-500/10 border-green-500/30",
        textColor: "text-green-200"
      };
    } else {
      return {
        icon: <Info className="w-12 h-12 text-orange-400" />,
        title: "Assessment Complete",
        message: `You have completed all available questions for this topic with a score of ${data.completedTopic.finalMastery}%. This topic has been noted for further practice.`,
        bgColor: "bg-orange-500/10 border-orange-500/30",
        textColor: "text-orange-200"
      };
    }
  };

  const achievement = getAchievementContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Topic Transition</h1>
          <p className="text-slate-300">Session {data.sessionId} • Learner {data.learnerId}</p>
        </div>

        {/* Topic Completion Summary */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              You have completed: {data.completedTopic.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Mastery Ring */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
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
                    strokeDasharray={`${data.completedTopic.finalMastery}, 100`}
                    className={getRingColor(data.completedTopic.finalMastery)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getMasteryColor(data.completedTopic.finalMastery)}`}>
                    {data.completedTopic.finalMastery}%
                  </span>
                </div>
              </div>
            </div>

            {/* Achievement */}
            <div className={`p-6 rounded-lg border ${achievement.bgColor}`}>
              <div className="text-center space-y-3">
                {achievement.icon}
                <h3 className="text-xl font-semibold text-white">{achievement.title}</h3>
                <p className={achievement.textColor}>{achievement.message}</p>
              </div>
            </div>

            {/* What was covered */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">What was covered:</h4>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-slate-200">
                  You answered {data.completedTopic.questionsAnswered} questions covering Bloom's Levels{" "}
                  {data.completedTopic.bloomLevels.map(level => `L${level}`).join(", ")}.
                </p>
                <p className="text-slate-200 mt-2">
                  Accuracy: {data.completedTopic.accuracy}%
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Up Next Panel */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Next Topic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">{data.nextTopic.name}</h3>
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="border-slate-500 text-slate-300">
                  {data.nextTopic.gap_type === "FUNDAMENTAL_GAP" ? "Fundamental Gap" : "Partial Gap"}
                </Badge>
                <Badge className={`${
                  data.nextTopic.startingDifficulty === "Easy" ? "bg-green-500" :
                  data.nextTopic.startingDifficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
                } text-white`}>
                  Starting: {data.nextTopic.startingDifficulty}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={onContinue}
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg"
          >
            Start {data.nextTopic.name} →
          </Button>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Target, BookOpen, Clock, Play, AlertTriangle, CheckCircle } from "lucide-react";

interface Topic {
  name: string;
  priority: "Critical" | "High" | "Medium";
  gap_type: "FUNDAMENTAL_GAP" | "PARTIAL_GAP";
  misconceptions: string[];
  starting_difficulty: "Easy" | "Medium" | "Hard";
}

interface LaunchScreenProps {
  topics?: Topic[];
  sessionId?: string;
  learnerId?: string;
  onStart?: () => void;
}

export default function LaunchScreen({
  topics = [
    {
      name: "Binary Search Trees",
      priority: "Critical",
      gap_type: "FUNDAMENTAL_GAP",
      misconceptions: ["Confusing left/right child ordering", "Incorrect rotation logic"],
      starting_difficulty: "Easy"
    },
    {
      name: "Java Collections Framework",
      priority: "High",
      gap_type: "PARTIAL_GAP",
      misconceptions: ["ArrayList vs LinkedList performance", "HashMap collision handling"],
      starting_difficulty: "Medium"
    },
    {
      name: "Object-Oriented Design",
      priority: "Medium",
      gap_type: "PARTIAL_GAP",
      misconceptions: ["Inheritance vs composition", "Encapsulation principles"],
      starting_difficulty: "Hard"
    }
  ],
  sessionId = "SESSION_001",
  learnerId = "STU-2026-1147",
  onStart = () => {}
}: LaunchScreenProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    // Trigger API call here to initialize session
    // For now, just navigate to session page
    setTimeout(() => {
      router.push("/assessment/session");
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getGapTypeLabel = (gap_type: string) => {
    return gap_type === "FUNDAMENTAL_GAP" ? "Fundamental Gap" : "Partial Gap";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(13,148,136,0.2)]">
            <Target className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Assessment Session Launch</h1>
          <p className="text-slate-300">Session {sessionId} • Learner {learnerId}</p>
        </div>

        {/* Topics to be Assessed */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Topics to be Assessed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topics.map((topic, index) => (
              <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{topic.name}</h3>
                  <div className="flex gap-2">
                    <Badge className={`${getPriorityColor(topic.priority)} text-white`}>
                      {topic.priority}
                    </Badge>
                    <Badge variant="outline" className="border-slate-500 text-slate-300">
                      {getGapTypeLabel(topic.gap_type)}
                    </Badge>
                    <Badge className={`${getDifficultyColor(topic.starting_difficulty)} text-white`}>
                      {topic.starting_difficulty}
                    </Badge>
                  </div>
                </div>

                {topic.misconceptions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-slate-400 text-sm mb-2">Known misconceptions to address:</p>
                    <div className="flex flex-wrap gap-2">
                      {topic.misconceptions.map((misconception, idx) => (
                        <Badge key={idx} variant="outline" className="border-orange-500/50 text-orange-300 text-xs">
                          {misconception}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Session Rules */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Session Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Mastery Target</p>
                  <p className="text-slate-300 text-sm">85% mastery required per topic</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <Clock className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Question Limit</p>
                  <p className="text-slate-300 text-sm">Maximum 10 questions per topic</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">No Time Pressure</p>
                  <p className="text-slate-300 text-sm">Take your time to think through answers</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <Target className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Adaptive Assessment</p>
                  <p className="text-slate-300 text-sm">Questions adjust to your skill level</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Assessment Button */}
        <div className="text-center">
          <Button
            onClick={handleStart}
            disabled={isStarting}
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-[0_0_30px_rgba(13,148,136,0.3)] hover:shadow-[0_0_40px_rgba(13,148,136,0.5)] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Starting Assessment...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Play className="w-6 h-6" />
                Start Assessment
              </div>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
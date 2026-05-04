"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  Lightbulb,
  CheckCircle,
  X,
  Code,
  ExternalLink,
  Download,
  RotateCcw,
  Heart,
  AlertTriangle
} from "lucide-react";

interface TopicReport {
  topic_name: string;
  mastery_percentage: number;
  questions_asked: number;
  correct_answers: number;
  accuracy_percentage: number;
  strengths: string[];
  weaknesses: string[];
  misconceptions_found: string[];
  improvement_plan: string;
  recommended_exercises: string[];
  estimated_study_hours: number;
}

interface QAExplanation {
  question_number: number;
  question_text: string;
  learner_answer: string;
  correct_answer: string;
  concept_explanation: string;
  why_correct_answer: string;
  common_mistake: string;
  learning_tip: string;
}

interface LearningPath {
  immediate_focus: string;
  week_1_goals: string[];
  week_2_4_goals: string[];
  long_term_goals: string[];
}

interface Resource {
  topic: string;
  name: string;
  type: string;
  url_hint: string;
}

interface ReportData {
  report_title: string;
  learner_id: string;
  session_id: string;
  generated_at: string;
  overall_grade: string;
  overall_assessment: string;
  overall_mastery_percentage: number;
  overall_accuracy_percentage: number;
  total_questions: number;
  session_duration_minutes: number;
  topic_reports: TopicReport[];
  qa_with_explanations: QAExplanation[];
  key_strengths: string[];
  key_weaknesses: string[];
  misconceptions_to_address: string[];
  learning_path: LearningPath;
  recommended_resources: Resource[];
  practice_project_suggestion: string;
  next_assessment_recommendation: string;
  motivational_message: string;
}

interface ReportPageProps {
  data?: ReportData;
  onDownload?: () => void;
  onStartNew?: () => void;
}

export default function ReportPage({
  data = {
    report_title: "Java Programming Assessment — Personalized Feedback Report",
    learner_id: "STU-2026-1147",
    session_id: "SESSION_001",
    generated_at: "2026-04-23T14:30:00Z",
    overall_grade: "Good",
    overall_assessment: "You have demonstrated solid foundational knowledge in Java programming with room for growth in advanced data structures and algorithm analysis. Your understanding of basic syntax and object-oriented principles is strong, but you would benefit from more practice with complex data structures and their performance characteristics.",
    overall_mastery_percentage: 72,
    overall_accuracy_percentage: 68,
    total_questions: 25,
    session_duration_minutes: 45,
    topic_reports: [
      {
        topic_name: "Basic Syntax",
        mastery_percentage: 95,
        questions_asked: 5,
        correct_answers: 5,
        accuracy_percentage: 100,
        strengths: ["Variable declaration and data types", "Control flow statements", "Method signatures"],
        weaknesses: [],
        misconceptions_found: [],
        improvement_plan: "Continue practicing with edge cases in syntax",
        recommended_exercises: ["Write programs with complex nested loops", "Practice string manipulation methods"],
        estimated_study_hours: 2
      },
      {
        topic_name: "Binary Search Trees",
        mastery_percentage: 78,
        questions_asked: 8,
        correct_answers: 6,
        accuracy_percentage: 75,
        strengths: ["Basic BST operations", "Traversal algorithms"],
        weaknesses: ["Time complexity analysis", "Balance maintenance"],
        misconceptions_found: ["Confusing O(log n) vs O(n) complexity", "Incorrect rotation logic understanding"],
        improvement_plan: "Focus on algorithmic complexity analysis and practice with AVL trees",
        recommended_exercises: ["Implement BST with balance checking", "Analyze time complexity for various operations"],
        estimated_study_hours: 8
      }
    ],
    qa_with_explanations: [
      {
        question_number: 3,
        question_text: "What is the time complexity of inserting an element into a balanced binary search tree?",
        learner_answer: "O(n)",
        correct_answer: "O(log n)",
        concept_explanation: "Binary Search Trees maintain their efficiency through logarithmic height when balanced.",
        why_correct_answer: "The correct answer is O(log n) because balanced BSTs guarantee that search, insertion, and deletion operations take time proportional to the height of the tree, which is O(log n) for n nodes.",
        common_mistake: "Students often confuse BST complexity with unbalanced binary trees or linear data structures.",
        learning_tip: "Always consider the height of the tree when analyzing BST operations - balance is crucial for performance."
      }
    ],
    key_strengths: ["Strong grasp of Java syntax", "Good understanding of basic OOP concepts", "Logical thinking in algorithm design"],
    key_weaknesses: ["Algorithm complexity analysis", "Advanced data structure implementations", "Performance optimization techniques"],
    misconceptions_to_address: ["Time complexity confusion between O(log n) and O(n)", "Incorrect understanding of inheritance vs composition"],
    learning_path: {
      immediate_focus: "Binary Search Trees and algorithmic complexity",
      week_1_goals: ["Master BST operations and complexity analysis", "Practice with balanced tree implementations"],
      week_2_4_goals: ["Study advanced data structures (Heaps, Tries)", "Learn algorithm optimization techniques", "Practice competitive programming problems"],
      long_term_goals: ["Master system design principles", "Develop expertise in algorithm analysis", "Contribute to open-source projects"]
    },
    recommended_resources: [
      { topic: "Binary Search Trees", name: "GeeksforGeeks BST Tutorial", type: "website", url_hint: "geeksforgeeks.org/binary-search-tree" },
      { topic: "Algorithm Complexity", name: "Introduction to Algorithms (CLRS)", type: "book", url_hint: "mitpress.mit.edu/9780262033848" }
    ],
    practice_project_suggestion: "Build a Java implementation of a self-balancing BST with comprehensive test cases covering insertion, deletion, and search operations. Include performance benchmarks comparing balanced vs unbalanced trees.",
    next_assessment_recommendation: "Retake this assessment in 2 weeks after completing the recommended exercises. Focus particularly on Binary Search Trees and Java Collections.",
    motivational_message: "You're building a solid foundation in Java programming! With focused practice on algorithmic thinking and data structures, you'll see significant improvement in your coding skills. Keep pushing forward!"
  },
  onDownload = () => {},
  onStartNew = () => {}
}: ReportPageProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Report Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">{data.report_title}</h1>
          <div className="text-slate-300 space-y-1">
            <p>Learner ID: {data.learner_id}</p>
            <p>Session ID: {data.session_id}</p>
            <p>Generated: {formatDate(data.generated_at)}</p>
            <Badge className="bg-teal-500 text-white text-lg px-4 py-1 mt-2">
              Overall Grade: {data.overall_grade}
            </Badge>
          </div>
        </div>

        {/* Overall Assessment */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Overall Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-200 text-lg leading-relaxed">{data.overall_assessment}</p>
          </CardContent>
        </Card>

        {/* Performance Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{data.overall_mastery_percentage}%</p>
              <p className="text-slate-400 text-sm">Overall Mastery</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{data.overall_accuracy_percentage}%</p>
              <p className="text-slate-400 text-sm">Overall Accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{data.total_questions}</p>
              <p className="text-slate-400 text-sm">Total Questions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{data.session_duration_minutes}</p>
              <p className="text-slate-400 text-sm">Minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* Per-topic Deep Analysis */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Topic Analysis</h2>
          {data.topic_reports.map((topic, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>{topic.topic_name}</span>
                  <div className="flex items-center gap-4">
                    <Badge className={topic.mastery_percentage >= 85 ? "bg-green-500" : topic.mastery_percentage >= 60 ? "bg-blue-500" : "bg-yellow-500"}>
                      {topic.mastery_percentage}% Mastery
                    </Badge>
                    <span className="text-slate-400 text-sm">
                      {topic.correct_answers}/{topic.questions_asked} correct
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Performance Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-2xl font-bold text-white">{topic.questions_asked}</p>
                    <p className="text-slate-400 text-sm">Questions Asked</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-2xl font-bold text-white">{topic.correct_answers}</p>
                    <p className="text-slate-400 text-sm">Correct Answers</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-2xl font-bold text-white">{topic.accuracy_percentage}%</p>
                    <p className="text-slate-400 text-sm">Accuracy</p>
                  </div>
                </div>

                {/* Strengths */}
                {topic.strengths.length > 0 && (
                  <div>
                    <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside text-green-200 space-y-1">
                      {topic.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {topic.weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-red-300 font-semibold mb-2 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Weaknesses
                    </h4>
                    <ul className="list-disc list-inside text-red-200 space-y-1">
                      {topic.weaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Misconceptions Found */}
                {topic.misconceptions_found.length > 0 && (
                  <div>
                    <h4 className="text-orange-300 font-semibold mb-2">Misconceptions Found</h4>
                    <ul className="list-disc list-inside text-orange-200 space-y-1">
                      {topic.misconceptions_found.map((misconception, idx) => (
                        <li key={idx}>{misconception}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvement Plan */}
                <div>
                  <h4 className="text-blue-300 font-semibold mb-2">Improvement Plan</h4>
                  <p className="text-blue-200">{topic.improvement_plan}</p>
                </div>

                {/* Recommended Exercises */}
                <div>
                  <h4 className="text-purple-300 font-semibold mb-2">Recommended Exercises</h4>
                  <ul className="list-disc list-inside text-purple-200 space-y-1">
                    {topic.recommended_exercises.map((exercise, idx) => (
                      <li key={idx}>{exercise}</li>
                    ))}
                  </ul>
                  <p className="text-purple-400 text-sm mt-2">
                    Estimated study time: {topic.estimated_study_hours} hours
                  </p>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Q&A with AI Explanations */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Question Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.qa_with_explanations.map((qa, index) => (
              <div key={index} className="border border-slate-600 rounded-lg p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-slate-500 text-slate-300">
                      Question {qa.question_number}
                    </Badge>
                  </div>
                  <p className="text-white font-medium text-lg">{qa.question_text}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                    <p className="text-red-300 text-sm font-medium">Your Answer:</p>
                    <p className="text-red-200 font-mono">{qa.learner_answer}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-green-300 text-sm font-medium">Correct Answer:</p>
                    <p className="text-green-200 font-mono">{qa.correct_answer}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-blue-300 font-semibold flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4" />
                      Concept Explanation
                    </h5>
                    <p className="text-blue-200">{qa.concept_explanation}</p>
                  </div>

                  <div>
                    <h5 className="text-green-300 font-semibold mb-2">Why This Answer is Correct</h5>
                    <p className="text-green-200">{qa.why_correct_answer}</p>
                  </div>

                  <div>
                    <h5 className="text-orange-300 font-semibold mb-2">Common Mistake</h5>
                    <p className="text-orange-200">{qa.common_mistake}</p>
                  </div>

                  <div>
                    <h5 className="text-teal-300 font-semibold flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4" />
                      Learning Tip
                    </h5>
                    <p className="text-teal-200">{qa.learning_tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Strengths and Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">

          <Card className="bg-green-500/10 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.key_strengths.map((strength, index) => (
                  <li key={index} className="text-green-200 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-red-500/10 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center gap-2">
                <X className="w-5 h-5" />
                Key Weaknesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.key_weaknesses.map((weakness, index) => (
                  <li key={index} className="text-red-200 flex items-start gap-2">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* Misconceptions to Address */}
        {data.misconceptions_to_address.length > 0 && (
          <Card className="bg-orange-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-300">Misconceptions to Address</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.misconceptions_to_address.map((misconception, index) => (
                  <li key={index} className="text-orange-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {misconception}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Personalized Learning Path */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Personalized Learning Path</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <div>
              <h4 className="text-teal-300 font-semibold mb-2">Immediate Focus</h4>
              <p className="text-teal-200">{data.learning_path.immediate_focus}</p>
            </div>

            <div>
              <h4 className="text-blue-300 font-semibold mb-2">Week 1 Goals</h4>
              <ul className="list-disc list-inside text-blue-200 space-y-1">
                {data.learning_path.week_1_goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-purple-300 font-semibold mb-2">Weeks 2-4 Goals</h4>
              <ul className="list-disc list-inside text-purple-200 space-y-1">
                {data.learning_path.week_2_4_goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-indigo-300 font-semibold mb-2">Long-term Goals</h4>
              <ul className="list-disc list-inside text-indigo-200 space-y-1">
                {data.learning_path.long_term_goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>

          </CardContent>
        </Card>

        {/* Recommended Resources */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recommended Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {data.recommended_resources.map((resource, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-slate-500 text-slate-300">
                      {resource.topic}
                    </Badge>
                    <Badge className="bg-slate-600 text-slate-200">
                      {resource.type}
                    </Badge>
                  </div>
                  <h5 className="text-white font-medium mb-1">{resource.name}</h5>
                  <p className="text-slate-400 text-sm">{resource.url_hint}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Practice Project Suggestion */}
        <Card className="bg-teal-500/10 border-teal-500/30">
          <CardHeader>
            <CardTitle className="text-teal-300 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Practice Project Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-teal-200 leading-relaxed">{data.practice_project_suggestion}</p>
          </CardContent>
        </Card>

        {/* Next Assessment Recommendation */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Next Assessment Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-200">{data.next_assessment_recommendation}</p>
          </CardContent>
        </Card>

        {/* Motivational Closing */}
        <Card className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-teal-500/30">
          <CardContent className="p-8 text-center">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <p className="text-white text-lg italic leading-relaxed">{data.motivational_message}</p>
          </CardContent>
        </Card>

        {/* Report Actions */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={onDownload}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button
            onClick={onStartNew}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 font-semibold rounded-lg"
          >
            Start New Session →
          </Button>
        </div>

      </div>
    </div>
  );
}
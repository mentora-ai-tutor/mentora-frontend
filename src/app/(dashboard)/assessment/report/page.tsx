"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  AlertTriangle,
  Loader2
} from "lucide-react";
import { assessmentApi } from "@/lib/api/assessment";

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

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        let storedReport = localStorage.getItem('assessment_feedback_report');
        let storedQaReview = localStorage.getItem('assessment_qa_review');

        if (storedReport) {
          const report = JSON.parse(storedReport);
          const currentLearnerId = JSON.parse(localStorage.getItem('user') || '{}').student_id;
          const belongsToCurrentUser = !currentLearnerId || !report.learner_id || report.learner_id === currentLearnerId;

          if (!belongsToCurrentUser) {
            localStorage.removeItem('assessment_feedback_report');
            localStorage.removeItem('assessment_qa_review');
            localStorage.removeItem('assessment_session_summary');
            storedReport = null;
            storedQaReview = null;
          }
        }

        if (storedReport) {
          const report = JSON.parse(storedReport);
          const qaReview = storedQaReview ? JSON.parse(storedQaReview) : [];

          const topicNames = [...new Set(qaReview.map((q: any) => q.topic).filter(Boolean))] as string[];
          const rawTopics = report.topic_reports || [];
          const topicReports = topicNames.map((name: string) => {
            const items = qaReview.filter((q: any) => q.topic === name);
            const correct = items.filter((q: any) => q.is_correct).length;
            const extra = rawTopics.find((t: any) =>
              (t.topic_name || t.topic || t.name || '').toLowerCase() === name.toLowerCase()
            ) || {};
            return {
              topic_name: name,
              mastery_percentage: extra.mastery_percentage ?? extra.mastery ?? (items.length > 0 ? Math.round((correct / items.length) * 100) : 0),
              questions_asked: extra.questions_asked ?? extra.questions ?? extra.total_questions ?? items.length,
              correct_answers: extra.correct_answers ?? extra.correct ?? extra.total_correct ?? correct,
              accuracy_percentage: extra.accuracy_percentage ?? extra.accuracy ?? (items.length > 0 ? Math.round((correct / items.length) * 100) : 0),
              strengths: Array.isArray(extra.strengths) ? extra.strengths : (Array.isArray(extra.topic_strengths) ? extra.topic_strengths : []),
              weaknesses: Array.isArray(extra.weaknesses) ? extra.weaknesses : (Array.isArray(extra.topic_weaknesses) ? extra.topic_weaknesses : []),
              misconceptions_found: Array.isArray(extra.misconceptions_found) ? extra.misconceptions_found : (Array.isArray(extra.misconceptions) ? extra.misconceptions : []),
              improvement_plan: extra.improvement_plan || extra.improvement_roadmap || '',
              recommended_exercises: Array.isArray(extra.recommended_exercises) ? extra.recommended_exercises : (Array.isArray(extra.exercises) ? extra.exercises : []),
              estimated_study_hours: extra.estimated_study_hours ?? extra.study_hours ?? 0,
            };
          });

          setData({
            report_title: report.report_title || "Java Programming Assessment — Personalized Feedback Report",
            learner_id: report.learner_id || 'Unknown',
            session_id: report.session_id || 'Unknown',
            generated_at: report.generated_at || new Date().toISOString(),
            overall_grade: report.overall_grade || 'Completed',
            overall_assessment: report.overall_assessment || 'Assessment completed successfully.',
            overall_mastery_percentage: report.overall_mastery_percentage ?? 0,
            overall_accuracy_percentage: report.overall_accuracy_percentage ?? 0,
            total_questions: report.total_questions ?? qaReview.length ?? 0,
            session_duration_minutes: report.session_duration_minutes ?? 0,
            topic_reports: topicReports,
            qa_with_explanations: (qaReview || []).map((q: any) => ({
              question_number: q.question_number || 0,
              question_text: q.question_text || '',
              learner_answer: q.learner_answer || '',
              correct_answer: q.correct_answer || '',
              concept_explanation: '',
              why_correct_answer: '',
              common_mistake: '',
              learning_tip: '',
            })),
            key_strengths: report.key_strengths || [],
            key_weaknesses: report.key_weaknesses || [],
            misconceptions_to_address: report.misconceptions_to_address || [],
            learning_path: {
              immediate_focus: report.learning_path?.immediate_focus || 'Review topics needing improvement',
              week_1_goals: report.learning_path?.week_1_goals || [],
              week_2_4_goals: report.learning_path?.week_2_4_goals || [],
              long_term_goals: typeof report.learning_path?.long_term_goals === 'string'
                ? [report.learning_path.long_term_goals]
                : (report.learning_path?.long_term_goals || []),
            },
            recommended_resources: report.recommended_resources || [],
            practice_project_suggestion: report.practice_project_suggestion || '',
            next_assessment_recommendation: report.next_assessment_recommendation || '',
            motivational_message: report.motivational_message || 'Great effort! Keep learning.',
          });
          setLoading(false);
          return;
        }

        let sid = sessionId || JSON.parse(localStorage.getItem('assessment_session') || '{}').session_id;

        if (!sid && !storedReport) {
          try {
            const sessionsRes = await assessmentApi.getSessions();
            if (sessionsRes.success && sessionsRes.data?.length > 0) {
              sid = sessionsRes.data[0].session_id;
            }
          } catch {}
        }

        if (sid && !storedReport) {
          const fbRes = await assessmentApi.getFeedbackReport(sid);
          if (fbRes.success && fbRes.data) {
            const report = fbRes.data.feedback_report || {};
            const qaReview = fbRes.data.full_qa_review || [];

            const topicNames = [...new Set(qaReview.map((q: any) => q.topic).filter(Boolean))] as string[];
            const rawTopics = report.topic_reports || [];
            const topicReports = topicNames.map((name: string) => {
              const items = qaReview.filter((q: any) => q.topic === name);
              const correct = items.filter((q: any) => q.is_correct).length;
              const extra = rawTopics.find((t: any) =>
                (t.topic_name || t.topic || t.name || '').toLowerCase() === name.toLowerCase()
              ) || {};
              return {
                topic_name: name,
                mastery_percentage: extra.mastery_percentage ?? extra.mastery ?? (items.length > 0 ? Math.round((correct / items.length) * 100) : 0),
                questions_asked: extra.questions_asked ?? extra.questions ?? extra.total_questions ?? items.length,
                correct_answers: extra.correct_answers ?? extra.correct ?? extra.total_correct ?? correct,
                accuracy_percentage: extra.accuracy_percentage ?? extra.accuracy ?? (items.length > 0 ? Math.round((correct / items.length) * 100) : 0),
                strengths: Array.isArray(extra.strengths) ? extra.strengths : (Array.isArray(extra.topic_strengths) ? extra.topic_strengths : []),
                weaknesses: Array.isArray(extra.weaknesses) ? extra.weaknesses : (Array.isArray(extra.topic_weaknesses) ? extra.topic_weaknesses : []),
                misconceptions_found: Array.isArray(extra.misconceptions_found) ? extra.misconceptions_found : (Array.isArray(extra.misconceptions) ? extra.misconceptions : []),
                improvement_plan: extra.improvement_plan || extra.improvement_roadmap || '',
                recommended_exercises: Array.isArray(extra.recommended_exercises) ? extra.recommended_exercises : (Array.isArray(extra.exercises) ? extra.exercises : []),
                estimated_study_hours: extra.estimated_study_hours ?? extra.study_hours ?? 0,
              };
            });

            setData({
              report_title: report.report_title || "Java Programming Assessment — Personalized Feedback Report",
              learner_id: report.learner_id || 'Unknown',
              session_id: fbRes.data.session_id || sid,
              generated_at: report.generated_at || new Date().toISOString(),
              overall_grade: report.overall_grade || 'Completed',
              overall_assessment: report.overall_assessment || 'Assessment completed successfully.',
              overall_mastery_percentage: report.overall_mastery_percentage ?? 0,
              overall_accuracy_percentage: report.overall_accuracy_percentage ?? 0,
              total_questions: report.total_questions ?? qaReview.length ?? 0,
              session_duration_minutes: report.session_duration_minutes ?? 0,
              topic_reports: topicReports,
              qa_with_explanations: (qaReview || []).map((q: any) => ({
                question_number: q.question_number || 0,
                question_text: q.question_text || '',
                learner_answer: q.learner_answer || '',
                correct_answer: q.correct_answer || '',
                concept_explanation: '',
                why_correct_answer: '',
                common_mistake: '',
                learning_tip: '',
              })),
              key_strengths: report.key_strengths || [],
              key_weaknesses: report.key_weaknesses || [],
              misconceptions_to_address: report.misconceptions_to_address || [],
              learning_path: {
                immediate_focus: report.learning_path?.immediate_focus || 'Review topics needing improvement',
                week_1_goals: report.learning_path?.week_1_goals || [],
                week_2_4_goals: report.learning_path?.week_2_4_goals || [],
                long_term_goals: typeof report.learning_path?.long_term_goals === 'string'
                  ? [report.learning_path.long_term_goals]
                  : (report.learning_path?.long_term_goals || []),
              },
              recommended_resources: report.recommended_resources || [],
              practice_project_suggestion: report.practice_project_suggestion || '',
              next_assessment_recommendation: report.next_assessment_recommendation || '',
              motivational_message: report.motivational_message || 'Great effort! Keep learning.',
            });
            setLoading(false);
            return;
          }
        }

        if (sid) {
          const res = await assessmentApi.getSession(sid);
          if (res.success && res.data) {
            const session = res.data.updated_session || res.data;
            const report = res.data.feedback_report || session.feedback_report || {};
            const qaItems = JSON.parse(localStorage.getItem('assessment_qa') || '[]');
            const topics = session.all_topics || session.topics || [];

            setData({
              report_title: "Java Programming Assessment — Personalized Feedback Report",
              learner_id: session.learner_id || res.data.learner_id || 'Unknown',
              session_id: sid,
              generated_at: report.generated_at || new Date().toISOString(),
              overall_grade: report.overall_grade || 'Completed',
              overall_assessment: report.overall_assessment || 'Assessment completed successfully.',
              overall_mastery_percentage: report.overall_mastery_percentage ?? session.current_topic_mastery ?? 0,
              overall_accuracy_percentage: report.overall_accuracy_percentage ?? session.accuracy_percentage ?? 0,
              total_questions: report.total_questions ?? qaItems.length ?? 0,
              session_duration_minutes: report.session_duration_minutes ?? session.duration_minutes ?? 0,
              topic_reports: topics.map((t: any) => ({
                topic_name: t.name || t.topic_name || t.topic || 'Unknown',
                mastery_percentage: t.mastery || t.mastery_percentage || 0,
                questions_asked: t.questions_asked || 0,
                correct_answers: t.correct_answers || 0,
                accuracy_percentage: t.accuracy_percentage || 0,
                strengths: Array.isArray(t.strengths) ? t.strengths : [],
                weaknesses: Array.isArray(t.weaknesses) ? t.weaknesses : [],
                misconceptions_found: Array.isArray(t.misconceptions_found) ? t.misconceptions_found : [],
                improvement_plan: t.improvement_plan || '',
                recommended_exercises: Array.isArray(t.recommended_exercises) ? t.recommended_exercises : [],
                estimated_study_hours: t.estimated_study_hours || 0,
              })),
              qa_with_explanations: qaItems.map((q: any) => ({
                question_number: q.number,
                question_text: q.question,
                learner_answer: q.learner_answer,
                correct_answer: q.correct_answer,
                concept_explanation: q.explanation || '',
                why_correct_answer: '',
                common_mistake: '',
                learning_tip: '',
              })),
              key_strengths: report.key_strengths || [],
              key_weaknesses: report.key_weaknesses || [],
              misconceptions_to_address: report.misconceptions_to_address || [],
              learning_path: {
                immediate_focus: report.learning_path?.immediate_focus || 'Review topics needing improvement',
                week_1_goals: report.learning_path?.week_1_goals || [],
                week_2_4_goals: report.learning_path?.week_2_4_goals || [],
                long_term_goals: typeof report.learning_path?.long_term_goals === 'string'
                  ? [report.learning_path.long_term_goals]
                  : (report.learning_path?.long_term_goals || []),
              },
              recommended_resources: report.recommended_resources || [],
              practice_project_suggestion: report.practice_project_suggestion || '',
              next_assessment_recommendation: report.next_assessment_recommendation || '',
              motivational_message: report.motivational_message || 'Great effort! Keep learning.',
            });
            setLoading(false);
            return;
          }
        }
      } catch {}

      const qaItems = JSON.parse(localStorage.getItem('assessment_qa') || '[]');
      if (qaItems.length > 0) {
        const correct = qaItems.filter((q: any) => q.is_correct).length;
        const topicNames = [...new Set(qaItems.map((q: any) => q.topic))] as string[];
        const topics = topicNames.map((t: string) => {
          const items = qaItems.filter((q: any) => q.topic === t);
          const correctCount = items.filter((q: any) => q.is_correct).length;
          return {
            topic_name: t,
            mastery_percentage: Math.round((correctCount / items.length) * 100),
            questions_asked: items.length,
            correct_answers: correctCount,
            accuracy_percentage: Math.round((correctCount / items.length) * 100),
            strengths: [],
            weaknesses: [],
            misconceptions_found: [],
            improvement_plan: '',
            recommended_exercises: [],
            estimated_study_hours: 0,
          };
        });

        setData({
          report_title: "Java Programming Assessment — Personalized Feedback Report",
          learner_id: JSON.parse(localStorage.getItem('user') || '{}').student_id || 'Unknown',
          session_id: 'local',
          generated_at: new Date().toISOString(),
          overall_grade: (correct / qaItems.length) >= 0.85 ? 'Excellent' : (correct / qaItems.length) >= 0.7 ? 'Good' : 'Satisfactory',
          overall_assessment: `You answered ${correct} out of ${qaItems.length} questions correctly (${Math.round((correct / qaItems.length) * 100)}%).`,
          overall_mastery_percentage: Math.round((correct / qaItems.length) * 100),
          overall_accuracy_percentage: Math.round((correct / qaItems.length) * 100),
          total_questions: qaItems.length,
          session_duration_minutes: 0,
          topic_reports: topics,
          qa_with_explanations: qaItems.map((q: any) => ({
            question_number: q.number,
            question_text: q.question,
            learner_answer: q.learner_answer,
            correct_answer: q.correct_answer,
            concept_explanation: q.explanation || '',
            why_correct_answer: '',
            common_mistake: '',
            learning_tip: '',
          })),
          key_strengths: [],
          key_weaknesses: [],
          misconceptions_to_address: [],
          learning_path: {
            immediate_focus: 'Review topics needing improvement',
            week_1_goals: [],
            week_2_4_goals: [],
            long_term_goals: [],
          },
          recommended_resources: [],
          practice_project_suggestion: '',
          next_assessment_recommendation: '',
          motivational_message: 'Great effort! Keep learning.',
        });
      }
      setLoading(false);
    };

    loadReport();
  }, [sessionId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const onDownload = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-report-${data.session_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onStartNew = () => {
    localStorage.removeItem('assessment_qa');
    localStorage.removeItem('assessment_session');
    router.push('/assessment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-white/70 font-semibold">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Report Available</h2>
          <p className="text-white/60 mb-6">Complete an assessment session first to view your personalized feedback report.</p>
          <Button onClick={() => router.push('/assessment')} className="bg-teal-600 hover:bg-teal-500 text-white">
            Go to Assessment
          </Button>
        </div>
      </div>
    );
  }

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
                {Array.isArray(topic.strengths) && topic.strengths.length > 0 && (
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
                {Array.isArray(topic.weaknesses) && topic.weaknesses.length > 0 && (
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
                {Array.isArray(topic.misconceptions_found) && topic.misconceptions_found.length > 0 && (
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
                {Array.isArray(topic.recommended_exercises) && topic.recommended_exercises.length > 0 && (
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
                )}

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

                {qa.concept_explanation && (
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-blue-300 font-semibold flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4" />
                        Concept Explanation
                      </h5>
                      <p className="text-blue-200">{qa.concept_explanation}</p>
                    </div>
                  </div>
                )}
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

            {data.learning_path.immediate_focus && (
              <div>
                <h4 className="text-teal-300 font-semibold mb-2">Immediate Focus</h4>
                <p className="text-teal-200">{data.learning_path.immediate_focus}</p>
              </div>
            )}

            {data.learning_path.week_1_goals.length > 0 && (
              <div>
                <h4 className="text-blue-300 font-semibold mb-2">Week 1 Goals</h4>
                <ul className="list-disc list-inside text-blue-200 space-y-1">
                  {data.learning_path.week_1_goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.learning_path.week_2_4_goals.length > 0 && (
              <div>
                <h4 className="text-purple-300 font-semibold mb-2">Weeks 2-4 Goals</h4>
                <ul className="list-disc list-inside text-purple-200 space-y-1">
                  {data.learning_path.week_2_4_goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.learning_path.long_term_goals.length > 0 && (
              <div>
                <h4 className="text-indigo-300 font-semibold mb-2">Long-term Goals</h4>
                {typeof data.learning_path.long_term_goals === 'string' ? (
                  <p className="text-indigo-200">{data.learning_path.long_term_goals}</p>
                ) : (
                  <ul className="list-disc list-inside text-indigo-200 space-y-1">
                    {data.learning_path.long_term_goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

          </CardContent>
        </Card>

        {data.recommended_resources.length > 0 && (
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
        )}

        {data.practice_project_suggestion && (
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
        )}

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
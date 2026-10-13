'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Code2,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { peerLearningApi, type QuizQuestion, type QuizSummaryResponse } from '@/lib/api/peerLearning';
import Editor from '@monaco-editor/react';

interface FeedbackItem {
  question: QuizQuestion;
  submitted: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

type Phase = 'loading' | 'question' | 'completed' | 'error';

export default function IndividualQuiz() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('loading');
  const [sessionId, setSessionId] = useState('');
  const [topic, setTopic] = useState('Java');
  const [totalQuestions, setTotalQuestions] = useState(7);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackItem | null>(null);
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [summary, setSummary] = useState<QuizSummaryResponse | null>(null);
  const [error, setError] = useState('');
  const answerTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const startQuiz = useCallback(async () => {
    setPhase('loading');
    setError('');
    try {
      const res = await peerLearningApi.startIndividualQuiz();
      if (res.success && res.data) {
        const data = res.data;
        setSessionId(data.session_id);
        setTotalQuestions(data.total_questions || 7);
        setQuestionIndex(data.question_index || 0);
        setCurrentQuestion(data.first_question);
        setAnswer('');
        setFeedback(null);
        setHistory([]);
        setSummary(null);
        setPhase('question');
      } else {
        setError(res.message || 'Failed to start the quiz.');
        setPhase('error');
      }
    } catch {
      setError('Network error. Please try again.');
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const handleSubmit = async () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await peerLearningApi.submitQuizAnswer(answer);
      if (res.success && res.data) {
        const data = res.data;
        const item: FeedbackItem = {
          question: currentQuestion!,
          submitted: answer,
          isCorrect: data.is_correct,
          correctAnswer: data.correct_answer,
          explanation: data.explanation,
        };
        const nextHistory = [...history, item];
        setHistory(nextHistory);
        setFeedback(item);

        if (data.is_quiz_completed) {
          setPhase('loading');
          setAnswer('');
          try {
            const summaryRes = await peerLearningApi.getQuizSummary(sessionId);
            if (summaryRes.success && summaryRes.data) {
              setSummary(summaryRes.data);
              setTopic(summaryRes.data.topic);
              setPhase('completed');
            } else {
              setFeedback(item);
              setPhase('completed');
            }
          } catch {
            setFeedback(item);
            setPhase('completed');
          }
        } else if (data.next_question) {
          setCurrentQuestion(data.next_question);
          setQuestionIndex((i) => i + 1);
          setAnswer('');
          setFeedback(null);
          if (answerTextareaRef.current) answerTextareaRef.current.focus();
        }
      } else {
        setError(res.message || 'Failed to submit your answer.');
      }
    } catch {
      setError('Network error while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer('');
    if (answerTextareaRef.current) answerTextareaRef.current.focus();
  };

  const restart = () => {
    setPhase('loading');
    startQuiz();
  };

  const progress = Math.min(100, Math.round((questionIndex / totalQuestions) * 100));

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              Individual Verification Quiz
            </h1>
            <p className="text-xs text-white/40">7 code-based questions to verify your Java mastery</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/peer-learning')}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors"
        >
          Back to Peer Learning
        </button>
      </div>

      {phase === 'loading' && (
        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-10 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
          <p className="text-sm text-teal-300 font-semibold">Generating your quiz questions...</p>
          <p className="text-xs text-white/40">The AI is preparing code-based questions targeted at your knowledge gap.</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 flex flex-col items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <p className="text-sm text-red-300 font-semibold">Could not start the quiz</p>
          <p className="text-xs text-white/50 text-center">{error}</p>
          <button
            onClick={startQuiz}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}

      {phase === 'question' && currentQuestion && (
        <div className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Verification Quiz</span>
            <span className="text-xs text-teal-400 font-mono font-semibold">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full mb-5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          {/* Question */}
          <div className="mb-4">
            <p className="text-xs text-teal-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5" />
              Question {questionIndex + 1}
            </p>
            <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap font-mono bg-[#0F172A] rounded-xl border border-white/5 p-3">
              {currentQuestion.question}
            </p>
          </div>

          {/* Hint */}
          {currentQuestion.hint && (
            <details className="mb-4 group">
              <summary className="cursor-pointer text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                Show Hint
              </summary>
              <p className="mt-2 text-xs text-amber-300/80 bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 leading-relaxed">
                {currentQuestion.hint}
              </p>
            </details>
          )}

          {/* Answer editor */}
          <div className="mb-4">
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold mb-1.5">Your Answer (Java code or explanation)</p>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <Editor
                height="180px"
                defaultLanguage="java"
                theme="vs-dark"
                value={answer}
                onChange={(v) => setAnswer(v || '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  tabSize: 2,
                }}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 mb-4">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !answer.trim()}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                Submit Answer
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {phase === 'question' && feedback && (
        <div className={`rounded-2xl border p-5 ${
          feedback.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <p className={`text-sm font-black ${feedback.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {feedback.isCorrect ? 'Correct!' : 'Not quite right'}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-white/70 leading-relaxed">{feedback.explanation}</p>
            {!feedback.isCorrect && (
              <div className="rounded-lg bg-[#0F172A] border border-white/5 p-3">
                <p className="text-[10px] text-amber-400 uppercase tracking-wider font-bold mb-1">Correct Answer</p>
                <p className="text-white/70 font-mono whitespace-pre-wrap">{feedback.correctAnswer}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="mt-4 w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
          >
            Next Question
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {phase === 'completed' && (
        <div className="space-y-3">
          {/* Mastery Score */}
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#1e293b]/80 to-amber-500/[0.03] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-lg font-black text-white">Quiz Complete</h2>
                <p className="text-xs text-white/40">Your verification mastery score for {topic}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-[#0F172A] border border-white/5 p-4 text-center">
                <p className="text-[10px] text-white/40 uppercase mb-1">Correct</p>
                <p className="text-2xl font-black text-emerald-400">{summary?.correct_answers ?? 0}</p>
              </div>
              <div className="rounded-xl bg-[#0F172A] border border-white/5 p-4 text-center">
                <p className="text-[10px] text-white/40 uppercase mb-1">Total</p>
                <p className="text-2xl font-black text-white">{summary?.total_questions ?? totalQuestions}</p>
              </div>
              <div className="rounded-xl bg-[#0F172A] border border-white/5 p-4 text-center">
                <p className="text-[10px] text-white/40 uppercase mb-1">Mastery Score</p>
                <p className="text-2xl font-black text-amber-400">{summary?.score_percentage ?? 0}%</p>
              </div>
            </div>

            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${summary?.score_percentage ?? 0}%` }}
              />
            </div>
          </div>

          {/* Question breakdown / verification details */}
          <div className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-5">
            <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-400" />
              Verification Questions Breakdown
            </h3>
            <p className="text-xs text-white/40 mb-4">The session has auto-closed after all {totalQuestions} questions. Review your answers below.</p>

            <div className="space-y-3">
              {summary?.detailed_history && summary.detailed_history.length > 0 ? (
                summary.detailed_history.map((item, i) => (
                  <div key={item.question_id ?? i} className="rounded-xl bg-[#0F172A] border border-white/5 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.is_correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <p className="text-xs font-bold text-white">
                          Question {i + 1}
                          <span className="ml-2 text-[10px] text-white/30">{item.question_text ? 'Code-based' : ''}</span>
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${item.is_correct ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.is_correct ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    {item.question_text && (
                      <p className="text-xs text-white/60 font-mono whitespace-pre-wrap bg-white/[0.03] rounded-lg p-2 mb-2">
                        {item.question_text}
                      </p>
                    )}

                    <div className="grid md:grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
                        <p className="text-[9px] text-white/30 uppercase mb-0.5">Your Answer</p>
                        <p className="text-white/70 whitespace-pre-wrap font-mono">{item.student_answer || '—'}</p>
                      </div>
                      <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
                        <p className="text-[9px] text-white/30 uppercase mb-0.5">Expected Answer</p>
                        <p className="text-amber-300/80 whitespace-pre-wrap font-mono">{item.expected_answer || '—'}</p>
                      </div>
                    </div>

                    {item.feedback && (
                      <p className="mt-2 text-[11px] text-white/50 leading-relaxed">{item.feedback}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/40 text-center py-4">No detailed results available.</p>
              )}
            </div>
          </div>

          <button
            onClick={restart}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Verification Quiz
          </button>
        </div>
      )}

      {/* Prev/Next nav when feedback is dismissed */}
      {phase === 'question' && (
        <div className="flex items-center justify-between text-[10px] text-white/30">
          <span className="flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Session auto-advances after each answer</span>
        </div>
      )}
    </div>
  );
}

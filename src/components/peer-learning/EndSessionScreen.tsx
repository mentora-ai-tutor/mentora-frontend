'use client';

import { CheckCircle2, ArrowLeft, User, Brain, BookOpen } from 'lucide-react';
import type { CodeEvaluation } from '@/lib/api/peerLearning';
import type { SummaryResponse } from '@/lib/api/peerLearning';
import type { ContentRecommendation } from '@/lib/api/peerLearning';

interface EndSessionScreenProps {
  studentName: string;
  studentId: string;
  peerName: string;
  peerId: string;
  isAiSession: boolean;
  topic: string;
  gapTopic: string;
  evaluation: CodeEvaluation | null;
  summary: SummaryResponse | null;
  recommendations: ContentRecommendation[];
  onReturnHome: () => void;
}

export default function EndSessionScreen({
  studentName,
  studentId,
  peerName,
  peerId,
  isAiSession,
  topic,
  gapTopic,
  evaluation,
  summary,
  recommendations,
  onReturnHome,
}: EndSessionScreenProps) {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6 animate-slide-up">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-2xl font-black text-white">Session Completed</h1>
        <p className="text-sm text-white/50">Here is a summary of your learning session.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Session Details</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
            <p className="text-[10px] text-white/40 uppercase mb-0.5">Learner</p>
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-amber-400" />
              <p className="text-white text-xs font-semibold">{studentName}</p>
            </div>
            <p className="text-[10px] text-white/30 mt-0.5">{studentId}</p>
          </div>
          <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
            <p className="text-[10px] text-white/40 uppercase mb-0.5">{isAiSession ? 'AI Teacher' : 'Peer Teacher'}</p>
            <div className="flex items-center gap-1.5">
              {isAiSession ? <Brain className="w-3 h-3 text-violet-400" /> : <User className="w-3 h-3 text-teal-400" />}
              <p className="text-white text-xs font-semibold">{peerName}</p>
            </div>
            <p className="text-[10px] text-white/30 mt-0.5">{peerId}</p>
          </div>
        </div>

        <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
          <p className="text-[10px] text-white/40 uppercase mb-0.5">Topic</p>
          <p className="text-teal-400 text-sm font-semibold">{topic}</p>
        </div>

        <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
          <p className="text-[10px] text-white/40 uppercase mb-0.5">Original Knowledge Gap</p>
          <p className="text-amber-400 text-sm font-semibold">{gapTopic}</p>
        </div>

        {evaluation && (
          <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
            <p className="text-[10px] text-white/40 uppercase mb-1">Evaluation Result</p>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold ${evaluation.is_valid ? 'text-emerald-400' : 'text-red-400'}`}>
                {evaluation.is_valid ? 'Passed' : 'Needs Improvement'}
              </span>
              <span className="text-[10px] text-white/30">| Complexity: {evaluation.complexity}</span>
            </div>
            <p className="text-xs text-white/60">{evaluation.feedback}</p>
          </div>
        )}

        {summary && (
          <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
            <p className="text-[10px] text-white/40 uppercase mb-1">Learning Outcome</p>
            <p className="text-xs text-white/60 leading-relaxed">{summary.summary}</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
            <p className="text-[10px] text-white/40 uppercase mb-1">Recommended Next Topic</p>
            <div className="space-y-1">
              {recommendations.slice(0, 2).map((rec, i) => (
                <p key={i} className="text-xs text-teal-400/80 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 shrink-0" />
                  {rec.title}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onReturnHome}
        className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/80 font-bold rounded-xl transition-colors border border-white/5 flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Peer Learning Home
      </button>
    </div>
  );
}

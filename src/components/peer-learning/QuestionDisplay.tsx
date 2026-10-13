'use client';

import { useState } from 'react';
import { ClipboardList, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface GradedResult {
  is_correct: boolean;
  correct_answer: string;
  selected_option: string;
  feedback: string;
}

interface QuestionData {
  text: string;
  topic: string;
  subskill: string;
  difficulty: string;
  learner: string;
  peerTeacher: string;
  options: string[];
}

function renderQuestionText(text: string) {
  const segments: { type: 'text' | 'code'; content: string }[] = [];
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).replace(/^(java|javascript|python|c\+\+|c#)?\n/i, '');
      segments.push({ type: 'code', content: code.trim() });
    } else if (part.startsWith('`') && part.endsWith('`')) {
      segments.push({ type: 'code', content: part.slice(1, -1) });
    } else {
      segments.push({ type: 'text', content: part });
    }
  }
  return segments.map((seg, i) => {
    if (seg.type === 'code') {
      const isMultiLine = seg.content.includes('\n');
      if (isMultiLine) {
        return (
          <pre key={i} className="rounded-lg bg-[#0a0f1a] border border-white/5 px-3 py-2.5 my-2 overflow-x-auto">
            <code className="text-teal-300 text-xs font-mono leading-relaxed whitespace-pre">{seg.content}</code>
          </pre>
        );
      }
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono">
          {seg.content}
        </code>
      );
    }
    return <span key={i}>{seg.content}</span>;
  });
}

interface QuestionDisplayProps {
  question: QuestionData | null;
  generating: boolean;
  onStartCollab: () => void;
  started: boolean;
  onAnswerSubmit?: (selectedOption: string) => void;
  evaluating?: boolean;
  gradedResult?: GradedResult | null;
}

export default function QuestionDisplay({ question, generating, onStartCollab, started, onAnswerSubmit, evaluating, gradedResult }: QuestionDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (generating) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
          <div>
            <p className="text-sm font-bold text-amber-400">Generating Question</p>
            <p className="text-xs text-white/50">Generating a question based on your learning gap...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const isAnswered = gradedResult !== null && gradedResult !== undefined;

  const handleSubmit = async () => {
    if (!selectedOption || !onAnswerSubmit) return;
    await onAnswerSubmit(selectedOption);
  };

  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      if (selectedOption === option) {
        return 'border-teal-500/50 bg-teal-500/10 text-teal-400 cursor-pointer';
      }
      return 'border-white/5 bg-[#0F172A] text-white/80 cursor-pointer hover:border-white/20 hover:bg-white/[0.03]';
    }
    if (isAnswered && gradedResult) {
      if (option === gradedResult.correct_answer) {
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
      }
      if (option === gradedResult.selected_option && !gradedResult.is_correct) {
        return 'border-red-500/40 bg-red-500/10 text-red-300';
      }
      return 'border-white/5 bg-[#0F172A] text-white/30';
    }
    return 'border-white/5 bg-[#0F172A] text-white/80';
  };

  const getOptionIcon = (option: string) => {
    if (!isAnswered || !gradedResult) return null;
    if (option === gradedResult.correct_answer) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (option === gradedResult.selected_option && !gradedResult.is_correct) {
      return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1e293b]/55 p-5">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white">Learning Question</h3>
      </div>

      <div className="rounded-xl bg-[#0F172A] border border-white/5 p-4 mb-4">
        <p className="text-white text-sm font-semibold leading-relaxed">{renderQuestionText(question.text)}</p>
      </div>

      {question.options.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            {isAnswered ? 'Your Answer' : 'Select Your Answer'}
          </p>
          {question.options.map((option, index) => (
            <button
              key={`${option}-${index}`}
              onClick={() => {
                if (!isAnswered && !evaluating) {
                  setSelectedOption(option);
                }
              }}
              disabled={isAnswered || evaluating}
              className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-all flex items-center gap-2.5 ${getOptionStyle(option)}`}
            >
              <span className="w-5 h-5 rounded-full border border-current/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{renderQuestionText(option)}</span>
              {getOptionIcon(option)}
            </button>
          ))}
        </div>
      )}

      {isAnswered && gradedResult && (
        <div className={`rounded-xl p-3 mb-4 border ${
          gradedResult.is_correct
            ? 'bg-emerald-500/5 border-emerald-500/20'
            : 'bg-red-500/5 border-red-500/20'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {gradedResult.is_correct ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <p className={`text-sm font-bold ${gradedResult.is_correct ? 'text-emerald-400' : 'text-red-400'}`}>
              {gradedResult.is_correct ? 'Correct!' : 'Incorrect'}
            </p>
          </div>
          <p className="text-xs text-white/60">{gradedResult.feedback}</p>
          {!gradedResult.is_correct && gradedResult.correct_answer && (
            <p className="text-xs text-emerald-300/70 mt-1">
              Correct answer: {renderQuestionText(gradedResult.correct_answer)}
            </p>
          )}
        </div>
      )}

      {!isAnswered && selectedOption && onAnswerSubmit && (
        <button
          onClick={handleSubmit}
          disabled={evaluating}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(13,148,136,0.3)] flex items-center justify-center gap-2"
        >
          {evaluating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Evaluating...
            </>
          ) : (
            'Submit Answer'
          )}
        </button>
      )}

      {!isAnswered && !selectedOption && (
        <button
          disabled
          className="w-full py-3 bg-white/5 text-white/30 font-bold rounded-xl border border-white/5 cursor-not-allowed"
        >
          Select an answer to continue
        </button>
      )}

      {isAnswered && !started && (
        <button
          onClick={onStartCollab}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(13,148,136,0.3)]"
        >
          Start Collaborative Work
        </button>
      )}
    </div>
  );
}

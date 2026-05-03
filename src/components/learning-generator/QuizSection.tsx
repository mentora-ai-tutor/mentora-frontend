"use client";

import { useState } from "react";
import { Target, Award, Check, Loader2, XCircle, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { LearningMaterial } from "@/lib/api/learningGenerator";

interface QuizSectionProps {
  material: LearningMaterial;
  quizScore: number | null;
  answers: { [key: number]: string };
  onAnswerChange: (questionNumber: number, letter: string) => void;
  onSubmit: () => void;
  savingProgress: boolean;
}

export default function QuizSection({
  material,
  quizScore,
  answers,
  onAnswerChange,
  onSubmit,
  savingProgress,
}: QuizSectionProps) {
  const sm = material.structured_material;
  const assessment = sm.assessment;

  if (quizScore === null) {
    return (
      <div className="max-w-3xl w-full my-auto pb-10">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 items-center justify-center mb-4">
            <Target className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-3xl font-black text-white">Knowledge Check</h2>
          <p className="text-white/50 mt-2">Pass this quick assessment to achieve mastery in {sm.topic}.</p>
        </div>

        <div className="space-y-6">
          {assessment.quiz.filter(Boolean).map((q, qIndex) => (
            <div key={qIndex} className="p-6 bg-[#334155]/20 border border-white/10 rounded-2xl">
              <p className="text-sm font-bold text-teal-400 mb-2">Question {q.question_number} ({typeof q.type === 'string' ? q.type.replace('_', ' ') : q.type})</p>
              <h3 className="text-lg font-medium text-white mb-4 whitespace-pre-wrap">{q.question}</h3>
              {q.code_snippet && (
                <pre className="p-3 bg-[#0F172A] rounded-xl text-teal-200 text-sm font-mono mb-4 border border-white/5">
                  {q.code_snippet}
                </pre>
              )}
              <div className="space-y-3">
                {q.options.map((opt: string, i: number) => {
                  const letter = opt.substring(0, 1);
                  const isSelected = answers[q.question_number] === letter;
                  return (
                    <div
                      key={i}
                      onClick={() => onAnswerChange(q.question_number, letter)}
                      className={`p-4 border rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
                        isSelected ? 'border-teal-500 bg-teal-500/10' : 'border-white/5 bg-[#0F172A] hover:border-teal-500/50 hover:bg-teal-500/5'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${isSelected ? 'border-teal-400 bg-teal-400' : 'border-white/20'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-[#0F172A] rounded-full" />}
                      </div>
                      <span className="text-sm text-white/80">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={Object.keys(answers).length < assessment.quiz.length || savingProgress}
            className="px-6 py-3 bg-teal-600 disabled:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:bg-teal-500 transition-all flex items-center gap-2"
          >
            {savingProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Submit Answers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full text-center space-y-6 animate-slide-up">
      <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#B45309]/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute inset-2 border-2 border-[#B45309]/50 rounded-full animate-spin-slow" />
        <Award className="w-16 h-16 text-[#B45309] relative z-10" />
      </div>
      <div>
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-[#B45309]">{quizScore >= 80 ? "Mastery Achieved!" : "Good Try!"}</h2>
        <p className="text-white/60 mt-3">You scored <span className="text-white font-bold">{quizScore}%</span> on the {sm.topic} module.</p>
      </div>

      <div className="p-4 bg-linear-to-br from-[#B45309]/10 to-transparent border border-[#B45309]/20 rounded-xl inline-block mx-auto text-left">
        <p className="text-xs text-[#B45309] font-bold uppercase tracking-wider mb-1">Rewards Gained</p>
        <p className="text-sm text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> +{quizScore} Mastery Points</p>
        {quizScore >= 80 && <p className="text-sm text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Badge: {sm.topic} Initiate</p>}
      </div>

      <div className="pt-4">
        <Link href="/learning-generator" className="px-8 py-3 bg-white text-[#0F172A] font-black rounded-xl hover:bg-teal-50 transition-colors w-full flex items-center justify-center gap-2">
          Return to Hub
        </Link>
      </div>
    </div>
  );
}

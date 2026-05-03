"use client";

import { useState } from "react";
import { Brain, Sparkles, Lightbulb, Code2, Check, CheckCircle2, ShieldAlert, XCircle, ChevronRight, Loader2 } from "lucide-react";
import type { LearningMaterial } from "@/lib/api/learningGenerator";
import InsightPanel from "./InsightPanel";

interface ContentRendererProps {
  material: LearningMaterial;
  currentStepId: string | undefined;
  lesson: any;
  assessment: any;
  code: string;
  showCodeEditor: boolean;
  copiedCode: boolean;
  onCopyCode: () => void;
  onOpenEditor: () => void;
  onExplainSimpler: () => void;
  onRealLifeAnalogy: () => void;
  insightType: "simpler" | "analogy" | null;
  insightActiveTab: "simpler" | "analogy" | null;
  aiInsight: string | null;
  onCloseInsight: () => void;
}

export default function ContentRenderer({
  material,
  currentStepId,
  lesson,
  assessment,
  code,
  showCodeEditor,
  copiedCode,
  onCopyCode,
  onOpenEditor,
  onExplainSimpler,
  onRealLifeAnalogy,
  insightType,
  insightActiveTab,
  aiInsight,
  onCloseInsight,
  title,
}: ContentRendererProps & { title?: string }) {
  const sm = material.structured_material;

  return (
    <div className={`${showCodeEditor ? 'flex-1' : 'flex-[2.5]'} p-6 lg:p-10 overflow-y-auto border-b lg:border-b-0 ${showCodeEditor ? 'lg:border-r' : ''} border-white/5 custom-scrollbar`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            {currentStepId === "debug" ? <ShieldAlert className="w-5 h-5 text-red-400" /> : <Brain className="w-5 h-5 text-teal-400" />}
          </div>
          <h1 className="text-2xl font-black text-white">{title || (currentStepId ? getStepTitle(currentStepId, sm) : '')}</h1>
        </div>

        <div className="prose prose-invert prose-teal max-w-none">
          {currentStepId === "intro" && lesson.introduction && (
            <>
              <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                {lesson.introduction.what_is_it}
              </p>
              <h3 className="text-teal-400 font-bold mt-8 mb-2">Why learn this?</h3>
              <p className="text-white/70 leading-relaxed text-sm">
                {lesson.introduction.why_learn_it}
              </p>
              {lesson.introduction.prerequisite_note && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl my-6">
                  <p className="text-amber-200/80 font-medium text-sm m-0">
                    <strong>Prerequisites:</strong> {lesson.introduction.prerequisite_note}
                  </p>
                </div>
              )}
            </>
          )}

          {currentStepId === "concepts" && lesson.concept_explained && (
            <>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                <strong>Core Definition:</strong> {lesson.concept_explained.core_definition}
              </p>
              {lesson.concept_explained.analogy && (
                <div className="p-4 bg-[#334155]/30 border border-white/10 rounded-xl my-6 text-sm text-white/70">
                  <strong>Analogy:</strong> {lesson.concept_explained.analogy}
                </div>
              )}
              {sm.syntax_reference && (
                <>
                  <h3 className="text-teal-400 font-bold mt-8 mb-4">Syntax Reference</h3>
                  <pre className="p-4 bg-[#0F172A] border border-white/5 rounded-xl text-teal-200 font-mono text-sm">
                    {sm.syntax_reference.basic_syntax}
                  </pre>
                  {sm.syntax_reference.syntax_breakdown && sm.syntax_reference.syntax_breakdown.length > 0 && (
                    <ul className="space-y-3 mt-4 text-white/70 text-sm list-decimal pl-5">
                      {sm.syntax_reference.syntax_breakdown.map((rule: any, i: number) => (
                        <li key={i}>{typeof rule === 'string' ? rule.replace(/^\d+\.\s*/, '') : String(rule)}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          )}

          {currentStepId === "guide" && lesson.step_by_step_guide && (
            <>
              <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                {lesson.step_by_step_guide.overview}
              </p>
              <div className="space-y-4 mt-6">
                {lesson.step_by_step_guide.steps.map((step: any, idx: number) => (
                  <div key={idx} className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl hover:border-teal-500/30 transition-colors">
                    <h4 className="text-teal-400 font-bold mb-2">Step {step.step_number}: {step.title}</h4>
                    <p className="text-white/70 text-sm mb-4 leading-relaxed">{step.instruction}</p>
                    {step.java_tip && (
                      <div className="px-3 py-2 bg-amber-500/10 text-amber-200/70 border border-amber-500/20 text-xs font-mono rounded inline-block">
                        💡 Tip: {step.java_tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStepId === "example" && lesson.examples?.example_1 && (
            <>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                {lesson.examples.example_1.description}
              </p>
              <p className="text-white/60 text-sm leading-relaxed border-l-2 border-teal-500 pl-4 py-1 mb-8">
                {lesson.examples.example_1.explanation}
              </p>
              <div className="mb-4 relative group">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-bold">Reference Code</p>
                <button
                   onClick={onCopyCode}
                   className="absolute top-8 right-3 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                   title="Copy Code"
                 >
                   {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Code2 className="w-3.5 h-3.5 text-white/50" />}
                 </button>
                 <pre className="p-4 bg-[#0F172A] border border-white/10 rounded-xl font-mono text-sm text-teal-200/90 whitespace-pre-wrap wrap-break-word leading-relaxed overflow-x-auto">
                   {lesson.examples?.example_1.code}
                 </pre>
              </div>
              <p className="text-xs text-white/40 italic">Use the code editor on the right to type, run, or modify this example.</p>
            </>
          )}

          {currentStepId === "mistakes" && lesson.common_mistakes && lesson.common_mistakes.length > 0 && (
            <>
              <h3 className="text-xl font-bold text-white mb-6">Common Pitfalls</h3>
              <div className="space-y-6">
                {lesson.common_mistakes.map((mistake: any, idx: number) => (
                  <div key={idx} className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
                    <h4 className="text-red-400 font-bold mb-2">{mistake.title}</h4>
                    <p className="text-white/70 text-sm mb-5 leading-relaxed">{mistake.description}</p>

                    <div className="flex flex-col gap-3 mb-3">
                      <div className="p-4 bg-red-950/40 rounded-xl border border-red-500/20 font-mono text-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-[10px] uppercase text-red-500 font-black tracking-widest">Bad Pattern</span>
                        </div>
                        <code className="text-red-200/80 whitespace-pre-wrap wrap-break-word leading-relaxed block">{mistake.bad_code}</code>
                      </div>
                      <div className="p-4 bg-teal-900/40 rounded-xl border border-teal-500/20 font-mono text-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          <span className="text-[10px] uppercase text-teal-400 font-black tracking-widest">Correct Pattern</span>
                        </div>
                        <code className="text-teal-100/90 whitespace-pre-wrap wrap-break-word leading-relaxed block">{mistake.good_code}</code>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs mt-3 italic">{mistake.explanation}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStepId === "practice" && assessment.practice_challenge && (
            <>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                {assessment.practice_challenge.problem_statement.split("\n")[0]}
              </p>
              <h3 className="text-teal-400 font-bold mt-6 mb-2">Requirements</h3>
              {assessment.practice_challenge.requirements && (
                <ul className="space-y-2 text-white/70 text-sm list-disc pl-5 mb-6">
                  {assessment.practice_challenge.requirements.map((req: string, i: number) => <li key={i}>{req}</li>)}
                </ul>
              )}
              <div className="p-3 bg-[#0F172A] rounded-xl text-white/50 text-xs font-mono border border-white/5">
                {assessment.practice_challenge.example_input} <br />
                {assessment.practice_challenge.expected_output}
              </div>
            </>
          )}

          {currentStepId === "debug" && lesson.debugging_exercise && (
            <>
              <p className="text-white/80 text-lg leading-relaxed">
                {lesson.debugging_exercise.scenario}
              </p>
              <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-xl my-6">
                <p className="text-red-200 font-medium m-0 text-sm">
                  <strong>Runtime Error:</strong> {lesson.debugging_exercise.error_output}
                </p>
              </div>
              <p className="text-white/70 text-sm">
                Use the interactive environment to step through the logic. Can you spot the bug?
              </p>
            </>
          )}
        </div>

        {/* AI Actions */}
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            onClick={onExplainSimpler}
            disabled={insightType !== null}
            className={`px-4 py-2 border text-sm font-bold rounded-xl flex items-center gap-2 transition-all disabled:cursor-wait ${
              insightActiveTab === "simpler"
                ? "bg-teal-600/30 border-teal-400 text-teal-200 shadow-[0_0_15px_rgba(13,148,136,0.2)]"
                : "bg-linear-to-r from-teal-600/20 to-teal-800/20 border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
            }`}
          >
            {insightType === "simpler" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Explain Simpler
          </button>
          <button
            onClick={onRealLifeAnalogy}
            disabled={insightType !== null}
            className={`px-4 py-2 border text-sm font-bold rounded-xl flex items-center gap-2 transition-all disabled:cursor-wait ${
              insightActiveTab === "analogy"
                ? "bg-amber-600/30 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(180,83,9,0.2)]"
                : "bg-[#334155]/30 border-white/10 text-white/70 hover:bg-[#334155]/50"
            }`}
          >
            {insightType === "analogy" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />} Give a Real-life Analogy
          </button>
          {!showCodeEditor && (currentStepId === "example" || currentStepId === "practice" || currentStepId === "debug") && (
            <button
              onClick={onOpenEditor}
              className="px-4 py-2 bg-teal-600/20 border border-teal-500/30 hover:bg-teal-600/30 text-teal-300 text-sm font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <Code2 className="w-4 h-4" /> Open Code Editor
            </button>
          )}
        </div>

        {/* AI Insight Panel */}
        <InsightPanel
          aiInsight={aiInsight}
          insightType={insightType}
          insightActiveTab={insightActiveTab}
          onClose={onCloseInsight}
        />
      </div>
    </div>
  );
}

function getStepTitle(stepId: string, sm: any): string {
  const titles: Record<string, string> = {
    intro: "Introduction",
    concepts: "Concepts & Syntax",
    guide: "Step-by-Step Guide",
    example: "Code Examples",
    mistakes: "Common Mistakes",
    practice: "Practice Challenge",
    debug: "Debugging",
  };
  return titles[stepId] || "";
}

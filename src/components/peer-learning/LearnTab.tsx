'use client';

import { useState } from 'react';
import { Lightbulb, Loader2, AlertTriangle, ExternalLink, BookOpen, CheckCircle2, Code2, Target, ListOrdered } from 'lucide-react';
import { peerLearningApi, type ContentRecommendation, type SingleContentRecommendation, type ContentMcqQuestion } from '@/lib/api/peerLearning';

interface LearnTabProps {
  gapTopic: string;
}

export default function LearnTab({ gapTopic }: LearnTabProps) {
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState<SingleContentRecommendation | null>(null);
  const [listRecs, setListRecs] = useState<ContentRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async () => {
    setLoading(true);
    setError(null);
    setRec(null);
    setListRecs([]);

    try {
      const res = await peerLearningApi.recommendContent({
        topic: gapTopic,
        weak_subskill: gapTopic ? undefined : 'General Concepts',
      });
      const payload = res.data as SingleContentRecommendation | undefined;

      if (res.success && payload && payload.status) {
        // Single rich recommendation (tutorial_title etc.)
        if (payload.tutorial_title || payload.concept_summary || payload.mcq_questions) {
          setRec(payload);
        } else if (payload.recommendations) {
          // Legacy/list shape
          setListRecs(payload.recommendations);
        } else {
          // Unknown but successful -> treat whole object as a single rec
          setRec(payload);
        }
      } else if (res.success) {
        setError('Unexpected response from the recommendation service.');
      } else {
        setError(res.message || 'Failed to get recommendations.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/5">
        <button
          onClick={handleRecommend}
          disabled={loading}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Getting Recommendations...
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4" />
              Get Learning Recommendations
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 min-h-0">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {/* Legacy/list shape */}
        {listRecs.length > 0 && (
          <div className="space-y-3">
            {rec?.target_subskill && (
              <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
                <p className="text-[10px] text-white/40 uppercase mb-0.5">Target Subskill</p>
                <p className="text-amber-400 text-sm font-semibold">{rec.target_subskill}</p>
              </div>
            )}
            {rec?.topic && (
              <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
                <p className="text-[10px] text-white/40 uppercase mb-0.5">Topic</p>
                <p className="text-teal-400 text-sm font-semibold">{rec.topic}</p>
              </div>
            )}
            {listRecs.map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-[#1e293b]/40 p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md hover:bg-white/5 text-teal-400 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-white/40">
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-semibold">{item.type}</span>
                  <span>{item.estimated_minutes} min</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Single rich recommendation */}
        {rec && (rec.tutorial_title || rec.concept_summary) && (
          <div className="space-y-3">
            <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
              <p className="text-[10px] text-white/40 uppercase mb-0.5">Topic</p>
              <p className="text-teal-400 text-sm font-semibold">{rec.topic || gapTopic}</p>
            </div>
            <div className="rounded-xl bg-[#0F172A] border border-white/5 p-3">
              <p className="text-[10px] text-white/40 uppercase mb-0.5">Weak Subskill</p>
              <p className="text-amber-400 text-sm font-semibold">{rec.weak_subskill || rec.target_subskill || 'General Concepts'}</p>
            </div>

            {rec.tutorial_title && (
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <p className="text-sm font-black text-white">{rec.tutorial_title}</p>
                </div>
                {rec.concept_summary && (
                  <div className="space-y-2 mt-1">
                    {(() => {
                      const summary = rec.concept_summary;
                      const parts = summary.split(/\s+(?=(?:Core Concept|Real-World Analogy|Execution Flow|Key Points)\s*:)/i);
                      return parts.map((part, i) => {
                        const m = part.match(/^((?:Core Concept|Real-World Analogy|Execution Flow|Key Points)\s*:)([\s\S]*)$/);
                        if (m) {
                          return (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <p className="text-xs text-white/60 leading-relaxed">
                                <span className="font-bold text-teal-300">{m[1]}</span>
                                {m[2]}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <p className="text-xs text-white/60 leading-relaxed">{part}</p>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            )}

            {rec.key_takeaways && rec.key_takeaways.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-[#1e293b]/40 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Key Takeaways</p>
                </div>
                <ul className="space-y-1.5">
                  {rec.key_takeaways.map((k, i) => (
                    <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rec.practice_code_snippet && (
              <div className="rounded-xl border border-white/10 bg-[#0F172A] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-teal-400" />
                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Practice Code</p>
                </div>
                <pre className="text-[11px] text-white/70 leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">{rec.practice_code_snippet}</pre>
              </div>
            )}

            {rec.suggested_exercise && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Target className="w-4 h-4 text-amber-400" />
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Suggested Exercise</p>
                </div>
                <p className="text-xs text-amber-200/80 leading-relaxed">{rec.suggested_exercise}</p>
              </div>
            )}

            {rec.mcq_questions && rec.mcq_questions.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-[#1e293b]/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ListOrdered className="w-4 h-4 text-teal-400" />
                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Check Your Understanding</p>
                </div>
                <div className="space-y-4">
                  {rec.mcq_questions.map((q: ContentMcqQuestion) => (
                    <div key={q.question_id} className="rounded-lg bg-[#0F172A] border border-white/5 p-3">
                      <p className="text-xs font-semibold text-white mb-2">{q.question_id}. {q.question}</p>
                      <div className="space-y-1 mb-2">
                        {q.options.map((opt) => (
                          <div key={opt.option_id} className="flex items-center gap-2 text-[11px] text-white/60">
                            <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold text-[10px]">{opt.option_id}</span>
                            {opt.option_text}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-white/40">
                        <span className="text-amber-400 font-bold">Answer: {q.correct_answer}</span> — {q.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!rec && listRecs.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Lightbulb className="w-8 h-8 text-white/10 mb-2" />
            <p className="text-xs text-white/30">Get personalized learning content based on your remaining weaknesses</p>
          </div>
        )}
      </div>
    </div>
  );
}

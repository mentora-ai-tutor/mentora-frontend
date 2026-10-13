"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Code,
  Star,
  Terminal,
  Zap,
  Target,
  BookOpen,
  AlertCircle,
  BrainCircuit,
  Save,
  Layers,
  RefreshCw,
  Loader2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { assessmentApi } from "@/lib/api/assessment";

export default function LaunchScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const res = await assessmentApi.getSessions();
        const sessions = Array.isArray(res?.data) ? res.data : [];
        const latest = sessions.find(
          (s: any) => s && s.mastery_profile && Array.isArray(s.mastery_profile.knowledge_gaps) && s.mastery_profile.knowledge_gaps.length > 0
        );
        if (!latest) {
          if (mounted) setNoProfile(true);
          return;
        }
        const mp = latest.mastery_profile;
        const hasObserved = (key: string) =>
          mp.knowledge_gaps.some((gap: any) => Array.isArray(gap?.observed_error_patterns?.[key]) && gap.observed_error_patterns[key].length > 0);
        if (mounted) {
          setProfile({
            learner_id: latest.learner_id,
            data_sources: {
              github: hasObserved('github') ? 'available' : null,
              sandbox: hasObserved('sandbox') ? 'available' : null,
              quizzes: hasObserved('quizzes') ? 'available' : null,
            },
            mastery_profile: mp,
            recommendations: {
              priority_order: mp.knowledge_gaps.map((gap: any) => gap.topic),
              general_advice:
                mp.overall_mastery_score >= 70
                  ? "You're in a strong position — sharpen the identified gaps to reach full mastery."
                  : (mp.overall_mastery_score ?? 0) >= 45
                    ? "You have a partial grasp — close the prioritized gaps below to build a solid foundation."
                    : "Foundational gaps detected — the assessment will scaffold concepts step by step.",
            },
          });
        }
      } catch (error) {
        console.error('Failed to load knowledge profile:', error);
        if (mounted) setNoProfile(true);
      } finally {
        if (mounted) setIsProfileLoading(false);
      }
    };
    loadProfile();
    return () => { mounted = false; };
  }, []);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => ({...prev, [index]: !prev[index]}));
  };

  const getGap = (topicName: string) =>
    profile.mastery_profile.knowledge_gaps.find((g: any) => g.topic === topicName);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const knowledge_gaps = profile.mastery_profile.knowledge_gaps.map((gap: any) => ({
        topic: gap.topic,
        topic_id: gap.topic_id,
        gap_type: gap.gap_type,
        confidence: gap.confidence,
        evidence_summary: gap.evidence_summary,
        misconceptions: gap.misconceptions,
        prerequisite_topics: gap.prerequisite_topics,
        related_topics: gap.related_topics,
        observed_error_patterns: gap.observed_error_patterns,
        suggested_intervention: gap.suggested_intervention,
      }));

      const strengths = profile.mastery_profile.strengths.map((s: any) => ({
        topic: s.topic,
        topic_id: s.topic_id,
        mastery_level: s.mastery_level,
        confidence: s.confidence,
        evidence_summary: s.evidence_summary,
        can_teach_others: s.can_teach_others,
      }));

      const response = await assessmentApi.startSession({
        mastery_profile: {
          overall_mastery_score: profile.mastery_profile.overall_mastery_score,
          knowledge_gaps,
          strengths,
        },
      });

      const sessionData = response.data || response;
      if (response.success && sessionData) {
        const sessionId = sessionData.session_id || sessionData.sessionId;
        if (sessionId) {
          localStorage.setItem('assessment_session', JSON.stringify(sessionData));
          router.push(`/assessment/session?sessionId=${sessionId}`);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    }
    router.push("/assessment/session");
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-teal-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-teal-500 rounded-full animate-spin" />
        </div>
        <p className="text-white/70 font-semibold text-sm tracking-wide">Preparing your assessment profile...</p>
        <p className="text-white/30 text-xs mt-1">Analyzing knowledge gaps</p>
      </div>
    );
  }

  if (!profile || noProfile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
          <BrainCircuit className="w-12 h-12 text-teal-400" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">No Knowledge Profile Found Yet</h1>
        <p className="text-white/50 max-w-lg mb-3 text-lg leading-relaxed">
          Your personalized assessment profile hasn&apos;t been generated for this learner yet.
        </p>
        <p className="text-white/30 text-sm max-w-md leading-relaxed">
          Submit a knowledge analysis profile to the{" "}
          <code className="text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded-md">/api/ame/start-session</code> endpoint with
          this learner&apos;s token — the mastery profile and knowledge gaps will appear here.
        </p>
      </div>
    );
  }

  const totalTime = profile.mastery_profile.knowledge_gaps.reduce((acc: number, gap: any) => acc + (gap.suggested_intervention?.estimated_time_minutes || 0), 0);
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const prerequisites = Array.from(new Set(profile.mastery_profile.knowledge_gaps.flatMap((gap: any) => gap.prerequisite_topics || []))) as string[];

  const getMasteryColor = (score: number) => {
    if (score >= 70) return { text: "text-emerald-400", stroke: "text-emerald-400", bg: "bg-emerald-500", glow: "shadow-emerald-500/20" };
    if (score >= 40) return { text: "text-amber-400", stroke: "text-amber-400", bg: "bg-amber-500", glow: "shadow-amber-500/20" };
    return { text: "text-red-400", stroke: "text-red-400", bg: "bg-red-500", glow: "shadow-red-500/20" };
  };

  const masteryColor = getMasteryColor(profile.mastery_profile.overall_mastery_score);

  return (
    <div className={`space-y-10 transition-all duration-700 ${isStarting ? 'opacity-40 pointer-events-none scale-[0.99]' : 'opacity-100'}`}>

      {/* ═══════════════════════════════════════════════════
          HERO SECTION — Clean, premium feel
      ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-gradient-to-br from-[#0f172a] via-[#131d2e] to-[#0c1320]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        {/* Glow accent */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/[0.06] rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/[0.04] rounded-full blur-[100px]" />

        <div className="relative z-10 p-7 lg:p-9 flex flex-col lg:flex-row lg:items-center gap-8">
          {/* Left: Text content */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/[0.08] border border-teal-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
              </span>
              <span className="text-teal-400 text-[11px] font-bold tracking-widest uppercase">System Ready</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white leading-[1.15] tracking-tight">
              Your Personalized<br />
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Java Assessment</span>{' '}
              is Ready.
            </h1>
            <p className="text-white/45 text-sm lg:text-base max-w-xl leading-relaxed">
              Based on your recent learning activity, this assessment has been tailored specifically to the areas where you need the most support.
            </p>
          </div>

          {/* Right: Mastery ring + data sources */}
          <div className="flex flex-col items-center gap-5 shrink-0">
            <div className="relative group">
              <div className={`absolute inset-0 rounded-full ${masteryColor.glow} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/[0.06]" />
                  <circle
                    cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={masteryColor.stroke}
                    strokeDasharray={`${profile.mastery_profile.overall_mastery_score}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${masteryColor.text} leading-none`}>
                    {profile.mastery_profile.overall_mastery_score}
                  </span>
                  <span className="text-[9px] text-white/30 font-medium uppercase tracking-wider mt-1">Mastery</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Data Sources Connected</p>
              <div className="flex gap-2.5">
                {[
                  { key: 'github', icon: Code, label: 'GitHub' },
                  { key: 'sandbox', icon: Terminal, label: 'Sandbox' },
                  { key: 'quizzes', icon: FileText, label: 'Quizzes' },
                ].map(({ key, icon: Icon, label }) => (
                  <div
                    key={key}
                    className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 ${
                      profile.data_sources[key] === "available"
                        ? 'bg-teal-500/[0.06] border-teal-500/20 text-teal-400'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/20'
                    }`}
                    title={label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MAIN CONTENT GRID
      ═══════════════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* ─── LEFT: Primary Content ─── */}
        <div className="lg:col-span-2 space-y-10">

          {/* Section A: Assessment Summary Card */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 lg:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-teal-500/[0.08] border border-teal-500/15">
                <Target className="w-4 h-4 text-teal-400" />
              </div>
              <h2 className="text-lg font-bold text-white">What This Assessment Covers</h2>
            </div>

            {/* Topics list — compact single row */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Topics to Cover</h3>
              <div className="flex flex-wrap gap-2">
                {profile.recommendations.priority_order.map((topicName: string, i: number) => {
                  const gap = getGap(topicName);
                  const isFundamental = gap?.gap_type === 'FUNDAMENTAL_GAP';
                  return (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors duration-200 ${
                        isFundamental
                          ? 'bg-red-500/[0.05] border-red-500/15 text-red-300/90'
                          : 'bg-teal-500/[0.05] border-teal-500/15 text-teal-300/90'
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${isFundamental ? 'bg-red-400' : 'bg-teal-400'}`} />
                      {topicName}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-lg border-l-2 border-teal-500 bg-teal-500/[0.04] px-4 py-3">
              <p className="text-white/65 italic text-sm leading-relaxed">
                &ldquo;{profile.recommendations.general_advice}&rdquo;
              </p>
            </div>
          </section>

          {/* Section B: Topics to be Assessed */}
          <section>
            <div className="mb-7">
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Topics You Will Be Assessed On</h2>
              <p className="text-white/40 text-sm leading-relaxed">Identified through your coding activity, quiz results, and submission analysis.</p>
            </div>

            <div className="space-y-5">
              {profile.recommendations.priority_order.map((topicName: string, index: number) => {
                const gap = getGap(topicName);
                if (!gap) return null;
                const isFundamental = gap.gap_type === 'FUNDAMENTAL_GAP';
                const confidencePct = Math.round(gap.confidence * 100);
                const isExpanded = expandedCards[index];

                return (
                  <div
                    key={index}
                    className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? 'border-white/10 bg-[#141e2e] shadow-xl shadow-black/10'
                        : 'border-white/[0.06] bg-[#121a28] hover:border-white/10 hover:bg-[#141e2e] hover:shadow-lg hover:shadow-black/10'
                    }`}
                  >
                    {/* Top accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] ${isFundamental ? 'bg-gradient-to-r from-red-500/80 to-red-500/30' : 'bg-gradient-to-r from-amber-500/80 to-amber-500/30'}`} />

                    <div className="p-6 lg:p-7">
                      {/* Topic Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-start gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0 border ${
                            isFundamental
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1.5">{topicName}</h3>
                            <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${
                              isFundamental
                                ? 'bg-red-500/8 border-red-500/20 text-red-400'
                                : 'bg-amber-500/8 border-amber-500/20 text-amber-400'
                            }`}>
                              {isFundamental ? (
                                <><AlertCircle className="w-3 h-3" /> Fundamental Gap</>
                              ) : (
                                <><Zap className="w-3 h-3" /> Partial Gap</>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Evidence */}
                      <p className="text-white/55 text-sm leading-relaxed mb-5">
                        {gap.evidence_summary}
                      </p>

                      {/* Confidence — badge/score presentation, no bar */}
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                            gap.confidence > 0.85
                              ? 'bg-teal-500/10 border-teal-500/25'
                              : gap.confidence >= 0.60
                                ? 'bg-amber-500/10 border-amber-500/25'
                                : 'bg-red-500/10 border-red-500/25'
                          }`}>
                            <Target className={`w-4 h-4 ${
                              gap.confidence > 0.85 ? 'text-teal-400' : gap.confidence >= 0.60 ? 'text-amber-400' : 'text-red-400'
                            }`} />
                          </div>
                          <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Analysis Confidence</span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                          gap.confidence > 0.85
                            ? 'bg-teal-500/10 border-teal-500/25'
                            : gap.confidence >= 0.60
                              ? 'bg-amber-500/10 border-amber-500/25'
                              : 'bg-red-500/10 border-red-500/25'
                        }`}>
                          <span className={`text-xs font-black uppercase tracking-wider ${
                            gap.confidence > 0.85 ? 'text-teal-400' : gap.confidence >= 0.60 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {gap.confidence > 0.85 ? 'High' : gap.confidence >= 0.60 ? 'Medium' : 'Low'}
                          </span>
                          <span className="text-white/15">/</span>
                          <span className={`text-base font-black tabular-nums leading-none ${
                            gap.confidence > 0.85 ? 'text-teal-400' : gap.confidence >= 0.60 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {confidencePct}<span className="text-[10px] font-bold opacity-60">%</span>
                          </span>
                        </div>
                      </div>

                      {/* Misconceptions */}
                      {gap.misconceptions.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-3">Identified Misconceptions</h4>
                          <div className="flex flex-wrap gap-2">
                            {gap.misconceptions.map((misc: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-amber-500/[0.06] border border-amber-500/15 text-amber-300/90 rounded-lg text-xs font-medium">
                                {misc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Learning Objectives */}
                      <div className="mb-6">
                        <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-3">Learning Objectives</h4>
                        <ul className="space-y-2">
                          {gap.suggested_intervention.learning_objectives.map((obj: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                              <p className="text-sm text-white/70 leading-relaxed">{obj}</p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expandable Details */}
                      <div className="pt-4 border-t border-white/[0.06]">
                        <button
                          onClick={() => toggleCard(index)}
                          className="flex items-center gap-2 text-xs font-bold text-white/30 hover:text-teal-400 transition-colors duration-200 group/btn"
                        >
                          <span>{isExpanded ? 'Hide' : 'Show'} detailed evidence</span>
                          {isExpanded
                            ? <ChevronUp className="w-3.5 h-3.5 transition-transform" />
                            : <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                          }
                        </button>

                        {isExpanded && (
                          <div className="mt-4 p-5 bg-[#0c1219] rounded-xl border border-white/[0.04] text-sm space-y-5">
                            {gap.observed_error_patterns.sandbox?.length > 0 && (
                              <div>
                                <p className="font-semibold text-white/70 mb-2 flex items-center gap-2">
                                  <Terminal className="w-3.5 h-3.5 text-teal-400" /> Sandbox Observations
                                </p>
                                <ul className="space-y-1.5 pl-5">
                                  {gap.observed_error_patterns.sandbox.map((err: string, i: number) => (
                                    <li key={i} className="text-white/40 text-xs list-disc">{err}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {gap.observed_error_patterns.quizzes?.length > 0 && (
                              <div>
                                <p className="font-semibold text-white/70 mb-2 flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-blue-400" /> Quiz Observations
                                </p>
                                <ul className="space-y-1.5 pl-5">
                                  {gap.observed_error_patterns.quizzes.map((err: string, i: number) => (
                                    <li key={i} className="text-white/40 text-xs list-disc">{err}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {gap.observed_error_patterns.github?.length > 0 && profile.data_sources.github === "available" && (
                              <div>
                                <p className="font-semibold text-white/70 mb-2 flex items-center gap-2">
                                  <Code className="w-3.5 h-3.5 text-purple-400" /> GitHub Observations
                                </p>
                                <ul className="space-y-1.5 pl-5">
                                  {gap.observed_error_patterns.github.map((err: string, i: number) => (
                                    <li key={i} className="text-white/40 text-xs list-disc">{err}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom metadata strip */}
                    <div className="bg-white/[0.015] border-t border-white/[0.04] px-6 lg:px-7 py-3 flex flex-wrap gap-x-6 gap-y-2">
                      {[
                        { icon: Layers, text: `L${isFundamental ? '1 (Remembering)' : '3 (Applying)'}` },
                        { icon: BrainCircuit, text: gap.suggested_intervention.primary },
                        { icon: Clock, text: `${gap.suggested_intervention.estimated_time_minutes} min` },
                      ].map(({ icon: Icon, text }, i) => (
                        <span key={i} className="flex items-center gap-2 text-[11px] font-semibold text-white/25 uppercase tracking-wider">
                          <Icon className="w-3.5 h-3.5" /> {text}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section C: Strengths */}
          {profile.mastery_profile.strengths.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/15">
                  <Star className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Your Strengths</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {profile.mastery_profile.strengths.map((strength: any, i: number) => {
                  const confidencePct = Math.round((strength.confidence || 0) * 100);
                  return (
                    <div
                      key={i}
                      className="relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent p-5 pt-6 overflow-hidden group"
                    >
                      {/* Soft top glow */}
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/[0.06] rounded-full blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                              <Star className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-sm leading-tight">{strength.topic || strength.topic_name}</h4>
                              <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider mt-0.5 inline-block">
                                {strength.mastery_level}
                              </span>
                            </div>
                          </div>
                          {strength.can_teach_others && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-wider shrink-0">
                              <Star className="w-3 h-3 fill-amber-400" /> Mentor
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-white/40 italic leading-relaxed mb-4 line-clamp-2">&ldquo;{strength.evidence_summary}&rdquo;</p>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${confidencePct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-emerald-400 tabular-nums">{confidencePct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* ─── RIGHT: Sidebar ─── */}
        <div className="space-y-6">

          {/* Section D: Assessment Roadmap */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Assessment Roadmap
            </h3>
            <div className="relative border-l border-white/[0.08] ml-3 space-y-5 pb-2">
              {profile.recommendations.priority_order.map((topicName: string, i: number) => {
                const gap = getGap(topicName);
                if (!gap) return null;
                const isFirst = i === 0;
                return (
                  <div key={i} className="relative pl-7">
                    <div className={`absolute -left-[10px] top-0.5 w-[18px] h-[18px] rounded-full border-[3px] border-[#0f172a] ${
                      isFirst
                        ? 'bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.5)]'
                        : 'bg-white/15'
                    }`} />
                    <div className={isFirst ? "opacity-100" : "opacity-40"}>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold text-sm ${isFirst ? 'text-teal-400' : 'text-white'}`}>{topicName}</h4>
                        {isFirst && (
                          <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-[9px] font-bold uppercase rounded-md border border-teal-500/20">
                            Start Here
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40">
                        {gap.gap_type === 'FUNDAMENTAL_GAP' ? 'Starts L1' : 'Starts L3'} &middot; ~{gap.suggested_intervention.estimated_time_minutes}m
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section E: How It Works */}
          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#121a28] to-[#0f172a] p-6">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> How It Works
            </h3>
            <div className="space-y-4">
              {[
                { icon: BrainCircuit, text: "Questions adapt dynamically. Answer correctly to reach higher Bloom's levels.", color: "text-teal-400" },
                { icon: Target, text: "Score 85% per topic to advance. Max 10 questions per topic.", color: "text-blue-400" },
                { icon: RefreshCw, text: "Struggling? The system auto-activates scaffolded support mode.", color: "text-amber-400" },
              ].map(({ icon: Icon, text, color }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section F: Prerequisites */}
          {prerequisites.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Prerequisites
              </h3>
              <div className="flex flex-wrap gap-2">
                {prerequisites.map((prereq: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] text-white/45 text-xs font-medium rounded-lg hover:text-white/70 hover:border-white/10 transition-colors duration-200 cursor-default">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" /> Quick Tips
            </h3>
            <div className="space-y-3">
              {[
                "Read each question carefully before answering",
                "Use the sandbox to test your code before submitting",
                "Don't rush — take your time to think through each problem",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400/40 shrink-0" />
                  <p className="text-xs text-white/35 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          LAUNCH FOOTER — Pre-flight + CTA
      ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0f172a] via-[#111c2e] to-[#0c1520]">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-teal-500/[0.05] rounded-full blur-[80px]" />

        <div className="relative z-10 p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-7">
          {/* Left: Checklist */}
          <div className="w-full lg:w-[46%]">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              </div>
              Pre-flight Checklist
            </h3>
            <div className="space-y-2">
              {[
                "Profile loaded completely",
                `Questions personalized to ${profile.mastery_profile.knowledge_gaps.flatMap((g: any) => g.misconceptions || []).length} specific misconceptions`,
                "GitHub, Sandbox, and Quiz parameters synced",
                "Session saves automatically after every answer",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-[13px] text-white/55"
                >
                  <div className="w-4 h-4 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-2.5 h-2.5 text-teal-400" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <div className="w-full lg:w-[46%] flex justify-end">
            {isStarting ? (
              <div className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-[#0f172a] px-5 py-6">
                <div className="relative w-8 h-8 shrink-0">
                  <div className="absolute inset-0 border-3 border-teal-500/20 rounded-full" />
                  <div className="absolute inset-0 border-3 border-transparent border-t-teal-400 rounded-full animate-spin" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Generating first question...</p>
                  <p className="text-xs text-white/40">Calling AI workflows, please wait.</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStart}
                className="group w-full max-w-md rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-left shadow-lg shadow-teal-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-500 hover:to-emerald-500 hover:shadow-xl hover:shadow-teal-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">Begin Assessment</p>
                    <p className="text-[11px] text-white/70 font-medium mt-0.5">
                      Starting: {profile.recommendations.priority_order[0]}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

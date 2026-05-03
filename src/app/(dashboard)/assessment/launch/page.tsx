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

const MOCK_PROFILE = {
  studentId: "STU-2026-1147",
  analysis_timestamp: "6 April 2026",
  data_sources: {
    github: "available",
    sandbox: "available",
    quizzes: "available",
  },
  mastery_profile: {
    overall_mastery_score: 31,
    strengths: [
      {
        topic_name: "Java Syntax and Basic I/O",
        mastery_level: "Advanced",
        confidence: 0.97,
        evidence_summary: "100% sandbox success rate. Quiz 94/100. No syntax errors across any submission.",
        can_teach_others: true,
      },
      {
        topic_name: "Control Flow Structures",
        mastery_level: "Proficient",
        confidence: 0.88,
        evidence_summary: "Accurate implementation of loops and conditionals across all recent assignments.",
        can_teach_others: false,
      }
    ],
  },
  recommendations: {
    general_advice: "Address BST first as it is blocking progress on advanced topics. Collections second as it is needed in almost every subsequent project.",
    priority_order: [
      {
        topic_name: "Binary Search Trees",
        gap_type: "FUNDAMENTAL_GAP",
        confidence: 0.97,
        evidence_summary: "GitHub shows a single massive commit containing a fully functional BST implementation with 96% AI probability. Sandbox insertion attempts placed nodes on the wrong side 90% of the time. Quiz score 8/50.",
        observed_error_patterns: {
          sandbox: ["Insertions placed on wrong side 9 out of 10 attempts", "Null pointer exceptions during traversal"],
          quizzes: ["Cannot identify worst-case time complexity", "Fails to trace simple insertions"],
          github: ["Single massive commit of complete BST implementation", "96% AI generation probability flag"],
        },
        misconceptions: [
          "Believes insertion goes to leftmost node",
          "Cannot distinguish traversal types",
          "Thinks deletion removes entire subtree",
          "Does not know inorder produces sorted output"
        ],
        prerequisite_topics: ["Recursion", "Object references", "Linked lists"],
        suggested_intervention: {
          learning_objectives: [
            "Explain the BST ordering property and verify it on any tree",
            "Insert a sequence of nodes into a BST and draw the resulting tree",
          ],
          primary: "Step-by-step Practice",
          estimated_time_minutes: 90,
        },
      },
      {
        topic_name: "Java Collections Framework",
        gap_type: "PARTIAL_GAP",
        confidence: 0.82,
        evidence_summary: "Uses ArrayList correctly but struggles with Map interfaces. Unnecessary iterations seen in GitHub repos instead of key lookups.",
        observed_error_patterns: {
          sandbox: ["Iterates over HashMap entries to find a key instead of using .get()"],
          quizzes: ["Confuses HashSet with TreeSet ordering"],
          github: ["Suboptimal data structure selection in algorithms project"],
        },
        misconceptions: [
          "Believes HashMap maintains insertion order",
        ],
        prerequisite_topics: ["Generics", "Interfaces", "Big-O notation"],
        suggested_intervention: {
          learning_objectives: [
            "Choose appropriate collection types for given scenarios",
            "Utilize Map methods efficiently (get, put, containsKey)",
          ],
          primary: "Targeted Quiz",
          estimated_time_minutes: 45,
        },
      },
      {
        topic_name: "Exception Handling",
        gap_type: "FUNDAMENTAL_GAP",
        confidence: 0.90,
        evidence_summary: "Consistently ignores checked exceptions or uses empty catch blocks. Fails quizzes related to finally block execution.",
        observed_error_patterns: {
          sandbox: ["Empty catch blocks detected", "Throws Exception everywhere"],
          quizzes: ["Incorrectly believes finally block is skipped if return is called in try block"],
          github: [],
        },
        misconceptions: [
          "Catching Exception catches all errors cleanly without consequence",
        ],
        prerequisite_topics: ["Method signatures", "Call stack"],
        suggested_intervention: {
          learning_objectives: [
            "Write robust try-catch-finally blocks",
            "Understand difference between checked and unchecked exceptions",
          ],
          primary: "Interactive Tutorial",
          estimated_time_minutes: 60,
        },
      }
    ],
  },
};

export default function LaunchScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile(MOCK_PROFILE);
      setIsPageLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => ({...prev, [index]: !prev[index]}));
  };

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      router.push("/assessment/session");
    }, 2500);
  };

  if (!isPageLoaded || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-pulse text-teal-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-semibold text-white/70">Loading your profile insights...</p>
      </div>
    );
  }

  const totalTime = profile.recommendations.priority_order.reduce((acc: number, t: any) => acc + t.suggested_intervention.estimated_time_minutes, 0);
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const prerequisites = Array.from(new Set(profile.recommendations.priority_order.flatMap((t: any) => t.prerequisite_topics))) as string[];

  return (
    <div className={`space-y-8 animate-slide-up transition-all duration-1000 ${isStarting ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
      {/* ── WELCOME HERO (Zone 1 & 2 logic adapted) ── */}
      <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-10 relative overflow-hidden group">
        <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 group-hover:rotate-180 transition-transform duration-1000 ease-linear animate-pulse" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-4">
              <Zap className="w-3 h-3" /> System Ready
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">Your Personalized Java Assessment is Ready.</h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Based on your recent learning activity, this assessment has been tailored specifically to the areas where you need the most support.
            </p>
          </div>
          
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 flex items-center gap-6 shrink-0">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    className="text-white/10"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    className={profile.mastery_profile.overall_mastery_score >= 70 ? "text-teal-400" : profile.mastery_profile.overall_mastery_score >= 40 ? "text-amber-400" : "text-red-400"}
                    strokeWidth="3"
                    strokeDasharray={`${profile.mastery_profile.overall_mastery_score}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-black ${profile.mastery_profile.overall_mastery_score >= 70 ? "text-teal-400" : profile.mastery_profile.overall_mastery_score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                    {profile.mastery_profile.overall_mastery_score}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Current Mastery</p>
              <p className="text-xs text-white/50 mb-3">Before this assessment</p>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/70 border border-white/10 flex items-center gap-1" title="GitHub Code">
                  <Code className="w-3 h-3 text-white/50" /> {profile.data_sources.github === "available" && <CheckCircle className="w-3 h-3 text-teal-400" />}
                </div>
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/70 border border-white/10 flex items-center gap-1" title="Coding Sandbox">
                  <Terminal className="w-3 h-3 text-white/50" /> {profile.data_sources.sandbox === "available" && <CheckCircle className="w-3 h-3 text-teal-400" />}
                </div>
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/70 border border-white/10 flex items-center gap-1" title="Quiz Results">
                  <FileText className="w-3 h-3 text-white/50" /> {profile.data_sources.quizzes === "available" && <CheckCircle className="w-3 h-3 text-teal-400" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ── PRIMARY COLUMN (Left) ── */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* Section A: Assessment Summary */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-400" /> What This Assessment Covers
            </h2>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-white/80">
                {profile.recommendations.priority_order.length} Topics to Master
              </span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-white/80">
                Approx. {hours} hr {minutes} min
              </span>
              <span className="px-4 py-2 bg-[#B45309]/10 border border-[#B45309]/30 rounded-xl text-sm font-semibold text-[#B45309]">
                85% per topic target
              </span>
            </div>
            <div className="border-l-2 border-teal-500 pl-4 py-1">
              <p className="text-white/80 italic text-lg leading-relaxed">
                "{profile.recommendations.general_advice}"
              </p>
            </div>
          </div>
          
          {/* Section B: Topics to be Assessed */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Topics You Will Be Assessed On</h2>
              <p className="text-white/50 text-sm">These topics were identified through your coding activity, quiz results, and submission analysis.</p>
            </div>
            
            <div className="space-y-6">
              {profile.recommendations.priority_order.map((topic: any, index: number) => {
                const isFundamental = topic.gap_type === 'FUNDAMENTAL_GAP';
                const confidenceColorClass = topic.confidence > 0.85 ? 'text-teal-400' : topic.confidence >= 0.60 ? 'text-amber-400' : 'text-red-400';
                const confidenceBgClass = topic.confidence > 0.85 ? 'bg-teal-400' : topic.confidence >= 0.60 ? 'bg-amber-400' : 'bg-red-400';
                
                return (
                  <div key={index} className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-colors rounded-2xl overflow-hidden flex flex-col relative group">
                    <div className={`absolute top-0 left-0 w-full h-1 ${isFundamental ? 'bg-red-500/50' : 'bg-amber-500/50'}`}></div>
                    
                    <div className="p-6 lg:p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${isFundamental ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{topic.topic_name}</h3>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${isFundamental ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                                {isFundamental ? 'Fundamental Gap' : 'Partial Gap'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Evidence & Confidence */}
                      <p className="text-white/70 text-sm mb-6 leading-relaxed">
                        {topic.evidence_summary}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-8">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider whitespace-nowrap">Analysis Confidence</span>
                        <div className="flex-1 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                          <div className={`h-full ${confidenceBgClass} rounded-full`} style={{ width: `${topic.confidence * 100}%` }}></div>
                        </div>
                        <span className={`text-sm font-bold ${confidenceColorClass}`}>{Math.round(topic.confidence * 100)}%</span>
                      </div>
                      
                      {/* Misconceptions */}
                      {topic.misconceptions.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Identified Misconceptions</h4>
                          <div className="flex flex-wrap gap-2">
                            {topic.misconceptions.map((misc: string, i: number) => (
                              <span key={i} className="px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-xs font-medium">
                                {misc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Objectives */}
                      <div className="mb-6">
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Learning Objectives</h4>
                        <ul className="space-y-2">
                          {topic.suggested_intervention.learning_objectives.map((obj: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                              <span className="text-teal-400 mt-0.5">•</span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expandable Details */}
                      <div className="pt-4 border-t border-white/5">
                        <button 
                          onClick={() => toggleCard(index)}
                          className="flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-white/80 transition-colors"
                        >
                          Show detailed evidence {expandedCards[index] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        
                        {expandedCards[index] && (
                          <div className="mt-4 space-y-4 p-4 bg-[#0F172A]/50 rounded-xl border border-white/5 text-sm">
                            {topic.observed_error_patterns.sandbox?.length > 0 && (
                              <div>
                                <p className="font-semibold text-white/80 mb-2 flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> Sandbox Observations</p>
                                <ul className="list-disc pl-5 text-white/50 space-y-1 text-xs">
                                  {topic.observed_error_patterns.sandbox.map((err: string, i: number) => <li key={i}>{err}</li>)}
                                </ul>
                              </div>
                            )}
                            {topic.observed_error_patterns.quizzes?.length > 0 && (
                              <div>
                                <p className="font-semibold text-white/80 mb-2 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Quiz Observations</p>
                                <ul className="list-disc pl-5 text-white/50 space-y-1 text-xs">
                                  {topic.observed_error_patterns.quizzes.map((err: string, i: number) => <li key={i}>{err}</li>)}
                                </ul>
                              </div>
                            )}
                            {topic.observed_error_patterns.github?.length > 0 && profile.data_sources.github === "available" && (
                              <div>
                                <p className="font-semibold text-white/80 mb-2 flex items-center gap-2"><Code className="w-3.5 h-3.5" /> GitHub Observations</p>
                                <ul className="list-disc pl-5 text-white/50 space-y-1 text-xs">
                                  {topic.observed_error_patterns.github.map((err: string, i: number) => <li key={i}>{err}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Footer Strip */}
                    <div className="bg-[#0F172A]/80 border-t border-white/5 px-6 lg:px-8 py-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/40 uppercase tracking-wider mt-auto">
                      <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> L{isFundamental ? '1 (Remembering)' : '3 (Applying)'}</span>
                      <span className="flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5" /> {topic.suggested_intervention.primary}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {topic.suggested_intervention.estimated_time_minutes} min</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Section C: Strengths */}
          {profile.mastery_profile.strengths.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Your Strengths</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.mastery_profile.strengths.map((strength: any, i: number) => (
                  <div key={i} className="bg-[#334155]/30 border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:bg-[#334155]/40 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <h4 className="text-white font-bold">{strength.topic_name}</h4>
                      <span className="px-2 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-bold rounded uppercase tracking-wider">
                        {strength.mastery_level}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 italic mb-4 pl-2 line-clamp-2">"{strength.evidence_summary}"</p>
                    <div className="flex items-center gap-3 mt-auto pl-2">
                      <div className="flex-1 h-1 bg-[#0F172A] rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${strength.confidence * 100}%` }}></div>
                      </div>
                      {strength.can_teach_others && (
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" /> Mentor
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* ── SECONDARY COLUMN (Right) ── */}
        <div className="col-span-1 space-y-6">
          
          {/* Section D: Assessment Roadmap */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6 hover:bg-[#334155]/40 transition-colors">
            <h3 className="text-lg font-bold text-white mb-6">Assessment Roadmap</h3>
            
            <div className="relative border-l border-white/10 ml-3 space-y-6 pb-2">
              {profile.recommendations.priority_order.map((topic: any, i: number) => {
                const isFirst = i === 0;
                return (
                  <div key={i} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 border-[#1e293b] ${isFirst ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]' : 'bg-white/20'}`}></div>
                    <div className={isFirst ? "opacity-100" : "opacity-50"}>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold text-sm ${isFirst ? 'text-teal-400' : 'text-white'}`}>{topic.topic_name}</h4>
                        {isFirst && <span className="px-1.5 py-0.5 bg-teal-500/10 text-teal-400 text-[8px] font-bold uppercase rounded border border-teal-500/20">Start</span>}
                      </div>
                      <div className="text-xs text-white/50">
                        <p>{topic.gap_type === 'FUNDAMENTAL_GAP' ? 'Starts L1' : 'Starts L3'} • ~{topic.suggested_intervention.estimated_time_minutes}m</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Section E: How It Works */}
          <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> How It Works
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <BrainCircuit className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Questions adapt dynamically. Answer correctly to reach higher Bloom's levels.</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Target className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Score 85% per topic to advance. Max 10 questions per topic.</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <RefreshCw className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <span>Struggling? The system auto-activates scaffolded support mode.</span>
              </li>
            </ul>
          </div>

          {/* Section F: Prerequisite Topics */}
          <div className="bg-[#334155]/20 border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Prerequisites
            </h3>
            <div className="flex flex-wrap gap-2">
              {prerequisites.map((prereq: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-[#0F172A]/50 border border-white/5 text-white/60 text-xs font-medium rounded-lg">
                  {prereq}
                </span>
              ))}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* ── ZONE 5: LAUNCH FOOTER ── */}
      <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-teal-500/20 rounded-3xl p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_30px_rgba(13,148,136,0.1)] mt-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-transparent pointer-events-none" />
        
        <div className="w-full md:w-1/2 space-y-3 relative z-10">
          <h3 className="text-xl font-bold text-white mb-4">Pre-flight Checklist</h3>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Profile loaded completely</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Questions personalized to {profile.recommendations.priority_order.flatMap((t: any) => t.misconceptions).length} specific misconceptions</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>GitHub, Sandbox, and Quiz parameters synced</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Session saves automatically after every answer</span>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex justify-end relative z-10">
          {isStarting ? (
            <div className="bg-[#0F172A] border border-teal-500/30 rounded-2xl p-6 w-full text-center">
              <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Generating first question...</h3>
              <p className="text-xs text-white/50">Calling AI workflows, please wait.</p>
            </div>
          ) : (
            <button 
              onClick={handleStart}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] rounded-2xl p-6 lg:p-8 text-left transition-all hover:-translate-y-1 group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              <h2 className="text-2xl lg:text-3xl font-black mb-2 flex items-center justify-between relative z-10">
                Begin Assessment
                <ArrowRight className="w-6 h-6 opacity-80 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all" />
              </h2>
              <p className="text-white/70 text-sm font-semibold relative z-10">
                Start: {profile.recommendations.priority_order[0].topic_name}
              </p>
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Users, MessageSquare, CheckCircle2, Play, Clock, Target, Sparkles, Terminal, AlertCircle, Award, Zap, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { peerLearningApi } from "@/lib/api/peerLearning";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MasteryRing = ({ percentage }: { percentage: number }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-20 h-20 group">
      <div className="absolute inset-[-20%] bg-teal-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <svg className="w-full h-full transform -rotate-90 relative z-10">
        <circle
          cx="40"
          cy="40"
          r={radius}
          className="stroke-[#1e293b] fill-none"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          className="stroke-teal-400 fill-none transition-all duration-1000 ease-out"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center z-10">
        <span className="font-black text-xl text-white">{percentage}%</span>
      </div>
    </div>
  );
};

export default function PeerLearningDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [acceptingNotif, setAcceptingNotif] = useState<string | null>(null);

  useEffect(() => {
    loadStudent();
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStudent = async () => {
    setLoading(true);
    const result = await peerLearningApi.getStudentProfile();
    if (result.success && result.data) {
      setStudent(result.data);
    }
    setLoading(false);
  };

  const loadNotifications = async () => {
    const result = await peerLearningApi.getNotifications();
    if (result.success && result.data) {
      setNotifications(Array.isArray(result.data) ? result.data : []);
    }
  };

  const handleFindTeacher = async () => {
    setMatchLoading(true);
    setMatchResult(null);
    const result = await peerLearningApi.findTeacher();
    setMatchResult(result);
    setMatchLoading(false);
  };

  const handleAcceptNotification = async (notificationId: string, sessionId: string) => {
    setAcceptingNotif(notificationId);
    const result = await peerLearningApi.acceptNotification(notificationId);
    setAcceptingNotif(null);
    if (result?.session_id) {
      router.push(`/peer-learning/pair-session?sessionId=${result.session_id}`);
    }
  };

  const overallMastery = student?.mastery_profile?.overall_mastery_score || student?.stats?.overall_mastery_score || 0;

  return (
    <div className="flex flex-col gap-6 animate-slide-up pb-8 min-h-[calc(100vh-2rem)]">
      
      {/* ── HEADER HERO ── */}
      <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-5 relative overflow-hidden group shrink-0">
        <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 group-hover:rotate-180 transition-transform duration-1000 ease-linear animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-3">
              <Zap className="w-3 h-3" /> Active Module
            </div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-1.5">
              Peer Learning Hub
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
            </h1>
            <p className="text-white/60 text-sm max-w-xl">
              Collaborate to master complex topics. Match with verified peers in real-time to solve coding challenges together and improve your mastery score.
            </p>
          </div>

          {student && (
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-4 flex items-center gap-4 shrink-0">
              <div className="flex flex-col">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-0.5">Student ID</span>
                <span className="text-white font-mono text-sm">{student.student_id || student._id}</span>
              </div>
              <div className="w-px h-8 bg-white/10 mx-2" />
              <div className="flex flex-col">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-0.5">Network Status</span>
                <span className="text-teal-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" /> Active
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TOP HORIZONTAL ROW: DIAGNOSTICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        
        {/* 1. Mastery Index */}
        <Card className="bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border-white/5 rounded-2xl hover:border-teal-500/20 transition-all group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(13,148,136,0.15)] z-10 hover:z-20 relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-white/50 tracking-wider uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-400" /> Mastery Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <MasteryRing percentage={overallMastery} />
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Level</span>
                    <span className="font-bold text-white text-sm mt-0.5">{student?.profile?.java_level || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Institution</span>
                    <span className="font-bold text-white text-sm mt-0.5 truncate max-w-[140px]">{student?.profile?.institution || "N/A"}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Focus Areas */}
        <Card className="bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border-white/5 rounded-2xl hover:border-amber-500/20 transition-all group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] z-10 hover:z-20 relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-white/50 tracking-wider uppercase flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" /> Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? null : student?.mastery_profile?.knowledge_gaps?.length > 0 ? (
              <div className="space-y-4 mt-1">
                {student.mastery_profile.knowledge_gaps.slice(0, 3).map((gap: any, idx: number) => {
                  const score = gap.mastery_score || gap.confidence || 0;
                  const isRed = gap.gap_type === 'FUNDAMENTAL_GAP';
                  return (
                    <div key={idx} className="group/item cursor-default">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-sm font-semibold text-white/80 group-hover/item:text-white transition-colors truncate max-w-[200px]">{gap.topic}</span>
                        <span className="text-xs font-bold text-white/50">{score}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden flex-1">
                          <div 
                            className={`h-full rounded-full relative ${isRed ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-amber-600 to-amber-400'}`} 
                            style={{ width: `${score}%` }} 
                          >
                            <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-shimmer" />
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase w-12 text-right ${isRed ? 'text-red-400' : 'text-amber-400'}`}>
                          {isRed ? 'CRIT' : 'PART'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-medium text-white/40">No gaps detected.</p>
            )}
          </CardContent>
        </Card>

        {/* 3. Core Strengths */}
        <Card className="bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border-white/5 rounded-2xl hover:border-teal-500/20 transition-all group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(13,148,136,0.15)] z-10 hover:z-20 relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-white/50 tracking-wider uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> Core Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? null : student?.mastery_profile?.strengths?.length > 0 ? (
              <div className="space-y-4 mt-1">
                {student.mastery_profile.strengths.slice(0, 3).map((str: any, idx: number) => {
                  const score = str.mastery_score || 90;
                  return (
                    <div key={idx} className="group/item cursor-default">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-sm font-semibold text-white/80 group-hover/item:text-white transition-colors truncate max-w-[200px]">{str.topic || str}</span>
                        <span className="text-xs font-bold text-white/50">{score}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden flex-1">
                          <div 
                            className="h-full rounded-full relative bg-gradient-to-r from-teal-600 to-teal-400" 
                            style={{ width: `${score}%` }} 
                          >
                            <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-shimmer" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase w-12 text-right text-teal-400">
                          MSTRD
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-medium text-white/40">Insufficient data.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── BOTTOM GRID: ACTION & SYSTEM ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 pb-2">
        
        {/* Session Planner */}
        <div className="col-span-1 lg:col-span-2 relative p-[1px] rounded-2xl overflow-hidden group flex flex-col">
          {/* Animated border effect */}
          <div className="absolute inset-[-50%] bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0 group-hover:rotate-180 transition-transform duration-1000 ease-linear animate-pulse opacity-50" />
          
          <Card className="relative h-full bg-[#1e293b]/95 backdrop-blur-xl rounded-2xl border-none flex flex-col overflow-hidden">
            <CardHeader className="shrink-0 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-2 shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                    <Sparkles className="w-3 h-3" /> Peer Match
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Session Planner</CardTitle>
                  <p className="text-xs text-white/50 mt-1">
                    Review the blueprint below and initialize matching.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between p-0 px-4 pb-4">
              
              {/* How this happens (Execution Plan) */}
              <div className="flex-1 flex flex-col justify-center my-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 relative hover:border-teal-500/30 transition-all group/step shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                    <div className="absolute -top-3.5 left-4 px-2 py-0.5 bg-[#0F172A] border border-white/10 rounded-lg text-[11px] font-bold text-teal-400 group-hover/step:border-teal-500/40 transition-all">Step 1</div>
                    <Target className="w-6 h-6 text-teal-400/50 mb-1 mt-1 group-hover/step:text-teal-400 transition-colors" />
                    <h3 className="text-base font-black text-white mb-1 tracking-wide">Analyze Profile</h3>
                    <p className="text-sm text-white/60 leading-tight font-medium">System instantly maps your critical gaps.</p>
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 relative hover:border-teal-500/30 transition-all group/step shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                    <div className="absolute -top-3.5 left-4 px-2 py-0.5 bg-[#0F172A] border border-white/10 rounded-lg text-[11px] font-bold text-teal-400 group-hover/step:border-teal-500/40 transition-all">Step 2</div>
                    <Users className="w-6 h-6 text-teal-400/50 mb-1 mt-1 group-hover/step:text-teal-400 transition-colors" />
                    <h3 className="text-base font-black text-white mb-1 tracking-wide">Peer Matching</h3>
                    <p className="text-sm text-white/60 leading-tight font-medium">Finds an active peer with verified mastery.</p>
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 relative hover:border-teal-500/30 transition-all group/step shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                    <div className="absolute -top-3.5 left-4 px-2 py-0.5 bg-[#0F172A] border border-white/10 rounded-lg text-[11px] font-bold text-teal-400 group-hover/step:border-teal-500/40 transition-all">Step 3</div>
                    <Play className="w-6 h-6 text-teal-400/50 mb-1 mt-1 group-hover/step:text-teal-400 transition-colors" />
                    <h3 className="text-base font-black text-white mb-1 tracking-wide">Live Session</h3>
                    <p className="text-sm text-white/60 leading-tight font-medium">Connect in a shared workspace to learn.</p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="shrink-0 space-y-3">
                
                {/* Dynamic UI: Show Queue Stats when NOT matching/matched, otherwise show Match UI */}
                {!matchResult && !matchLoading && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border border-white/10 flex flex-col items-center text-center shadow-lg">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-0.5">Active Pool</span>
                      <span className="font-black text-3xl text-white leading-none mt-1">24</span>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border border-white/10 flex flex-col items-center text-center shadow-lg">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-0.5">Avg Wait</span>
                      <span className="font-black text-3xl text-white leading-none mt-1">45s</span>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#334155]/30 to-[#0F172A] border border-white/10 flex flex-col items-center text-center shadow-lg">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-0.5">Match Rate</span>
                      <span className="font-black text-3xl text-teal-400 leading-none mt-1">92%</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleFindTeacher}
                  disabled={matchLoading}
                  className={`w-full py-3 bg-teal-600 text-white font-black text-base uppercase tracking-widest rounded-xl hover:bg-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${!matchLoading ? 'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(13,148,136,0.6)] shadow-[0_0_15px_rgba(13,148,136,0.3)]' : ''}`}
                >
                  {matchLoading ? (
                    <>
                      <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Locating Peer...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Initialize Match</span>
                    </>
                  )}
                </button>

                {matchResult && (
                  <div className="w-full animate-slide-up">
                    <div className={`border rounded-xl overflow-hidden ${matchResult.status === 'matched' ? 'border-teal-500/30' : 'border-amber-500/30'}`}>
                      <div className={`px-4 py-3 border-b flex justify-between items-center ${matchResult.status === 'matched' ? 'bg-teal-500/10 border-teal-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                        <div className="flex items-center gap-2">
                          {matchResult.status === 'matched' ? <CheckCircle2 className="w-4 h-4 text-teal-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${matchResult.status === 'matched' ? 'text-teal-400' : 'text-amber-400'}`}>
                            {matchResult.status === 'matched' ? 'Match Established' : 'Queue Active'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-[#0F172A]/50">
                        {matchResult.session_details && (
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-end">
                              <span className="text-[10px] font-bold text-white/40 uppercase">Target Topic</span>
                              <span className="text-xs font-semibold text-white">{matchResult.session_details.topic_name}</span>
                            </div>
                            <div className="w-full h-px bg-white/10" />
                            <div className="flex justify-between items-end">
                              <span className="text-[10px] font-bold text-white/40 uppercase">Peer ID</span>
                              <span className="text-xs font-mono font-bold text-teal-400">{matchResult.teacher_details?.name || matchResult.partner?.student_id}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {matchResult.status !== 'matched' ? (
                            <>
                              <button className="flex-1 py-2.5 bg-[#B45309]/10 hover:bg-[#B45309]/20 text-[#B45309] font-bold rounded-xl transition-colors border border-[#B45309]/30 text-xs uppercase tracking-wider">
                                Hold Position
                              </button>
                              <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 font-bold rounded-xl transition-colors border border-white/5 text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                                <Sparkles className="w-3 h-3" /> Connect Agent
                              </button>
                            </>
                          ) : (
                            <Link
                              href={`/peer-learning/pair-session?sessionId=${matchResult.session_id}`}
                              className="w-full"
                            >
                              <button className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:shadow-[0_0_25px_rgba(13,148,136,0.5)] flex items-center justify-center gap-2">
                                <Play className="w-4 h-4 fill-white" /> Connect Session
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System State */}
        <div className="flex flex-col gap-6">
          
          {/* System Log */}
          <Card className="bg-[#334155]/30 border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <CardHeader className="py-4 shrink-0 border-b border-white/5">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" /> System Log
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-5">
              <div className="space-y-5">
                <div className="relative pl-5 border-l border-white/10">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#0F172A] border-2 border-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                  <p className="text-[10px] font-bold text-white/40 mb-1">JUST NOW</p>
                  <p className="text-sm text-white/80 font-medium">Dashboard initialized</p>
                </div>
                <div className="relative pl-5 border-l border-white/10">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#0F172A] border-2 border-white/40" />
                  <p className="text-[10px] font-bold text-white/40 mb-1">SYSTEM</p>
                  <p className="text-sm text-white/50">Waiting for peer connection event...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-[#334155]/30 border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors">
            <CardHeader className="py-4 shrink-0 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Notifications
              </CardTitle>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/70 text-[10px] font-bold">{notifications.length}</span>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-5">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notif: any, idx: number) => {
                    const isJoinNotif = notif.action === "join_session" || notif.type === "pairing_success";
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 border rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1e293b] shadow-sm ${
                          isJoinNotif ? 'border-teal-500/30' : 'border-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold tracking-wider ${isJoinNotif ? 'text-teal-400' : 'text-white/40'}`}>
                            {isJoinNotif ? 'SESSION READY' : `MSG_ID: ${idx}`}
                          </span>
                          <div className="flex items-center gap-2">
                            {notif.scheduled_at && (
                              <span className="text-[10px] font-medium text-amber-400/70">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {new Date(notif.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                            {notif.created_at && (
                              <span className="text-[10px] font-medium text-white/40">
                                {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed mb-2">{notif.message}</p>
                        {isJoinNotif && notif.session_id && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAcceptNotification(notif.notification_id, notif.session_id)}
                              disabled={acceptingNotif === notif.notification_id}
                              size="sm"
                              className="w-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold h-8"
                            >
                              {acceptingNotif === notif.notification_id ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                              ) : (
                                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              {notif.action_label || "Join Session"}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-white/30" />
                  </div>
                  <p className="text-xs font-bold text-white/40">No active alerts.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Clock, Play, Send, CheckCircle2, MessageSquare, HelpCircle, Users, Terminal,
  Code2, Sparkles, Bug, ShieldAlert, AlertCircle, Wifi, WifiOff, ListTodo,
  Circle, CheckSquare, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { peerLearningApi } from "@/lib/api/peerLearning";

interface ChatMessage {
  type: string;
  from: string;
  role: string;
  message: string;
  timestamp: string;
}

interface GroupMember {
  student_id: string;
  role: string;
  score?: number;
  task_completion?: number;
  collaboration?: number;
  communication?: number;
}

interface GroupSessionData {
  session_id: string;
  topic_id: string;
  topic_name: string;
  members: GroupMember[];
  activity_type: string;
  status: string;
  problem_statement: string;
  explainer_guide: string;
  solver_starter: string;
  reviewer_checklist: string;
  expected_solution: string;
  session_number: number;
  group_average_score: number | null;
  chat_log: ChatMessage[];
  sandbox_code: string;
  created_at: string;
  completed_at: string | null;
}

interface GroupSessionPageProps {
  defaultActivityType?: string;
}

const ROLE_COLORS: Record<string, { primary: string; bg: string; border: string }> = {
  EXPLAINER: { primary: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500" },
  SOLVER: { primary: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500" },
  REVIEWER: { primary: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500" },
};

const ACTIVITY_STYLES: Record<string, { title: string; icon: any; accent: string; accentBg: string; accentBorder: string; accentText: string }> = {
  coding: {
    title: "GROUP CODING SESSION",
    icon: Code2,
    accent: "teal",
    accentBg: "bg-teal-500/10",
    accentBorder: "border-teal-500/20",
    accentText: "text-teal-400",
  },
  debugging: {
    title: "GROUP DEBUGGING SESSION",
    icon: Bug,
    accent: "amber",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/20",
    accentText: "text-[#B45309]",
  },
  mini_project: {
    title: "GROUP MINI PROJECT",
    icon: Sparkles,
    accent: "teal",
    accentBg: "bg-teal-500/10",
    accentBorder: "border-teal-500/20",
    accentText: "text-teal-400",
  },
};

const ROLE_ACTIONS: Record<string, string> = {
  EXPLAINER: "Explain logic",
  SOLVER: "Write code",
  REVIEWER: "Audit logic",
};

const PHASES = [
  { label: "Conceptual Sync", key: "conceptual" },
  { label: "Logic Articulation", key: "logic" },
  { label: "Final Verification", key: "verification" },
];

export default function GroupSession({ defaultActivityType }: GroupSessionPageProps) {
  const [sessionData, setSessionData] = useState<GroupSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myStudentId, setMyStudentId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState("");
  const [forming, setForming] = useState(false);

  // WebSocket state
  const [wsConnected, setWsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Code editor
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");

  // Hints
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const MAX_HINTS = 3;

  // Score submission
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [taskScore, setTaskScore] = useState(85);
  const [collabScore, setCollabScore] = useState(80);
  const [commScore, setCommScore] = useState(75);
  const [submittingScore, setSubmittingScore] = useState(false);
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [showBugReport, setShowBugReport] = useState(false);
  const [showMarkComplete, setShowMarkComplete] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);

  const style = ACTIVITY_STYLES[sessionData?.activity_type || defaultActivityType || "coding"] || ACTIVITY_STYLES.coding;
  const Icon = style.icon;

  const scrollChatToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  // Get student id on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setMyStudentId(payload.student_id || payload.id);
      } catch {}
    }
    // Check URL for sessionId
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("sessionId");
    if (sid) setSessionId(sid);
  }, []);

  // Fetch session data when sessionId is available
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    const loadSession = async () => {
      const data = await peerLearningApi.getGroupSession(sessionId!);
      if (!data) {
        setError("Session not found");
        setLoading(false);
        return;
      }
      setSessionData(data);
      setCode(data.sandbox_code || data.solver_starter || "");
      setChatMessages(data.chat_log || []);
      setCurrentPhase(0);
      setLoading(false);
    };
    loadSession();
  }, [sessionId]);

  // Initialize WebSocket when sessionData is loaded
  useEffect(() => {
    if (!sessionData) return;

    const onMessage = (data: any) => {
      switch (data.type) {
        case "chat":
          setChatMessages(prev => [...prev, data]);
          scrollChatToBottom();
          break;
        case "sandbox_update":
          if (data.from !== myStudentId) {
            setCode(data.code || "");
            if (data.language) setLanguage(data.language);
          }
          break;
        case "role_action":
          setChatMessages(prev => [...prev, {
            type: "role_action",
            from: data.from,
            role: data.role,
            message: `[${data.action}] ${data.content || ""}`,
            timestamp: data.timestamp,
          }]);
          break;
        case "user_joined":
          setChatMessages(prev => [...prev, {
            type: "system", from: "system", role: "system",
            message: `${data.student_id.slice(0, 8)} joined the group`,
            timestamp: data.timestamp,
          }]);
          break;
        case "user_left":
          setChatMessages(prev => [...prev, {
            type: "system", from: "system", role: "system",
            message: `${data.student_id.slice(0, 8)} left the group`,
            timestamp: data.timestamp,
          }]);
          break;
        case "pong":
          break;
      }
    };

    const onOpen = () => setWsConnected(true);
    const onClose = () => setWsConnected(false);

    const ws = peerLearningApi.connectGroupWebSocket(sessionData.session_id, onMessage, onOpen, onClose);
    wsRef.current = ws;

    return () => {
      if (ws) ws.close();
    };
  }, [sessionData, myStudentId, scrollChatToBottom]);

  const sendChatMessage = () => {
    if (!chatInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "chat", message: chatInput.trim() }));
    setChatInput("");
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const sendCodeUpdate = useCallback((newCode: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: "sandbox_update",
      code: newCode,
      language,
    }));
  }, [language]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    sendCodeUpdate(newCode);
  };

  const sendRoleAction = (action: string, content?: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "role_action", action, content }));
  };

  const handleFormGroup = async () => {
    if (!topicId.trim()) return;
    setForming(true);
    setError("");
    const result = await peerLearningApi.formGroupSession(topicId.trim());
    if (result.success && result.data?.session_id) {
      setSessionId(result.data.session_id);
    } else {
      setError(result.message || "Failed to form group session");
    }
    setForming(false);
  };

  const handleRevealHint = () => {
    if (hintsRevealed < MAX_HINTS) {
      setHintsRevealed(prev => prev + 1);
    }
  };

  const handleSubmitScores = async () => {
    if (!sessionData || !myStudentId) return;
    setSubmittingScore(true);
    const result = await peerLearningApi.submitGroupScores(
      sessionData.session_id,
      myStudentId,
      taskScore,
      collabScore,
      commScore,
    );
    setScoreResult(result);
    setSubmittingScore(false);
    if (result?.session_id) {
      setShowScoreForm(false);
    }
  };

  const getMyRole = () => {
    if (!sessionData || !myStudentId) return null;
    return sessionData.members.find(m => m.student_id === myStudentId);
  };

  const getRoleStyle = (role: string) => ROLE_COLORS[role] || ROLE_COLORS.EXPLAINER;

  const isMyMember = (studentId: string) => studentId === myStudentId;

  const isMyMessage = (msg: ChatMessage) => msg.from === myStudentId;

  // ─── Form View (no session) ────────────────────────────────────────────────

  if (!sessionId) {
    return (
      <div className="space-y-6 animate-slide-up pb-8 text-white">
        <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-8 max-w-xl mx-auto">
          <h1 className="text-xl font-black text-teal-400 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" /> JOIN GROUP SESSION
          </h1>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm mb-4">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Topic ID</label>
              <input
                type="text"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                placeholder="e.g. loops"
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50"
              />
            </div>
            <Button
              onClick={handleFormGroup}
              disabled={forming || !topicId.trim()}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl h-12"
            >
              {forming ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> FORMING GROUP...</>
              ) : (
                <><Users className="w-4 h-4 mr-2" /> FORM GROUP SESSION</>
              )}
            </Button>
            <p className="text-xs text-white/30 text-center">
              Or add <code className="text-teal-400">?sessionId=YOUR_SESSION_ID</code> to the URL
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Loading View ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up pb-8 text-white">
        <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-12 text-center">
          <div className="w-10 h-10 border-[3px] border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading session data...</p>
        </div>
      </div>
    );
  }

  // ─── Error View ────────────────────────────────────────────────────────────

  if (error && !sessionData) {
    return (
      <div className="space-y-6 animate-slide-up pb-8 text-white">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-black text-white mb-2">Session Error</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <Link href="/peer-learning">
            <Button variant="outline" className="border-white/10 text-white">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!sessionData) return null;

  const myRole = getMyRole();
  const myMemberRole = myRole?.role || "";

  // ─── Score Submitted View ───────────────────────────────────────────────────

  if (scoreResult && !showScoreForm) {
    return (
      <div className="space-y-6 animate-slide-up pb-8 text-white">
        <div className="bg-[#334155]/30 border border-teal-500/30 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-teal-400 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white mb-2">Session Complete!</h1>
          <p className="text-white/60 mb-6">Your scores have been submitted.</p>
          {scoreResult.group_average_score !== undefined && (
            <div className="inline-flex items-center gap-2 bg-teal-500/10 px-6 py-3 rounded-xl border border-teal-500/20 mb-6">
              <Award className="w-5 h-5 text-teal-400" />
              <span className="font-bold text-teal-400">Group Avg: {scoreResult.group_average_score}%</span>
            </div>
          )}
          {scoreResult.group_action && (
            <p className="text-sm text-white/50 mb-6">
              {scoreResult.group_action === "continue" ? "Your group continues to the next round!"
              : scoreResult.group_action === "group_disbanded" ? "Your group has been disbanded."
              : `Action: ${scoreResult.group_action}`}
            </p>
          )}
          <Link href="/peer-learning">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Main Session UI ──────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className={`text-xl font-black uppercase tracking-tight flex items-center gap-2 ${style.accentText}`}>
            <Icon className="w-5 h-5" /> {style.title} - {sessionData.topic_name.toUpperCase()}
          </h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1 font-medium flex-wrap">
            <span>Group ID: {sessionData.session_id.slice(0, 12)}...</span>
            <span>Type: <span className="text-white">{sessionData.activity_type.toUpperCase()}</span></span>
            <span>Session #{sessionData.session_number}</span>
            {myRole && (
              <span className={getRoleStyle(myMemberRole).primary}>Your Role: {myMemberRole}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#0F172A]/40 px-4 py-2 rounded-xl border border-white/5 self-center md:self-auto">
          <Clock className="w-5 h-5 text-[#B45309] animate-pulse" />
          <span className="text-xl font-bold font-mono text-[#B45309]">
            {sessionData.activity_type === "mini_project" ? "45:00" : "25:00"}
          </span>
          {wsConnected ? (
            <Wifi className="w-4 h-4 text-teal-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-400" />
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Role Assignment */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h2 className="text-[10px] font-black uppercase text-white/50 tracking-widest">
                {sessionData.activity_type === "debugging" ? "Neural Designation Matrix" : "Current Role Assignment"}
              </h2>
            </div>
            <div className="p-0">
              <div className="grid grid-cols-3 divide-x divide-white/5 text-center">
                {sessionData.members.map((member) => {
                  const rStyle = getRoleStyle(member.role);
                  const isMe = isMyMember(member.student_id);
                  return (
                    <div key={member.student_id} className={`p-5 ${isMe ? `${rStyle.bg} border-b-2 ${rStyle.border}` : ""}`}>
                      <h3 className={`font-black text-xs uppercase mb-1 ${rStyle.primary}`}>
                        {member.role}
                      </h3>
                      <p className="text-xs font-black text-white mb-2 tracking-tighter">
                        {isMe ? "(YOU)" : member.student_id.slice(0, 8)}
                      </p>
                      <p className="text-[10px] text-white/50 uppercase font-bold tracking-tight">
                        {ROLE_ACTIONS[member.role] || "Collaborate"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <Card className="bg-[#334155]/30 border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 flex items-center justify-between">
              <h2 className="text-sm font-black text-white/50 flex items-center gap-2 uppercase tracking-widest">
                <Code2 className={`w-4 h-4 ${style.accentText}`} />
                {sessionData.activity_type === "debugging" ? "Buggy Source Code" : "Mission Briefing"}
              </h2>
            </div>
            <CardContent className="p-6">
              <h3 className="font-black text-lg text-white mb-3 tracking-tight">
                {sessionData.activity_type === "debugging" ? "Bug Analysis" : "Problem Statement"}
              </h3>
              <p className="text-sm text-white/70 mb-6 leading-relaxed font-medium whitespace-pre-wrap">
                {sessionData.problem_statement || "No problem statement available."}
              </p>

              {/* Role-specific guides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sessionData.explainer_guide && (
                  <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 shadow-inner">
                    <h3 className="text-[10px] font-black text-teal-300 mb-3 uppercase tracking-widest">Explainer Guide</h3>
                    <p className="text-[11px] font-mono text-white/60 whitespace-pre-wrap">{sessionData.explainer_guide}</p>
                  </div>
                )}
                {sessionData.solver_starter && (
                  <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 shadow-inner">
                    <h3 className="text-[10px] font-black text-blue-300 mb-3 uppercase tracking-widest">Solver Starter</h3>
                    <pre className="text-[10px] font-mono text-teal-100/50 leading-relaxed whitespace-pre-wrap">{sessionData.solver_starter}</pre>
                  </div>
                )}
                {sessionData.reviewer_checklist && (
                  <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 shadow-inner">
                    <h3 className="text-[10px] font-black text-purple-300 mb-3 uppercase tracking-widest">Reviewer Checklist</h3>
                    <p className="text-[11px] font-mono text-white/60 whitespace-pre-wrap">{sessionData.reviewer_checklist}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bug Tracker (debugging only) / Task Progress (other modes) */}
          {sessionData.activity_type === "debugging" ? (
            <div className="bg-[#B45309]/5 border border-[#B45309]/20 rounded-2xl overflow-hidden hover:bg-[#B45309]/10 transition-all shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="font-black text-lg mb-1 flex items-center gap-2 text-[#B45309] tracking-tight">
                      <ShieldAlert className="w-5 h-5" /> ANOMALY TRACKER
                    </h2>
                    <p className="text-sm text-white/50 font-medium italic">"Audit the codebase for structural vulnerabilities"</p>
                  </div>
                  <div className="bg-[#B45309]/10 text-[#B45309] px-4 py-1.5 rounded-full text-xs font-black border border-[#B45309]/20 shadow-inner tracking-widest">
                    ALERTS: 0 OF 4 FOUND
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5 group hover:bg-black/40 transition-all">
                      <div className="w-5 h-5 border-2 border-white/10 rounded flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-white/5 rounded-sm" />
                      </div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-tight">Bug #{id}: <span className="text-white/20 italic font-normal ml-1">Searching...</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Collaborative Code Editor */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0F172A]/80 flex-wrap gap-4">
              <h2 className="font-bold text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Terminal className={`w-4 h-4 ${style.accentText}`} />
                Collaborative IDE
              </h2>
              <div className="flex gap-3 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRevealHint}
                  disabled={hintsRevealed >= MAX_HINTS}
                  className="h-9 px-4 text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold rounded-xl"
                >
                  <HelpCircle className="w-3 h-3 mr-2 text-[#B45309]" />
                  HINT ({hintsRevealed}/{MAX_HINTS})
                </Button>
                {myMemberRole === "REVIEWER" && sessionData.activity_type === "debugging" && (
                  <Button
                    size="sm"
                    onClick={() => setShowBugReport(true)}
                    className="h-9 px-4 text-xs bg-[#B45309] hover:bg-[#B45309]/80 text-white font-black rounded-xl"
                  >
                    <Bug className="w-3 h-3 mr-2" /> REPORT BUG
                  </Button>
                )}
                {(myMemberRole === "SOLVER" || !myMemberRole) && (
                  <Button
                    size="sm"
                    onClick={() => setShowMarkComplete(true)}
                    className={`h-9 px-4 text-xs text-white font-black rounded-xl shadow-[0_0_15px_rgba(13,148,136,0.3)] ${
                      style.accent === "teal" ? "bg-teal-600 hover:bg-teal-500" : "bg-teal-600 hover:bg-teal-500"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-2" />
                    {sessionData.activity_type === "mini_project" ? "MARK FEATURE COMPLETE" : "SUBMIT"}
                  </Button>
                )}
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="p-6 flex-1 font-mono text-sm bg-black text-gray-400 overflow-auto leading-relaxed shadow-inner resize-none border-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Output Console */}
          <Card className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 px-5">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Telemetry Output</h3>
              </div>
              <div className="p-5 font-mono text-xs space-y-2 bg-black min-h-[120px]">
                <p className="text-white/30 italic">{">"} Session initialized.</p>
                {sessionData.expected_solution && (
                  <div className="p-3 bg-teal-500/5 border border-teal-500/10 rounded-xl mt-2">
                    <p className="text-teal-400 font-bold text-[10px] uppercase tracking-widest mb-1">Expected Solution</p>
                    <pre className="text-white/60 text-[10px] whitespace-pre-wrap">{sessionData.expected_solution}</pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - Chat & Hints */}
        <div className="space-y-6 flex flex-col">
          {/* Live Chat */}
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col min-h-[500px] overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 flex flex-col gap-3">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <MessageSquare className={`w-4 h-4 ${style.accentText}`} /> Neural Link: Chat
              </h2>
              <div className="flex flex-wrap gap-2">
                {sessionData.members.map((member) => {
                  const isMe = isMyMember(member.student_id);
                  return (
                    <div
                      key={member.student_id}
                      className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                        isMe
                          ? `${style.accentBg} ${style.accentBorder} ${style.accentText}`
                          : "bg-white/5 border border-white/10 text-white/40"
                      }`}
                    >
                      <span className={`relative flex h-1.5 w-1.5 ${isMe ? "" : "opacity-40"}`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isMe ? `${style.accentText.replace("text", "bg")} opacity-75` : ""}`}></span>
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isMe ? (style.accent === "teal" ? "bg-teal-500" : "bg-amber-500") : "bg-white/20"}`}></span>
                      </span>
                      {isMe ? "YOU" : member.student_id.slice(0, 6)}
                      <span className="text-[8px] text-white/30 normal-case">{member.role.slice(0, 3)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 flex-1 overflow-auto space-y-6 bg-black/10">
              {chatMessages.length === 0 && (
                <div className="text-center text-xs text-white/30 my-4 font-medium uppercase tracking-wider">
                  {wsConnected ? "Connected. Start chatting!" : "Connecting..."}
                </div>
              )}
              {chatMessages.map((msg, idx) => {
                if (msg.type === "system") {
                  return (
                    <div key={idx} className="text-center">
                      <span className="text-[10px] text-white/20 italic">{msg.message}</span>
                    </div>
                  );
                }
                return (
                  <div key={idx} className={`space-y-1.5 ${isMyMessage(msg) ? "bg-teal-500/5 p-3 rounded-xl border border-teal-500/10" : ""}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest block ${
                      isMyMessage(msg) ? "text-teal-400" : "text-white/40"
                    }`}>
                      {isMyMessage(msg) ? `You (${msg.role}):` : `${msg.from.slice(0, 8)} (${msg.role}):`}
                    </span>
                    <p className={`text-sm leading-relaxed ${
                      isMyMessage(msg) ? "text-teal-100/90 font-bold italic" : "text-white/80 font-medium"
                    }`}>
                      {msg.message}
                    </p>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-[#0F172A]/80 shadow-2xl">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder={wsConnected ? "Type your message..." : "Waiting for connection..."}
                  disabled={!wsConnected}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/50 transition-all disabled:opacity-50"
                />
                <Button
                  size="icon"
                  onClick={sendChatMessage}
                  disabled={!wsConnected || !chatInput.trim()}
                  className={`${style.accent === "teal" ? "bg-teal-600 hover:bg-teal-500" : "bg-[#B45309] hover:bg-[#B45309]/80"} text-white shrink-0 rounded-xl border-none shadow-lg h-10 w-10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hints & Task Progress */}
          <div className="space-y-6">
            <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-[#334155]/40 transition-colors shadow-xl">
              <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#B45309]" /> Operational Guidance
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {hintsRevealed > 0 && (
                  <Button variant="outline" className="w-full justify-start text-left text-sm bg-[#B45309]/10 border-[#B45309]/30 text-[#B45309] hover:bg-[#B45309]/20 h-auto py-4 px-5 rounded-2xl transition-all shadow-inner border">
                    <div className="leading-snug">
                      <span className="font-black block mb-1 text-[10px] uppercase tracking-widest opacity-70">[Hint Level {hintsRevealed}]</span>
                      {hintsRevealed === 1 && "Break down the problem: identify the key components needed."}
                      {hintsRevealed === 2 && "Consider edge cases and boundary conditions in your solution."}
                      {hintsRevealed === 3 && "Review the expected output format and ensure correctness."}
                    </div>
                  </Button>
                )}
                {hintsRevealed < MAX_HINTS && Array.from({ length: MAX_HINTS - hintsRevealed }).map((_, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    disabled
                    className="w-full justify-start text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/5 text-white/20 h-auto py-3 px-5 rounded-xl cursor-not-allowed"
                  >
                    Unlock Level {hintsRevealed + i + 1}: {i === 0 ? "Initial Analysis" : i === 1 ? "Edge Cases" : "Final Review"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6 hover:bg-[#334155]/40 transition-colors shadow-xl">
              <h2 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">
                {sessionData.activity_type === "mini_project" ? "Operational Evolution" : "Task Evolution"}
              </h2>
              <div className="space-y-4">
                {PHASES.map((phase, idx) => (
                  <div
                    key={phase.key}
                    className={`flex items-center gap-3 ${
                      idx < currentPhase ? "opacity-40" :
                      idx === currentPhase ? `${style.accentBg} p-3 rounded-xl border ${style.accentBorder} shadow-inner` :
                      "px-3"
                    }`}
                  >
                    {idx < currentPhase ? (
                      <CheckCircle2 className={`w-4 h-4 ${style.accentText}`} />
                    ) : idx === currentPhase ? (
                      <div className="w-4 h-4 rounded-full border-2 border-teal-400 border-t-transparent animate-spin"></div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-white/10 rounded"></div>
                    )}
                    <span className={`text-xs font-bold tracking-tight uppercase ${
                      idx === currentPhase ? `${style.accentText}` : "text-white/30"
                    }`}>
                      Phase {idx + 1}: {phase.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Score Submission */}
              {!showScoreForm && !scoreResult && (
                <div className="mt-6 pt-4 border-t border-white/5">
                  <Button
                    onClick={() => setShowScoreForm(true)}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-widest rounded-xl h-11"
                  >
                    <Award className="w-4 h-4 mr-2" /> SUBMIT SCORES
                  </Button>
                </div>
              )}

              {showScoreForm && (
                <div className="mt-6 pt-4 border-t border-white/5 space-y-4 animate-slide-up">
                  <h3 className="text-xs font-black text-white/50 uppercase tracking-widest">Rate Your Performance</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider block mb-1">Task Completion: {taskScore}%</label>
                      <input type="range" min="0" max="100" value={taskScore} onChange={(e) => setTaskScore(Number(e.target.value))}
                        className="w-full accent-teal-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider block mb-1">Collaboration: {collabScore}%</label>
                      <input type="range" min="0" max="100" value={collabScore} onChange={(e) => setCollabScore(Number(e.target.value))}
                        className="w-full accent-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider block mb-1">Communication: {commScore}%</label>
                      <input type="range" min="0" max="100" value={commScore} onChange={(e) => setCommScore(Number(e.target.value))}
                        className="w-full accent-purple-500" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSubmitScores}
                      disabled={submittingScore}
                      className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl h-11 text-xs"
                    >
                      {submittingScore ? "SUBMITTING..." : "CONFIRM"}
                    </Button>
                    <Button
                      onClick={() => setShowScoreForm(false)}
                      variant="outline"
                      className="flex-1 border-white/10 hover:bg-white/5 rounded-xl h-11 text-white text-xs"
                    >
                      CANCEL
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bug Report Overlay (debugging) */}
      {showBugReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-brand-tertiary border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(180,83,9,0.2)] overflow-hidden">
            <div className="border-b border-white/5 p-5 bg-[#0F172A]/80 flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-2 text-[#B45309] uppercase tracking-tighter">
                <ShieldAlert className="w-5 h-5" /> Submit Neural Audit
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Bug Coordinate (Line):</label>
                <input type="text" placeholder="e.g. 14" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#B45309]/50 focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Diagnostic Description:</label>
                <textarea rows={2} placeholder="Explain the anomaly..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:border-[#B45309]/50 focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Suggested Fix Matrix:</label>
                <textarea rows={2} placeholder="Code to resolve bug..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:border-[#B45309]/50 focus:outline-none transition-all" />
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={() => { setShowBugReport(false); sendRoleAction("bug_report", "Bug reported"); }} className="flex-1 bg-[#B45309] hover:bg-[#B45309]/80 text-white font-black rounded-xl h-12 shadow-lg transition-all active:scale-95">
                  CONFIRM REPORT
                </Button>
                <Button onClick={() => setShowBugReport(false)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5 rounded-xl h-12 text-white font-bold">
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Complete Overlay (mini_project) */}
      {showMarkComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-brand-tertiary border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(13,148,136,0.2)] overflow-hidden">
            <div className="border-b border-white/5 p-5 bg-[#0F172A]/80 flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-2 text-teal-400 uppercase tracking-tighter">
                <CheckCircle2 className="w-5 h-5" /> Deploy Feature Module
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Target Feature:</span>
                <p className="font-black text-white">{sessionData.topic_name}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Source Code Audit:</span>
                <div className="p-4 font-mono text-xs bg-black text-gray-400 rounded-xl border border-white/5 max-h-[150px] overflow-auto leading-relaxed shadow-inner">
                  {code || "// No code submitted"}
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button onClick={() => { setShowMarkComplete(false); setCurrentPhase(prev => Math.min(prev + 1, 2)); sendRoleAction("feature_complete", "Feature marked complete"); }}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl h-12 shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest">
                  CONFIRM DEPLOYMENT
                </Button>
                <Button onClick={() => setShowMarkComplete(false)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5 rounded-xl h-12 text-white font-bold text-xs uppercase tracking-widest">
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

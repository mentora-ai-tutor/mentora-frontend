"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, CheckCircle2, AlertCircle, MessageSquare, Users, Wifi, WifiOff, Monitor, MonitorOff, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { peerLearningApi } from "@/lib/api/peerLearning";

interface ChatMessage {
  type: string;
  from: string;
  role: string;
  message: string;
  timestamp: string;
}

interface Participant {
  student_id: string;
  role: string;
  is_online: boolean;
  joined_at?: string;
}

export default function PairSessionPage() {
  const searchParams = useSearchParams();

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [error, setError] = useState("");

  // Live room state
  const [sessionId, setSessionId] = useState<string | null>(searchParams.get("sessionId"));
  const [myRole, setMyRole] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [myStudentId, setMyStudentId] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [sharerId, setSharerId] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const totalQuestions = 5;

  const scrollChatToBottom = useCallback(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  // Get student ID from token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setMyStudentId(payload.student_id || payload.id);
      } catch {}
    }
  }, []);

  // Resolve session if not provided
  useEffect(() => {
    if (sessionId) return;
    const resolveSession = async () => {
      const room = await peerLearningApi.getMyLiveRoom();
      if (room?.session_id) {
        setSessionId(room.session_id);
      }
    };
    resolveSession();
  }, [sessionId]);

  // Check session readiness
  useEffect(() => {
    if (!sessionId) return;
    const checkReady = async () => {
      const ready = await peerLearningApi.getSessionReady(sessionId);
      if (!ready) return;
      if (ready.ready) {
        setSessionReady(true);
      } else if (ready.remaining_seconds) {
        setCountdown(ready.remaining_seconds);
      }
    };
    checkReady();
  }, [sessionId]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          setSessionReady(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Poll readiness during countdown to detect early activation by teacher
  useEffect(() => {
    if (!sessionId || sessionReady) return;
    const interval = setInterval(async () => {
      try {
        const ready = await peerLearningApi.getSessionReady(sessionId);
        if (ready?.ready) {
          setSessionReady(true);
          setCountdown(null);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [sessionId, sessionReady]);

  // Connect live room WebSocket
  useEffect(() => {
    if (!sessionId || !sessionReady) return;

    const onMessage = (data: any) => {
      switch (data.type) {
        case "welcome":
          if (data.role) setMyRole(data.role);
          break;
        case "chat":
          setChatMessages(prev => [...prev, data]);
          scrollChatToBottom();
          break;
        case "user_joined":
          setParticipants(prev => {
            const exists = prev.find(p => p.student_id === data.student_id);
            if (exists) return prev.map(p => p.student_id === data.student_id ? { ...p, is_online: true } : p);
            return [...prev, { student_id: data.student_id, role: data.role, is_online: true }];
          });
          break;
        case "user_left":
          setParticipants(prev => prev.map(p => p.student_id === data.student_id ? { ...p, is_online: false } : p));
          break;
        case "presence":
          setParticipants(prev => prev.map(p => p.student_id === data.student_id ? { ...p, is_online: data.status === "online" } : p));
          break;
        case "screen_share":
          if (data.signal_type === "started") {
            setScreenShareActive(true);
            setSharerId(data.from);
          } else if (data.signal_type === "stopped") {
            setScreenShareActive(false);
            setSharerId(null);
          } else if (data.signal_type === "offer") {
            handleScreenShareOffer(data);
          } else if (data.signal_type === "answer") {
            handleScreenShareAnswer(data);
          } else if (data.signal_type === "ice_candidate") {
            handleIceCandidate(data);
          }
          break;
        case "session_action":
          if (data.action === "question_started" && data.payload) {
            setCurrentQuestion(data.payload.question);
            setQuestionsAsked(data.payload.questions_asked);
          } else if (data.action === "answer_submitted" && data.payload) {
            setQuestionsAsked(data.payload.questions_asked);
            setFeedback(data.payload.feedback);
          }
          break;
        case "pong":
          break;
      }
    };

    const onOpen = () => setWsConnected(true);
    const onClose = (code?: number, reason?: string) => {
      setWsConnected(false);
      if (code === 4006) {
        setError(`Session not ready: ${reason || "Please wait"}`);
      }
    };

    const ws = peerLearningApi.connectLiveRoomWebSocket(sessionId, onMessage, onOpen, onClose);
    wsRef.current = ws;

    // Fetch room members
    peerLearningApi.getLiveRoomMembers(sessionId).then(m => {
      if (m?.participants) setParticipants(m.participants);
    });

    // Check screen share state
    peerLearningApi.getScreenShareState(sessionId).then(s => {
      if (s?.is_sharing) {
        setScreenShareActive(true);
        setSharerId(s.sharer_id);
      }
    });

    return () => {
      if (ws) ws.close();
      if (sessionId) peerLearningApi.leaveLiveRoom(sessionId);
      stopScreenShare();
    };
  }, [sessionId, sessionReady, scrollChatToBottom]);

  // WebRTC screen share handlers
  const handleScreenShareOffer = async (data: any) => {
    if (!wsRef.current) return;
    setVideoPlaying(false);
    streamRef.current = null;
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcRef.current = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        wsRef.current?.send(JSON.stringify({
          type: "screen_share",
          signal_type: "ice_candidate",
          signal_data: e.candidate.toJSON(),
          target_student_id: data.from,
        }));
      }
    };

    pc.ontrack = (e) => {
      streamRef.current = e.streams[0];
      if (videoRef.current) {
        videoRef.current.srcObject = e.streams[0];
      }
    };

    try {
      const desc = new RTCSessionDescription(JSON.parse(data.signal_data));
      await pc.setRemoteDescription(desc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      wsRef.current.send(JSON.stringify({
        type: "screen_share",
        signal_type: "answer",
        signal_data: JSON.stringify(pc.localDescription),
        target_student_id: data.from,
      }));
    } catch {}
  };

  const handleScreenShareAnswer = async (data: any) => {
    if (!pcRef.current) return;
    try {
      const desc = new RTCSessionDescription(JSON.parse(data.signal_data));
      await pcRef.current.setRemoteDescription(desc);
    } catch {}
  };

  const handleIceCandidate = async (data: any) => {
    if (!pcRef.current) return;
    try {
      await pcRef.current.addIceCandidate(new RTCIceCandidate(JSON.parse(data.signal_data)));
    } catch {}
  };

  const startScreenShare = async () => {
    if (!wsRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      mediaStreamRef.current = stream;

      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      pcRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          wsRef.current?.send(JSON.stringify({
            type: "screen_share",
            signal_type: "ice_candidate",
            signal_data: e.candidate.toJSON(),
          }));
        }
      };

      stream.getVideoTracks()[0].onended = () => stopScreenShare();

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      wsRef.current.send(JSON.stringify({
        type: "screen_share",
        signal_type: "offer",
        signal_data: JSON.stringify(pc.localDescription),
      }));

      wsRef.current.send(JSON.stringify({
        type: "screen_share",
        signal_type: "started",
      }));

      setIsSharing(true);
    } catch {
      // User cancelled screen share
    }
  };

  const stopScreenShare = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setIsSharing(false);
    wsRef.current?.send(JSON.stringify({ type: "screen_share", signal_type: "stopped" }));
  };

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

  const handleStartQuestion = async () => {
    setLoading(true);
    setError("");
    setFeedback(null);

    const result = await peerLearningApi.startQuestion();
    if (result.question_id || result.question_text) {
      setCurrentQuestion(result);
      setQuestionsAsked(1);
      setAnswer("");
      if (result.session_id) setSessionId(result.session_id);
      wsRef.current?.send(JSON.stringify({
        type: "session_action",
        action: "question_started",
        payload: { question: result, questions_asked: 1 },
      }));
    } else {
      setError(result.detail || result.error || "Failed to start question");
    }
    setLoading(false);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setError("");

    const result = await peerLearningApi.submitAnswer(answer);
    if (result.is_correct !== undefined) {
      setFeedback(result);
      if (result.questions_asked) setQuestionsAsked(result.questions_asked);
      if (result.performance) setSessionResult(result.performance);
      wsRef.current?.send(JSON.stringify({
        type: "session_action",
        action: "answer_submitted",
        payload: {
          is_correct: result.is_correct,
          questions_asked: result.questions_asked,
          feedback: result,
        },
      }));
    } else {
      setError(result.detail || result.error || JSON.stringify(result));
    }
    setLoading(false);
  };

  const handleNextQuestion = async () => {
    if (feedback?.performance) setSessionResult(feedback.performance);
    setFeedback(null);
    setError("");
    setLoading(true);

    if (questionsAsked >= totalQuestions) {
      setSessionFinished(true);
      setLoading(false);
      return;
    }

    const result = await peerLearningApi.startQuestion();
    if (result.question_id || result.question_text) {
      setCurrentQuestion(result);
      setQuestionsAsked(prev => prev + 1);
      setAnswer("");
      wsRef.current?.send(JSON.stringify({
        type: "session_action",
        action: "question_started",
        payload: { question: result, questions_asked: questionsAsked + 1 },
      }));
    } else {
      if (result.error === "No active question" || questionsAsked >= totalQuestions) {
        setSessionFinished(true);
      } else {
        setError(result.detail || result.error || "Failed to load next question");
      }
    }
    setLoading(false);
  };

  const isMyMessage = (msg: ChatMessage) => msg.from === myStudentId;

  // Countdown view
  if (countdown !== null && countdown > 0 && !sessionReady) {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[#334155]/30 border border-white/10 rounded-3xl p-12 text-center max-w-md">
          <Clock className="w-16 h-16 text-teal-400 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-white mb-2">Session Scheduled</h1>
          <p className="text-white/60 mb-8">Your session starts in:</p>
          <div className="text-6xl font-black text-teal-400 mb-8 font-mono tracking-widest">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
          <p className="text-xs text-white/40">The quiz will be available and the live room will open at the scheduled time.</p>
        </div>
      </div>
    );
  }

  // Session finished view
  if (sessionFinished) {
    const sr = sessionResult || feedback?.performance || {};
    const bloomBefore = sr.bloom_level_before ?? feedback?.bloom_level_before ?? "—";
    const bloomAfter = sr.bloom_level_after ?? feedback?.bloom_level_after ?? "—";
    const masteryBefore = sr.previous_mastery_score ?? "—";
    const masteryAfter = sr.current_mastery_score ?? feedback?.current_mastery_score ?? "—";
    const improvement = sr.score_improvement ?? (masteryAfter !== "—" && masteryBefore !== "—" ? (masteryAfter - masteryBefore).toFixed(1) : null);
    const outcome = sr.learner_outcome || "—";
    const teacherScore = sr.teacher_score ?? "—";

    return (
      <div className="space-y-6 animate-slide-up pb-8 text-white">
        <div className="bg-[#334155]/30 border border-teal-500/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-16 h-16 text-teal-400 mx-auto mb-4" />
            <h1 className="text-3xl font-black text-white mb-2">Session Complete!</h1>
            <p className="text-white/60">You have completed all {totalQuestions} questions.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0F172A]/50 rounded-xl p-4 text-center border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Bloom Level Before</p>
              <p className="text-2xl font-black text-teal-400">{bloomBefore}</p>
            </div>
            <div className="bg-[#0F172A]/50 rounded-xl p-4 text-center border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Bloom Level After</p>
              <p className="text-2xl font-black text-teal-400">{bloomAfter}</p>
            </div>
            <div className="bg-[#0F172A]/50 rounded-xl p-4 text-center border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Mastery Before</p>
              <p className="text-2xl font-black text-white">{masteryBefore}{masteryBefore !== "—" ? "%" : ""}</p>
            </div>
            <div className="bg-[#0F172A]/50 rounded-xl p-4 text-center border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Mastery After</p>
              <p className="text-2xl font-black text-teal-400">{masteryAfter}{masteryAfter !== "—" ? "%" : ""}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {improvement !== null && (
              <div className="bg-[#0F172A]/50 rounded-xl px-6 py-3 text-center border border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Score Improvement</p>
                <p className={`text-xl font-black ${Number(improvement) >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                  {Number(improvement) >= 0 ? "+" : ""}{improvement}%
                </p>
              </div>
            )}
            <div className="bg-[#0F172A]/50 rounded-xl px-6 py-3 text-center border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Outcome</p>
              <p className="text-xl font-black text-teal-400">{outcome}</p>
            </div>
            {teacherScore !== "—" && (
              <div className="bg-[#0F172A]/50 rounded-xl px-6 py-3 text-center border border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Teacher Score</p>
                <p className="text-xl font-black text-amber-400">{teacherScore}%</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/peer-learning">
              <Button className="bg-teal-600 hover:bg-teal-500 text-white">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-black text-teal-400">COLLABORATIVE TUTORING SESSION</h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1">
            <span>
              {myRole === "teacher" ? "TEACHER" : "LEARNER"}
              {myRole === "teacher" ? " (monitoring)" : ""}
            </span>
            <span>Question: {questionsAsked + (currentQuestion && !feedback ? 1 : 0)} of {totalQuestions}</span>
            {sessionId && <span>Session: {sessionId.slice(0, 8)}...</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {wsConnected ? (
            <span className="flex items-center gap-1.5 text-xs text-teal-400 font-bold">
              <Wifi className="w-3.5 h-3.5" /> Live
            </span>
          ) : sessionId ? (
            <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
              <WifiOff className="w-3.5 h-3.5" /> Reconnecting...
            </span>
          ) : null}
          {myRole === "learner" && (
            <Button
              onClick={isSharing ? stopScreenShare : startScreenShare}
              size="sm"
              className={`text-xs ${isSharing ? 'bg-red-600 hover:bg-red-500' : 'bg-teal-600 hover:bg-teal-500'} text-white`}
            >
              {isSharing ? <MonitorOff className="w-3.5 h-3.5 mr-1" /> : <Monitor className="w-3.5 h-3.5 mr-1" />}
              {isSharing ? "Stop Share" : "Share Screen"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Screen share viewer (teacher sees learner's screen) */}
          {screenShareActive && myRole === "teacher" && (
            <div className="bg-[#0F172A] border border-teal-500/20 rounded-2xl overflow-hidden">
              <div className="p-2 bg-[#0F172A]/80 border-b border-white/5 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-teal-400">Live Screen — {sharerId ? sharerId.slice(0, 8) : "Learner"}</span>
              </div>
              <div className="relative">
                {!videoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-white/60">Connecting to screen share...</span>
                    </div>
                  </div>
                )}
                <video ref={(el) => { videoRef.current = el; if (el && streamRef.current && !el.srcObject) el.srcObject = streamRef.current; }} autoPlay playsInline onPlaying={() => setVideoPlaying(true)} className="w-full h-auto max-h-[400px] bg-black" />
              </div>
            </div>
          )}

          {!currentQuestion ? (
            <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-8 text-center">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-[3px] border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/60">Generating your first question...</p>
                </div>
              ) : (
                <>
                  {myRole === "teacher" ? (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-4">Monitoring Mode</h2>
                      <p className="text-white/60 mb-6">You are connected as the teacher. You can see the learner's screen and chat with them. The learner will start the quiz when ready.</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
                      <p className="text-white/60 mb-6">Click the button below to generate your first question.</p>
                      <Button
                        onClick={handleStartQuestion}
                        disabled={loading}
                        className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-lg"
                      >
                        {loading ? "Generating..." : <><Play className="w-5 h-5 mr-2" /> START QUESTION</>}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {/* Question (learner only) */}
              {myRole !== "teacher" && (
                <>
                  <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-5">
                      <h2 className="font-bold text-lg mb-2">QUESTION {questionsAsked}:</h2>
                      <div className="text-sm text-white/80 mb-4 leading-relaxed">
                        <p>{currentQuestion.question_text || currentQuestion.question}</p>

                      </div>
                    </div>
                  </div>

                  {(!feedback || (feedback && !feedback.is_correct)) && (
                    <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col">
                      <div className="p-3 border-b border-white/5 bg-[#0F172A]/80">
                        <h2 className="font-bold text-sm">YOUR ANSWER:</h2>
                      </div>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="flex-1 p-4 bg-[#0F172A] text-white text-sm font-mono placeholder:text-white/30 focus:outline-none resize-none border-none"
                        rows={8}
                      />
                      <div className="p-3 border-t border-white/5 bg-[#0F172A]/80 flex gap-2">
                        <Button onClick={handleSubmitAnswer} disabled={loading || !answer.trim()} className="bg-teal-600 hover:bg-teal-500 text-white">
                          <Send className="w-4 h-4 mr-2" />
                          {loading ? "Submitting..." : "SUBMIT ANSWER"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {feedback && (
                    <div className={`bg-[#334155]/30 border rounded-2xl overflow-hidden ${feedback.is_correct ? 'border-teal-500/20' : 'border-red-500/20'}`}>
                      <div className="p-4">
                        <div className={`flex items-center gap-2 mb-2 ${feedback.is_correct ? 'text-teal-400' : 'text-red-400'}`}>
                          {feedback.is_correct ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                          <span className="font-bold">{feedback.is_correct ? "Correct!" : "Incorrect"}</span>
                        </div>
                        {feedback.feedback && <p className="text-sm text-white/70">{feedback.feedback}</p>}
                        {feedback.current_mastery_score && <p className="text-xs text-white/50 mt-2">Current Mastery: {feedback.current_mastery_score}%</p>}
                        <Button onClick={handleNextQuestion} disabled={loading} className="mt-4 bg-teal-600 hover:bg-teal-500 text-white">
                          {loading ? "Loading..." : (questionsAsked >= totalQuestions ? "Finish Session" : "NEXT QUESTION")}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {myRole === "teacher" && (
                <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-6 text-center flex-1 flex flex-col items-center justify-center">
                  <Monitor className="w-12 h-12 text-teal-400 mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">Watching Learner's Progress</h2>
                  <p className="text-white/60">The learner is on question {questionsAsked}. Their screen is shared below so you can guide them.</p>
                  {currentQuestion?.question_text && (
                    <div className="mt-4 bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 text-left max-w-lg">
                      <p className="text-xs font-bold text-white/40 mb-1 uppercase">Current Question:</p>
                      <p className="text-sm text-white/80">{currentQuestion.question_text}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400">
              <p className="font-bold">Error:</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - LIVE CHAT */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> LIVE CHAT
              </h2>
              <div className="flex items-center gap-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs text-white/60" title={`${p.student_id.slice(0, 8)} (${p.role})`}>
                    <span className={`relative flex h-2 w-2 ${!p.is_online ? 'opacity-40' : ''}`}>
                      <span className={`absolute inline-flex h-full w-full rounded-full ${p.is_online ? 'animate-ping bg-teal-400 opacity-75' : ''}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${p.is_online ? 'bg-teal-500' : 'bg-gray-500'}`}></span>
                    </span>
                    {p.role === "teacher" ? <Users className="w-3 h-3" /> : <span className="w-3 h-3 flex items-center justify-center text-[8px] font-bold">L</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto space-y-3 p-4 bg-black/10">
              {chatMessages.length === 0 && (
                <div className="text-center text-xs text-white/30 my-4 font-medium uppercase tracking-wider">
                  {wsConnected ? "Connected. Start chatting!" : "Connecting..."}
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${isMyMessage(msg) ? 'bg-teal-600/30 border border-teal-500/20 rounded-tr-md' : 'bg-[#0F172A]/80 border border-white/5 rounded-tl-md'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isMyMessage(msg) ? 'text-teal-300' : 'text-white/40'}`}>
                        {isMyMessage(msg) ? 'You' : `${msg.role} (${msg.from.slice(0, 6)})`}
                      </span>
                      <span className="text-[9px] text-white/30">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-white/5 bg-[#0F172A]/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder={wsConnected ? "Type your message..." : "Waiting for connection..."}
                  disabled={!wsConnected}
                  className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 disabled:opacity-50"
                />
                <Button
                  size="icon"
                  onClick={sendChatMessage}
                  disabled={!wsConnected || !chatInput.trim()}
                  className="bg-teal-600 hover:bg-teal-500 text-white shrink-0 rounded-xl border-none disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

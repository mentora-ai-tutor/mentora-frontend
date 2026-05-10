"use client";

import { useState } from "react";
import { Clock, Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { peerLearningApi } from "@/lib/api/peerLearning";

export default function PairSessionPage() {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const totalQuestions = 5;

  const handleStartQuestion = async () => {
    setLoading(true);
    setError("");
    setFeedback(null);
    
    const result = await peerLearningApi.startQuestion();
    console.log("Start question result:", result);
    
    if (result.question_id || result.question_text) {
      setCurrentQuestion(result);
      setQuestionsAsked(1); // Reset to 1 for first question
      setAnswer("");
      if (result.session_id) setSessionId(result.session_id);
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
    console.log("Submit answer result:", result);
    
    if (result.is_correct !== undefined) {
      setFeedback(result);
      // Update questions asked from backend response
      if (result.questions_asked) {
        setQuestionsAsked(result.questions_asked);
      }
    } else {
      setError(result.detail || result.error || JSON.stringify(result));
    }
    setLoading(false);
  };

  const handleNextQuestion = async () => {
    setFeedback(null);
    setError("");
    setLoading(true);
    
    // Check if we've reached 5 questions
    if (questionsAsked >= totalQuestions) {
      setSessionFinished(true);
      setLoading(false);
      return;
    }
    
    const result = await peerLearningApi.startQuestion();
    console.log("Next question result:", result);
    
    if (result.question_id || result.question_text) {
      setCurrentQuestion(result);
      setQuestionsAsked(prev => prev + 1);
      setAnswer("");
    } else {
      // If backend says no more questions or session complete
      if (result.error === "No active question" || questionsAsked >= totalQuestions) {
        setSessionFinished(true);
      } else {
        setError(result.detail || result.error || "Failed to load next question");
      }
    }
    setLoading(false);
  };

  if (sessionFinished) {
    return (
      <div className="space-y-6 animate-slide-up pb-8 text-white">
        <div className="bg-[#334155]/30 border border-teal-500/30 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-teal-400 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white mb-2">Session Complete!</h1>
          <p className="text-white/60 mb-6">You have completed all {totalQuestions} questions.</p>
          <Link href="/peer-learning">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#334155]/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-black text-teal-400">PAIR SESSION</h1>
          <div className="flex gap-4 text-sm text-white/60 mt-1">
            <span>Question: {questionsAsked + (currentQuestion && !feedback ? 1 : 0)} of {totalQuestions}</span>
            {sessionId && <span>Session: {sessionId.slice(0, 8)}...</span>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* LEFT PANEL */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {!currentQuestion ? (
            <div className="bg-[#334155]/30 border border-white/5 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
              <p className="text-white/60 mb-6">Click the button below to generate your first question.</p>
              <Button
                onClick={handleStartQuestion}
                disabled={loading}
                className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-lg"
              >
                {loading ? "Generating..." : "START QUESTION"}
              </Button>
            </div>
          ) : (
            <>
              {/* Question */}
              <div className="bg-[#334155]/30 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-5">
                  <h2 className="font-bold text-lg mb-2">QUESTION {questionsAsked}:</h2>
                  <div className="text-sm text-white/80 mb-4 leading-relaxed">
                    <p>{currentQuestion.question_text || currentQuestion.question}</p>
                    {currentQuestion.expected_answer && (
                      <div className="mt-4 bg-[#0F172A]/50 p-3 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold text-white/50 mb-2 uppercase">Expected Answer:</h3>
                        <pre className="text-xs font-mono text-teal-300 whitespace-pre-wrap">{currentQuestion.expected_answer}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Answer Input - only show if no feedback yet or answer was incorrect */}
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
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={loading || !answer.trim()}
                      className="bg-teal-600 hover:bg-teal-500 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {loading ? "Submitting..." : "SUBMIT ANSWER"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className={`bg-[#334155]/30 border rounded-2xl overflow-hidden ${
                  feedback.is_correct ? 'border-teal-500/20' : 'border-red-500/20'
                }`}>
                  <div className="p-4">
                    <div className={`flex items-center gap-2 mb-2 ${
                      feedback.is_correct ? 'text-teal-400' : 'text-red-400'
                    }`}>
                      {feedback.is_correct ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span className="font-bold">
                        {feedback.is_correct ? "Correct!" : "Incorrect"}
                      </span>
                    </div>
                    {feedback.feedback && (
                      <p className="text-sm text-white/70">{feedback.feedback}</p>
                    )}
                    {feedback.current_mastery_score && (
                      <p className="text-xs text-white/50 mt-2">Current Mastery: {feedback.current_mastery_score}%</p>
                    )}
                    
                    {/* Next Question Button */}
                    <Button
                      onClick={handleNextQuestion}
                      disabled={loading}
                      className="mt-4 bg-teal-600 hover:bg-teal-500 text-white"
                    >
                      {loading ? "Loading..." : (questionsAsked >= totalQuestions ? "Finish Session" : "NEXT QUESTION")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400">
                  <p className="font-bold">Error:</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT PANEL - CHAT */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-[#334155]/30 border border-white/5 rounded-2xl flex-1 flex flex-col h-[500px] overflow-hidden">
            <div className="p-3 border-b border-white/5 bg-[#0F172A]/80 flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> LIVE CHAT
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span> Teacher Online
              </div>
            </div>
            <div className="p-4 flex-1 overflow-auto space-y-4">
              <div className="text-center text-xs text-white/30 my-4 font-medium uppercase tracking-wider">Session started</div>
            </div>
            <div className="p-3 border-t border-white/5 bg-[#0F172A]/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50"
                />
                <Button size="icon" className="bg-teal-600 hover:bg-teal-500 text-white shrink-0 rounded-xl border-none">
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

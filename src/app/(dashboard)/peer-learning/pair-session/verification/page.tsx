"use client";

import { Clock, Play, Send, ShieldAlert, CheckCircle2, Lock, Terminal, MessageSquare, Target, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function VerificationPage() {
  return (
    <div className="space-y-6 animate-slide-up pb-12 text-white h-full flex flex-col font-sans">
      {/* HEADER - ALERT STATUS */}
      <div className="flex flex-col md:flex-row justify-between gap-6 bg-[#B45309]/10 p-6 rounded-[32px] border border-[#B45309]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B45309]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="bg-[#B45309]/20 p-3 rounded-2xl border border-[#B45309]/30">
            <ShieldAlert className="w-8 h-8 text-[#B45309] shrink-0" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-black text-[#B45309] uppercase tracking-[0.2em] bg-[#B45309]/10 px-2 py-0.5 rounded border border-[#B45309]/20">Phase: Secure Verification</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Audit Session - Independent Logic</h1>
            <p className="text-[11px] font-bold text-[#B45309]/70 mt-2 uppercase tracking-wide leading-relaxed">
              ⚠️ Neural Link Restricted: Teacher guidance is disabled during this unit ⚠️<br />
              <span className="text-white/40">Protocol: Verify individual comprehension via isolated problem-solving.</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#0F172A]/40 px-5 py-3 rounded-2xl border border-white/5 self-center md:self-auto h-fit shadow-inner">
          <Clock className="w-5 h-5 text-[#B45309] animate-pulse" />
          <span className="text-2xl font-bold font-mono text-[#B45309]">03:45</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1">
        {/* LEFT PANEL - QUESTION & EDITOR */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          {/* Question */}
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:bg-[#334155]/40 transition-all">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#B45309]" /> Verification Vector
              </h2>
            </div>
            <CardContent className="p-8">
              <p className="text-sm md:text-base font-bold text-white leading-relaxed mb-6">
                Develop a <span className="text-[#B45309]">for loop sequence</span> that generates all odd numerical values within the range [1, 15] inclusive.
              </p>
              <div className="bg-black p-5 rounded-2xl border border-white/5 inline-block w-full max-w-sm shadow-inner group">
                <h3 className="text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest group-hover:text-teal-400 transition-colors">Target Telemetry Output:</h3>
                <pre className="text-xs font-mono text-teal-400 font-black leading-relaxed">1\n3\n5\n7\n9\n11\n13\n15</pre>
              </div>
            </CardContent>
          </div>

          {/* Code Editor */}
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#B45309]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0F172A]/80 px-8">
              <h2 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" /> Isolated Script Editor
              </h2>
              <div className="flex gap-4">
                <Button size="sm" variant="outline" className="h-9 px-4 text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
                  <Play className="w-3 h-3 mr-2 text-teal-400" /> RUN LOGIC
                </Button>
                <Link href="/peer-learning/pair-session/performance">
                  <Button size="sm" className="h-9 px-4 text-xs bg-[#B45309] hover:bg-[#B45309]/80 text-white font-black rounded-xl shadow-[0_0_15px_rgba(180,83,9,0.3)] transition-all">
                    SUBMIT VERIFICATION
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-8 flex-1 font-mono text-sm bg-black text-gray-400 overflow-auto leading-relaxed">
              <div className="text-teal-400 font-bold inline opacity-80">public class</div> <div className="text-white inline">OddNumbers</div> {"{\n"}
              {"  "}<div className="text-teal-400 inline font-bold opacity-80">public static void</div> <div className="text-[#B45309] inline font-bold">main</div>(String[] args) {"{\n"}
              {"    "}<div className="text-teal-400 inline font-bold">for</div>(<div className="text-teal-400 inline">int</div> i = 1; i {"<="} 15; i = i + 2) {"{\n"}
              {"      "}System.out.println(i);\n
              {"    }\n"}
              {"  }\n"}
              {"}"}
            </div>
          </div>

          {/* Output Console */}
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 flex justify-between items-center px-8">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Diagnostic Output</h3>
                <span className="text-[10px] font-black text-[#B45309] uppercase tracking-widest bg-[#B45309]/10 px-2 py-0.5 rounded border border-[#B45309]/20">Attempts: 2 / 3</span>
              </div>
              <div className="p-8 font-mono text-xs space-y-2 bg-black">
                <p className="text-white/30 italic">{">"} Initializing OddNumbers sequence...</p>
                <p className="font-bold text-white tracking-tight leading-relaxed">1\n3\n5\n7\n9\n11\n13\n15</p>
                <p className="text-white/30 italic">{">"} Sequence finalized.</p>
                <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl flex items-center gap-3 shadow-inner">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px]">Verification Logic Stabilized - All Tests Passed</span>
                </div>
              </div>
            </CardContent>
          </div>
        </div>

        {/* RIGHT PANEL - CHAT DISABLED */}
        <div className="space-y-8 flex flex-col">
          {/* Live Chat */}
          <div className="bg-[#334155]/30 border border-white/10 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-[#0F172A]/80 flex items-center justify-between px-6">
              <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" /> Neural Link: Comm
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
                <span className="text-[10px] font-black text-[#B45309] uppercase tracking-tighter">Encrypted</span>
              </div>
            </div>

            <div className="p-8 flex-1 overflow-auto flex items-center justify-center relative bg-black/10">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-10 rounded-[32px]">
                <div className="bg-[#B45309]/10 p-5 rounded-full border border-[#B45309]/20 mb-6 shadow-[0_0_30px_rgba(180,83,9,0.1)]">
                  <Lock className="w-10 h-10 text-[#B45309] opacity-80" />
                </div>
                <p className="text-xs font-black text-white uppercase tracking-widest mb-2">Protocol Locked</p>
                <p className="text-[11px] text-white/40 font-bold uppercase tracking-tight max-w-[200px] leading-relaxed">
                  Verification protocol active. Incoming teacher transmissions are restricted until unit completion.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-white/5 bg-[#0F172A]/80 shadow-2xl">
              <div className="flex gap-3">
                <input
                  disabled
                  type="text"
                  placeholder="Link disabled..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/10 focus:outline-none cursor-not-allowed opacity-50"
                />
                <Button disabled size="icon" className="bg-[#B45309]/20 text-[#B45309] shrink-0 rounded-xl w-12 h-12 border border-[#B45309]/20">
                  <Send className="w-5 h-5 opacity-30" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Clock, Play, Send, AlertCircle, MessageSquare, HelpCircle, ShieldAlert, Sparkles, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function TeacherHelpPage() {
  return (
    <div className="space-y-6 animate-slide-up pb-8 text-white h-full flex flex-col">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-brand-neutral/30 backdrop-blur-xl p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(13,148,136,0.15)] transition-transform group-hover:scale-110 duration-500">
            <ShieldAlert className="w-7 h-7 text-brand-primary" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3 h-3" /> Teacher Intervention
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">TEACHER HELP REQUESTED</h1>
            <p className="text-white/50 text-sm mt-1 font-medium">
              You've been exploring this concept for <strong className="text-white font-bold">2 minutes 15 seconds</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1">
        {/* ── LEFT PANEL: CODE & ERRORS ── */}
        <div className="space-y-6 flex flex-col">
          {/* Your Code Section */}
          <Card className="bg-brand-tertiary/60 backdrop-blur-xl border-white/10 overflow-hidden rounded-2xl shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-brand-neutral/20 flex items-center justify-between">
              <h2 className="font-bold text-xs uppercase tracking-widest text-white/60 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                Your Current Code
              </h2>
              <div className="flex gap-1.5 opacity-50">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="p-6 font-mono text-sm bg-brand-tertiary/40 text-white/80 overflow-auto leading-relaxed">
              <div className="text-brand-primary inline">for</div>(<div className="text-brand-secondary inline">int</div> i = 2; i {"<"} 20; i = i + 2) {"{\n"}
              {"  "}System.out.println(i);\n
              {"}"}
            </div>
          </Card>

          {/* Error Detected Section */}
          <Card className="bg-destructive/10 border-destructive/20 rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full blur-2xl pointer-events-none" />
            <CardContent className="p-6 flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center shrink-0 shadow-lg shadow-destructive/10">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-destructive mb-1.5 text-xs uppercase tracking-widest">Error detected</h3>
                <p className="text-lg text-white/90 font-bold leading-tight">Off-by-one error</p>
                <p className="text-sm text-white/60 mt-1">The output stops at 18, but the question requires 20.</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-3 mt-auto pt-4">
            <Link href="/peer-learning/pair-session/verification" className="w-full">
              <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-black py-8 rounded-2xl shadow-[0_0_30px_rgba(13,148,136,0.3)] hover:shadow-[0_0_50px_rgba(13,148,136,0.5)] transition-all hover:scale-[1.02] active:scale-95 text-lg group">
                I UNDERSTAND - START VERIFICATION
                <Play className="w-5 h-5 ml-2 fill-current group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full bg-brand-neutral/20 border-white/10 hover:bg-brand-neutral/40 text-white font-bold py-6 rounded-2xl h-auto transition-colors">
              I NEED MORE EXPLANATION
            </Button>
            <Button variant="ghost" className="w-full text-white/30 hover:text-white hover:bg-white/5 py-4 h-auto font-medium rounded-xl transition-all">
              REQUEST DIFFERENT TEACHER
            </Button>
          </div>
        </div>

        {/* ── RIGHT PANEL: TEACHER'S EXPLANATION ── */}
        <div className="space-y-6 flex flex-col">
          <Card className="bg-brand-tertiary/80 backdrop-blur-2xl border-white/10 flex-1 flex flex-col rounded-2xl overflow-hidden relative shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
            {/* Ambient glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="p-5 border-b border-white/5 bg-brand-neutral/20 backdrop-blur-md flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-2 text-brand-primary uppercase tracking-widest">
                <MessageSquare className="w-4 h-4" /> Teacher's Explanation
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-tighter">Live Session</span>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-auto space-y-6 relative">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-tertiary border border-brand-primary/30 flex items-center justify-center font-black text-white text-xl shadow-lg shrink-0">M</div>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">Michael T.</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Typing...</p>
                  </div>
                  
                  <div className="bg-brand-neutral/20 backdrop-blur-sm p-6 rounded-2xl border border-white/5 text-sm leading-relaxed space-y-4 text-white/80 shadow-inner">
                    <p className="text-base">Good attempt! Your loop correctly starts at 2 and increments by 2.</p>
                    
                    <div className="p-4 bg-brand-tertiary/60 rounded-xl border border-white/5 border-l-4 border-l-brand-secondary">
                      <p>However, look at your condition: <code className="bg-white/10 px-1.5 py-0.5 rounded text-brand-secondary font-mono">i {"<"} 20</code></p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-white/60 uppercase tracking-widest">Trace Analysis:</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {[2, 4, 6, 18].map(n => (
                          <li key={n} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/50" />
                            <span className="font-mono text-white/70">i={n} → prints {n}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-destructive/5 p-3 rounded-xl border border-destructive/20 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        <p className="text-xs font-mono text-destructive/90">i=20 → <code className="bg-destructive/20 px-1 rounded">20 {"<"} 20</code> is FALSE</p>
                      </div>
                    </div>

                    <p className="text-white/90">The question asks for numbers up to 20 <span className="text-brand-primary font-bold">INCLUSIVE</span>.</p>
                    
                    <div className="space-y-3">
                      <p className="text-xs font-black text-white/40 uppercase tracking-widest">Solution:</p>
                      <pre className="text-xs font-mono bg-brand-tertiary/80 p-4 rounded-xl border border-brand-primary/20 shadow-xl overflow-x-auto">
                        <span className="text-brand-primary font-bold">for</span>(<span className="text-brand-secondary">int</span> i = 2; i <span className="text-brand-primary font-bold underline underline-offset-4">{"<="}</span> 20; i = i + 2) {"{\n"}
                        {"  "}System.out.println(i);\n
                        {"}"}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Brain, Code, Activity, Sparkles, TrendingUp, Target, Zap, ChevronRight,
  PlayCircle, BookOpen, Bug, BarChart3, CheckCircle2, XCircle, Award, Check
} from "lucide-react";
import MentoraLogo from "@/components/auth/MentoraLogo";

// ── Intersection Observer Hook for Scroll Animations ──
function FadeInView({ children, delay = 0, direction = "up" }: { children: React.ReactNode, delay?: number, direction?: "up" | "left" | "right" }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (inView) return "translate-x-0 translate-y-0 opacity-100";
    if (direction === "up") return "translate-y-12 opacity-0";
    if (direction === "left") return "-translate-x-12 opacity-0";
    if (direction === "right") return "translate-x-12 opacity-0";
    return "opacity-0";
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${getTransform()}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-teal-500/30 font-sans overflow-x-hidden">
      
      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <MentoraLogo size="sm" />
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/20 rounded-xl hover:bg-white/5"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all bg-teal-600 rounded-xl border border-teal-500/50 shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:bg-teal-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(13,148,136,0.5)] active:scale-95"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background Gradients & Glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0F172A] to-[#334155]/20 -z-10" />
        <div className="absolute top-1/4 left-[10%] w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-[120px] mix-blend-screen -z-10 animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-[10%] w-[600px] h-[600px] bg-amber-700/10 rounded-full blur-[150px] mix-blend-screen -z-10 animate-glow-pulse delay-700" />
        
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {mounted && [...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-teal-400 rounded-full animate-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid xl:grid-cols-2 gap-12 xl:gap-8 items-center h-full pt-10">
          {/* Left: Content */}
          <div className="space-y-8 relative z-10">
            <FadeInView direction="up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#334155]/50 border border-white/10 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold tracking-wider text-teal-100 uppercase">Next-gen learning platform</span>
              </div>
            </FadeInView>
            
            <FadeInView delay={100} direction="up">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
                Master Programming with Your <span className="bg-gradient-to-r from-teal-400 to-[#CCFBF1] bg-clip-text text-transparent">Personal AI Tutor</span>
              </h1>
            </FadeInView>
            
            <FadeInView delay={200} direction="up">
              <p className="text-lg lg:text-xl text-[#F8FAFC]/70 max-w-xl leading-relaxed font-light">
                MENTORA analyzes your weaknesses and generates personalized learning materials, exercises, and study plans in real-time.
              </p>
            </FadeInView>
            
            <FadeInView delay={300} direction="up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-teal-600 border border-teal-500/50 rounded-xl hover:bg-teal-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_35px_rgba(13,148,136,0.5)] active:scale-95 w-full sm:w-auto overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
                  <span className="relative flex items-center gap-2 tracking-wide">
                    Get Started <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <button
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 active:scale-95 w-full sm:w-auto"
                >
                  <PlayCircle className="w-5 h-5 mr-2 text-teal-400 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </div>
            </FadeInView>
          </div>

          {/* Right: Abstract AI Illustration */}
          <FadeInView delay={400} direction="left">
            <div className="relative z-10 h-[500px] w-full flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                
                {/* Center glowing brain */}
                <div className="absolute z-10 w-32 h-32 rounded-full border border-teal-500/40 bg-[#0F172A] shadow-[0_0_60px_rgba(13,148,136,0.3)] flex items-center justify-center animate-glow-pulse backdrop-blur-sm">
                  <Brain className="w-16 h-16 text-teal-400" />
                </div>
                
                {/* Code Snippet Card */}
                <div className="absolute top-[12%] left-[2%] w-48 p-4 rounded-xl bg-[#334155]/60 border border-white/10 backdrop-blur-md animate-float z-20 shadow-xl shadow-black/50">
                  <div className="flex gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <div className="space-y-2 opacity-80">
                    <div className="h-2 w-3/4 bg-teal-400/50 rounded" />
                    <div className="h-2 w-1/2 bg-[#CCFBF1]/30 rounded ml-4" />
                    <div className="h-2 w-5/6 bg-[#CCFBF1]/30 rounded ml-4" />
                    <div className="h-2 w-2/3 bg-teal-400/50 rounded" />
                  </div>
                </div>

                {/* Exercise Card */}
                <div className="absolute bottom-[15%] right-[2%] w-56 p-4 rounded-xl bg-[#334155]/80 border border-teal-500/30 backdrop-blur-md animate-float-delayed z-20 shadow-xl shadow-teal-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-[#B45309] border border-amber-500/30">
                      <Target className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">New Exercise</p>
                      <p className="text-sm font-bold text-white">Dynamic Programming</p>
                    </div>
                  </div>
                </div>

                {/* Error Card */}
                <div className="absolute top-[30%] right-[-5%] w-44 p-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md animate-float delay-500 z-10">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-medium text-red-200">Logic Error Detected</span>
                  </div>
                </div>

                {/* Concept Card */}
                <div className="absolute bottom-[20%] left-[5%] w-40 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md animate-float delay-700 z-10 text-center">
                  <Sparkles className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-amber-100">Mastered: Trees</span>
                </div>

                {/* Decorative rings & flow lines */}
                <div className="absolute inset-2 rounded-full border border-teal-500/20 animate-spin-slow" />
                <div className="absolute inset-10 rounded-full border border-teal-400/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
                <div className="absolute inset-20 rounded-full border border-[#CCFBF1]/5 border-dashed animate-spin-slow" />
                
                <svg className="absolute inset-0 w-full h-full -z-10 opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M10,90 Q50,10 90,90" fill="none" stroke="#0D9488" strokeWidth="0.5" strokeDasharray="2 2" className="animate-pulse" />
                  <path d="M20,80 Q50,20 80,80" fill="none" stroke="#B45309" strokeWidth="0.5" strokeDasharray="2 2" className="animate-pulse delay-300" />
                </svg>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS ── */}
      <section className="py-24 bg-[#0F172A] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInView>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">How MENTORA Works</h2>
              <p className="text-[#F8FAFC]/50 text-lg">A continuous loop of measurement, adaptation, and improvement to accelerate your learning.</p>
            </div>
          </FadeInView>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { icon: Activity, title: "Analyze Learning", desc: "We track how you solve problems to understand your thinking process." },
              { icon: Target, title: "Detect Gaps", desc: "Our AI pinpoints exactly which concepts you're struggling with." },
              { icon: Brain, title: "Generate Content", desc: "Get custom exercises explanations tailored to your weak points." },
              { icon: TrendingUp, title: "Improve Mastery", desc: "Watch your skills grow as you conquer targeted challenges one by one." },
            ].map((step, i) => (
              <FadeInView key={i} delay={i * 150} direction="up">
                <div className="group relative p-6 rounded-3xl bg-[#334155]/20 border border-white/5 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(13,148,136,0.15)] hover:border-teal-500/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#0F172A] border border-white/10 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-500/20 group-hover:border-teal-500/50 transition-all duration-300 mb-6 shadow-lg shadow-black/50">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-[#F8FAFC]/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FEATURES GRID ── */}
      <section className="py-24 bg-gradient-to-b from-[#0F172A] to-[#334155]/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInView>
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Everything you need to succeed</h2>
              <p className="text-[#F8FAFC]/50 text-lg max-w-2xl">Powerful features designed to replace traditional static courses with a dynamic, AI-driven curriculum.</p>
            </div>
          </FadeInView>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI Generated Lessons", desc: "Lessons created on the fly based on what you need to learn next, avoiding repetitive content." },
              { icon: Code, title: "Coding Exercises", desc: "Practical programming tasks generated specifically to test your current edge of understanding." },
              { icon: Bug, title: "Debugging Challenges", desc: "Find and fix errors in code injected by the AI to build real-world debugging intuition." },
              { icon: BookOpen, title: "Personalized Study Plans", desc: "A continuous roadmap to mastery, automatically adjusted as you progress through topics." },
              { icon: Zap, title: "Real-time Adaptation", desc: "The difficulty of problems adjusts dynamically based on your success rate and time taken." },
              { icon: BarChart3, title: "Progress Tracking", desc: "Visualize your growth with detailed analytics, skill trees, and predictive scoring." },
            ].map((feat, i) => (
              <FadeInView key={i} delay={i * 100} direction="up">
                <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(13,148,136,0.1)] transition-all duration-300 h-full backdrop-blur-sm">
                  <feat.icon className="w-8 h-8 text-teal-400 mb-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  <h3 className="text-xl font-bold mb-3 text-[#F8FAFC]">{feat.title}</h3>
                  <p className="text-[#F8FAFC]/50 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: AI PERSONALIZATION (UNIQUE SELLING POINT) ── */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden z-10">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-600/5 rounded-full blur-[150px] -z-10 animate-glow-pulse" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <FadeInView direction="left">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-wider uppercase">
                <Award className="w-4 h-4" /> Personalization Engine
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Not generic learning.<br />MENTORA adapts to YOU.
              </h2>
              <p className="text-[#F8FAFC]/60 text-lg">
                Stop watching identical pre-recorded videos. Our AI builds a unique curriculum based entirely on your interactions.
              </p>
              <ul className="space-y-4">
                {[
                  "Based on your specific past errors",
                  "Adapted to your exact skill level",
                  "Aligned with your career goals",
                  "Adjusted dynamically in real-time"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#F8FAFC]">
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="inline-flex items-center gap-2 text-teal-400 font-bold hover:text-[#CCFBF1] transition-colors leading-relaxed group">
                See it in action <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInView>

          <FadeInView delay={200} direction="right">
            <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-[#0F172A] shadow-2xl shadow-teal-900/40 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Mac Window Header */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-[#334155]/40 backdrop-blur-md">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="relative aspect-[16/10] bg-[#0F172A] p-6 flex flex-col gap-4">
                {/* Mockup Dashboard Content instead of duplicating the logo */}
                <div className="w-full flex gap-4 h-full">
                   {/* Sidebar mockup */}
                   <div className="w-1/4 h-full bg-white/5 rounded-lg border border-white/5 space-y-3 p-3">
                      <div className="w-full h-2 bg-white/10 rounded-full" />
                      <div className="w-3/4 h-2 bg-white/10 rounded-full" />
                      <div className="w-5/6 h-2 bg-white/10 rounded-full" />
                   </div>
                   {/* Main content mockup */}
                   <div className="flex-1 h-full flex flex-col gap-4">
                      {/* Top stats */}
                      <div className="flex gap-4 h-1/4">
                         <div className="flex-1 bg-white/5 rounded-lg border border-white/5" />
                         <div className="flex-1 bg-white/5 rounded-lg border border-white/5" />
                         <div className="flex-1 bg-white/5 rounded-lg border border-white/5" />
                      </div>
                      {/* Main chart area */}
                      <div className="flex-1 bg-white/5 rounded-lg border border-white/5 p-4 flex items-end gap-2 justify-between">
                         <div className="w-6 h-[40%] bg-teal-500/50 rounded-t-sm" />
                         <div className="w-6 h-[60%] bg-teal-500/50 rounded-t-sm" />
                         <div className="w-6 h-[30%] bg-teal-500/50 rounded-t-sm" />
                         <div className="w-6 h-[80%] bg-teal-500/80 rounded-t-sm" />
                         <div className="w-6 h-[50%] bg-teal-500/50 rounded-t-sm" />
                         <div className="w-6 h-[90%] bg-teal-500/90 rounded-t-sm" />
                      </div>
                   </div>
                </div>
                
                <div className="absolute inset-0 bg-[#0F172A]/10" />
                
                {/* Animated Highlight */}
                <div className="absolute top-[25%] left-[15%] w-[35%] h-[25%] border-2 border-[#B45309] rounded-lg shadow-[0_0_20px_rgba(180,83,9,0.4)] animate-pulse z-10" />
                <div className="absolute top-[20%] left-[15%] px-2.5 py-1 bg-[#B45309] text-[10px] font-bold text-white rounded shadow-lg z-20 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Weak Concept Detected
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ── SECTION 5: WHY MENTORA ── */}
      <section className="py-24 bg-[#0F172A] relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInView>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Why choose AI over traditional?</h2>
            </div>
          </FadeInView>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeInView direction="up">
              <div className="p-8 rounded-3xl bg-[#334155]/20 border border-white/5 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-8 h-8 text-white/40" />
                  <h3 className="text-2xl font-bold text-white/50">Traditional Learning</h3>
                </div>
                <ul className="space-y-5">
                  {["Static, pre-recorded content", "Same curriculum for everyone", "No real-time personalization", "Passive watching, low engagement"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/40">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInView>

            <FadeInView delay={200} direction="up">
              <div className="relative p-8 rounded-3xl bg-teal-900/10 border border-teal-500/30 h-full shadow-[0_0_30px_rgba(13,148,136,0.1)]">
                <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 bg-teal-600 text-xs font-bold rounded-full shadow-lg">The Mentora Way</div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-teal-400" />
                  <h3 className="text-2xl font-bold text-white">MENTORA AI</h3>
                </div>
                <ul className="space-y-5">
                  {["AI-generated dynamic content", "Personalized paths for you", "Adaptive difficulty in real-time", "Active coding and instant feedback"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-teal-50">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: ACHIEVEMENT / TRUST ── */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#B45309]/10 rounded-full blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-3xl md:text-5xl font-black mb-16">
              Improve your <span className="text-[#B45309]">programming mastery</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Learners", value: "10K+" },
                { label: "Success Rate", value: "98%" },
                { label: "Exercises Generated", value: "500K+" },
                { label: "Concepts Mastered", value: "2M+" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[#334155]">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-[#B45309] uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ── SECTION 7: CTA ── */}
      <section className="py-24 px-6 relative z-10">
        <FadeInView>
          <div className="max-w-5xl mx-auto rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/40 to-[#B45309]/20 border border-white/10 rounded-3xl" />
            <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm rounded-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Start Learning Smarter Today</h2>
              <p className="text-xl text-[#F8FAFC]/70 mb-10 max-w-2xl mx-auto font-light">
                Join thousands of students who are mastering programming faster with MENTORA's personalized AI guidance.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-4 text-lg font-bold text-white bg-teal-600 rounded-xl border border-teal-500/50 shadow-[0_0_20px_rgba(13,148,136,0.4)] hover:bg-teal-500 hover:scale-105 transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 text-lg font-bold text-white bg-[#334155]/50 backdrop-blur-md rounded-xl border border-white/20 hover:bg-[#334155] transition-all"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </FadeInView>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-[#0F172A] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-4">
              <MentoraLogo size="sm" />
              <p className="text-white/40 text-sm max-w-sm leading-relaxed mt-4">
                MENTORA is an AI-powered personalized learning system designed to adapt to your unique educational needs in real-time.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} Mentora AI. All rights reserved.
            </p>
            <div className="flex gap-4 opacity-50">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center pointer-events-none" />
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center pointer-events-none" />
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center pointer-events-none" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

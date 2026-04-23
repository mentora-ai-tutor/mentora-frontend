import { ReactNode } from "react";
import type { Metadata } from "next";
import AuthBackground from "@/components/auth/AuthBackground";
import MentoraLogo from "@/components/auth/MentoraLogo";

export const metadata: Metadata = {
  title: {
    template: "%s | Mentora",
    default: "Mentora – AI-Powered Learning Platform",
  },
  description:
    "Sign in or create your Mentora account to access personalised AI-powered learning, assessments and peer collaboration.",
};

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex">
      {/* Animated background */}
      <AuthBackground />

      {/* ── Left panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative z-10 flex-col justify-between p-12">
        {/* Logo */}
        <MentoraLogo size="md" />

        {/* Centre illustration / copy */}
        <div className="space-y-8 max-w-lg">
          {/* Floating cards */}
          <div className="relative h-64">
            {/* Card 1 */}
            <div className="absolute left-0 top-4 w-56 p-4 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl animate-float">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <span className="text-teal-400 text-sm">🧠</span>
                </div>
                <span className="text-white/80 text-xs font-semibold">Knowledge Analysis</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-teal-500/30">
                  <div className="h-full w-4/5 rounded-full bg-teal-500" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-teal-500/20">
                  <div className="h-full w-3/5 rounded-full bg-teal-400" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-teal-500/20">
                  <div className="h-full w-9/12 rounded-full bg-teal-300" />
                </div>
              </div>
              <p className="text-white/40 text-[10px] mt-2">Learning progress: 78%</p>
            </div>

            {/* Card 2 */}
            <div className="absolute right-4 top-0 w-52 p-4 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl animate-float-delayed">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-xs font-semibold">AI Score</span>
                <span className="text-teal-400 text-xs font-black">94/100</span>
              </div>
              <div className="flex items-end gap-1 h-14">
                {[40, 65, 50, 80, 70, 94].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-teal-700 to-teal-400"
                    style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.5 + i * 0.08 }}
                  />
                ))}
              </div>
              <p className="text-white/30 text-[10px] mt-2">Assessment performance</p>
            </div>

            {/* Card 3 */}
            <div className="absolute left-12 bottom-0 w-60 p-4 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl animate-float delay-200">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px]">🤝</div>
                <span className="text-white/70 text-xs font-semibold">Peer Learning</span>
                <span className="ml-auto text-[10px] text-green-400 font-semibold">● Live</span>
              </div>
              <p className="text-white/40 text-[11px] leading-relaxed">
                3 students are collaborating on <span className="text-amber-400">Data Structures</span> right now
              </p>
              <div className="flex -space-x-1.5 mt-2.5">
                {["🧑", "👩", "👨"].map((e, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs">
                    {e}
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-[10px] text-teal-400 font-bold">+8</div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Learn smarter with{" "}
              <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">
                AI guidance
              </span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-sm">
              Personalised assessments, knowledge gap analysis and collaborative peer learning — all in one platform.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            {[
              { value: "10K+", label: "Students" },
              { value: "98%", label: "Satisfaction" },
              { value: "4 AI", label: "Agents" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Mentora · AI Research Project
        </p>
      </div>

      {/* ── Right panel – form ── */}
      <div className="relative z-10 w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Logo for mobile only */}
          <div className="flex justify-center mb-8 lg:hidden">
            <MentoraLogo size="md" />
          </div>

          {/* Glassmorphism card */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.07] backdrop-blur-2xl shadow-2xl shadow-black/40">
            {/* Top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400/80 to-transparent" />
            {/* Content */}
            <div className="relative p-8">
              {children}
            </div>
            {/* Bottom glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

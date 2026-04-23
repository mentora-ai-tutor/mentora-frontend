"use client";

import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export default function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`
        relative w-full max-w-md rounded-3xl overflow-hidden
        border border-white/10
        bg-white/[0.07] backdrop-blur-2xl
        shadow-2xl shadow-black/40
        ${className}
      `}
    >
      {/* Top teal shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400/80 to-transparent" />

      {/* Inner content */}
      <div className="relative p-8">{children}</div>

      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </div>
  );
}

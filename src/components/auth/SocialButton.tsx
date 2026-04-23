"use client";

import { ReactNode } from "react";

interface SocialButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export default function SocialButton({ icon, label, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex items-center justify-center gap-2.5
        h-11 w-full rounded-xl
        border border-white/10 bg-white/[0.05]
        text-white/70 text-sm font-medium
        transition-all duration-200
        hover:bg-white/[0.1] hover:border-white/20 hover:text-white hover:scale-[1.01]
        active:scale-[0.99]
      "
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

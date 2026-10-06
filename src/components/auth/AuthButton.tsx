"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

export default function AuthButton({
  children,
  loading = false,
  variant = "primary",
  fullWidth = true,
  className = "",
  disabled,
  ...props
}: AuthButtonProps) {
  const base =
    "relative h-12 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 overflow-hidden group";

  const variants = {
    primary: `
      bg-gradient-to-r from-teal-600 to-teal-500
      text-white shadow-lg shadow-teal-900/30
      hover:from-teal-500 hover:to-teal-400
      hover:shadow-teal-600/40 hover:scale-[1.01]
      active:scale-[0.99]
      disabled:from-teal-900/50 disabled:to-teal-800/40 disabled:shadow-none disabled:scale-100
    `,
    secondary: `
      bg-gradient-to-r from-amber-700 to-amber-600
      text-white shadow-lg shadow-amber-900/30
      hover:from-amber-600 hover:to-amber-500
      hover:shadow-amber-600/40 hover:scale-[1.01]
      active:scale-[0.99]
    `,
    ghost: `
      bg-white/[0.06] border border-white/10 text-white/80
      hover:bg-white/[0.1] hover:border-white/20 hover:text-white
      hover:scale-[1.01] active:scale-[0.99]
    `,
  };

  return (
    <Button
      className={`
        ${base}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {/* shimmer sweep on primary */}
      {variant === "primary" && (
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="absolute inset-0 animate-shimmer" />
        </span>
      )}

      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Processing…
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

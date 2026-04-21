"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, id, icon, error, hint, rightElement, className = "", ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="space-y-1.5">
        <Label
          htmlFor={id}
          className={`text-sm font-medium transition-colors duration-200 ${
            focused ? "text-teal-400" : "text-white/70"
          }`}
        >
          {label}
        </Label>

        <div className={`relative group`}>
          {/* left icon */}
          {icon && (
            <span
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${
                focused ? "text-teal-400" : "text-white/40"
              }`}
            >
              {icon}
            </span>
          )}

          <Input
            ref={ref}
            id={id}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              h-12 w-full rounded-xl border transition-all duration-200
              bg-white/[0.06] text-white placeholder:text-white/30
              border-white/[0.12]
              focus-visible:border-teal-500/70 focus-visible:ring-0 focus-visible:ring-offset-0
              focus-visible:bg-white/[0.09]
              hover:border-white/20 hover:bg-white/[0.08]
              ${icon ? "pl-11" : "pl-4"}
              ${rightElement ? "pr-12" : "pr-4"}
              ${error ? "border-red-500/60 focus-visible:border-red-500" : ""}
              ${className}
            `}
            {...props}
          />

          {/* right element (e.g. show/hide toggle) */}
          {rightElement && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10">
              {rightElement}
            </span>
          )}

          {/* focus glow */}
          <div
            className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
              focused
                ? "shadow-[0_0_0_2px_rgba(20,184,166,0.18),0_0_20px_rgba(13,148,136,0.12)]"
                : ""
            }`}
          />
        </div>

        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-white/40 mt-1">{hint}</p>}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";
export default AuthInput;

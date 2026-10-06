"use client";

import { Search, Filter } from "lucide-react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterGap: string;
  onFilterChange: (filter: string) => void;
  gapTypes: string[];
}

const gapColorMap: Record<string, { bg: string; border: string; text: string }> = {
  FUNDAMENTAL_GAP: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-600 dark:text-red-400" },
  PARTIAL_GAP: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  SURFACE_GAP: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  default: { bg: "bg-[var(--lmg-bg-subtle)]", border: "border-[var(--lmg-border)]", text: "text-[var(--lmg-text-muted)]" },
};

export default function SearchFilterBar({ searchQuery, onSearchChange, filterGap, onFilterChange, gapTypes }: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lmg-text-muted)]" />
        <input
          type="text"
          placeholder="Search by topic or topic ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[var(--lmg-bg-surface)] border border-[var(--lmg-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--lmg-text-primary)] placeholder:text-[var(--lmg-text-muted)] focus:border-teal-500/60 outline-none transition-colors shadow-xs"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-[var(--lmg-text-muted)]" />
        {gapTypes.map((type) => {
          const isActive = filterGap === type;
          const colors = type !== "ALL" ? gapColorMap[type] : null;
          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? type === "ALL"
                    ? "bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30 shadow-xs"
                    : `${colors!.bg} ${colors!.text} border ${colors!.border} shadow-xs`
                  : "bg-[var(--lmg-bg-surface)] text-[var(--lmg-text-muted)] border border-[var(--lmg-border)] hover:text-[var(--lmg-text-primary)] hover:border-[var(--lmg-border-strong)]"
              }`}
            >
              {type === "ALL" ? "All" : type.replace("_", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

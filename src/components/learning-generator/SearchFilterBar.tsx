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
  FUNDAMENTAL_GAP: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  PARTIAL_GAP: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  SURFACE_GAP: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  default: { bg: "bg-white/5", border: "border-white/10", text: "text-white/50" },
};

export default function SearchFilterBar({ searchQuery, onSearchChange, filterGap, onFilterChange, gapTypes }: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by topic or topic ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#334155]/20 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-teal-500/50 outline-none"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-white/30" />
        {gapTypes.map((type) => {
          const isActive = filterGap === type;
          const colors = type !== "ALL" ? gapColorMap[type] : null;
          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? type === "ALL"
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : `${colors!.bg} ${colors!.text} border ${colors!.border}`
                  : "bg-[#334155]/20 text-white/40 border border-white/5 hover:text-white/60"
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

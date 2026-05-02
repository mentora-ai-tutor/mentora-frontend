"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type LearningMaterial } from "@/lib/api/learningGenerator";
import {
  BookOpen, ChevronLeft, Loader2, ExternalLink, Search,
  Clock, Filter, FileText, Calendar, Sparkles, Eye
} from "lucide-react";

export default function MaterialsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGap, setFilterGap] = useState<string>("ALL");

  const fetchData = useCallback(async () => {
    if (!user?.student_id) return;
    try {
      const res = await learningGeneratorApi.getMaterials(user.student_id);
      if (res.success && res.data) {
        const matData = res.data as any;
        setMaterials(matData.items || []);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.student_id]);

  useEffect(() => {
    if (user?.student_id) fetchData();
  }, [user?.student_id, fetchData]);

  const getGapColor = (gapType: string) => {
    switch (gapType) {
      case "FUNDAMENTAL_GAP": return { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" };
      case "PARTIAL_GAP": return { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" };
      case "SURFACE_GAP": return { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" };
      default: return { bg: "bg-white/5", border: "border-white/10", text: "text-white/50" };
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "intermediate": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "advanced": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-white/5 text-white/50 border-white/10";
    }
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = !searchQuery ||
      m.structured_material.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.structured_material.topic_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGap = filterGap === "ALL" || m.structured_material.gap_type === filterGap;
    return matchesSearch && matchesGap;
  });

  const gapTypes = ["ALL", ...Array.from(new Set(materials.map(m => m.structured_material.gap_type)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <Link href="/learning-generator" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-bold mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Overview
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Learning Materials</h1>
            <p className="text-sm text-white/50">All AI-generated personalized learning content.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <p className="text-3xl font-black text-white">{materials.length}</p>
          <p className="text-xs text-white/40 mt-1">Total Materials</p>
        </div>
        <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
          <p className="text-3xl font-black text-red-400">
            {materials.filter(m => m.structured_material.gap_type === "FUNDAMENTAL_GAP").length}
          </p>
          <p className="text-xs text-red-400/60 mt-1">Fundamental</p>
        </div>
        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <p className="text-3xl font-black text-amber-400">
            {materials.filter(m => m.structured_material.gap_type === "PARTIAL_GAP").length}
          </p>
          <p className="text-xs text-amber-400/60 mt-1">Partial</p>
        </div>
        <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
          <p className="text-3xl font-black text-blue-400">
            {materials.filter(m => m.structured_material.gap_type === "SURFACE_GAP").length}
          </p>
          <p className="text-xs text-blue-400/60 mt-1">Surface</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by topic or topic ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#334155]/20 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-teal-500/50 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-white/30" />
          {gapTypes.map((type) => {
            const isActive = filterGap === type;
            const colors = type !== "ALL" ? getGapColor(type) : null;
            return (
              <button
                key={type}
                onClick={() => setFilterGap(type)}
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

      {/* Materials List */}
      {filteredMaterials.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material) => {
            const sm = material.structured_material;
            const colors = getGapColor(sm.gap_type);
            const diffColor = getDifficultyColor(sm.difficulty_level);
            return (
              <div
                key={material._id}
                className="group p-5 bg-[#334155]/20 border border-white/5 rounded-2xl hover:border-teal-500/30 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
                    {sm.difficulty_level}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.border} ${colors.text}`}>
                    {sm.gap_type.replace("_", " ")}
                  </span>
                </div>

                {/* Topic */}
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors mb-1">
                  {sm.topic}
                </h3>
                <p className="text-xs text-white/30 mb-4 font-mono">{sm.topic_id}</p>

                {/* Content Preview */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{sm.lesson?.concept_explained ? "Concepts" : ""}{sm.lesson?.examples ? " + Examples" : ""}{sm.assessment?.quiz ? " + Quiz" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(sm.generated_at).toLocaleDateString()}</span>
                  </div>
                  {sm.generation_models && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{sm.generation_models.llm || "N/A"}</span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <Link
                  href={`/learning-generator/workspace/${material._id}`}
                  className="w-full py-2.5 bg-teal-600/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-xl hover:bg-teal-600/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5" /> Open Workspace
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-[#334155]/10 border border-white/5 rounded-2xl text-center">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white/60 mb-2">
            {materials.length === 0 ? "No materials yet" : "No materials match your filters"}
          </h3>
          <p className="text-sm text-white/40">
            {materials.length === 0
              ? "Submit a learning profile to generate personalized materials."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type LearningMaterial } from "@/lib/api/learningGenerator";
import { BookOpen, ChevronLeft, Loader2 } from "lucide-react";
import MaterialCard from "@/components/learning-generator/MaterialCard";
import SearchFilterBar from "@/components/learning-generator/SearchFilterBar";

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

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.structured_material.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.structured_material.topic_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGap = filterGap === "ALL" || m.structured_material.gap_type === filterGap;
    return matchesSearch && matchesGap;
  });

  const gapTypes = ["ALL", ...Array.from(new Set(materials.map((m) => m.structured_material.gap_type)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
          <p className="text-3xl font-black text-white">{materials.length}</p>
          <p className="text-xs text-white/40 mt-1">Total Materials</p>
        </div>
        <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
          <p className="text-3xl font-black text-red-400">
            {materials.filter((m) => m.structured_material.gap_type === "FUNDAMENTAL_GAP").length}
          </p>
          <p className="text-xs text-red-400/60 mt-1">Fundamental</p>
        </div>
        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <p className="text-3xl font-black text-amber-400">
            {materials.filter((m) => m.structured_material.gap_type === "PARTIAL_GAP").length}
          </p>
          <p className="text-xs text-amber-400/60 mt-1">Partial</p>
        </div>
        <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
          <p className="text-3xl font-black text-blue-400">
            {materials.filter((m) => m.structured_material.gap_type === "SURFACE_GAP").length}
          </p>
          <p className="text-xs text-blue-400/60 mt-1">Surface</p>
        </div>
      </div>

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterGap={filterGap}
        onFilterChange={setFilterGap}
        gapTypes={gapTypes}
      />

      {filteredMaterials.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material) => (
            <MaterialCard key={material._id} material={material} />
          ))}
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

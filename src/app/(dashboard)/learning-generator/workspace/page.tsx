"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { learningGeneratorApi, type LearningMaterial } from "@/lib/api/learningGenerator";
import { BookOpen, ChevronLeft, Loader2, Eye, Clock, ExternalLink } from "lucide-react";

export default function WorkspaceList() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);

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
            <h1 className="text-2xl font-black text-white">Workspace</h1>
            <p className="text-sm text-white/50">Select a material to open in the interactive workspace.</p>
          </div>
        </div>
      </div>

      {materials.length > 0 ? (
        <div className="space-y-3">
          {materials.map((material) => (
            <Link
              key={material._id}
              href={`/learning-generator/workspace/${material._id}`}
              className="flex items-center justify-between p-5 bg-[#334155]/20 border border-white/5 rounded-xl hover:border-teal-500/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-teal-300 transition-colors">
                    {material.structured_material.topic}
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(material.structured_material.generated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {material.structured_material.difficulty_level}
                </span>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-teal-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-[#334155]/10 border border-white/5 rounded-2xl text-center">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white/60 mb-2">No materials available</h3>
          <p className="text-sm text-white/40 mb-4">Generate learning materials first, then they will appear here.</p>
          <Link href="/learning-generator" className="px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-colors">
            Go to Overview
          </Link>
        </div>
      )}
    </div>
  );
}

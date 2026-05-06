"use client";

import { useState } from "react";
import { BookOpen, Sparkles, Wand2, Plus, RefreshCw, Layers, TrendingUp } from "lucide-react";

export default function LearningGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setState("loading");
    setTimeout(() => setState("done"), 2000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Material Generator</h1>
          <p className="text-sm text-white/50">Instantly create personalized tutorials, exercises, and study plans.</p>
        </div>
      </div>

      {state === "idle" && (
        <div className="max-w-2xl bg-[#334155]/20 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px]" />
          
          <label className="block text-sm font-bold text-white mb-2">What do you want to learn?</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Dijkstra's Algorithm, React Hooks, UI/UX..."
            className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500/50 outline-none shadow-inner mb-4"
          />

          <label className="block text-sm font-bold text-white mb-2 mt-6">Learning Goal (Optional)</label>
          <select className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm focus:border-teal-500/50 outline-none appearance-none mb-8">
            <option>Prepare for an interview</option>
            <option>Build a project</option>
            <option>Pass an exam</option>
            <option>Just curious</option>
          </select>

          <button 
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="w-full relative group py-3.5 bg-teal-600 disabled:bg-[#334155] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(13,148,136,0.3)] disabled:shadow-none hover:bg-teal-500 hover:scale-[1.02] flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
            <Wand2 className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Generate Learning Plan</span>
          </button>
        </div>
      )}

      {state === "loading" && (
        <div className="max-w-2xl py-24 text-center border border-white/5 bg-[#334155]/10 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-[0_0_30px_rgba(13,148,136,0.2)]">
            <Sparkles className="w-8 h-8 text-teal-400 animate-spin-slow" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-widest animate-pulse">ANALYZING</h2>
          <p className="text-sm text-teal-400 mt-2">Crafting highly personalized content...</p>
        </div>
      )}

      {state === "done" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Material Ready
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-white">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button className="px-4 py-2 text-xs font-bold bg-teal-600/10 text-teal-400 border border-teal-500/30 rounded-lg hover:bg-teal-600/20 transition-colors flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Simplify explanation
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Explanation */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-6 bg-[#334155]/30 border border-white/5 rounded-2xl leading-relaxed text-sm">
                <h3 className="text-xl font-bold text-white mb-4">Understanding {topic || "the topic"}</h3>
                <p className="text-white/70 mb-3">At its core, this concept acts as a map to navigate the shortest path through a network. Based on your previous errors with tree traversal, we&apos;ve structured this explanation to isolate the graph logic first.</p>
                <div className="p-4 bg-[#0F172A] border border-white/5 rounded-xl text-teal-200 font-mono text-xs mb-3">
                  {"// Core intuition"} <br/>
                  distance[node] = min(distance[node], distance[current] + weight)
                </div>
                <p className="text-white/70">As you can see, it continually refines its estimate of the shortest path until it finds the absolute truth.</p>
              </div>

              {/* Study Plan */}
              <div className="p-6 bg-[#B45309]/10 border border-[#B45309]/20 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#B45309]" /> Recommended Study Plan
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-[#F8FAFC]">
                    <div className="w-6 h-6 rounded-full bg-[#B45309] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <span className="opacity-80">Read through the core intuition block above.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-[#F8FAFC]">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <span className="opacity-80">Attempt the first generated exercise (Shortest Path Basic).</span>
                  </li>
                  <li className="flex gap-3 text-sm text-[#F8FAFC]">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <span className="opacity-80">Check the assessment tab to verify your mastery level.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Exercises Sidebar */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Generated Exercises</h3>
              
              <div className="p-4 bg-[#334155]/20 border border-teal-500/20 rounded-xl hover:-translate-y-1 transition-transform cursor-pointer group shadow-[0_5px_15px_rgba(13,148,136,0.05)]">
                <h4 className="font-bold text-white text-sm mb-1">Basic Application</h4>
                <p className="text-xs text-white/50 mb-3">Write a function to traverse a 3-node graph.</p>
                <div className="w-full h-1 bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-teal-500 rounded-full" />
                </div>
              </div>

              <div className="p-4 bg-[#334155]/20 border border-white/5 rounded-xl hover:-translate-y-1 transition-transform cursor-pointer group">
                <h4 className="font-bold text-white text-sm mb-1">Edge Cases</h4>
                <p className="text-xs text-white/50 mb-3">Handle unconnected nodes safely.</p>
                <div className="w-full h-1 bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-teal-500 rounded-full" />
                </div>
              </div>
              
              <button className="w-full py-3 border border-white/5 bg-white/5 rounded-xl text-xs font-bold text-white/50 hover:text-white transition-colors flex justify-center items-center gap-2">
                <Plus className="w-4 h-4" /> Generate More
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

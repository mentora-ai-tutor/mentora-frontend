"use client";

import { Users, Search, MessageSquare, Plus, ArrowUpRight, Heart, HeartPulse } from "lucide-react";

export default function PeerLearningPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Peer Learning</h1>
            <p className="text-sm text-white/50">Collaborate, discuss, and learn from other students.</p>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(13,148,136,0.3)]">
          <Plus className="w-4 h-4" /> New Discussion
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ── DISCUSSION THREADS (MAIN) ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#334155]/20 border border-white/5 rounded-xl focus-within:border-teal-500/50 focus-within:bg-[#334155]/40 transition-all mb-6">
            <Search className="w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search topics, questions, or tags..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/40"
            />
          </div>

          <div className="space-y-3">
            {[
              { title: "Best resources for learning Dynamic Programming visually?", author: "Alex K.", replies: 12, likes: 45, tag: "Algorithms", time: "2h ago", active: true },
              { title: "How to set up ESLint with React 19 correctly?", author: "Sarah M.", replies: 4, likes: 12, tag: "React", time: "5h ago" },
              { title: "Looking for a study partner for System Design rounds", author: "David W.", replies: 28, likes: 34, tag: "Study Group", time: "1d ago" },
              { title: "Explanation: Why is Hash Map lookup O(1)?", author: "Mentora AI generated", replies: 56, likes: 120, tag: "Theory", time: "2d ago" },
            ].map((thread, i) => (
              <div key={i} className="p-5 bg-[#334155]/20 hover:bg-[#334155]/40 border border-white/5 hover:border-teal-500/20 rounded-2xl transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/60 group-hover:bg-teal-500/10 group-hover:text-teal-400 transition-colors">
                      {thread.tag}
                    </span>
                    <span className="text-[10px] text-white/30">• {thread.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors mb-1">
                    {thread.title}
                  </h3>
                  <div className="text-xs text-white/50 flex items-center gap-1">
                    Started by <span className={thread.active ? "text-teal-400 font-medium" : ""}>{thread.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/40 shrink-0">
                  <div className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4" /> <span className="text-sm font-medium">{thread.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
                    <MessageSquare className="w-4 h-4" /> <span className="text-sm font-medium">{thread.replies}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-3 bg-transparent hover:bg-white/5 text-teal-400 text-sm font-bold rounded-xl transition-colors">
            Load More Threads...
          </button>
        </div>

        {/* ── SIDEBAR: MENTORS & TOP CONTRIBUTORS ── */}
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-br from-teal-900/20 to-[#0F172A] border border-teal-500/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[40px] pointer-events-none" />
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-teal-400" /> Matches for You
            </h3>
            
            <div className="space-y-3">
              {[
                { name: "Michael T.", role: "Senior Engineer", skills: ["React", "System Design"], match: "95%" },
                { name: "Elena R.", role: "Student (Pro)", skills: ["Algorithms", "Python"], match: "88%" },
              ].map((user, i) => (
                <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                         <p className="text-[10px] text-teal-400">{user.role}</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[9px] font-bold shadow-sm">
                      {user.match} Match
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {user.skills.map(s => <span key={s} className="px-1.5 py-0.5 rounded bg-black/30 border border-white/10 text-white/50 text-[9px]">{s}</span>)}
                  </div>
                  <button className="w-full py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                    Connect <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
               {["#DynamicProgramming", "#ReactJS", "#FAANGPrep", "#SystemDesign", "#LeetCode", "#NodeJS"].map(tag => (
                 <span key={tag} className="px-2.5 py-1.5 bg-[#0F172A] border border-white/10 rounded-lg text-xs text-white/60 hover:text-teal-400 hover:border-teal-500/30 cursor-pointer transition-colors">
                   {tag}
                 </span>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

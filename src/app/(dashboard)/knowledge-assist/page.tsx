"use client";

import { useState } from "react";
import { Brain, User, Send, Sparkles, AlertCircle } from "lucide-react";

export default function KnowledgeAssistPage() {
  const [messages, setMessages] = useState<{ role: "human" | "ai", text: string }[]>([
    {
      role: "ai",
      text: "Hello Jane! I noticed you were struggling with calculating the depth of a Binary Tree. How can I help you understand it better today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "human", text: userMsg }]);
    setInput("");
    setTyping(true);

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: "Great question! Depth represents the distance from the root to a specific node. A classic way to find it is using recursion. Would you like a step-by-step breakdown or a small code example?"
      }]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#1e293b]/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
      
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#334155]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-white font-bold">Knowledge Assist</h2>
            <p className="text-teal-400 text-xs flex items-center gap-1 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              AI Online
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-[#B45309]/10 border border-[#B45309]/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#B45309]" />
          <span className="text-[#B45309] text-xs font-bold uppercase">Tree context loaded</span>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 max-w-3xl ${msg.role === "human" ? "ml-auto flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center border ${
              msg.role === "ai" 
                ? "bg-teal-500/10 border-teal-500/30 text-teal-400" 
                : "bg-white/5 border-white/10 text-white/70"
            }`}>
              {msg.role === "ai" ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className={`p-4 rounded-2xl ${
              msg.role === "ai" 
                ? "bg-[#334155]/40 border border-white/5 text-white/90 rounded-tl-none shadow-lg shadow-black/20" 
                : "bg-teal-600 text-white rounded-tr-none shadow-lg shadow-teal-900/40"
            }`}>
              {msg.role === "ai" && (
                <div className="flex items-center gap-1.5 mb-2 px-2 py-0.5 w-fit rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> AI Mentor
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-4 max-w-3xl">
            <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/30 flex shrink-0 items-center justify-center text-teal-400">
              <Brain className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-[#334155]/40 border border-white/5 w-20 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-white/5 bg-[#334155]/10">
        <div className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-[#0F172A] border border-white/10 focus:border-teal-500/50 outline-none text-white text-sm rounded-xl py-4 pl-4 pr-14 shadow-inner transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-teal-600 hover:bg-teal-500 disabled:bg-[#334155] disabled:text-white/30 text-white rounded-lg flex items-center justify-center transition-all group"
          >
            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/30 mt-2 font-medium">MENTORA AI provides realtime hints tailored to your learning data.</p>
      </div>

    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/lib/api/workspaces';

interface WorkspaceAssistantPanelProps {
  aiMessages: ChatMessage[];
  activeFileName?: string;
  canWrite: boolean;
  asking: boolean;
  onAsk: (question: string) => void;
}

const SUGGESTIONS = [
  'Explain what this code does',
  'Find bugs in this file',
  'Suggest improvements',
];

export default function WorkspaceAssistantPanel({
  aiMessages,
  activeFileName,
  canWrite,
  asking,
  onAsk,
}: WorkspaceAssistantPanelProps) {
  const [question, setQuestion] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [aiMessages]);

  const submit = (value: string) => {
    const text = value.trim();
    if (!text) return;
    onAsk(text);
    setQuestion('');
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {aiMessages.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
              <Bot className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <p className="text-xs font-semibold text-foreground/80">AI Study Assistant</p>
            <p className="max-w-[220px] text-[11px] text-subtle-foreground">
              {activeFileName
                ? `Ask anything, with "${activeFileName}" as context.`
                : 'Ask anything about your project.'}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={!canWrite}
                  onClick={() => submit(suggestion)}
                  className="rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-surface-3 disabled:opacity-40"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          aiMessages.map((message) => (
            <div key={message.message_id} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
              <div className="mb-1 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-700 dark:text-amber-400" />
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">AI Study Assistant</span>
              </div>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-amber-100/90">{message.message}</p>
            </div>
          ))
        )}
        {asking && (
          <div className="flex items-center gap-2 text-[11px] text-subtle-foreground">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            Thinking…
          </div>
        )}
      </div>

      <div className="border-t border-border p-2.5">
        <div className="flex items-end gap-2">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit(question);
              }
            }}
            rows={2}
            disabled={!canWrite || asking}
            placeholder={canWrite ? 'Ask the AI assistant…' : 'Viewers cannot use the assistant'}
            className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500/50 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => submit(question)}
            disabled={!canWrite || asking || !question.trim()}
            className="rounded-lg bg-amber-600 p-2 text-white hover:bg-amber-500 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

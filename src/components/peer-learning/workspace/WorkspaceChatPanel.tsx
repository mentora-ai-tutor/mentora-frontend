'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/lib/api/workspaces';

interface WorkspaceChatPanelProps {
  messages: ChatMessage[];
  currentStudentId: string;
  canWrite: boolean;
  onSend: (text: string) => void;
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function WorkspaceChatPanel({
  messages,
  currentStudentId,
  canWrite,
  onSend,
}: WorkspaceChatPanelProps) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  const submit = () => {
    const text = draft.trim();
    if (!text || !canWrite) return;
    onSend(text);
    setDraft('');
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.length === 0 && (
          <p className="py-8 text-center text-xs text-subtle-foreground">No messages yet. Say hello to your team.</p>
        )}
        {messages.map((message) => {
          const isOwn = message.student_id === currentStudentId;
          const isAi = message.message_type === 'ai' || message.role === 'ai';
          return (
            <div key={message.message_id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
              <div className="mb-0.5 flex items-center gap-1.5 px-1">
                {isAi && <Sparkles className="w-3 h-3 text-amber-700 dark:text-amber-400" />}
                <span className={`text-[10px] font-bold ${isAi ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>
                  {message.sender_name}
                </span>
                {message.role && message.role !== 'ai' && (
                  <span className="rounded bg-muted px-1 text-[9px] uppercase tracking-wide text-subtle-foreground">
                    {message.role}
                  </span>
                )}
                <span className="text-[9px] text-subtle-foreground">{formatTime(message.timestamp)}</span>
              </div>
              <div
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  isAi
                    ? 'border border-amber-500/20 bg-amber-500/5 text-amber-100'
                    : isOwn
                      ? 'bg-teal-600/80 text-white'
                      : 'bg-card text-foreground/80'
                }`}
              >
                {message.message}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border p-2.5">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={1}
            disabled={!canWrite}
            placeholder={canWrite ? 'Message your team…' : 'Viewers cannot send messages'}
            className="max-h-24 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-teal-500/50 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!canWrite || !draft.trim()}
            className="rounded-lg bg-teal-600 p-2 text-white hover:bg-teal-500 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

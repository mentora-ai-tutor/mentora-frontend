'use client';

import { useState } from 'react';
import { Check, MessageSquare, RotateCcw, Trash2 } from 'lucide-react';
import type { CodeComment, WorkspaceFile } from '@/lib/api/workspaces';

interface WorkspaceCommentsPanelProps {
  file: WorkspaceFile | null;
  comments: CodeComment[];
  currentStudentId: string;
  canWrite: boolean;
  onAdd: (body: string, lineStart?: number, lineEnd?: number) => void;
  onResolve: (commentId: string, resolved: boolean) => void;
  onDelete: (commentId: string) => void;
}

export default function WorkspaceCommentsPanel({
  file,
  comments,
  currentStudentId,
  canWrite,
  onAdd,
  onResolve,
  onDelete,
}: WorkspaceCommentsPanelProps) {
  const [body, setBody] = useState('');
  const [line, setLine] = useState('');

  if (!file) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-white/25">
        <MessageSquare className="h-8 w-8" />
        <p className="text-xs">Open a file to view its comments</p>
      </div>
    );
  }

  const submit = () => {
    const text = body.trim();
    if (!text) return;
    const lineNumber = line.trim() ? Number.parseInt(line, 10) : undefined;
    onAdd(text, Number.isNaN(lineNumber) ? undefined : lineNumber);
    setBody('');
    setLine('');
  };

  const open = comments.filter((comment) => comment.status === 'open');
  const resolved = comments.filter((comment) => comment.status === 'resolved');

  const renderComment = (comment: CodeComment) => {
    const isAuthor = comment.author_student_id === currentStudentId;
    return (
      <div
        key={comment.comment_id}
        className={`rounded-lg border p-2.5 ${
          comment.status === 'resolved'
            ? 'border-white/5 bg-white/[0.02] opacity-70'
            : 'border-white/10 bg-[#1e293b]/50'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-white/80">{comment.author_name || comment.author_student_id}</span>
            {comment.line_start && (
              <span className="rounded bg-teal-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-teal-300">
                L{comment.line_start}
                {comment.line_end && comment.line_end !== comment.line_start ? `–${comment.line_end}` : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title={comment.status === 'open' ? 'Resolve' : 'Reopen'}
              onClick={() => onResolve(comment.comment_id, comment.status === 'open')}
              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-emerald-300"
            >
              {comment.status === 'open' ? <Check className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
            </button>
            {(isAuthor || canWrite) && (
              <button
                type="button"
                title="Delete"
                onClick={() => onDelete(comment.comment_id)}
                className="rounded p-1 text-white/40 hover:bg-rose-500/15 hover:text-rose-300"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-xs text-white/70">{comment.body}</p>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/5 px-3 py-2">
        <p className="truncate text-[11px] font-bold text-white/60">{file.path}</p>
        <p className="text-[10px] text-white/30">
          {open.length} open · {resolved.length} resolved
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {comments.length === 0 && <p className="py-6 text-center text-xs text-white/30">No comments on this file yet.</p>}
        {open.map(renderComment)}
        {resolved.length > 0 && (
          <p className="pt-2 text-[10px] font-bold uppercase tracking-wider text-white/30">Resolved</p>
        )}
        {resolved.map(renderComment)}
      </div>

      <div className="space-y-2 border-t border-white/5 p-2.5">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={2}
          disabled={!canWrite}
          placeholder={canWrite ? 'Add a comment…' : 'Viewers cannot comment'}
          className="w-full resize-none rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2 text-xs text-white outline-none focus:border-teal-500/50 disabled:opacity-50"
        />
        <div className="flex items-center gap-2">
          <input
            value={line}
            onChange={(event) => setLine(event.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Line #"
            className="w-20 rounded-md border border-white/10 bg-[#0F172A] px-2 py-1.5 text-xs text-white outline-none focus:border-teal-500/50"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!canWrite || !body.trim()}
            className="flex-1 rounded-md bg-teal-600 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-40"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}

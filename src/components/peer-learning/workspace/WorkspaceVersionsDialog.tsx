'use client';

import { useState } from 'react';
import { History, RotateCcw, X } from 'lucide-react';
import type { FileVersion, WorkspaceFile } from '@/lib/api/workspaces';

interface WorkspaceVersionsDialogProps {
  file: WorkspaceFile | null;
  versions: FileVersion[];
  loading: boolean;
  canWrite: boolean;
  onClose: () => void;
  onView: (versionId: string) => Promise<FileVersion | null>;
  onRestore: (versionId: string) => void;
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function WorkspaceVersionsDialog({
  file,
  versions,
  loading,
  canWrite,
  onClose,
  onView,
  onRestore,
}: WorkspaceVersionsDialogProps) {
  const [preview, setPreview] = useState<FileVersion | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-bold text-white">Version history</span>
            {file && <span className="text-xs text-white/40">{file.path}</span>}
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-white/40 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[240px_1fr]">
          <div className="overflow-y-auto border-b border-white/5 p-2 md:border-b-0 md:border-r">
            {loading && <p className="p-3 text-xs text-white/40">Loading…</p>}
            {!loading && versions.length === 0 && <p className="p-3 text-xs text-white/30">No versions yet.</p>}
            {versions.map((version) => (
              <button
                key={version.version_id}
                type="button"
                onClick={async () => {
                  setPreviewLoading(true);
                  const full = await onView(version.version_id);
                  setPreview(full);
                  setPreviewLoading(false);
                }}
                className={`mb-1 flex w-full flex-col rounded-lg px-2.5 py-2 text-left transition-colors ${
                  preview?.version_id === version.version_id ? 'bg-teal-500/10' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-xs font-semibold text-white/90">v{version.version_number}</span>
                <span className="truncate text-[10px] text-white/40">{version.message}</span>
                <span className="text-[10px] text-white/30">{formatTime(version.created_at)}</span>
              </button>
            ))}
          </div>

          <div className="flex min-h-[200px] flex-col overflow-hidden">
            {preview ? (
              <>
                <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
                  <span className="text-[11px] text-white/50">
                    v{preview.version_number} by {preview.author_student_id}
                  </span>
                  {canWrite && (
                    <button
                      type="button"
                      onClick={() => onRestore(preview.version_id)}
                      className="flex items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-teal-500"
                    >
                      <RotateCcw className="h-3 w-3" /> Restore
                    </button>
                  )}
                </div>
                <pre className="flex-1 overflow-auto bg-[#0B1121] p-3 text-[11px] leading-relaxed text-white/70">
                  {previewLoading ? 'Loading…' : preview.content || '(empty)'}
                </pre>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-4 text-center text-xs text-white/30">
                Select a version to preview its contents.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

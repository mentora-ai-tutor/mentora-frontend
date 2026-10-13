'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditor } from 'monaco-editor';
import type { MonacoBinding } from 'y-monaco';
import type * as Y from 'yjs';
import {
  Code2,
  History,
  MessageSquare,
  Play,
  Save,
  Square,
  Wifi,
  WifiOff,
} from 'lucide-react';
import type { WorkspaceCollabProvider } from '@/lib/workspace/collab';
import type { CodeRunResult, WorkspaceFile } from '@/lib/api/workspaces';

interface WorkspaceEditorProps {
  file: WorkspaceFile | null;
  providerRef: RefObject<WorkspaceCollabProvider | null>;
  canWrite: boolean;
  connected: boolean;
  saving: boolean;
  onSave: (code: string) => Promise<boolean>;
  onRun: (code: string, stdin: string) => Promise<CodeRunResult | null>;
  onOpenComments: () => void;
  onOpenVersions: () => void;
}

export default function WorkspaceEditor({
  file,
  providerRef,
  canWrite,
  connected,
  saving,
  onSave,
  onRun,
  onOpenComments,
  onOpenVersions,
}: WorkspaceEditorProps) {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const ytextRef = useRef<Y.Text | null>(null);
  const lastSavedRef = useRef<string>(file?.content ?? '');
  const awarenessTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fileRef = useRef<WorkspaceFile | null>(file);
  const lastFileIdRef = useRef<string | null>(null);
  fileRef.current = file;

  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showRun, setShowRun] = useState(false);
  const [stdin, setStdin] = useState('');
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null);

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      bindingRef.current = null;
      if (awarenessTimer.current) clearTimeout(awarenessTimer.current);
    };
  }, []);

  useEffect(() => {
    if (lastFileIdRef.current === (file?.file_id ?? null)) return;
    lastFileIdRef.current = file?.file_id ?? null;
    setReady(false);
    setDirty(false);
    setRunResult(null);
    lastSavedRef.current = file?.content ?? '';
  }, [file?.file_id, file?.content]);

  const scheduleAwareness = (currentFile: WorkspaceFile) => {
    if (awarenessTimer.current) clearTimeout(awarenessTimer.current);
    awarenessTimer.current = setTimeout(() => {
      const editor = editorRef.current;
      const p = providerRef.current;
      if (!editor || !p) return;
      const position = editor.getPosition();
      if (position) {
        p.sendAwareness(currentFile.file_id, { line: position.lineNumber, column: position.column });
      }
    }, 150);
  };

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    const currentFile = fileRef.current;
    const currentProvider = providerRef.current;

    editor.updateOptions({ readOnly: !canWrite });

    if (!currentFile || !currentProvider) {
      setReady(true);
      return;
    }

    bindingRef.current?.destroy();
    bindingRef.current = null;

    void (async () => {
      const ytext = await currentProvider.prepareFile(currentFile.file_id, currentFile.content ?? '');
      const model = editor.getModel();
      if (!model) return;
      const { MonacoBinding: Binding } = await import('y-monaco');
      ytextRef.current = ytext;
      bindingRef.current = new Binding(ytext, model, new Set([editor]));
      setDirty(ytext.toString() !== lastSavedRef.current);
      ytext.observe((_event, transaction) => {
        if (transaction.origin === 'restore') {
          lastSavedRef.current = ytext.toString();
          setDirty(false);
          return;
        }
        setDirty(ytext.toString() !== lastSavedRef.current);
      });
      setReady(true);
      scheduleAwareness(currentFile);
    })();

    editor.onDidChangeCursorSelection(() => {
      if (fileRef.current) scheduleAwareness(fileRef.current);
    });
  };

  const getCode = (): string => {
    const text = ytextRef.current?.toString();
    if (text !== undefined) return text;
    return fileRef.current?.content ?? '';
  };

  const handleSave = async (): Promise<boolean> => {
    if (!canWrite || !fileRef.current) return false;
    const code = getCode();
    const ok = await onSave(code);
    if (ok) {
      lastSavedRef.current = code;
      setDirty(false);
    }
    return ok;
  };

  const handleRun = async () => {
    if (!fileRef.current) return;
    setRunning(true);
    setShowRun(true);
    const result = await onRun(getCode(), stdin);
    setRunResult(result);
    setRunning(false);
  };

  if (!file) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#0F172A] text-white/30">
        <Code2 className="w-10 h-10" />
        <p className="text-sm">Select a file to start collaborating</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0F172A]">
      <div className="flex items-center justify-between border-b border-white/5 bg-[#1e293b]/60 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Code2 className="w-4 h-4 shrink-0 text-teal-400" />
          <span className="truncate text-xs font-bold text-white">{file.path}</span>
          {dirty && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" title="Unsaved changes" />}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="mr-1 flex items-center gap-1 text-[10px]">
            {connected ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-white/30" />
                <span className="text-white/30">Offline</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenComments}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-white/60 hover:bg-white/5 hover:text-white"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Comments
          </button>
          <button
            type="button"
            onClick={onOpenVersions}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-white/60 hover:bg-white/5 hover:text-white"
          >
            <History className="w-3.5 h-3.5" /> Versions
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-white/60 hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            <Play className="w-3.5 h-3.5" /> Run
          </button>
          {canWrite && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex items-center gap-1 rounded-md bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <Editor
          key={file.file_id}
          height="100%"
          theme="vs-dark"
          defaultLanguage={file.language || 'java'}
          defaultValue={file.content ?? ''}
          onMount={handleMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
            readOnly: !canWrite,
          }}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/80">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          </div>
        )}
      </div>

      {showRun && (
        <div className="border-t border-white/5 bg-[#0B1121]">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Output</span>
            <input
              value={stdin}
              onChange={(event) => setStdin(event.target.value)}
              placeholder="stdin (optional)"
              className="mr-2 w-48 rounded-md border border-white/10 bg-[#0F172A] px-2 py-1 text-xs text-white outline-none focus:border-teal-500/50"
            />
            <button
              type="button"
              onClick={() => setShowRun(false)}
              className="rounded p-1 text-white/40 hover:text-white"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>
          <pre className="max-h-48 overflow-auto px-3 pb-3 text-xs text-white/70">
            {running
              ? 'Running…'
              : runResult
                ? [
                    ...(runResult.compile_errors?.length ? ['--- compile errors ---', ...runResult.compile_errors] : []),
                    ...(runResult.output ? ['--- stdout ---', runResult.output] : []),
                    ...(runResult.error ? ['--- stderr ---', runResult.error] : []),
                    ...(runResult.message ? [runResult.message] : []),
                  ].join('\n') || 'No output.'
                : 'Run the file to see its output.'}
          </pre>
        </div>
      )}
    </div>
  );
}

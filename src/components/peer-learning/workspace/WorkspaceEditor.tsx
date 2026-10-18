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
  Terminal,
  Wifi,
  WifiOff,
} from 'lucide-react';
import type { WorkspaceCollabProvider } from '@/lib/workspace/collab';
import type { CodeRunResult, WorkspaceFile } from '@/lib/api/workspaces';
import WorkspaceTerminal from './WorkspaceTerminal';

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
  const mountIdRef = useRef(0);
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

  const destroyBinding = () => {
    const binding = bindingRef.current;
    bindingRef.current = null;
    if (!binding) return;
    try {
      binding.destroy();
    } catch {
      // y-monaco auto-destroys the binding when the Monaco model is disposed
      // (switching files remounts the Editor via `key`), so a manual destroy
      // can throw: "[yjs] Tried to remove event handler that doesn't exist."
    }
  };

  useEffect(() => {
    return () => {
      mountIdRef.current++;
      destroyBinding();
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

    destroyBinding();
    const mountId = ++mountIdRef.current;

    void (async () => {
      const ytext = await currentProvider.prepareFile(currentFile.file_id, currentFile.content ?? '');
      if (mountId !== mountIdRef.current) return;
      const model = editor.getModel();
      if (!model) return;
      const { MonacoBinding: Binding } = await import('y-monaco');
      if (mountId !== mountIdRef.current) return;
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
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-background text-subtle-foreground">
        <Code2 className="w-10 h-10" />
        <p className="text-sm">Select a file to start collaborating</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border bg-card/60 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Code2 className="w-4 h-4 shrink-0 text-teal-700 dark:text-teal-400" />
          <span className="truncate text-xs font-bold text-foreground">{file.path}</span>
          {dirty && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" title="Unsaved changes" />}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="mr-1 flex items-center gap-1 text-[10px]">
            {connected ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-subtle-foreground" />
                <span className="text-subtle-foreground">Offline</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenComments}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Comments
          </button>
          <button
            type="button"
            onClick={onOpenVersions}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <History className="w-3.5 h-3.5" /> Versions
          </button>
          <button
            type="button"
            onClick={() => setShowRun((prev) => !prev)}
            title="Toggle terminal"
            className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-xs hover:bg-muted hover:text-foreground ${
              showRun ? 'text-teal-700 dark:text-teal-300' : 'text-muted-foreground'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Terminal
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
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
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          </div>
        )}
      </div>

      {showRun && (
        <div className="h-44 shrink-0 sm:h-56">
          <WorkspaceTerminal
            fileName={file.name}
            running={running}
            result={runResult}
            stdin={stdin}
            canRun={canWrite}
            onStdinChange={setStdin}
            onRun={handleRun}
            onClear={() => setRunResult(null)}
            onClose={() => setShowRun(false)}
          />
        </div>
      )}
    </div>
  );
}

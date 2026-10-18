'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Eraser, Play, X } from 'lucide-react';
import type { CodeRunResult } from '@/lib/api/workspaces';

type LineKind = 'command' | 'stdout' | 'stderr' | 'ok' | 'fail' | 'note';

interface TerminalLine {
  kind: LineKind;
  text: string;
}

const KIND_CLASS: Record<LineKind, string> = {
  command: 'text-teal-700 dark:text-teal-300',
  stdout: 'text-foreground',
  stderr: 'text-rose-600 dark:text-rose-400',
  ok: 'text-emerald-700 dark:text-emerald-400',
  fail: 'text-rose-600 dark:text-rose-400',
  note: 'text-muted-foreground',
};

function splitLines(text: string): string[] {
  const trimmed = text.replace(/\n$/, '');
  return trimmed ? trimmed.split('\n') : [];
}

function buildLines(result: CodeRunResult | null, target: string): TerminalLine[] {
  if (!result) {
    return [{ kind: 'note', text: 'Press Run to compile and execute this file in the sandbox.' }];
  }

  const lines: TerminalLine[] = [];

  const compileCommand = result.compile_command || (result.compiled ? result.command : undefined);
  if (compileCommand) {
    lines.push({ kind: 'command', text: `$ ${compileCommand}` });
  }

  for (const error of result.compile_errors ?? []) {
    lines.push({ kind: 'stderr', text: error });
  }

  if (result.compiled) {
    const runCommand = result.run_command || (result.execution_enabled ? result.command : undefined);
    if (runCommand) {
      lines.push({ kind: 'command', text: `$ ${runCommand}` });
    }
    for (const line of splitLines(result.output || '')) {
      lines.push({ kind: 'stdout', text: line });
    }
    for (const line of splitLines(result.error || '')) {
      lines.push({ kind: 'stderr', text: line });
    }
  } else if (!(result.compile_errors ?? []).length && result.error) {
    for (const line of splitLines(result.error)) {
      lines.push({ kind: 'stderr', text: line });
    }
  }

  if (result.message) {
    lines.push({ kind: 'note', text: result.message });
  }

  if (result.compiled && result.execution_enabled) {
    const code = result.exit_code;
    lines.push({
      kind: code === 0 ? 'ok' : 'fail',
      text:
        code === 0
          ? `Process finished with exit code 0${result.duration_ms ? ` in ${result.duration_ms} ms` : ''}`
          : `Process finished with exit code ${code ?? 'null'}`,
    });
  } else if (result.compiled && !result.execution_enabled) {
    lines.push({ kind: 'note', text: `Compilation of ${target} finished — execution is disabled.` });
  } else {
    lines.push({ kind: 'fail', text: `Compilation failed${result.exit_code != null ? ` with exit code ${result.exit_code}` : ''}.` });
  }

  return lines;
}

interface WorkspaceTerminalProps {
  fileName: string;
  running: boolean;
  result: CodeRunResult | null;
  stdin: string;
  canRun: boolean;
  onStdinChange: (value: string) => void;
  onRun: () => void;
  onClear: () => void;
  onClose: () => void;
}

export default function WorkspaceTerminal({
  fileName,
  running,
  result,
  stdin,
  canRun,
  onStdinChange,
  onRun,
  onClear,
  onClose,
}: WorkspaceTerminalProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const lines = useMemo(() => buildLines(result, fileName), [result, fileName]);

  useEffect(() => {
    const node = bodyRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines, running]);

  return (
    <div className="flex h-full min-h-0 flex-col border-t border-border bg-[#0b1120]">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 bg-[#0d1526] px-3 py-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-subtle-foreground">Terminal</span>
        <span className="truncate text-[10px] text-muted-foreground">{fileName}</span>

        <div className="ml-auto flex items-center gap-1.5">
          <input
            value={stdin}
            onChange={(event) => onStdinChange(event.target.value)}
            placeholder="stdin"
            className="w-40 rounded-md border border-white/10 bg-background px-2 py-1 text-[11px] text-foreground outline-none focus:border-teal-500/50"
          />
          <button
            type="button"
            onClick={onRun}
            disabled={running || !canRun}
            title="Run in sandbox"
            className="flex items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play className="h-3 w-3" /> {running ? 'Running…' : 'Run'}
          </button>
          <button
            type="button"
            onClick={onClear}
            title="Clear terminal"
            className="rounded p-1 text-subtle-foreground hover:bg-white/5 hover:text-foreground"
          >
            <Eraser className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close terminal"
            className="rounded p-1 text-subtle-foreground hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={bodyRef}
        className="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-[11px] leading-[1.6] sm:text-xs"
      >
        {running && !result && <p className={KIND_CLASS.note}>Running…</p>}
        {lines.map((line, index) => (
          <p key={`${index}-${line.kind}`} className={`whitespace-pre-wrap break-all ${KIND_CLASS[line.kind]}`}>
            {line.text || ' '}
          </p>
        ))}
        {running && result && <p className={KIND_CLASS.note}>Running…</p>}
      </div>
    </div>
  );
}

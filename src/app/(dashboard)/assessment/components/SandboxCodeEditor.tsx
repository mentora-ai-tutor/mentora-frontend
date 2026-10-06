"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#0F172A]">
      <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
      <span className="ml-2 text-sm text-white/40">Loading editor...</span>
    </div>
  ),
});

interface SandboxCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: number;
  readOnly?: boolean;
}

export default function SandboxCodeEditor({
  value,
  onChange,
  language = "java",
  height = 320,
  readOnly = false,
}: SandboxCodeEditorProps) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0F172A]">
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        theme="mentora-dark"
        onChange={(v) => onChange(v ?? "")}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("mentora-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
              { token: "comment", foreground: "64748b", fontStyle: "italic" },
              { token: "keyword", foreground: "5eead4" },
              { token: "string", foreground: "86efac" },
              { token: "number", foreground: "fbbf24" },
            ],
            colors: {
              "editor.background": "#0F172A",
              "editor.lineHighlightBackground": "#1e293b80",
              "editorLineNumber.foreground": "#475569",
              "editorLineNumber.activeForeground": "#94a3b8",
              "editorCursor.foreground": "#2dd4bf",
              "editor.selectionBackground": "#0d948840",
            },
          });
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
          readOnly,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        }}
      />
    </div>
  );
}

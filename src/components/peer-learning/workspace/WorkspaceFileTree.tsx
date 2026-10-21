'use client';

import { useMemo, useState } from 'react';
import {
  ChevronRight,
  File,
  FileCode,
  Folder,
  FolderOpen,
  FolderPlus,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import type { FileCreateInput, WorkspaceFile } from '@/lib/api/workspaces';

interface WorkspaceFileTreeProps {
  files: WorkspaceFile[];
  activeFileId: string | null;
  canWrite: boolean;
  activeFileIds?: string[];
  onSelect: (file: WorkspaceFile) => void;
  onCreate: (input: FileCreateInput) => void;
  onRename: (file: WorkspaceFile, name: string) => void;
  onDelete: (file: WorkspaceFile) => void;
}

interface TreeNode {
  entry: WorkspaceFile;
  children: TreeNode[];
}

function parentPathOf(path: string): string {
  const idx = path.lastIndexOf('/');
  return idx === -1 ? '' : path.slice(0, idx);
}

function entryPath(entry: WorkspaceFile): string {
  return entry.path || entry.name || '';
}

function buildTree(files: WorkspaceFile[]): TreeNode[] {
  const byPath = new Map<string, TreeNode>();
  const usable = files.filter((entry) => Boolean(entryPath(entry)));
  for (const entry of usable) {
    byPath.set(entryPath(entry), { entry, children: [] });
  }
  const roots: TreeNode[] = [];
  const sorted = [...usable].sort((a, b) => entryPath(a).localeCompare(entryPath(b)));
  for (const entry of sorted) {
    const node = byPath.get(entryPath(entry));
    if (!node) continue;
    const parentPath = parentPathOf(entryPath(entry));
    if (parentPath && byPath.has(parentPath)) {
      byPath.get(parentPath)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortNodes = (nodes: TreeNode[]): void => {
    nodes.sort((a, b) => {
      if (a.entry.type !== b.entry.type) return a.entry.type === 'folder' ? -1 : 1;
      return a.entry.name.localeCompare(b.entry.name);
    });
    nodes.forEach((node) => sortNodes(node.children));
  };
  sortNodes(roots);
  return roots;
}

export default function WorkspaceFileTree({
  files,
  activeFileId,
  canWrite,
  activeFileIds = [],
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: WorkspaceFileTreeProps) {
  const tree = useMemo(() => buildTree(files), [files]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [creating, setCreating] = useState<{ parent: string; type: 'file' | 'folder' } | null>(null);
  const [newName, setNewName] = useState('');

  const activeSet = useMemo(() => new Set(activeFileIds), [activeFileIds]);

  const toggle = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const submitCreate = () => {
    if (!creating) return;
    const name = newName.trim();
    if (name) {
      onCreate({ name, parent_path: creating.parent, type: creating.type });
      setExpanded((prev) => ({ ...prev, [creating.parent]: true }));
    }
    setCreating(null);
    setNewName('');
  };

  const submitRename = (file: WorkspaceFile) => {
    const name = renameValue.trim();
    if (name && name !== file.name) onRename(file, name);
    setRenamingId(null);
    setRenameValue('');
  };

  const renderCreateRow = (depth: number) => (
    <div className="flex items-center gap-2 py-1 pr-2" style={{ paddingLeft: `${depth * 14 + 24}px` }}>
      {creating?.type === 'folder' ? (
        <FolderPlus className="w-4 h-4 shrink-0 text-teal-700 dark:text-teal-400" />
      ) : (
        <FileCode className="w-4 h-4 shrink-0 text-teal-700 dark:text-teal-400" />
      )}
      <input
        autoFocus
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') submitCreate();
          if (event.key === 'Escape') {
            setCreating(null);
            setNewName('');
          }
        }}
        onBlur={submitCreate}
        placeholder={creating?.type === 'folder' ? 'folder name' : 'File.java'}
        className="min-w-0 flex-1 rounded-md border border-teal-500/40 bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-teal-400"
      />
    </div>
  );

  const renderNode = (node: TreeNode, depth: number) => {
    const { entry } = node;
    const isFolder = entry.type === 'folder';
    const isOpen = expanded[entry.path] ?? true;
    const isActive = entry.id === activeFileId;
    const isBeingViewed = activeSet.has(entry.id);

    return (
      <div key={entry.id}>
        <div
          className={`group flex items-center gap-1.5 rounded-lg pr-1.5 transition-colors ${
            isActive ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'text-muted-foreground hover:bg-muted'
          }`}
          style={{ paddingLeft: `${depth * 14 + 4}px` }}
        >
          <button
            type="button"
            onClick={() => (isFolder ? toggle(entry.path) : onSelect(entry))}
            className="flex min-w-0 flex-1 items-center gap-1.5 py-1.5 text-left"
          >
            {isFolder ? (
              <>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 text-subtle-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`}
                />
                {isOpen ? (
                  <FolderOpen className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400/80" />
                ) : (
                  <Folder className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400/80" />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5 shrink-0" />
                <File className="w-4 h-4 shrink-0 text-subtle-foreground" />
              </>
            )}

            {renamingId === entry.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submitRename(entry);
                  if (event.key === 'Escape') setRenamingId(null);
                }}
                onBlur={() => submitRename(entry)}
                onClick={(event) => event.stopPropagation()}
                className="min-w-0 flex-1 rounded-md border border-teal-500/40 bg-background px-1.5 py-0.5 text-xs text-foreground outline-none"
              />
            ) : (
              <span className="flex-1 truncate text-xs font-medium">{entry.name}</span>
            )}

            {isBeingViewed && !isActive && (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" title="Someone is viewing this file" />
            )}
          </button>

          {canWrite && renamingId !== entry.id && (
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              {isFolder && (
                <>
                  <button
                    type="button"
                    title="New file here"
                    onClick={() => setCreating({ parent: entry.path, type: 'file' })}
                    className="rounded p-1 text-subtle-foreground hover:bg-surface-3 hover:text-foreground"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    title="New folder here"
                    onClick={() => {
                      setCreating({ parent: entry.path, type: 'folder' });
                      setExpanded((prev) => ({ ...prev, [entry.path]: true }));
                    }}
                    className="rounded p-1 text-subtle-foreground hover:bg-surface-3 hover:text-foreground"
                  >
                    <FolderPlus className="w-3 h-3" />
                  </button>
                </>
              )}
              <button
                type="button"
                title="Rename"
                onClick={() => {
                  setRenamingId(entry.id);
                  setRenameValue(entry.name);
                }}
                className="rounded p-1 text-subtle-foreground hover:bg-surface-3 hover:text-foreground"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                type="button"
                title="Delete"
                onClick={() => onDelete(entry)}
                className="rounded p-1 text-subtle-foreground hover:bg-rose-500/20 hover:text-rose-700 dark:hover:text-rose-300"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {isFolder && isOpen && (
          <div>
            {creating?.parent === entry.path && renderCreateRow(depth + 1)}
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">
          <MoreVertical className="w-3 h-3" /> Explorer
        </span>
        {canWrite && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="New file"
              onClick={() => setCreating({ parent: '', type: 'file' })}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-3 hover:text-teal-700 dark:hover:text-teal-300"
            >
              <File className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="New folder"
              onClick={() => setCreating({ parent: '', type: 'folder' })}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-3 hover:text-teal-700 dark:hover:text-teal-300"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-1.5 py-2">
        {creating?.parent === '' && renderCreateRow(0)}
        {tree.length === 0 && !creating ? (
          <p className="px-3 py-6 text-center text-xs text-subtle-foreground">
            No files yet.{canWrite ? ' Create one to get started.' : ''}
          </p>
        ) : (
          tree.map((node) => renderNode(node, 0))
        )}
      </div>
    </div>
  );
}

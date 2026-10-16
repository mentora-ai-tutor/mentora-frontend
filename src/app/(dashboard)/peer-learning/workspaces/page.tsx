'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Archive,
  ArrowRight,
  FolderKanban,
  KeyRound,
  Link2,
  Plus,
  RotateCcw,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { workspaceApi, type Workspace } from '@/lib/api/workspaces';

export default function WorkspacesPage() {
  const router = useRouter();
  const [active, setActive] = useState<Workspace[]>([]);
  const [archived, setArchived] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [joinKey, setJoinKey] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const notify = (type: 'error' | 'success', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  const load = useCallback(async () => {
    const [activeRes, archivedRes] = await Promise.all([
      workspaceApi.listWorkspaces(false),
      workspaceApi.listWorkspaces(true),
    ]);
    if (activeRes.success && activeRes.data) {
      setActive(activeRes.data.workspaces);
    } else {
      notify('error', activeRes.message || 'Failed to load workspaces');
    }
    if (archivedRes.success && archivedRes.data) {
      setArchived(archivedRes.data.workspaces.filter((item) => item.status === 'archived'));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async () => {
    const value = name.trim();
    if (!value) return;
    setBusy(true);
    const res = await workspaceApi.createWorkspace({ name: value, description: description.trim() || undefined });
    setBusy(false);
    if (res.success && res.data?.workspace) {
      router.push(`/peer-learning/workspaces/${res.data.workspace.workspace_id}`);
    } else {
      notify('error', res.message || 'Could not create workspace');
    }
  };

  const handleJoin = async () => {
    const value = joinKey.trim();
    if (!value) return;
    setBusy(true);
    const res = await workspaceApi.joinWithKey(value);
    setBusy(false);
    if (res.success && res.data?.workspace_id) {
      router.push(`/peer-learning/workspaces/${res.data.workspace_id}`);
    } else {
      notify('error', res.message || 'Invalid or expired join key');
    }
  };

  const handleAcceptInvite = async () => {
    const value = inviteToken.trim();
    if (!value) return;
    setBusy(true);
    const res = await workspaceApi.acceptInvite(value);
    setBusy(false);
    if (res.success && res.data?.workspace_id) {
      router.push(`/peer-learning/workspaces/${res.data.workspace_id}`);
    } else {
      notify('error', res.message || 'Invalid or expired invite');
    }
  };

  const handleUnarchive = async (workspaceId: string) => {
    const res = await workspaceApi.unarchiveWorkspace(workspaceId);
    if (res.success) {
      setLoading(true);
      void load();
    } else {
      notify('error', res.message || 'Unarchive failed');
    }
  };

  const handlePurge = async (workspaceId: string, name: string) => {
    if (!window.confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
    const res = await workspaceApi.purgeWorkspace(workspaceId);
    if (res.success) {
      setLoading(true);
      void load();
    } else {
      notify('error', res.message || 'Delete failed');
    }
  };

  const renderCard = (workspace: Workspace, isArchived: boolean) => (
    <div
      key={workspace.workspace_id}
      className="group flex flex-col rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-teal-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/peer-learning/workspaces/${workspace.workspace_id}`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10">
            <FolderKanban className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-700 dark:group-hover:text-teal-300">{workspace.name}</h3>
            <p className="truncate text-xs text-subtle-foreground">{workspace.description || 'No description'}</p>
          </div>
        </Link>
        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted-foreground">
          {workspace.role}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-subtle-foreground">
          <Users className="h-3.5 w-3.5" /> {workspace.member_count} member{workspace.member_count === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-2">
          {isArchived ? (
            <>
              <button
                type="button"
                onClick={() => handleUnarchive(workspace.workspace_id)}
                className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted"
              >
                <RotateCcw className="h-3 w-3" /> Unarchive
              </button>
              <button
                type="button"
                onClick={() => handlePurge(workspace.workspace_id, workspace.name)}
                className="rounded-lg border border-rose-500/20 p-1.5 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          ) : (
            <Link
              href={`/peer-learning/workspaces/${workspace.workspace_id}`}
              className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-teal-500"
            >
              Open <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-slide-up space-y-6">
      {notice && (
        <div
          className={`fixed right-6 top-20 z-[60] rounded-lg border px-4 py-2.5 text-xs font-medium shadow-lg ${
            notice.type === 'error'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10">
              <FolderKanban className="h-5 w-5 text-teal-700 dark:text-teal-400" />
            </div>
            <h1 className="text-2xl font-black text-foreground md:text-3xl">Project Workspaces</h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Collaborate with your team in shared workspaces: edit code together in real time, chat, manage tasks,
            comment, and get AI help — all in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((prev) => !prev)}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-500"
        >
          {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreate ? 'Cancel' : 'New workspace'}
        </button>
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-border bg-card/50 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Workspace name"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-teal-500/50"
            />
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short description (optional)"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-teal-500/50"
            />
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={busy || !name.trim()}
            className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-40"
          >
            Create workspace
          </button>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card/50 p-3">
          <KeyRound className="ml-1 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
          <input
            value={joinKey}
            onChange={(event) => setJoinKey(event.target.value)}
            placeholder="Enter a join key"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-subtle-foreground"
          />
          <button
            type="button"
            onClick={handleJoin}
            disabled={busy || !joinKey.trim()}
            className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-3 disabled:opacity-40"
          >
            Join
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card/50 p-3">
          <Link2 className="ml-1 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
          <input
            value={inviteToken}
            onChange={(event) => setInviteToken(event.target.value)}
            placeholder="Paste an invite token"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-subtle-foreground"
          />
          <button
            type="button"
            onClick={handleAcceptInvite}
            disabled={busy || !inviteToken.trim()}
            className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-3 disabled:opacity-40"
          >
            Accept
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-subtle-foreground">Active ({active.length})</h2>
            {active.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <FolderKanban className="mx-auto mb-2 h-8 w-8 text-subtle-foreground" />
                <p className="text-sm text-subtle-foreground">No workspaces yet. Create one or join with a key.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {active.map((workspace) => renderCard(workspace, false))}
              </div>
            )}
          </section>

          {archived.length > 0 && (
            <section className="space-y-3">
              <button
                type="button"
                onClick={() => setShowArchived((prev) => !prev)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-subtle-foreground hover:text-muted-foreground"
              >
                <Archive className="h-3.5 w-3.5" /> Archived ({archived.length})
              </button>
              {showArchived && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {archived.map((workspace) => renderCard(workspace, true))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

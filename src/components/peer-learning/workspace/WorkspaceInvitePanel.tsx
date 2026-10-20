'use client';

import { useState } from 'react';
import { Check, Copy, KeyRound, Search, Trash2 } from 'lucide-react';
import type { InviteMeta, JoinKeyMeta, StudentSearchResult } from '@/lib/api/workspaces';

interface WorkspaceInvitePanelProps {
  joinKeys: JoinKeyMeta[];
  invites: InviteMeta[];
  onCreateJoinKey: (role: 'member' | 'viewer') => Promise<string | null>;
  onRevokeJoinKey: (keyId: string) => void;
  searchStudents: (query: string) => Promise<StudentSearchResult[]>;
  onInviteStudent: (studentId: string, role: 'member' | 'viewer') => Promise<boolean>;
  onRevokeInvite: (inviteId: string) => void;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded p-1 text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export default function WorkspaceInvitePanel({
  joinKeys,
  invites,
  onCreateJoinKey,
  onRevokeJoinKey,
  searchStudents,
  onInviteStudent,
  onRevokeInvite,
}: WorkspaceInvitePanelProps) {
  const [role, setRole] = useState<'member' | 'viewer'>('member');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StudentSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const generateKey = async () => {
    setBusy(true);
    setGeneratedKey(await onCreateJoinKey(role));
    setBusy(false);
  };

  const runSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    setResults(await searchStudents(value.trim()));
    setSearching(false);
  };

  const invite = async (studentId: string) => {
    const ok = await onInviteStudent(studentId, role);
    if (ok) {
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div className="h-full space-y-4 overflow-y-auto p-3">
      <div className="rounded-lg border border-border bg-card/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">
            Invite students
          </span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as 'member' | 'viewer')}
            className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none"
          >
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-subtle-foreground" />
          <input
            value={query}
            onChange={(event) => void runSearch(event.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-2.5 text-xs text-foreground outline-none focus:border-teal-500/50"
          />
        </div>
        {searching && <p className="mt-1.5 text-[10px] text-subtle-foreground">Searching…</p>}
        {results.length > 0 && (
          <div className="mt-1.5 max-h-36 space-y-1 overflow-y-auto">
            {results.map((student) => (
              <button
                key={student.student_id}
                type="button"
                onClick={() => void invite(student.student_id)}
                className="flex w-full items-center justify-between rounded-md border border-border bg-card/50 px-2.5 py-1.5 text-left hover:border-teal-500/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-foreground">
                    {student.name || student.student_id}
                  </p>
                  <p className="truncate text-[10px] text-subtle-foreground">{student.email}</p>
                </div>
                <span className="text-[10px] text-teal-700 dark:text-teal-300">Send invite</span>
              </button>
            ))}
          </div>
        )}
        {query.trim() && !searching && results.length === 0 && (
          <p className="mt-1.5 text-[10px] text-subtle-foreground">No students found.</p>
        )}

        <button
          type="button"
          onClick={() => void generateKey()}
          disabled={busy}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-teal-600 py-2 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-40"
        >
          <KeyRound className="h-3.5 w-3.5" /> Create join key
        </button>

        {generatedKey && (
          <div className="mt-2 flex items-center justify-between rounded-md border border-teal-500/30 bg-teal-500/10 px-2.5 py-1.5">
            <code className="text-xs font-bold tracking-wider text-teal-700 dark:text-teal-200">
              {generatedKey}
            </code>
            <CopyButton value={generatedKey} />
          </div>
        )}
        <p className="mt-2 text-[10px] text-subtle-foreground">
          Join keys are shown only once. Share them securely.
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">
          Join keys ({joinKeys.length})
        </h4>
        <div className="space-y-1.5">
          {joinKeys.length === 0 && <p className="text-[11px] text-subtle-foreground">No join keys.</p>}
          {joinKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-2.5 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-foreground/80">{key.id}</p>
                <p className="text-[10px] capitalize text-subtle-foreground">
                  {key.role} · {key.uses}
                  {key.max_uses ? `/${key.max_uses}` : ''} uses ·{' '}
                  {key.is_active && !key.revoked ? 'active' : 'inactive'}
                </p>
              </div>
              {key.is_active && !key.revoked && (
                <button
                  type="button"
                  onClick={() => onRevokeJoinKey(key.id)}
                  className="rounded p-1 text-subtle-foreground hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">
          Sent invites ({invites.length})
        </h4>
        <div className="space-y-1.5">
          {invites.length === 0 && <p className="text-[11px] text-subtle-foreground">No invites.</p>}
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-2.5 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-foreground/80">
                  {invite.workspace_name || invite.student_id}
                </p>
                <p className="text-[10px] capitalize text-subtle-foreground">
                  {invite.role} · {invite.status}
                </p>
              </div>
              {invite.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => onRevokeInvite(invite.id)}
                  className="rounded p-1 text-subtle-foreground hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

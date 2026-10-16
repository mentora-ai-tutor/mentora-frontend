'use client';

import { useState } from 'react';
import { Check, Copy, KeyRound, Link2, Trash2 } from 'lucide-react';
import type { InviteMeta, JoinKeyMeta, WorkspaceRole } from '@/lib/api/workspaces';

interface WorkspaceInvitePanelProps {
  joinKeys: JoinKeyMeta[];
  invites: InviteMeta[];
  onCreateJoinKey: (role: WorkspaceRole) => Promise<string | null>;
  onRevokeJoinKey: (keyId: string) => void;
  onCreateInvite: (role: WorkspaceRole) => Promise<string | null>;
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
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function WorkspaceInvitePanel({
  joinKeys,
  invites,
  onCreateJoinKey,
  onRevokeJoinKey,
  onCreateInvite,
  onRevokeInvite,
}: WorkspaceInvitePanelProps) {
  const [role, setRole] = useState<WorkspaceRole>('editor');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [generatedInvite, setGeneratedInvite] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const generateKey = async () => {
    setBusy(true);
    setGeneratedKey(await onCreateJoinKey(role));
    setBusy(false);
  };

  const generateInvite = async () => {
    setBusy(true);
    setGeneratedInvite(await onCreateInvite(role));
    setBusy(false);
  };

  return (
    <div className="h-full space-y-4 overflow-y-auto p-3">
      <div className="rounded-lg border border-border bg-card/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">Create access</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as WorkspaceRole)}
            className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none"
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={generateKey}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-teal-600 py-2 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-40"
          >
            <KeyRound className="h-3.5 w-3.5" /> Join key
          </button>
          <button
            type="button"
            onClick={generateInvite}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-teal-500/30 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 disabled:opacity-40"
          >
            <Link2 className="h-3.5 w-3.5" /> Invite token
          </button>
        </div>

        {generatedKey && (
          <div className="mt-2 flex items-center justify-between rounded-md border border-teal-500/30 bg-teal-500/10 px-2.5 py-1.5">
            <code className="text-xs font-bold tracking-wider text-teal-200">{generatedKey}</code>
            <CopyButton value={generatedKey} />
          </div>
        )}
        {generatedInvite && (
          <div className="mt-2 flex items-center justify-between rounded-md border border-teal-500/30 bg-teal-500/10 px-2.5 py-1.5">
            <code className="truncate text-[10px] text-teal-200">{generatedInvite}</code>
            <CopyButton value={generatedInvite} />
          </div>
        )}
        <p className="mt-2 text-[10px] text-subtle-foreground">Secrets are shown only once. Share them securely.</p>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">
          Join keys ({joinKeys.length})
        </h4>
        <div className="space-y-1.5">
          {joinKeys.length === 0 && <p className="text-[11px] text-subtle-foreground">No join keys.</p>}
          {joinKeys.map((key) => (
            <div
              key={key.key_id}
              className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-2.5 py-2"
            >
              <div>
                <p className="text-[11px] font-semibold text-foreground/80">{key.key_id}</p>
                <p className="text-[10px] capitalize text-subtle-foreground">
                  {key.role} · {key.uses}
                  {key.max_uses ? `/${key.max_uses}` : ''} uses · {key.status}
                </p>
              </div>
              {key.status === 'active' && (
                <button
                  type="button"
                  onClick={() => onRevokeJoinKey(key.key_id)}
                  className="rounded p-1 text-subtle-foreground hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-700 dark:hover:text-rose-300"
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
          Invites ({invites.length})
        </h4>
        <div className="space-y-1.5">
          {invites.length === 0 && <p className="text-[11px] text-subtle-foreground">No invites.</p>}
          {invites.map((invite) => (
            <div
              key={invite.invite_id}
              className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-2.5 py-2"
            >
              <div>
                <p className="text-[11px] font-semibold text-foreground/80">{invite.invite_id}</p>
                <p className="text-[10px] capitalize text-subtle-foreground">
                  {invite.role} · {invite.uses}
                  {invite.max_uses ? `/${invite.max_uses}` : ''} uses · {invite.status}
                </p>
              </div>
              {invite.status === 'active' && (
                <button
                  type="button"
                  onClick={() => onRevokeInvite(invite.invite_id)}
                  className="rounded p-1 text-subtle-foreground hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-700 dark:hover:text-rose-300"
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

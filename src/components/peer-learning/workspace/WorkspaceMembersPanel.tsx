'use client';

import { useState } from 'react';
import { Crown, LogOut, Search, Shield, UserMinus, UserPlus } from 'lucide-react';
import type { StudentSearchResult, WorkspaceMember, WorkspaceRole } from '@/lib/api/workspaces';

interface WorkspaceMembersPanelProps {
  members: WorkspaceMember[];
  memberNames: Record<string, string>;
  currentStudentId: string;
  onlineIds: string[];
  canManage: boolean;
  onInvite: (studentId: string, role: 'member' | 'viewer') => Promise<boolean>;
  onRoleChange: (studentId: string, role: 'member' | 'viewer') => void;
  onRemove: (studentId: string) => void;
  onTransfer: (studentId: string) => void;
  onLeave: () => void;
  onOpenInvites: () => void;
  searchStudents: (query: string) => Promise<StudentSearchResult[]>;
}

const ROLE_ICONS: Record<WorkspaceRole, typeof Crown> = {
  leader: Crown,
  member: Shield,
  viewer: UserPlus,
};

export default function WorkspaceMembersPanel({
  members,
  memberNames,
  currentStudentId,
  onlineIds,
  canManage,
  onInvite,
  onRoleChange,
  onRemove,
  onTransfer,
  onLeave,
  onOpenInvites,
  searchStudents,
}: WorkspaceMembersPanelProps) {
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StudentSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [newRole, setNewRole] = useState<'member' | 'viewer'>('member');
  const onlineSet = new Set(onlineIds);

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

  const submitInvite = async (studentId: string) => {
    const ok = await onInvite(studentId, newRole);
    if (ok) {
      setQuery('');
      setResults([]);
      setAdding(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">
          {members.length} member{members.length === 1 ? '' : 's'}
        </span>
        {canManage && (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onOpenInvites}
              className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-surface-3"
            >
              Invites
            </button>
            <button
              type="button"
              onClick={() => setAdding((prev) => !prev)}
              className="rounded-md bg-teal-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-teal-500"
            >
              Invite
            </button>
          </div>
        )}
      </div>

      {adding && (
        <div className="space-y-2 border-b border-border bg-background/60 p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-subtle-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(event) => void runSearch(event.target.value)}
              placeholder="Search students by name or email…"
              className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-2.5 text-xs text-foreground outline-none focus:border-teal-500/50"
            />
          </div>
          <select
            value={newRole}
            onChange={(event) => setNewRole(event.target.value as 'member' | 'viewer')}
            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none"
          >
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          {searching && <p className="text-[10px] text-subtle-foreground">Searching…</p>}
          {results.length > 0 && (
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {results.map((student) => (
                <button
                  key={student.student_id}
                  type="button"
                  onClick={() => void submitInvite(student.student_id)}
                  className="flex w-full items-center justify-between rounded-md border border-border bg-card/50 px-2.5 py-1.5 text-left hover:border-teal-500/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-foreground">
                      {student.name || student.student_id}
                    </p>
                    <p className="truncate text-[10px] text-subtle-foreground">{student.email}</p>
                  </div>
                  <span className="text-[10px] text-teal-700 dark:text-teal-300">Invite</span>
                </button>
              ))}
            </div>
          )}
          {query.trim() && !searching && results.length === 0 && (
            <p className="text-[10px] text-subtle-foreground">No students found.</p>
          )}
        </div>
      )}

      <div className="flex-1 space-y-1.5 overflow-y-auto p-2.5">
        {members.map((member) => {
          const RoleIcon = ROLE_ICONS[member.role] || Shield;
          const isSelf = member.student_id === currentStudentId;
          const isOwner = member.role === 'leader';
          const name = member.name || memberNames[member.student_id] || member.student_id;
          return (
            <div
              key={member.student_id}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-card/40 px-2.5 py-2"
            >
              <div className="relative">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: member.color || 'rgba(20,184,166,0.15)' }}
                >
                  {name.slice(0, 2).toUpperCase()}
                </div>
                {onlineSet.has(member.student_id) && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-xs font-semibold text-foreground">
                  {name}
                  {isSelf && <span className="text-[10px] font-normal text-subtle-foreground">(you)</span>}
                </p>
                <p className="flex items-center gap-1 text-[10px] capitalize text-subtle-foreground">
                  <RoleIcon className="h-3 w-3" /> {member.role}
                </p>
              </div>

              {canManage && !isSelf && (
                <div className="flex items-center gap-1">
                  {!isOwner && (
                    <select
                      value={member.role}
                      onChange={(event) =>
                        onRoleChange(member.student_id, event.target.value as 'member' | 'viewer')
                      }
                      className="rounded border border-border bg-background px-1.5 py-1 text-[10px] text-muted-foreground outline-none"
                    >
                      <option value="member">member</option>
                      <option value="viewer">viewer</option>
                    </select>
                  )}
                  {!isOwner && (
                    <>
                      <button
                        type="button"
                        title="Transfer leadership"
                        onClick={() => onTransfer(member.student_id)}
                        className="rounded p-1 text-subtle-foreground hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300"
                      >
                        <Crown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Remove member"
                        onClick={() => onRemove(member.student_id)}
                        className="rounded p-1 text-subtle-foreground hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-300"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-border p-2.5">
        <button
          type="button"
          onClick={onLeave}
          disabled={members.some((m) => m.student_id === currentStudentId && m.role === 'leader')}
          title={
            members.some((m) => m.student_id === currentStudentId && m.role === 'leader')
              ? 'Transfer leadership or archive before leaving'
              : undefined
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/20 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LogOut className="w-3.5 h-3.5" /> Leave workspace
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Crown, LogOut, Shield, UserMinus, UserPlus } from 'lucide-react';
import type { Workspace, WorkspaceMember, WorkspaceRole } from '@/lib/api/workspaces';

interface WorkspaceMembersPanelProps {
  workspace: Workspace;
  members: WorkspaceMember[];
  memberNames: Record<string, string>;
  currentStudentId: string;
  onlineIds: string[];
  canManage: boolean;
  onAddMember: (studentId: string, role: WorkspaceRole) => void;
  onRoleChange: (studentId: string, role: WorkspaceRole) => void;
  onRemove: (studentId: string) => void;
  onTransfer: (studentId: string) => void;
  onLeave: () => void;
  onOpenInvites: () => void;
}

const ROLE_ICONS: Record<WorkspaceRole, typeof Crown> = {
  owner: Crown,
  editor: Shield,
  viewer: UserPlus,
};

export default function WorkspaceMembersPanel({
  workspace,
  members,
  memberNames,
  currentStudentId,
  onlineIds,
  canManage,
  onAddMember,
  onRoleChange,
  onRemove,
  onTransfer,
  onLeave,
  onOpenInvites,
}: WorkspaceMembersPanelProps) {
  const [adding, setAdding] = useState(false);
  const [newId, setNewId] = useState('');
  const [newRole, setNewRole] = useState<WorkspaceRole>('editor');
  const onlineSet = new Set(onlineIds);

  const submitAdd = () => {
    const value = newId.trim();
    if (!value) return;
    onAddMember(value, newRole);
    setNewId('');
    setNewRole('editor');
    setAdding(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
          {members.length} member{members.length === 1 ? '' : 's'}
        </span>
        {canManage && (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onOpenInvites}
              className="rounded-md bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10"
            >
              Invites
            </button>
            <button
              type="button"
              onClick={() => setAdding((prev) => !prev)}
              className="rounded-md bg-teal-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-teal-500"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {adding && (
        <div className="space-y-2 border-b border-white/5 bg-[#0F172A]/60 p-3">
          <input
            autoFocus
            value={newId}
            onChange={(event) => setNewId(event.target.value)}
            placeholder="Student ID"
            className="w-full rounded-md border border-white/10 bg-[#0F172A] px-2.5 py-1.5 text-xs text-white outline-none focus:border-teal-500/50"
          />
          <div className="flex gap-2">
            <select
              value={newRole}
              onChange={(event) => setNewRole(event.target.value as WorkspaceRole)}
              className="flex-1 rounded-md border border-white/10 bg-[#0F172A] px-2 py-1.5 text-xs text-white outline-none"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="owner">Owner</option>
            </select>
            <button
              type="button"
              onClick={submitAdd}
              className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-1.5 overflow-y-auto p-2.5">
        {members.map((member) => {
          const RoleIcon = ROLE_ICONS[member.role] || Shield;
          const isSelf = member.student_id === currentStudentId;
          const name = memberNames[member.student_id] || member.student_id;
          return (
            <div
              key={member.student_id}
              className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-[#1e293b]/40 px-2.5 py-2"
            >
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/15 text-xs font-bold text-teal-300">
                  {name.slice(0, 2).toUpperCase()}
                </div>
                {onlineSet.has(member.student_id) && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0F172A] bg-emerald-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-xs font-semibold text-white/90">
                  {name}
                  {isSelf && <span className="text-[10px] font-normal text-white/40">(you)</span>}
                </p>
                <p className="flex items-center gap-1 text-[10px] capitalize text-white/40">
                  <RoleIcon className="h-3 w-3" /> {member.role}
                </p>
              </div>

              {canManage && !isSelf && (
                <div className="flex items-center gap-1">
                  <select
                    value={member.role}
                    onChange={(event) => onRoleChange(member.student_id, event.target.value as WorkspaceRole)}
                    className="rounded border border-white/10 bg-[#0F172A] px-1.5 py-1 text-[10px] text-white/70 outline-none"
                  >
                    <option value="editor">editor</option>
                    <option value="viewer">viewer</option>
                    <option value="owner">owner</option>
                  </select>
                  {member.role !== 'owner' && (
                    <>
                      <button
                        type="button"
                        title="Transfer ownership"
                        onClick={() => onTransfer(member.student_id)}
                        className="rounded p-1 text-white/40 hover:bg-amber-500/15 hover:text-amber-300"
                      >
                        <Crown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Remove member"
                        onClick={() => onRemove(member.student_id)}
                        className="rounded p-1 text-white/40 hover:bg-rose-500/15 hover:text-rose-300"
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

      <div className="border-t border-white/5 p-2.5">
        <button
          type="button"
          onClick={onLeave}
          disabled={workspace.owner_student_id === currentStudentId}
          title={
            workspace.owner_student_id === currentStudentId
              ? 'Transfer ownership or archive before leaving'
              : undefined
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/20 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LogOut className="w-3.5 h-3.5" /> Leave workspace
        </button>
      </div>
    </div>
  );
}

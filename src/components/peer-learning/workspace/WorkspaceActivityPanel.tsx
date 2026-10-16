'use client';

import { Activity as ActivityIcon } from 'lucide-react';
import type { ActivityEntry } from '@/lib/api/workspaces';

interface WorkspaceActivityPanelProps {
  activity: ActivityEntry[];
  memberNames: Record<string, string>;
}

const ACTION_LABELS: Record<string, string> = {
  workspace_updated: 'updated the workspace',
  workspace_archived: 'archived the workspace',
  workspace_unarchived: 'reactivated the workspace',
  member_added: 'added a member',
  member_removed: 'removed a member',
  member_left: 'left the workspace',
  member_role_changed: 'changed a member role',
  join_key_created: 'created a join key',
  join_key_revoked: 'revoked a join key',
  invite_created: 'created an invite',
  invite_revoked: 'revoked an invite',
  file_created: 'created a file',
  folder_created: 'created a folder',
  file_edited: 'edited a file',
  file_moved: 'moved a file',
  file_deleted: 'deleted a file',
  version_restored: 'restored a version',
  comment_added: 'added a comment',
  comment_updated: 'updated a comment',
  comment_deleted: 'deleted a comment',
  chat_message_sent: 'sent a message',
  chat_message_deleted: 'deleted a message',
  task_created: 'created a task',
  task_updated: 'updated a task',
  task_deleted: 'deleted a task',
  assistant_query: 'asked the AI assistant',
  code_run: 'ran code',
  ownership_transferred: 'transferred ownership',
};

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function WorkspaceActivityPanel({ activity, memberNames }: WorkspaceActivityPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-3">
      {activity.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-subtle-foreground">
          <ActivityIcon className="w-8 h-8" />
          <p className="text-xs">No activity yet</p>
        </div>
      ) : (
        <ol className="space-y-3">
          {activity.map((entry, index) => {
            const actor = memberNames[entry.actor_student_id] || entry.actor_student_id;
            const label = ACTION_LABELS[entry.action] || entry.action.replace(/_/g, ' ');
            const path = typeof entry.detail?.path === 'string' ? entry.detail.path : null;
            return (
              <li key={`${entry.timestamp}-${index}`} className="flex gap-2.5">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400/70" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{actor}</span> {label}
                  </p>
                  {path && <p className="truncate text-[10px] text-teal-700 dark:text-teal-300/70">{path}</p>}
                  <p className="text-[10px] text-subtle-foreground">{formatTime(entry.timestamp)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

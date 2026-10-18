'use client';

import { BarChart3, FileText, MessageSquare, CheckSquare, GitBranch, Users } from 'lucide-react';
import type { WorkspaceAnalytics } from '@/lib/api/workspaces';

interface WorkspaceAnalyticsPanelProps {
  analytics: WorkspaceAnalytics | null;
  loading: boolean;
}

const STAT_ICONS = {
  members: Users,
  files: FileText,
  versions: GitBranch,
  messages: MessageSquare,
  comments: MessageSquare,
  tasks: CheckSquare,
} as const;

export default function WorkspaceAnalyticsPanel({ analytics, loading }: WorkspaceAnalyticsPanelProps) {
  if (loading && !analytics) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-subtle-foreground">
        <BarChart3 className="w-8 h-8" />
        <p className="text-xs">Analytics unavailable</p>
      </div>
    );
  }

  const maxTimeline = Math.max(1, ...analytics.timeline.map((point) => point.count));

  return (
    <div className="h-full space-y-4 overflow-y-auto p-3">
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(analytics.totals) as (keyof WorkspaceAnalytics['totals'])[]).map((key) => {
          const Icon = STAT_ICONS[key];
          return (
            <div key={key} className="rounded-lg border border-border bg-card/50 p-2.5">
              <Icon className="mb-1 h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
              <p className="text-lg font-black text-foreground">{analytics.totals[key]}</p>
              <p className="text-[10px] capitalize text-subtle-foreground">{key}</p>
            </div>
          );
        })}
      </div>

      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">Contributions</h4>
        <div className="space-y-2">
          {analytics.per_member.map((member) => {
            const score = member.files_created + member.file_edits + member.messages_sent;
            return (
              <div key={member.student_id} className="rounded-lg border border-border bg-card/40 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-semibold text-foreground">{member.name}</span>
                  <span className="text-[10px] capitalize text-subtle-foreground">{member.role}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                  <span>{member.files_created} created</span>
                  <span>{member.file_edits} edits</span>
                  <span>{member.messages_sent} messages</span>
                  <span>{member.comments} comments</span>
                  <span>
                    {member.tasks_completed}/{member.tasks_assigned} tasks
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-teal-500/70"
                    style={{ width: `${Math.min(100, score * 8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {analytics.timeline.length > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">Activity (14 days)</h4>
          <div className="flex h-24 items-end gap-1">
            {analytics.timeline
              .slice()
              .reverse()
              .map((point) => (
                <div key={point.date} className="flex flex-1 flex-col items-center gap-1" title={`${point.date}: ${point.count}`}>
                  <div
                    className="w-full rounded-t bg-teal-500/60"
                    style={{ height: `${Math.max(4, (point.count / maxTimeline) * 80)}px` }}
                  />
                  <span className="text-[8px] text-subtle-foreground">{point.date.slice(5)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

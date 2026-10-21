'use client';

import { useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import type {
  TaskCreateInput,
  TaskPriority,
  TaskStatus,
  TaskUpdateInput,
  WorkspaceMember,
  WorkspaceTask,
} from '@/lib/api/workspaces';

interface WorkspaceTasksPanelProps {
  tasks: WorkspaceTask[];
  members: WorkspaceMember[];
  memberNames: Record<string, string>;
  canWrite: boolean;
  onCreate: (input: TaskCreateInput) => void;
  onUpdate: (taskId: string, input: TaskUpdateInput) => void;
  onDelete: (taskId: string) => void;
}

const COLUMNS: { status: TaskStatus; label: string; accent: string }[] = [
  { status: 'todo', label: 'To Do', accent: 'text-muted-foreground' },
  { status: 'in_progress', label: 'In Progress', accent: 'text-sky-700 dark:text-sky-400' },
  { status: 'review', label: 'In Review', accent: 'text-amber-700 dark:text-amber-400' },
  { status: 'done', label: 'Done', accent: 'text-emerald-700 dark:text-emerald-400' },
];

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  high: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
};

export default function WorkspaceTasksPanel({
  tasks,
  members,
  memberNames,
  canWrite,
  onCreate,
  onUpdate,
  onDelete,
}: WorkspaceTasksPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const submit = () => {
    const value = title.trim();
    if (!value) return;
    onCreate({
      title: value,
      priority,
      assignee_student_id: assignee || null,
      status: 'todo',
    });
    setTitle('');
    setAssignee('');
    setPriority('medium');
    setShowForm(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">
          {tasks.length} tasks
        </span>
        {canWrite && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-teal-500"
          >
            <Plus className="w-3 h-3" /> Task
          </button>
        )}
      </div>

      {showForm && (
        <div className="space-y-2 border-b border-border bg-background/60 p-3">
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
            className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-teal-500/50"
          />
          <div className="flex gap-2">
            <select
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-teal-500/50"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.student_id} value={member.student_id}>
                  {member.name || memberNames[member.student_id] || member.student_id}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-teal-500/50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="button"
            onClick={submit}
            className="w-full rounded-md bg-teal-600 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
          >
            Add task
          </button>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.status);
          return (
            <div key={column.status}>
              <div
                className={`mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${column.accent}`}
              >
                {column.label}
                <span className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {columnTasks.length === 0 && (
                  <p className="text-[11px] text-subtle-foreground">Nothing here.</p>
                )}
                {columnTasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-border bg-card/50 p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex-1 text-xs font-medium text-foreground">{task.title}</p>
                      {canWrite && (
                        <button
                          type="button"
                          onClick={() => onDelete(task.id)}
                          className="rounded p-0.5 text-subtle-foreground hover:text-rose-700 dark:hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {task.description && (
                      <p className="mt-1 text-[11px] text-muted-foreground">{task.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${PRIORITY_STYLES[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                      {task.assignee_student_id && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {memberNames[task.assignee_student_id] || task.assignee_student_id}
                        </span>
                      )}
                      {task.due_date && (
                        <span className="flex items-center gap-1 text-[10px] text-subtle-foreground">
                          <Calendar className="w-3 h-3" /> {task.due_date.slice(0, 10)}
                        </span>
                      )}
                    </div>
                    {canWrite && (
                      <select
                        value={task.status}
                        onChange={(event) =>
                          onUpdate(task.id, { status: event.target.value as TaskStatus })
                        }
                        className="mt-2 w-full rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground outline-none focus:border-teal-500/50"
                      >
                        {COLUMNS.map((option) => (
                          <option key={option.status} value={option.status}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

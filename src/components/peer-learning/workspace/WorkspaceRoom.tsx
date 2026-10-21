'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Archive,
  ArrowLeft,
  Bell,
  Bot,
  Calendar,
  ChevronDown,
  Download,
  History,
  ListChecks,
  MessageSquare,
  Shield,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  workspaceApi,
  type ActivityEntry,
  type ChatMessage,
  type CodeComment,
  type CodeRunResult,
  type FileCreateInput,
  type FileVersion,
  type InviteMeta,
  type JoinKeyMeta,
  type TaskCreateInput,
  type TaskUpdateInput,
  type Workspace,
  type WorkspaceAnalytics,
  type WorkspaceFile,
  type WorkspaceMember,
  type WorkspaceNotification,
  type WorkspaceRole,
  type WorkspaceTask,
} from '@/lib/api/workspaces';
import { useWorkspaceCollab } from '@/hooks/useWorkspaceCollab';
import WorkspaceFileTree from './WorkspaceFileTree';
import WorkspaceEditor from './WorkspaceEditor';
import WorkspaceChatPanel from './WorkspaceChatPanel';
import WorkspaceTasksPanel from './WorkspaceTasksPanel';
import WorkspaceActivityPanel from './WorkspaceActivityPanel';
import WorkspaceMembersPanel from './WorkspaceMembersPanel';
import WorkspaceAnalyticsPanel from './WorkspaceAnalyticsPanel';
import WorkspaceAssistantPanel from './WorkspaceAssistantPanel';
import WorkspaceCommentsPanel from './WorkspaceCommentsPanel';
import WorkspaceInvitePanel from './WorkspaceInvitePanel';
import WorkspaceVersionsDialog from './WorkspaceVersionsDialog';

type TabId = 'chat' | 'tasks' | 'activity' | 'members' | 'analytics' | 'assistant' | 'comments';
type MobileView = 'files' | 'editor' | 'panel';

const TABS: { id: TabId; label: string; icon: typeof MessageSquare }[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'tasks', label: 'Tasks', icon: ListChecks },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'assistant', label: 'AI', icon: Bot },
  { id: 'activity', label: 'Activity', icon: Calendar },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'analytics', label: 'Stats', icon: Sparkles },
];

const NOTIFICATION_LABELS: Record<string, string> = {
  chat_mention: 'mentioned you in chat',
  workspace_invitation: 'invited you to a workspace',
  member_joined: 'joined the workspace',
  task_assigned: 'assigned you a task',
  task_completed: 'completed a task',
  role_changed: 'changed a member role',
  ownership_transferred: 'transferred ownership',
};

interface WorkspaceRoomProps {
  workspaceId: string;
}

export default function WorkspaceRoom({ workspaceId }: WorkspaceRoomProps) {
  const router = useRouter();
  const { user } = useAuth();
  const currentStudentId = user?.student_id || user?._id || '';

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [analytics, setAnalytics] = useState<WorkspaceAnalytics | null>(null);
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [joinKeys, setJoinKeys] = useState<JoinKeyMeta[]>([]);
  const [invites, setInvites] = useState<InviteMeta[]>([]);

  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<WorkspaceFile | null>(null);
  const [comments, setComments] = useState<CodeComment[]>([]);
  const [versions, setVersions] = useState<FileVersion[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [asking, setAsking] = useState(false);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [tab, setTab] = useState<TabId>('chat');
  const [showInvites, setShowInvites] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('editor');
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const { providerRef, status, presence, awareness, liveMessages, appendLocalMessage } =
    useWorkspaceCollab(workspaceId);

  const notify = useCallback((type: 'error' | 'success', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  }, []);

  const role = workspace?.role;
  const canWrite = role === 'leader' || role === 'member';
  const canManage = role === 'leader';

  // ── Initial load ──────────────────────────────────────────────────────────

  const loadRoom = useCallback(async () => {
    const [wsRes, memberRes, fileRes, chatRes, taskRes, activityRes, notifRes] = await Promise.all([
      workspaceApi.getWorkspace(workspaceId),
      workspaceApi.listMembers(workspaceId),
      workspaceApi.listFiles(workspaceId),
      workspaceApi.listChatMessages(workspaceId, { limit: 100 }),
      workspaceApi.listTasks(workspaceId),
      workspaceApi.listActivity(workspaceId, { limit: 60 }),
      workspaceApi.listNotifications(workspaceId),
    ]);

    if (wsRes.success && wsRes.data?.workspace) {
      setWorkspace(wsRes.data.workspace);
    } else {
      notify('error', wsRes.message || 'Failed to load workspace');
    }
    if (memberRes.success && memberRes.data) setMembers(memberRes.data.members);
    if (fileRes.success && fileRes.data) setFiles(fileRes.data.files);
    if (chatRes.success && chatRes.data) setChatHistory(chatRes.data.messages);
    if (taskRes.success && taskRes.data) setTasks(taskRes.data.tasks);
    if (activityRes.success && activityRes.data) setActivity(activityRes.data.activities);
    if (notifRes.success && notifRes.data) {
      setNotifications(notifRes.data.notifications);
      setUnreadCount(notifRes.data.unread_count);
    }
    setLoading(false);
  }, [workspaceId, notify]);

  useEffect(() => {
    if (workspaceId) void loadRoom();
  }, [workspaceId, loadRoom]);

  const refreshFiles = useCallback(async () => {
    const res = await workspaceApi.listFiles(workspaceId);
    if (res.success && res.data) setFiles(res.data.files);
  }, [workspaceId]);

  const refreshActivity = useCallback(async () => {
    const res = await workspaceApi.listActivity(workspaceId, { limit: 60 });
    if (res.success && res.data) setActivity(res.data.activities);
  }, [workspaceId]);

  const refreshTasks = useCallback(async () => {
    const res = await workspaceApi.listTasks(workspaceId);
    if (res.success && res.data) setTasks(res.data.tasks);
  }, [workspaceId]);

  const refreshComments = useCallback(
    async (fileId: string) => {
      const res = await workspaceApi.listComments(workspaceId, { file_id: fileId });
      if (res.success && res.data) setComments(res.data.comments);
    },
    [workspaceId],
  );

  // ── Derived data ──────────────────────────────────────────────────────────

  const allMessages = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    for (const message of [...chatHistory, ...liveMessages]) map.set(message.id, message);
    return Array.from(map.values()).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [chatHistory, liveMessages]);

  const memberNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const member of members) {
      if (member.name) map[member.student_id] = member.name;
    }
    for (const message of allMessages) {
      if (message.name) map[message.student_id] = message.name;
    }
    return map;
  }, [members, allMessages]);

  const activeFileIds = useMemo(
    () => Array.from(new Set(awareness.map((entry) => entry.file_id).filter((id): id is string => Boolean(id)))),
    [awareness],
  );

  const onlineIds = useMemo(() => presence.map((participant) => participant.student_id), [presence]);

  // ── Chat read tracking ────────────────────────────────────────────────────

  useEffect(() => {
    if (tab !== 'chat' || unreadCount === 0) return;
    void (async () => {
      const res = await workspaceApi.markChatRead(workspaceId);
      if (res.success && res.data) setUnreadCount(res.data.unread_count);
    })();
  }, [tab, unreadCount, workspaceId]);

  // ── File operations ───────────────────────────────────────────────────────

  const openFile = useCallback(
    async (file: WorkspaceFile) => {
      if (file.type === 'folder') return;
      setActiveFileId(file.id);
      setActiveFile(null);
      setComments([]);
      setMobileView('editor');
      const [fileRes, commentsRes] = await Promise.all([
        workspaceApi.getFile(workspaceId, file.id),
        workspaceApi.listComments(workspaceId, { file_id: file.id }),
      ]);
      if (fileRes.success && fileRes.data?.file) {
        setActiveFile(fileRes.data.file);
      } else {
        setActiveFile(file);
        notify('error', fileRes.message || 'Could not load file contents');
      }
      if (commentsRes.success && commentsRes.data) setComments(commentsRes.data.comments);
    },
    [workspaceId, notify],
  );

  const handleCreateFile = useCallback(
    async (input: FileCreateInput) => {
      const call =
        input.type === 'folder'
          ? workspaceApi.createFolder(workspaceId, input)
          : workspaceApi.createFile(workspaceId, input);
      const res = await call;
      if (!res.success) {
        notify('error', res.message || 'Could not create item');
        return;
      }
      await refreshFiles();
      await refreshActivity();
      if (res.data?.file && res.data.file.type === 'file') void openFile(res.data.file);
    },
    [workspaceId, refreshFiles, refreshActivity, openFile, notify],
  );

  const handleRenameFile = useCallback(
    async (file: WorkspaceFile, name: string) => {
      const res = await workspaceApi.updateFile(workspaceId, file.id, { name });
      if (!res.success) {
        notify('error', res.message || 'Rename failed');
        return;
      }
      await refreshFiles();
      if (activeFile?.id === file.id && res.data?.file) setActiveFile(res.data.file);
    },
    [workspaceId, refreshFiles, activeFile, notify],
  );

  const handleDeleteFile = useCallback(
    async (file: WorkspaceFile) => {
      if (!window.confirm(`Delete "${file.path}"?`)) return;
      const res = await workspaceApi.deleteFile(workspaceId, file.id);
      if (!res.success) {
        notify('error', res.message || 'Delete failed');
        return;
      }
      if (activeFileId === file.id) {
        setActiveFile(null);
        setActiveFileId(null);
      }
      await refreshFiles();
      await refreshActivity();
    },
    [workspaceId, activeFileId, refreshFiles, refreshActivity, notify],
  );

  const handleSave = useCallback(
    async (code: string): Promise<boolean> => {
      if (!activeFile) return false;
      setSaving(true);
      const res = await workspaceApi.updateFile(workspaceId, activeFile.id, { content: code });
      setSaving(false);
      if (!res.success) {
        notify('error', res.message || 'Save failed');
        return false;
      }
      await refreshActivity();
      notify('success', 'Saved');
      return true;
    },
    [workspaceId, activeFile, refreshActivity, notify],
  );

  const handleRun = useCallback(
    async (code: string, stdin: string): Promise<CodeRunResult | null> => {
      const res = await workspaceApi.runCode(workspaceId, {
        code,
        stdin,
        file_id: activeFileId,
      });
      if (!res.success || !res.data) {
        notify('error', res.message || 'Run failed');
        return null;
      }
      return res.data.result;
    },
    [workspaceId, activeFileId, notify],
  );

  const handleDownload = useCallback(async () => {
    setExporting(true);
    const result = await workspaceApi.exportWorkspace(workspaceId);
    setExporting(false);
    if (!result.success || !result.blob) {
      notify('error', result.message || 'Download failed');
      return;
    }
    const url = URL.createObjectURL(result.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = result.filename || `${workspaceId}.zip`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    notify('success', 'Workspace downloaded');
  }, [workspaceId, notify]);

  // ── Chat & assistant ──────────────────────────────────────────────────────

  const handleSendChat = useCallback(
    async (text: string) => {
      const collab = providerRef.current;
      if (collab && status === 'connected') {
        collab.sendChat(text);
        return;
      }
      const res = await workspaceApi.sendChatMessage(workspaceId, { message: text });
      if (res.success && res.data?.message) {
        appendLocalMessage(res.data.message);
      } else {
        notify('error', res.message || 'Message failed to send');
      }
    },
    [providerRef, status, workspaceId, appendLocalMessage, notify],
  );

  const handleAsk = useCallback(
    async (question: string): Promise<string | null> => {
      setAsking(true);
      const res = await workspaceApi.askAssistant(workspaceId, {
        question,
        file_id: activeFile?.id,
      });
      setAsking(false);
      if (!res.success || !res.data) {
        notify('error', res.message || 'Assistant unavailable');
        return null;
      }
      return res.data.answer;
    },
    [workspaceId, activeFile, notify],
  );

  // ── Tasks ─────────────────────────────────────────────────────────────────

  const handleCreateTask = useCallback(
    async (input: TaskCreateInput) => {
      const res = await workspaceApi.createTask(workspaceId, input);
      if (res.success) {
        await refreshTasks();
        await refreshActivity();
      } else {
        notify('error', res.message || 'Could not create task');
      }
    },
    [workspaceId, refreshTasks, refreshActivity, notify],
  );

  const handleUpdateTask = useCallback(
    async (taskId: string, input: TaskUpdateInput) => {
      const res = await workspaceApi.updateTask(workspaceId, taskId, input);
      if (res.success) {
        await refreshTasks();
      } else {
        notify('error', res.message || 'Could not update task');
      }
    },
    [workspaceId, refreshTasks, notify],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      const res = await workspaceApi.deleteTask(workspaceId, taskId);
      if (res.success) await refreshTasks();
    },
    [workspaceId, refreshTasks],
  );

  // ── Comments ──────────────────────────────────────────────────────────────

  const handleAddComment = useCallback(
    async (body: string, lineStart?: number, lineEnd?: number) => {
      if (!activeFile) return;
      const res = await workspaceApi.createComment(workspaceId, {
        body,
        file_id: activeFile.id,
        line_start: lineStart,
        line_end: lineEnd,
      });
      if (res.success) await refreshComments(activeFile.id);
    },
    [workspaceId, activeFile, refreshComments],
  );

  const handleResolveComment = useCallback(
    async (commentId: string, resolved: boolean) => {
      if (!activeFile) return;
      const res = await workspaceApi.updateComment(workspaceId, commentId, {
        status: resolved ? 'resolved' : 'open',
      });
      if (res.success) await refreshComments(activeFile.id);
    },
    [workspaceId, activeFile, refreshComments],
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!activeFile) return;
      const res = await workspaceApi.deleteComment(workspaceId, commentId);
      if (res.success) await refreshComments(activeFile.id);
    },
    [workspaceId, activeFile, refreshComments],
  );

  // ── Versions ──────────────────────────────────────────────────────────────

  const openVersions = useCallback(async () => {
    if (!activeFile) return;
    setShowVersions(true);
    setVersionsLoading(true);
    const res = await workspaceApi.listFileVersions(workspaceId, activeFile.id);
    if (res.success && res.data) setVersions(res.data.versions);
    setVersionsLoading(false);
  }, [workspaceId, activeFile]);

  const handleViewVersion = useCallback(
    async (versionId: string): Promise<FileVersion | null> => {
      if (!activeFile) return null;
      const res = await workspaceApi.getFileVersion(workspaceId, activeFile.id, versionId);
      return res.success && res.data ? res.data.version : null;
    },
    [workspaceId, activeFile],
  );

  const handleRestore = useCallback(
    async (versionId: string) => {
      if (!activeFile) return;
      const res = await workspaceApi.restoreFileVersion(workspaceId, activeFile.id, versionId);
      if (!res.success || !res.data) {
        notify('error', res.message || 'Restore failed');
        return;
      }
      const collab = providerRef.current;
      if (collab) collab.applyContent(activeFile.id, res.data.content ?? '');
      const refreshed = await workspaceApi.getFile(workspaceId, activeFile.id);
      if (refreshed.success && refreshed.data?.file) setActiveFile(refreshed.data.file);
      await openVersions();
      await refreshFiles();
      await refreshActivity();
      notify('success', 'Version restored');
    },
    [workspaceId, activeFile, providerRef, openVersions, refreshFiles, refreshActivity, notify],
  );

  // ── Members & invites ─────────────────────────────────────────────────────

  const refreshMembers = useCallback(async () => {
    const refreshed = await workspaceApi.listMembers(workspaceId);
    if (refreshed.success && refreshed.data) setMembers(refreshed.data.members);
  }, [workspaceId]);

  const handleInvite = useCallback(
    async (studentId: string, memberRole: 'member' | 'viewer'): Promise<boolean> => {
      const res = await workspaceApi.inviteMember(workspaceId, studentId, memberRole);
      if (res.success) {
        notify('success', 'Invitation sent');
        return true;
      }
      notify('error', res.message || 'Could not send invite');
      return false;
    },
    [workspaceId, notify],
  );

  const handleRoleChange = useCallback(
    async (studentId: string, memberRole: 'member' | 'viewer') => {
      const res = await workspaceApi.updateMemberRole(workspaceId, studentId, memberRole);
      if (res.success) {
        await refreshMembers();
      } else {
        notify('error', res.message || 'Could not change role');
      }
    },
    [workspaceId, refreshMembers, notify],
  );

  const handleRemoveMember = useCallback(
    async (studentId: string) => {
      if (!window.confirm('Remove this member from the workspace?')) return;
      const res = await workspaceApi.removeMember(workspaceId, studentId);
      if (res.success) {
        await refreshMembers();
      } else {
        notify('error', res.message || 'Could not remove member');
      }
    },
    [workspaceId, refreshMembers, notify],
  );

  const handleTransfer = useCallback(
    async (studentId: string) => {
      if (!window.confirm('Transfer leadership to this member?')) return;
      const res = await workspaceApi.transferOwnership(workspaceId, studentId);
      if (res.success) {
        setLoading(true);
        await loadRoom();
      } else {
        notify('error', res.message || 'Transfer failed');
      }
    },
    [workspaceId, loadRoom, notify],
  );

  const handleLeave = useCallback(async () => {
    if (!window.confirm('Leave this workspace?')) return;
    const res = await workspaceApi.leaveWorkspace(workspaceId);
    if (res.success) {
      router.push('/peer-learning/workspaces');
    } else {
      notify('error', res.message || 'Could not leave workspace');
    }
  }, [workspaceId, router, notify]);

  const openInvites = useCallback(async () => {
    setTab('members');
    setShowInvites(true);
    const [keysRes, invitesRes] = await Promise.all([
      workspaceApi.listJoinKeys(workspaceId),
      workspaceApi.listInvites(workspaceId),
    ]);
    if (keysRes.success && keysRes.data) setJoinKeys(keysRes.data.keys);
    if (invitesRes.success && invitesRes.data) setInvites(invitesRes.data.invites);
  }, [workspaceId]);

  const handleCreateJoinKey = useCallback(
    async (keyRole: 'member' | 'viewer'): Promise<string | null> => {
      const res = await workspaceApi.createJoinKey(workspaceId, { role: keyRole });
      if (res.success && res.data) {
        const keysRes = await workspaceApi.listJoinKeys(workspaceId);
        if (keysRes.success && keysRes.data) setJoinKeys(keysRes.data.keys);
        return res.data.join_key;
      }
      notify('error', res.message || 'Could not create join key');
      return null;
    },
    [workspaceId, notify],
  );

  const handleRevokeJoinKey = useCallback(
    async (keyId: string) => {
      const res = await workspaceApi.revokeJoinKey(workspaceId, keyId);
      if (res.success) {
        const keysRes = await workspaceApi.listJoinKeys(workspaceId);
        if (keysRes.success && keysRes.data) setJoinKeys(keysRes.data.keys);
      }
    },
    [workspaceId],
  );

  const handleRevokeInvite = useCallback(
    async (inviteId: string) => {
      const res = await workspaceApi.revokeInvite(workspaceId, inviteId);
      if (res.success) {
        const invitesRes = await workspaceApi.listInvites(workspaceId);
        if (invitesRes.success && invitesRes.data) setInvites(invitesRes.data.invites);
      }
    },
    [workspaceId],
  );

  const searchStudents = useCallback(async (query: string) => {
    const res = await workspaceApi.searchStudents(query);
    return res.success && res.data ? res.data.students : [];
  }, []);

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  const handleArchive = useCallback(async () => {
    if (!window.confirm('Archive this workspace?')) return;
    const res = await workspaceApi.archiveWorkspace(workspaceId);
    if (res.success) router.push('/peer-learning/workspaces');
    else notify('error', res.message || 'Archive failed');
  }, [workspaceId, router, notify]);

  const handleUnarchive = useCallback(async () => {
    const res = await workspaceApi.unarchiveWorkspace(workspaceId);
    if (res.success) {
      setLoading(true);
      await loadRoom();
    } else {
      notify('error', res.message || 'Unarchive failed');
    }
  }, [workspaceId, loadRoom, notify]);

  const handlePurge = useCallback(async () => {
    if (!window.confirm('Permanently delete this workspace and all its data? This cannot be undone.')) return;
    const res = await workspaceApi.purgeWorkspace(workspaceId);
    if (res.success) router.push('/peer-learning/workspaces');
    else notify('error', res.message || 'Purge failed');
  }, [workspaceId, router, notify]);

  const handleMarkAllRead = useCallback(async () => {
    const res = await workspaceApi.markAllNotificationsRead(workspaceId);
    if (res.success) {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((item) => ({ ...item, status: 'read' })));
    }
  }, [workspaceId]);

  const describeNotification = useCallback(
    (item: WorkspaceNotification): string => {
      const actor = item.created_by ? memberNames[item.created_by] || item.created_by : 'Someone';
      const label = NOTIFICATION_LABELS[item.type] || item.type.replace(/_/g, ' ');
      const extra = item.title ? `: ${item.title}` : '';
      return `${actor} ${label}${extra}`;
    },
    [memberNames],
  );

  // ── Analytics lazy load ───────────────────────────────────────────────────

  useEffect(() => {
    if (tab !== 'analytics' || analytics || !workspaceId) return;
    void (async () => {
      const res = await workspaceApi.getAnalytics(workspaceId);
      if (res.success && res.data) setAnalytics(res.data.analytics);
    })();
  }, [tab, analytics, workspaceId]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <p>Workspace not found or you are not a member.</p>
        <Link href="/peer-learning/workspaces" className="text-sm text-teal-700 dark:text-teal-400 hover:underline">
          Back to workspaces
        </Link>
      </div>
    );
  }

  const archived = workspace.status === 'archived';
  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];

  const renderActiveTab = () => {
    if (tab === 'members' && showInvites && canManage) {
      return (
        <WorkspaceInvitePanel
          joinKeys={joinKeys}
          invites={invites}
          onCreateJoinKey={handleCreateJoinKey}
          onRevokeJoinKey={handleRevokeJoinKey}
          searchStudents={searchStudents}
          onInviteStudent={handleInvite}
          onRevokeInvite={handleRevokeInvite}
        />
      );
    }
    switch (tab) {
      case 'chat':
        return (
          <WorkspaceChatPanel
            messages={allMessages}
            currentStudentId={currentStudentId}
            canWrite={canWrite && !archived}
            onSend={handleSendChat}
          />
        );
      case 'tasks':
        return (
          <WorkspaceTasksPanel
            tasks={tasks}
            members={members}
            memberNames={memberNames}
            canWrite={canWrite && !archived}
            onCreate={handleCreateTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        );
      case 'comments':
        return (
          <WorkspaceCommentsPanel
            file={activeFile}
            comments={comments}
            currentStudentId={currentStudentId}
            canWrite={canWrite && !archived}
            onAdd={handleAddComment}
            onResolve={handleResolveComment}
            onDelete={handleDeleteComment}
          />
        );
      case 'assistant':
        return (
          <WorkspaceAssistantPanel
            activeFileName={activeFile?.name}
            canUse={!archived}
            asking={asking}
            onAsk={handleAsk}
          />
        );
      case 'activity':
        return <WorkspaceActivityPanel activity={activity} memberNames={memberNames} />;
      case 'members':
        return (
          <WorkspaceMembersPanel
            members={members}
            memberNames={memberNames}
            currentStudentId={currentStudentId}
            onlineIds={onlineIds}
            canManage={canManage}
            onInvite={handleInvite}
            onRoleChange={handleRoleChange}
            onRemove={handleRemoveMember}
            onTransfer={handleTransfer}
            onLeave={handleLeave}
            onOpenInvites={openInvites}
            searchStudents={searchStudents}
          />
        );
      case 'analytics':
        return <WorkspaceAnalyticsPanel analytics={analytics} loading={!analytics} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
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

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/55 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/peer-learning/workspaces"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-black text-foreground">{workspace.name}</h1>
              {archived && (
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">
                  Archived
                </span>
              )}
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] capitalize text-muted-foreground">{role}</span>
            </div>
            <p className="truncate text-xs text-subtle-foreground">{workspace.description || 'No description'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Presence */}
          <div className="flex items-center -space-x-2">
            {presence.slice(0, 5).map((participant) => (
              <div
                key={participant.student_id}
                title={participant.name}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-foreground"
                style={{ backgroundColor: participant.color || undefined }}
              >
                {participant.name.slice(0, 1).toUpperCase()}
              </div>
            ))}
            {presence.length > 5 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-surface-3 text-[10px] font-bold text-muted-foreground">
                +{presence.length - 5}
              </div>
            )}
          </div>

          <span
            className={`text-[10px] font-semibold ${status === 'connected' ? 'text-emerald-700 dark:text-emerald-400' : 'text-subtle-foreground'}`}
          >
            {status === 'connected' ? `${presence.length} online` : 'offline'}
          </span>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-sunken shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-xs font-bold text-foreground">Notifications</span>
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-teal-700 dark:text-teal-400 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="px-3 py-4 text-center text-[11px] text-subtle-foreground">No notifications</p>
                  )}
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`border-b border-border px-3 py-2 ${item.status === 'unread' ? 'bg-teal-500/5' : ''}`}
                    >
                      <p className="text-[11px] text-foreground/80">{describeNotification(item)}</p>
                      <p className="text-[10px] text-subtle-foreground">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {canManage && (
            <button
              type="button"
              onClick={openInvites}
              className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-500"
            >
              <Shield className="h-3.5 w-3.5" /> Invite
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-sunken py-1 shadow-xl">
                <button
                  type="button"
                  disabled={exporting}
                  onClick={() => {
                    setMenuOpen(false);
                    void handleDownload();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" /> {exporting ? 'Preparing…' : 'Download ZIP'}
                </button>
                {canManage && !archived && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void handleArchive();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </button>
                )}
                {canManage && archived && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void handleUnarchive();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <History className="h-3.5 w-3.5" /> Unarchive
                  </button>
                )}
                {canManage && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void handlePurge();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-700 dark:text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete forever
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile view switch */}
      <div className="flex gap-1 rounded-xl border border-border bg-card/50 p-1 lg:hidden">
        {(['files', 'editor', 'panel'] as MobileView[]).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setMobileView(view)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize ${
              mobileView === view ? 'bg-teal-600 text-white' : 'text-muted-foreground'
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Main 3-pane layout */}
      <div className="flex h-[calc(100vh-16rem)] min-h-[480px] overflow-hidden rounded-2xl border border-border bg-sunken">
        {/* File tree */}
        <div className={`w-full border-r border-border lg:block lg:w-56 xl:w-64 ${mobileView === 'files' ? 'block' : 'hidden'}`}>
          <WorkspaceFileTree
            files={files}
            activeFileId={activeFileId}
            canWrite={canWrite && !archived}
            activeFileIds={activeFileIds}
            onSelect={openFile}
            onCreate={handleCreateFile}
            onRename={handleRenameFile}
            onDelete={handleDeleteFile}
          />
        </div>

        {/* Editor */}
        <div className={`relative min-w-0 flex-1 lg:block ${mobileView === 'editor' ? 'block' : 'hidden'}`}>
          <WorkspaceEditor
            file={activeFile}
            providerRef={providerRef}
            canWrite={canWrite && !archived}
            connected={status === 'connected'}
            saving={saving}
            onSave={handleSave}
            onRun={handleRun}
            onOpenComments={() => {
              setTab('comments');
              setShowInvites(false);
              setMobileView('panel');
            }}
            onOpenVersions={openVersions}
          />
          {activeFileId && !activeFile && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className={`w-full border-l border-border lg:flex lg:w-80 lg:flex-col ${mobileView === 'panel' ? 'flex flex-col' : 'hidden'}`}>
          <div className="flex items-center gap-0.5 overflow-x-auto border-b border-border px-1.5 py-1.5 scrollbar-hide">
            {TABS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    if (item.id !== 'members') setShowInvites(false);
                  }}
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                    tab === item.id
                      ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground/80'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                  {item.id === 'chat' && unreadCount > 0 && (
                    <span className="ml-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="min-h-0 flex-1">
            {tab === 'members' && showInvites && (
              <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">Invites</span>
                <button
                  type="button"
                  onClick={() => setShowInvites(false)}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" /> Back to members
                </button>
              </div>
            )}
            {activeTab && renderActiveTab()}
          </div>
        </div>
      </div>

      {showVersions && (
        <WorkspaceVersionsDialog
          file={activeFile}
          versions={versions}
          loading={versionsLoading}
          canWrite={canWrite && !archived}
          onClose={() => setShowVersions(false)}
          onView={handleViewVersion}
          onRestore={handleRestore}
        />
      )}
    </div>
  );
}

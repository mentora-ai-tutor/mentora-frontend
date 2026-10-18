const PEER_LEARNING_API_URL =
  process.env.NEXT_PUBLIC_PEER_LEARNING_API_URL || 'http://localhost:8001';

// ── Shared types ───────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  status?: string;
  data?: T;
}

export type WorkspaceRole = 'owner' | 'editor' | 'viewer';
export type WorkspaceStatus = 'active' | 'archived';
export type WorkspaceVisibility = 'private' | 'invite';

export interface Workspace {
  workspace_id: string;
  name: string;
  description: string;
  visibility: WorkspaceVisibility;
  status: WorkspaceStatus;
  owner_student_id: string;
  member_count: number;
  created_at: string;
  updated_at: string;
  role?: WorkspaceRole;
}

export interface WorkspaceMember {
  workspace_id: string;
  student_id: string;
  role: WorkspaceRole;
  status: string;
  joined_at?: string;
  last_seen_at?: string;
  updated_at?: string;
}

export interface WorkspaceFile {
  file_id: string;
  workspace_id: string;
  name: string;
  path: string;
  parent_path: string;
  type: 'file' | 'folder';
  language: string;
  content?: string;
  size: number;
  version_count: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface FileVersion {
  version_id: string;
  workspace_id: string;
  file_id: string;
  version_number: number;
  content?: string;
  size: number;
  author_student_id: string;
  message: string;
  created_at: string;
}

export interface ActivityEntry {
  workspace_id: string;
  actor_student_id: string;
  action: string;
  detail: Record<string, unknown>;
  timestamp: string;
}

export interface ChatMessage {
  message_id: string;
  workspace_id: string;
  student_id: string;
  sender_name: string;
  role: WorkspaceRole | 'ai' | null;
  message: string;
  message_type: 'text' | 'code' | 'system' | 'ai' | 'ai_question';
  reply_to: string | null;
  timestamp: string;
}

export interface CodeComment {
  comment_id: string;
  workspace_id: string;
  file_id: string;
  body: string;
  line_start: number | null;
  line_end: number | null;
  parent_comment_id: string | null;
  author_student_id: string;
  author_name: string;
  status: 'open' | 'resolved';
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface WorkspaceTask {
  task_id: string;
  workspace_id: string;
  title: string;
  description: string;
  assignee_student_id: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  labels: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface WorkspaceNotification {
  notification_id: string;
  workspace_id: string;
  recipient_student_id: string;
  type: string;
  message: string;
  actor_student_id: string;
  detail: Record<string, unknown>;
  status: 'unread' | 'read';
  created_at: string;
  read_at?: string;
}

export interface JoinKeyMeta {
  key_id: string;
  workspace_id: string;
  role: WorkspaceRole;
  created_by: string;
  created_at: string;
  expires_at: string | null;
  max_uses: number | null;
  uses: number;
  status: string;
  last_used_at?: string;
}

export interface InviteMeta {
  invite_id: string;
  workspace_id: string;
  role: WorkspaceRole;
  created_by: string;
  created_at: string;
  expires_at: string | null;
  max_uses: number | null;
  uses: number;
  status: string;
}

export interface WorkspaceAnalytics {
  status: string;
  workspace_id: string;
  totals: {
    members: number;
    files: number;
    versions: number;
    messages: number;
    comments: number;
    tasks: number;
  };
  per_member: {
    student_id: string;
    name: string;
    role: WorkspaceRole;
    files_created: number;
    file_edits: number;
    messages_sent: number;
    comments: number;
    tasks_assigned: number;
    tasks_completed: number;
    last_seen_at?: string;
  }[];
  timeline: { date: string; count: number }[];
}

export interface CodeRunResult {
  status: string;
  execution_enabled: boolean;
  compiled: boolean;
  compile_errors: string[];
  output: string;
  exit_code: number | null;
  message?: string;
  error?: string;
  command?: string;
  compile_command?: string;
  run_command?: string;
  main_class?: string | null;
  scope?: 'file' | 'project';
  files_compiled?: number;
  duration_ms?: number;
}

export interface AssistantReply {
  status: string;
  reply: string;
  ai_status: string;
  message_id: string;
  question?: ChatMessage;
}

export interface PresenceParticipant {
  student_id: string;
  name: string;
  role: WorkspaceRole;
  color: string;
}

export interface AwarenessState {
  student_id: string;
  name: string;
  role: WorkspaceRole;
  color: string;
  file_id: string | null;
  selection?: unknown;
  cursor?: unknown;
  timestamp: string;
}

// ── Request payload types ──────────────────────────

export interface WorkspaceCreateInput {
  name: string;
  description?: string;
  visibility?: WorkspaceVisibility;
}

export interface WorkspaceUpdateInput {
  name?: string;
  description?: string;
  visibility?: WorkspaceVisibility;
  status?: WorkspaceStatus;
}

export interface FileCreateInput {
  name: string;
  parent_path?: string;
  type?: 'file' | 'folder';
  content?: string;
  language?: string;
}

export interface FileContentUpdateInput {
  content: string;
  message?: string;
  base_version?: number;
}

export interface FileUpdateInput {
  name?: string;
  parent_path?: string;
  language?: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  assignee_student_id?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  labels?: string[];
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  assignee_student_id?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  labels?: string[];
}

// ── API Client ─────────────────────────────────────

function buildQuery(params: Record<string, unknown> | undefined): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

class WorkspaceApi {
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private getHeaders(): HeadersInit {
    const token = this.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${PEER_LEARNING_API_URL}${path}`, {
        method,
        headers: this.getHeaders(),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      let result: Record<string, unknown> = {};
      try {
        result = (await response.json()) as Record<string, unknown>;
      } catch {
        result = {};
      }
      const detail = typeof result.detail === 'string' ? result.detail : undefined;
      const message = typeof result.message === 'string' ? result.message : undefined;
      return {
        success: response.ok,
        data: result as T,
        status: typeof result.status === 'string' ? result.status : undefined,
        message: detail || message || (response.ok ? undefined : `Request failed (${response.status})`),
      };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }

  private async requestBlob(
    path: string,
  ): Promise<{ success: boolean; blob?: Blob; filename?: string; message?: string }> {
    try {
      const response = await fetch(`${PEER_LEARNING_API_URL}${path}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        let message = `Request failed (${response.status})`;
        try {
          const body = (await response.json()) as { detail?: unknown; message?: unknown };
          message = typeof body.detail === 'string' ? body.detail : message;
        } catch {
          // non-JSON error body
        }
        return { success: false, message };
      }
      const disposition = response.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="?([^";]+)"?/i);
      return {
        success: true,
        blob: await response.blob(),
        filename: match ? match[1].trim() : undefined,
      };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }

  // ── Workspaces ────────────────────────────────

  async createWorkspace(input: WorkspaceCreateInput): Promise<ApiResponse<{ status: string; workspace: Workspace }>> {
    return this.request('/api/workspaces', 'POST', input);
  }

  async listWorkspaces(
    includeArchived = false,
  ): Promise<ApiResponse<{ status: string; total: number; workspaces: Workspace[] }>> {
    return this.request(`/api/workspaces${buildQuery({ include_archived: includeArchived })}`);
  }

  async getWorkspace(workspaceId: string): Promise<ApiResponse<{ status: string; workspace: Workspace }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}`);
  }

  async updateWorkspace(
    workspaceId: string,
    input: WorkspaceUpdateInput,
  ): Promise<ApiResponse<{ status: string; workspace: Workspace }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}`, 'PATCH', input);
  }

  async archiveWorkspace(workspaceId: string): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}`, 'DELETE');
  }

  async unarchiveWorkspace(workspaceId: string): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/unarchive`, 'POST');
  }

  async purgeWorkspace(
    workspaceId: string,
  ): Promise<ApiResponse<{ status: string; message: string; deleted: Record<string, number> }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/purge`, 'DELETE');
  }

  async transferOwnership(
    workspaceId: string,
    newOwnerStudentId: string,
  ): Promise<ApiResponse<{ status: string; message: string; new_owner: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/transfer-ownership`, 'POST', {
      new_owner_student_id: newOwnerStudentId,
    });
  }

  // ── Membership ────────────────────────────────

  async listMembers(
    workspaceId: string,
  ): Promise<ApiResponse<{ status: string; workspace_id: string; total: number; members: WorkspaceMember[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/members`);
  }

  async addMember(
    workspaceId: string,
    studentId: string,
    role: WorkspaceRole = 'editor',
  ): Promise<ApiResponse<{ status: string; member: WorkspaceMember }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/members`, 'POST', {
      student_id: studentId,
      role,
    });
  }

  async updateMemberRole(
    workspaceId: string,
    studentId: string,
    role: WorkspaceRole,
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(studentId)}`,
      'PATCH',
      { role },
    );
  }

  async removeMember(
    workspaceId: string,
    studentId: string,
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(studentId)}`,
      'DELETE',
    );
  }

  async leaveWorkspace(workspaceId: string): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/leave`, 'POST');
  }

  // ── Join keys & invites ───────────────────────

  async createJoinKey(
    workspaceId: string,
    options?: { role?: WorkspaceRole; expires_in_hours?: number; max_uses?: number },
  ): Promise<ApiResponse<{ status: string; join_key: string; key_id: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/join-keys`, 'POST', options ?? {});
  }

  async listJoinKeys(
    workspaceId: string,
  ): Promise<ApiResponse<{ status: string; workspace_id: string; total: number; join_keys: JoinKeyMeta[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/join-keys`);
  }

  async revokeJoinKey(
    workspaceId: string,
    keyId: string,
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/join-keys/${encodeURIComponent(keyId)}`,
      'DELETE',
    );
  }

  async joinWithKey(joinKey: string): Promise<ApiResponse<{ status: string; message: string; workspace_id: string; workspace?: Workspace }>> {
    return this.request('/api/workspaces/join', 'POST', { join_key: joinKey });
  }

  async createInvite(
    workspaceId: string,
    options?: { role?: WorkspaceRole; expires_in_hours?: number; max_uses?: number },
  ): Promise<ApiResponse<{ status: string; invite_token: string; invite_id: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/invites`, 'POST', options ?? {});
  }

  async listInvites(
    workspaceId: string,
  ): Promise<ApiResponse<{ status: string; workspace_id: string; total: number; invites: InviteMeta[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/invites`);
  }

  async revokeInvite(
    workspaceId: string,
    inviteId: string,
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/invites/${encodeURIComponent(inviteId)}`,
      'DELETE',
    );
  }

  async acceptInvite(token: string): Promise<ApiResponse<{ status: string; message: string; workspace_id: string; workspace?: Workspace }>> {
    return this.request('/api/workspaces/invites/accept', 'POST', { token });
  }

  // ── Files ─────────────────────────────────────

  async createFile(
    workspaceId: string,
    input: FileCreateInput,
  ): Promise<ApiResponse<{ status: string; file: WorkspaceFile }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/files`, 'POST', input);
  }

  async listFiles(
    workspaceId: string,
    includeContent = false,
  ): Promise<ApiResponse<{ status: string; workspace_id: string; total: number; files: WorkspaceFile[] }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files${buildQuery({ include_content: includeContent })}`,
    );
  }

  async getFile(workspaceId: string, fileId: string): Promise<ApiResponse<{ status: string; file: WorkspaceFile }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}`,
    );
  }

  async updateFileContent(
    workspaceId: string,
    fileId: string,
    input: FileContentUpdateInput,
  ): Promise<ApiResponse<{ status: string; file_id: string; version_number: number; updated_at: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/content`,
      'PUT',
      input,
    );
  }

  async updateFile(
    workspaceId: string,
    fileId: string,
    input: FileUpdateInput,
  ): Promise<ApiResponse<{ status: string; file: WorkspaceFile }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}`,
      'PATCH',
      input,
    );
  }

  async deleteFile(
    workspaceId: string,
    fileId: string,
    recursive = false,
  ): Promise<ApiResponse<{ status: string; message: string; deleted_count: number }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}${buildQuery({
        recursive,
      })}`,
      'DELETE',
    );
  }

  async listFileVersions(
    workspaceId: string,
    fileId: string,
  ): Promise<ApiResponse<{ status: string; workspace_id: string; file_id: string; total: number; versions: FileVersion[] }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/versions`,
    );
  }

  async getFileVersion(
    workspaceId: string,
    fileId: string,
    versionId: string,
  ): Promise<ApiResponse<{ status: string; version: FileVersion }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/versions/${encodeURIComponent(versionId)}`,
    );
  }

  async restoreFileVersion(
    workspaceId: string,
    fileId: string,
    versionId: string,
  ): Promise<ApiResponse<{ status: string; file_id: string; version_number: number; restored_from: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/versions/${encodeURIComponent(versionId)}/restore`,
      'POST',
    );
  }

  // ── Activity ──────────────────────────────────

  async listActivity(
    workspaceId: string,
    options?: { limit?: number; since?: string },
  ): Promise<ApiResponse<{ status: string; workspace_id: string; total: number; activity: ActivityEntry[] }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/activity${buildQuery(options)}`,
    );
  }

  // ── Chat ──────────────────────────────────────

  async sendChatMessage(
    workspaceId: string,
    message: string,
    messageType: 'text' | 'code' | 'system' = 'text',
    replyTo?: string,
  ): Promise<ApiResponse<{ status: string; message: ChatMessage }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/chat/messages`, 'POST', {
      message,
      message_type: messageType,
      reply_to: replyTo,
    });
  }

  async listChatMessages(
    workspaceId: string,
    options?: { limit?: number; before?: string; since?: string },
  ): Promise<ApiResponse<{ status: string; workspace_id: string; total: number; messages: ChatMessage[] }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/chat/messages${buildQuery(options)}`,
    );
  }

  async deleteChatMessage(
    workspaceId: string,
    messageId: string,
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/chat/messages/${encodeURIComponent(messageId)}`,
      'DELETE',
    );
  }

  // ── Inline comments ───────────────────────────

  async listComments(
    workspaceId: string,
    fileId: string,
    status: 'open' | 'resolved' | 'all' = 'all',
  ): Promise<ApiResponse<{ status: string; workspace_id: string; file_id: string; total: number; comments: CodeComment[] }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/comments${buildQuery(
        { status },
      )}`,
    );
  }

  async createComment(
    workspaceId: string,
    fileId: string,
    input: { body: string; line_start?: number; line_end?: number; parent_comment_id?: string },
  ): Promise<ApiResponse<{ status: string; comment: CodeComment }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/comments`,
      'POST',
      input,
    );
  }

  async updateComment(
    workspaceId: string,
    commentId: string,
    input: { body?: string; status?: 'open' | 'resolved' },
  ): Promise<ApiResponse<{ status: string; comment: CodeComment }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/comments/${encodeURIComponent(commentId)}`,
      'PATCH',
      input,
    );
  }

  async deleteComment(
    workspaceId: string,
    commentId: string,
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/comments/${encodeURIComponent(commentId)}`,
      'DELETE',
    );
  }

  // ── Tasks ─────────────────────────────────────

  async listTasks(
    workspaceId: string,
    options?: { status?: string; assignee?: string },
  ): Promise<
    ApiResponse<{
      status: string;
      workspace_id: string;
      total: number;
      tasks: WorkspaceTask[];
      board: Record<TaskStatus, WorkspaceTask[]>;
    }>
  > {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/tasks${buildQuery(options)}`);
  }

  async createTask(
    workspaceId: string,
    input: TaskCreateInput,
  ): Promise<ApiResponse<{ status: string; task: WorkspaceTask }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/tasks`, 'POST', input);
  }

  async updateTask(
    workspaceId: string,
    taskId: string,
    input: TaskUpdateInput,
  ): Promise<ApiResponse<{ status: string; task: WorkspaceTask }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/tasks/${encodeURIComponent(taskId)}`,
      'PATCH',
      input,
    );
  }

  async deleteTask(
    workspaceId: string,
    taskId: string,
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/tasks/${encodeURIComponent(taskId)}`,
      'DELETE',
    );
  }

  // ── AI assistant ──────────────────────────────

  async askAssistant(
    workspaceId: string,
    input: { question: string; file_id?: string; code?: string },
  ): Promise<ApiResponse<AssistantReply>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/assistant/ask`, 'POST', input);
  }

  // ── Analytics ─────────────────────────────────

  async getAnalytics(
    workspaceId: string,
  ): Promise<ApiResponse<WorkspaceAnalytics>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/analytics`);
  }

  // ── Notifications ─────────────────────────────

  async listNotifications(
    workspaceId: string,
    status: 'unread' | 'read' | 'all' = 'unread',
  ): Promise<
    ApiResponse<{
      status: string;
      workspace_id: string;
      total: number;
      unread_count: number;
      notifications: WorkspaceNotification[];
    }>
  > {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/notifications${buildQuery({ status })}`,
    );
  }

  async markNotificationRead(
    workspaceId: string,
    notificationId: string,
  ): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/notifications/${encodeURIComponent(notificationId)}/read`,
      'POST',
    );
  }

  async markAllNotificationsRead(
    workspaceId: string,
  ): Promise<ApiResponse<{ status: string; message: string; modified_count: number }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/notifications/read-all`, 'POST');
  }

  // ── Sandboxed code run ────────────────────────

  async runCode(
    workspaceId: string,
    code: string,
    stdin = '',
    fileId: string | null = null,
  ): Promise<ApiResponse<CodeRunResult>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/run`, 'POST', {
      code,
      stdin,
      file_id: fileId,
    });
  }

  // ── Export ────────────────────────────────────

  async exportWorkspace(
    workspaceId: string,
  ): Promise<{ success: boolean; blob?: Blob; filename?: string; message?: string }> {
    return this.requestBlob(`/api/workspaces/${encodeURIComponent(workspaceId)}/export`);
  }

  // ── Real-time (WebSocket) ─────────────────────

  getWebSocketUrl(workspaceId: string): string {
    const token = this.getAccessToken() || '';
    const base = PEER_LEARNING_API_URL.replace(/^http/, 'ws');
    return `${base}/api/workspaces/ws/${encodeURIComponent(workspaceId)}?token=${encodeURIComponent(token)}`;
  }
}

export const workspaceApi = new WorkspaceApi();
export { PEER_LEARNING_API_URL };

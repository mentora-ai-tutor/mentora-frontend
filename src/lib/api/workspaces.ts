const PEER_LEARNING_API_URL =
  process.env.NEXT_PUBLIC_PEER_LEARNING_API_URL || 'http://localhost:8001';

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  status?: string;
  data?: T;
}

export type WorkspaceRole = 'leader' | 'member' | 'viewer';
export type WorkspaceStatus = 'active' | 'archived' | 'closed';
export type WorkspaceVisibility = 'private' | 'invite';

export interface Workspace {
  workspace_id: string;
  name: string;
  description: string;
  visibility: WorkspaceVisibility;
  status: WorkspaceStatus;
  owner_student_id: string;
  peer_pool_id: string | null;
  project_id: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
  role?: WorkspaceRole;
}

export interface WorkspaceMember {
  student_id: string;
  role: WorkspaceRole;
  joined_at?: string;
  name?: string | null;
  email?: string | null;
  color?: string | null;
}

export interface StudentSearchResult {
  student_id: string;
  name: string | null;
  email: string | null;
}

export interface WorkspaceFile {
  id: string;
  workspace_id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FileVersion {
  id: string;
  workspace_id: string;
  file_id: string;
  path: string;
  name?: string | null;
  content?: string;
  size: number;
  student_id: string;
  created_at: string;
}

export interface TrashItem {
  trash_id: string;
  workspace_id: string;
  items: WorkspaceFile[];
  deleted_by: string;
  deleted_at: string;
  expires_at: string;
}

export type ChatMessageType = 'text' | 'code' | 'system';

export interface ChatMessage {
  id: string;
  type?: 'CHAT_MESSAGE';
  workspace_id: string;
  student_id: string;
  name: string | null;
  color: string | null;
  message: string;
  message_type: ChatMessageType;
  reply_to: string | null;
  mentions: string[];
  file_id: string | null;
  line_number: number | null;
  code_language: string | null;
  timestamp: string;
  created_at: string;
  updated_at?: string;
}

export interface CodeComment {
  id: string;
  workspace_id: string;
  file_id: string | null;
  student_id: string;
  name?: string | null;
  body: string;
  line_start: number | null;
  line_end: number | null;
  parent_comment_id: string | null;
  status: 'open' | 'resolved';
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface WorkspaceTask {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  assignee_student_id: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  labels: string[] | null;
  file_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityEntry {
  id: string;
  workspace_id: string;
  student_id: string;
  name?: string | null;
  action: string;
  target: unknown;
  timestamp: string;
}

export type WorkspaceNotificationType =
  | 'chat_mention'
  | 'workspace_invitation'
  | 'member_joined'
  | 'task_assigned'
  | 'task_completed'
  | 'role_changed'
  | 'ownership_transferred';

export interface WorkspaceNotification {
  id: string;
  workspace_id: string;
  student_id: string;
  type: WorkspaceNotificationType | string;
  status: 'unread' | 'read';
  created_at: string;
  message_id?: string;
  invite_id?: string;
  task_id?: string;
  title?: string;
  created_by?: string;
  member_student_id?: string;
  role?: WorkspaceRole;
  read_at?: string;
}

export interface InviteMeta {
  id: string;
  workspace_id: string;
  student_id: string;
  role: WorkspaceRole;
  status: 'pending' | 'accepted' | 'declined' | 'revoked' | 'accepting';
  invited_by: string;
  workspace_name?: string | null;
  created_at: string;
}

export interface PendingInvitation extends InviteMeta {
  workspace?: {
    workspace_id: string;
    name: string;
    description: string;
    owner_student_id: string;
  };
}

export interface JoinKeyMeta {
  id: string;
  role: WorkspaceRole;
  max_uses: number;
  uses: number;
  revoked: boolean;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface WorkspaceAnalytics {
  totals: {
    members: number;
    files: number;
    folders: number;
    versions: number;
    messages: number;
    comments: number;
    open_comments: number;
    tasks: number;
    tasks_done: number;
    activities: number;
  };
  members: {
    student_id: string;
    name: string | null;
    color: string | null;
    role: WorkspaceRole;
    joined_at?: string;
    edits: number;
    lines_changed: number;
    messages: number;
    comments: number;
    tasks_created: number;
    tasks_completed: number;
  }[];
  activity_by_day: { date: string; count: number }[];
}

export interface CodeRunResult {
  status: string;
  language: string;
  stdout: string;
  stderr: string;
  exit_code: number | null;
  compile_output: string;
  duration_ms: number;
  message?: string;
}

export interface PresenceParticipant {
  student_id: string;
  name: string;
  color: string | null;
}

export interface AwarenessState {
  student_id: string;
  name?: string;
  color?: string | null;
  role?: WorkspaceRole;
  file_id: string | null;
  cursor?: unknown;
  selection?: unknown;
}

// ---------------------------------------------------------------------------
// Request payload types
// ---------------------------------------------------------------------------

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
  name?: string;
  path?: string;
  parent_path?: string;
  type?: 'file' | 'folder';
  content?: string;
  language?: string;
}

export interface FileUpdateInput {
  content?: string;
  name?: string;
  language?: string;
}

export interface ChatSendInput {
  message: string;
  message_type?: ChatMessageType;
  reply_to?: string;
  mentions?: string[];
  file_id?: string;
  line_number?: number;
  code_language?: string;
}

export interface CommentCreateInput {
  body: string;
  file_id?: string;
  line_start?: number;
  line_end?: number;
  parent_comment_id?: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  assignee_student_id?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  labels?: string[];
  file_id?: string | null;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  assignee_student_id?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  labels?: string[];
  file_id?: string | null;
}

// ---------------------------------------------------------------------------
// API client
// ---------------------------------------------------------------------------

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
    init?: RequestInit,
  ): Promise<{ success: boolean; blob?: Blob; filename?: string; message?: string }> {
    try {
      const token = this.getAccessToken();
      const response = await fetch(`${PEER_LEARNING_API_URL}${path}`, {
        ...init,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(init?.headers || {}),
        },
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

  // -- Workspaces -----------------------------------------------------------

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
  ): Promise<ApiResponse<{ status: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}`, 'PATCH', input);
  }

  async archiveWorkspace(workspaceId: string): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}`, 'DELETE');
  }

  async unarchiveWorkspace(workspaceId: string): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/unarchive`, 'POST');
  }

  async purgeWorkspace(workspaceId: string): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/purge`, 'DELETE');
  }

  async leaveWorkspace(workspaceId: string): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/leave`, 'POST');
  }

  async transferOwnership(
    workspaceId: string,
    newOwnerStudentId: string,
  ): Promise<ApiResponse<{ status: string; owner_student_id: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/transfer-ownership`, 'POST', {
      new_owner_student_id: newOwnerStudentId,
    });
  }

  // -- Membership -----------------------------------------------------------

  async listMembers(
    workspaceId: string,
  ): Promise<ApiResponse<{ status: string; total: number; members: WorkspaceMember[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/members`);
  }

  async inviteMember(
    workspaceId: string,
    studentId: string,
    role: 'member' | 'viewer' = 'member',
  ): Promise<ApiResponse<{ status: string; invitation: InviteMeta }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/invite`, 'POST', {
      student_id: studentId,
      role,
    });
  }

  async updateMemberRole(
    workspaceId: string,
    studentId: string,
    role: 'member' | 'viewer',
  ): Promise<ApiResponse<{ status: string; member: WorkspaceMember }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(studentId)}`,
      'PATCH',
      { role },
    );
  }

  async removeMember(
    workspaceId: string,
    studentId: string,
  ): Promise<ApiResponse<{ status: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(studentId)}`,
      'DELETE',
    );
  }

  async searchStudents(query: string): Promise<ApiResponse<{ status: string; students: StudentSearchResult[] }>> {
    return this.request(`/api/workspaces/students/search${buildQuery({ q: query })}`);
  }

  // -- Join keys & invitations ----------------------------------------------

  async createJoinKey(
    workspaceId: string,
    options?: { role?: 'member' | 'viewer'; expires_in_hours?: number; max_uses?: number },
  ): Promise<
    ApiResponse<{ status: string; join_key: string; key_id: string; expires_at: string; max_uses: number }>
  > {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/join-keys`, 'POST', options ?? {});
  }

  async listJoinKeys(workspaceId: string): Promise<ApiResponse<{ status: string; keys: JoinKeyMeta[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/join-keys`);
  }

  async revokeJoinKey(workspaceId: string, keyId: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/join-keys/${encodeURIComponent(keyId)}`,
      'DELETE',
    );
  }

  async regenerateJoinKey(
    workspaceId: string,
    keyId: string,
    options?: { role?: 'member' | 'viewer'; expires_in_hours?: number; max_uses?: number },
  ): Promise<
    ApiResponse<{ status: string; join_key: string; key_id: string; expires_at: string; max_uses: number }>
  > {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/join-keys/${encodeURIComponent(keyId)}/regenerate`,
      'POST',
      options ?? {},
    );
  }

  async joinWithKey(
    joinKey: string,
  ): Promise<ApiResponse<{ status: string; workspace_id: string; role: WorkspaceRole }>> {
    return this.request('/api/workspaces/join', 'POST', { join_key: joinKey });
  }

  async listInvites(workspaceId: string): Promise<ApiResponse<{ status: string; invites: InviteMeta[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/invites`);
  }

  async revokeInvite(workspaceId: string, inviteId: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/invites/${encodeURIComponent(inviteId)}`,
      'DELETE',
    );
  }

  async listPendingInvitations(): Promise<ApiResponse<{ status: string; invitations: PendingInvitation[] }>> {
    return this.request('/api/workspaces/invitations/pending');
  }

  async acceptInvitation(inviteId: string): Promise<ApiResponse<{ status: string; workspace_id: string }>> {
    return this.request(`/api/workspaces/invitations/${encodeURIComponent(inviteId)}/accept`, 'POST');
  }

  async declineInvitation(inviteId: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(`/api/workspaces/invitations/${encodeURIComponent(inviteId)}/decline`, 'POST');
  }

  // -- Files ----------------------------------------------------------------

  async listFiles(
    workspaceId: string,
    includeContent = true,
  ): Promise<ApiResponse<{ status: string; total: number; files: WorkspaceFile[] }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files${buildQuery({ include_content: includeContent })}`,
    );
  }

  async getFile(workspaceId: string, fileId: string): Promise<ApiResponse<{ status: string; file: WorkspaceFile }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}`,
    );
  }

  async createFile(
    workspaceId: string,
    input: FileCreateInput,
  ): Promise<ApiResponse<{ status: string; file: WorkspaceFile }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/files`, 'POST', input);
  }

  async createFolder(
    workspaceId: string,
    input: FileCreateInput,
  ): Promise<ApiResponse<{ status: string; file: WorkspaceFile }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/folders`, 'POST', input);
  }

  async updateFile(
    workspaceId: string,
    fileId: string,
    input: FileUpdateInput,
  ): Promise<ApiResponse<{ status: string; file: WorkspaceFile }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}`,
      'PUT',
      input,
    );
  }

  async moveFile(
    workspaceId: string,
    fileId: string,
    newPath: string,
  ): Promise<ApiResponse<{ status: string; path: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/move`,
      'POST',
      { new_path: newPath },
    );
  }

  async duplicateFile(
    workspaceId: string,
    fileId: string,
  ): Promise<ApiResponse<{ status: string; files: WorkspaceFile[] }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/duplicate`,
      'POST',
    );
  }

  async deleteFile(
    workspaceId: string,
    fileId: string,
  ): Promise<ApiResponse<{ status: string; trash_id: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}`,
      'DELETE',
    );
  }

  // -- Versions -------------------------------------------------------------

  async listFileVersions(
    workspaceId: string,
    fileId: string,
  ): Promise<ApiResponse<{ status: string; total: number; versions: FileVersion[] }>> {
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
  ): Promise<ApiResponse<{ status: string; file: WorkspaceFile; content: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(fileId)}/versions/${encodeURIComponent(versionId)}/restore`,
      'POST',
    );
  }

  // -- Trash ----------------------------------------------------------------

  async listTrash(workspaceId: string): Promise<ApiResponse<{ status: string; items: TrashItem[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/trash`);
  }

  async restoreTrash(
    workspaceId: string,
    trashId: string,
  ): Promise<ApiResponse<{ status: string; files: WorkspaceFile[] }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/trash/${encodeURIComponent(trashId)}/restore`,
      'POST',
    );
  }

  async deleteTrash(workspaceId: string, trashId: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/trash/${encodeURIComponent(trashId)}`,
      'DELETE',
    );
  }

  // -- Import / export ------------------------------------------------------

  async exportWorkspace(
    workspaceId: string,
  ): Promise<{ success: boolean; blob?: Blob; filename?: string; message?: string }> {
    return this.requestBlob(`/api/workspaces/${encodeURIComponent(workspaceId)}/export`);
  }

  async importWorkspaceArchive(
    workspaceId: string,
    archive: Blob,
  ): Promise<ApiResponse<{ status: string; total: number; files: WorkspaceFile[] }>> {
    try {
      const token = this.getAccessToken();
      const response = await fetch(
        `${PEER_LEARNING_API_URL}/api/workspaces/${encodeURIComponent(workspaceId)}/import`,
        {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/zip',
          },
          body: archive,
        },
      );
      let result: Record<string, unknown> = {};
      try {
        result = (await response.json()) as Record<string, unknown>;
      } catch {
        result = {};
      }
      const detail = typeof result.detail === 'string' ? result.detail : undefined;
      return {
        success: response.ok,
        data: result as { status: string; total: number; files: WorkspaceFile[] },
        message: detail || (response.ok ? undefined : `Request failed (${response.status})`),
      };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }

  // -- Chat -----------------------------------------------------------------

  async listChatMessages(
    workspaceId: string,
    options?: { before?: string; limit?: number },
  ): Promise<
    ApiResponse<{
      status: string;
      total: number;
      messages: ChatMessage[];
      has_more: boolean;
      next_before: string | null;
      unread_count: number;
    }>
  > {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/chat${buildQuery(options)}`,
    );
  }

  async sendChatMessage(
    workspaceId: string,
    input: ChatSendInput,
  ): Promise<ApiResponse<{ status: string; message: ChatMessage; unread_count: number }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/chat`, 'POST', input);
  }

  async getChatUnread(workspaceId: string): Promise<ApiResponse<{ status: string; unread_count: number }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/chat/unread`);
  }

  async markChatRead(workspaceId: string): Promise<ApiResponse<{ status: string; unread_count: number }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/chat/read`, 'POST');
  }

  async updateChatMessage(
    workspaceId: string,
    messageId: string,
    message: string,
  ): Promise<ApiResponse<{ status: string; message: ChatMessage }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/chat/${encodeURIComponent(messageId)}`,
      'PATCH',
      { message },
    );
  }

  async deleteChatMessage(
    workspaceId: string,
    messageId: string,
  ): Promise<ApiResponse<{ status: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/chat/${encodeURIComponent(messageId)}`,
      'DELETE',
    );
  }

  // -- Comments -------------------------------------------------------------

  async listComments(
    workspaceId: string,
    options?: { file_id?: string; status?: 'open' | 'resolved' },
  ): Promise<ApiResponse<{ status: string; total: number; comments: CodeComment[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/comments${buildQuery(options)}`);
  }

  async createComment(
    workspaceId: string,
    input: CommentCreateInput,
  ): Promise<ApiResponse<{ status: string; comment: CodeComment }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/comments`, 'POST', input);
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

  async deleteComment(workspaceId: string, commentId: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/comments/${encodeURIComponent(commentId)}`,
      'DELETE',
    );
  }

  // -- Tasks ----------------------------------------------------------------

  async listTasks(
    workspaceId: string,
    options?: { status?: TaskStatus; assignee?: string },
  ): Promise<ApiResponse<{ status: string; total: number; tasks: WorkspaceTask[] }>> {
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

  async deleteTask(workspaceId: string, taskId: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/tasks/${encodeURIComponent(taskId)}`,
      'DELETE',
    );
  }

  // -- Assistant & code run -------------------------------------------------

  async askAssistant(
    workspaceId: string,
    input: { question: string; file_id?: string; code?: string; use_rag?: boolean },
  ): Promise<ApiResponse<{ status: string; answer: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/assistant/ask`, 'POST', input);
  }

  async runCode(
    workspaceId: string,
    input: { code: string; stdin?: string; file_id?: string | null; language?: string },
  ): Promise<ApiResponse<{ status: string; result: CodeRunResult }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/code/run`, 'POST', input);
  }

  // -- Activity / analytics / notifications ---------------------------------

  async listActivity(
    workspaceId: string,
    options?: { limit?: number; actor_student_id?: string; action?: string },
  ): Promise<ApiResponse<{ status: string; total: number; activities: ActivityEntry[] }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/activity${buildQuery(options)}`);
  }

  async getAnalytics(
    workspaceId: string,
  ): Promise<ApiResponse<{ status: string; analytics: WorkspaceAnalytics }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/analytics`);
  }

  async listNotifications(
    workspaceId: string,
    options?: { unread_only?: boolean; limit?: number },
  ): Promise<
    ApiResponse<{
      status: string;
      total: number;
      unread_count: number;
      notifications: WorkspaceNotification[];
    }>
  > {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/notifications${buildQuery(options)}`);
  }

  async markNotificationRead(
    workspaceId: string,
    notificationId: string,
  ): Promise<ApiResponse<{ status: string }>> {
    return this.request(
      `/api/workspaces/${encodeURIComponent(workspaceId)}/notifications/${encodeURIComponent(notificationId)}/read`,
      'PATCH',
    );
  }

  async markAllNotificationsRead(workspaceId: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(`/api/workspaces/${encodeURIComponent(workspaceId)}/notifications/read-all`, 'POST');
  }

  // -- WebSocket ------------------------------------------------------------

  getWebSocketUrl(workspaceId: string): string {
    const token = this.getAccessToken() || '';
    const base = PEER_LEARNING_API_URL.replace(/^http/, 'ws');
    return `${base}/api/workspaces/ws/${encodeURIComponent(workspaceId)}?token=${encodeURIComponent(token)}`;
  }
}

export const workspaceApi = new WorkspaceApi();
export { PEER_LEARNING_API_URL };

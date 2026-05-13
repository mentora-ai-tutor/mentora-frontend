const API_URL = process.env.NEXT_PUBLIC_PEER_LEARNING_API_URL || 'http://localhost:8000';

class PeerLearningApi {
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private getStudentIdFromToken(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.student_id || payload.id;
    } catch {
      return null;
    }
  }

  async getStudentProfile(): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const studentId = payload.student_id || payload.id;
      const response = await fetch(`${API_URL}/api/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to load profile' };
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  async findTeacher(): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/sessions/pair/match-me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      return await response.json();
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  async startQuestion(): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/sessions/my/start-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to start question' };
      return result;
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  async submitAnswer(answer: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/sessions/my/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answer }),
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to submit answer' };
      return result;
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  // ─── Notifications API ─────────────────────────────────────────────────────

  async getNotifications(): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, data: [] };
    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) return { success: false, data: [] };
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, data: [] };
    }
  }

  async markNotificationRead(notificationId: string): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async markAllNotificationsRead(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async acceptNotification(notificationId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getUnreadNotificationCount(): Promise<number> {
    const result = await this.getNotifications();
    if (!result.success) return 0;
    return (result.data || []).filter((n: any) => n.status === 'unread').length;
  }

  // ─── Live Room REST API ─────────────────────────────────────────────────────

  async getSessionReady(sessionId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api/live-room/${sessionId}/ready`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getMyLiveRoom(): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api/live-room/my/room`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getLiveRoom(sessionId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api/live-room/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async joinLiveRoom(sessionId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api/live-room/${sessionId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async leaveLiveRoom(sessionId: string): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const response = await fetch(`${API_URL}/api/live-room/${sessionId}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getLiveRoomMembers(sessionId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api/live-room/${sessionId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getScreenShareState(sessionId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api/live-room/${sessionId}/screen-share`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  // ─── Performance API ───────────────────────────────────────────────────────

  async getStudentPerformance(studentId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/performance/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to load performance' };
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  async getStudentTopicPerformance(studentId: string, topicId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/performance/${studentId}/topic/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to load topic performance' };
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  async getCompletionReport(studentId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/performance/${studentId}/completion`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to load completion report' };
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  // ─── Groups API ────────────────────────────────────────────────────────────

  async formGroupSession(topicId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/groups/form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topic_id: topicId }),
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to form group session' };
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  async getGroupSession(sessionId: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api/groups/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async submitGroupScores(
    sessionId: string,
    studentId: string,
    taskCompletion: number,
    collaboration: number,
    communication: number,
  ): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/groups/${sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          student_id: studentId,
          task_completion_score: taskCompletion,
          collaboration_score: collaboration,
          communication_score: communication,
        }),
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to submit scores' };
      return result;
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }

  // ─── WebSocket ──────────────────────────────────────────────────────────────

  connectLiveRoomWebSocket(
    sessionId: string,
    onMessage: (data: any) => void,
    onOpen?: () => void,
    onClose?: (code?: number, reason?: string) => void,
    onError?: (err: Event) => void,
  ): WebSocket | null {
    const token = this.getAccessToken();
    const studentId = this.getStudentIdFromToken();
    if (!token || !studentId) return null;

    const wsUrl = `${API_URL.replace(/^http/, 'ws')}/api/live-room/ws/${sessionId}?student_id=${studentId}&token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (onOpen) onOpen();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = (event) => {
      if (onClose) onClose(event.code, event.reason);
    };

    ws.onerror = (err) => {
      if (onError) onError(err);
    };

    return ws;
  }

  connectSessionWebSocket(
    sessionId: string,
    onMessage: (data: any) => void,
    onOpen?: () => void,
    onClose?: () => void,
    onError?: (err: Event) => void,
  ): WebSocket | null {
    const token = this.getAccessToken();
    const studentId = this.getStudentIdFromToken();
    if (!token || !studentId) return null;

    const wsUrl = `${API_URL.replace(/^http/, 'ws')}/ws/session/${sessionId}?student_id=${studentId}&role=learner&token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (onOpen) onOpen();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      if (onClose) onClose();
    };

    ws.onerror = (err) => {
      if (onError) onError(err);
    };

    return ws;
  }
}

export const peerLearningApi = new PeerLearningApi();

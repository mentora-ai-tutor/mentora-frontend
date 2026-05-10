const API_URL = process.env.NEXT_PUBLIC_PEER_LEARNING_API_URL || 'http://localhost:8000';

class PeerLearningApi {
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
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

  async getNotifications(): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.detail || 'Failed to load notifications' };
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  }
}

export const peerLearningApi = new PeerLearningApi();

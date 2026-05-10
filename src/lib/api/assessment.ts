/* eslint-disable @typescript-eslint/no-explicit-any */
const AME_API_URL = process.env.NEXT_PUBLIC_AME_API_URL || 'http://localhost:5002';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface MasteryProfile {
  overall_mastery_score: number;
  knowledge_gaps: Array<{
    topic_name: string;
    gap_type: 'FUNDAMENTAL_GAP' | 'PARTIAL_GAP' | 'SURFACE_GAP';
    confidence: number;
    evidence_summary?: string;
    observed_error_patterns?: Record<string, string[]>;
    misconceptions?: string[];
    prerequisite_topics?: string[];
    suggested_intervention?: {
      primary: string;
      estimated_time_minutes: number;
      learning_objectives: string[];
    };
  }>;
  strengths: Array<{
    topic_name: string;
    mastery_level: string;
    confidence: number;
    evidence_summary?: string;
    can_teach_others?: boolean;
  }>;
}

interface StartSessionPayload {
  mastery_profile: MasteryProfile;
}

interface SubmitAnswerPayload {
  session_id: string;
  question_id: string;
  answer: string;
}

class AssessmentApi {
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any,
  ): Promise<ApiResponse<T>> {
    const token = this.getAccessToken();
    const url = `${AME_API_URL}${path}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API error: ${response.status}`);
    }

    return result;
  }

  async startSession(payload: StartSessionPayload): Promise<ApiResponse<any>> {
    return this.request('POST', '/api/ame/start-session', payload);
  }

  async submitAnswer(payload: SubmitAnswerPayload): Promise<ApiResponse<any>> {
    return this.request('POST', '/api/ame/submit-answer', payload);
  }

  async getSession(sessionId: string): Promise<ApiResponse<any>> {
    return this.request('GET', `/api/ame/session/${sessionId}`);
  }

  async getSessions(): Promise<ApiResponse<any>> {
    return this.request('GET', '/api/ame/sessions');
  }

  async getQuestions(topic?: string): Promise<ApiResponse<any>> {
    const query = topic ? `?topic=${encodeURIComponent(topic)}` : '';
    return this.request('GET', `/api/ame/questions${query}`);
  }

  async getFeedbackReport(sessionId: string): Promise<ApiResponse<any>> {
    return this.request('GET', `/api/ame/feedback-report/${sessionId}`);
  }
}

export const assessmentApi = new AssessmentApi();
export type { ApiResponse, MasteryProfile, StartSessionPayload, SubmitAnswerPayload };

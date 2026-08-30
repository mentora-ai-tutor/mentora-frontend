const PEER_LEARNING_API_URL =
  process.env.NEXT_PUBLIC_PEER_LEARNING_API_URL || 'http://localhost:8001';

// ── Types matching exact backend schemas ───────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  status?: string;
  [key: string]: unknown;
  data?: T;
}

// ── Student Analysis (GET /api/student/analysis/{id}) ──

export interface ImportWeakSubskill {
  subskill: string;
  subskill_id: string;
  status: string;
  evidence?: string;
  recommended_content_focus?: string;
}

export interface ImportSuggestedIntervention {
  primary: string;
  secondary: string[];
  difficulty_level: string;
  estimated_time_minutes: number;
  learning_objectives: string[];
}

export interface ImportKnowledgeGap {
  topic: string;
  topic_id: string;
  gap_type: string;
  confidence: number;
  mastery_score: number;
  weak_subskills: ImportWeakSubskill[];
  known_subskills?: unknown[];
  misconceptions: string[];
  observed_error_patterns?: { github: string[]; sandbox: string[]; quizzes: string[] };
  evidence_summary?: string;
  suggested_intervention?: ImportSuggestedIntervention;
}

export interface ImportStrength {
  topic: string;
  topic_id: string;
  confidence: number;
  mastery_score: number;
  mastery_level: string;
  can_teach_others: boolean;
}

export interface ImportMasteryProfile {
  overall_mastery_score: number;
  knowledge_gaps: ImportKnowledgeGap[];
  strengths: ImportStrength[];
}

export interface ImportRecommendations {
  priority_order: string[];
  general_advice?: string;
  for_instructor?: string;
}

export interface StudentAnalysisDocument {
  _id: string;
  schema_version: string;
  student_id: string;
  analysis_timestamp: string;
  data_sources: { github: string; sandbox: string; quizzes: string };
  mastery_profile: ImportMasteryProfile;
  recommendations: ImportRecommendations;
  overall_mastery_score: number;
  knowledge_gaps: ImportKnowledgeGap[];
  strengths: ImportStrength[];
  gap_topic_ids: string[];
  created_at: string;
  updated_at: string;
  saved_at: string;
}

// ── Peer Match (POST /api/peer/match) ──────────────

export interface PeerMatchResponse {
  status: string;
  matched_peer_id: string | null;
  match_score: number;
  message: string;
  room_id?: string;
  notification_id?: string;
}

export interface CodingTask {
  task_number?: number;
  task_type: string;
  task_description: string;
  starter_code: string;
  requirements: string[];
  hints: string[];
  evaluation_criteria?: string;
}

export interface TaskProgressItem {
  task_number: number;
  task_type: string;
  status: 'available' | 'completed' | 'locked';
  attempts: number;
  passed: boolean;
}

// ── Diagnostic Coding Session (POST /api/student/onboard-and-diagnose) ──

export interface DiagnosticCodingTask {
  task_type: string;
  task_description: string;
  starter_code: string;
  requirements: string[];
  hints: string[];
  evaluation_criteria: string;
}

export interface DiagnosticSessionTaskResponse {
  status: 'in_progress';
  student_id: string;
  current_task_number: number;
  total_tasks: number;
  task: DiagnosticCodingTask;
  instructions: string;
}

export interface DiagnosticTaskResult {
  task_index: number;
  task_type: string;
  submitted_code: string;
  is_correct: boolean;
  grade: string;
  feedback: string;
}

export interface DiagnosticSessionCompleteResponse {
  status: 'session_complete';
  student_id: string;
  session_summary: {
    total_tasks: number;
    tasks_passed: number;
    mastery_score: number;
    results: DiagnosticTaskResult[];
  };
}

export type DiagnosticSessionResponse =
  | DiagnosticSessionTaskResponse
  | DiagnosticSessionCompleteResponse;

// ── Evaluate Diagnostic Quiz (POST /api/student/evaluate-diagnostic-quiz) ──

export interface DiagnosticEvaluationSubmission {
  submitted_code: string;
}

export interface GradedSubmission {
  task_index: number;
  submitted_code: string;
  is_correct: boolean;
  correct_answer: string;
}

export interface DiagnosticEvaluationResult {
  status: string;
  graded_submissions: GradedSubmission[];
  feedback: string;
}

// ── Peer Notifications (GET /api/peer/notifications) ──

export interface PeerNotification {
  _id: string;
  student_id: string;
  type: 'peer_match';
  matched_student_id: string;
  matched_student_name: string;
  room_id: string;
  topic: string;
  role: string;
  match_score: number;
  status: 'unread' | 'read';
  created_at: string;
  read_at?: string;
}

export interface PeerNotificationsResponse {
  status: string;
  total: number;
  unread_count: number;
  notifications: PeerNotification[];
}

// ── Code Assessment (POST /api/assessment/evaluate) ─

export interface CodeEvaluationRequest {
  code: string;
}

export interface CodeEvaluation {
  is_valid: boolean;
  feedback: string;
  complexity: string;
  passed_tests: boolean;
  errors: string[];
  suggestions: string[];
}

export interface TaskEvaluation {
  grade: string;
  feedback: string;
  sample_approach: string;
  syntax_evaluation: string;
}

export type SessionStatus = 'no_session' | 'in_progress' | 'session_complete';

export interface CodeEvaluationResponse {
  status: string;
  student_id: string;
  language: string;
  evaluation: CodeEvaluation;
  task_evaluation?: TaskEvaluation;
  session_status?: SessionStatus;
  current_task_index?: number;
  evaluation_type?: string;
  task_number?: number;
  passed?: boolean;
  next_task_available?: boolean;
}

// ── Content Recommendation (POST /api/content/recommend) ─

export interface ContentRecommendation {
  title: string;
  type: string;
  estimated_minutes: number;
  link: string;
}

export interface ContentMcqOption {
  option_id: string;
  option_text: string;
}

export interface ContentMcqQuestion {
  question_id: number;
  question: string;
  options: ContentMcqOption[];
  correct_answer: string;
  explanation: string;
}

// The actual backend returns a single rich learning recommendation
export interface SingleContentRecommendation {
  status: string;
  student_id?: string;
  topic?: string;
  weak_subskill?: string;
  target_subskill?: string;
  tutorial_title?: string;
  concept_summary?: string;
  key_takeaways?: string[];
  practice_code_snippet?: string;
  suggested_exercise?: string;
  mcq_questions?: ContentMcqQuestion[];
  // legacy/list shape (some backend versions return an array)
  recommendations?: ContentRecommendation[];
}

export type ContentRecommendResponse = SingleContentRecommendation;

// ── Individual Quiz (POST /api/individual-quiz/start, submit-answer) ─

export interface QuizQuestion {
  id: number;
  question: string;
  hint?: string;
}

export interface IndividualQuizStartResponse {
  status: string;
  session_id: string;
  total_questions: number;
  question_index: number;
  first_question: QuizQuestion;
}

export interface SubmitAnswerResponse {
  status: string;
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  next_question: QuizQuestion | null;
  is_quiz_completed: boolean;
}

export interface QuizDetailedHistoryItem {
  question_id: number;
  question_text: string;
  student_answer: string;
  expected_answer: string;
  is_correct: boolean;
  feedback: string;
}

export interface QuizSummaryResponse {
  status: string;
  session_id: string;
  student_id: string;
  topic: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  detailed_history: QuizDetailedHistoryItem[];
}

// ── Chat Summarize (POST /api/chat/summarize-session) ─

export interface SummaryResponse {
  status: string;
  total_messages: number;
  summary: string;
  key_learning_points: string[];
}

// ── Issue Token (POST /api/student/issue-token) ────

export interface IssueTokenResponse {
  student_id: string;
  access_token: string;
  token_type: string;
  expires_minutes: number;
}

// ── Chat Support (POST /api/chat/support) ──────────

export interface ChatSupportResponse {
  status: string;
  student_id?: string;
  reply: string;
  [key: string]: unknown;
}

// ── WebSocket message shapes (from backend) ────────

export interface ChatWsMessage {
  sender: string;
  content: string;
}

export interface CollabWsMessage {
  type: string;
  code?: string;
  active_users_count?: number;
  timestamp?: string;
  student_id?: string;
  message?: string;
  current_task?: number;
  current_task_index?: number;
  total_tasks?: number;
  status?: string;
  attempts?: number;
  passed?: boolean;
  task_progress?: TaskProgressItem[];
  sequence_complete?: boolean;
  task?: CodingTask;
  coding_tasks?: CodingTask[];
  student_name?: string;
  role?: string;
  cursor?: Record<string, unknown>;
  cursors?: Record<string, unknown>[];
  whiteboard?: Record<string, unknown>[];
  whiteboard_state?: Record<string, unknown>[];
  element?: Record<string, unknown>;
  element_id?: string;
  participant_id?: string;
  color?: string;
  [key: string]: unknown;
}

// ── API Client ─────────────────────────────────────

class PeerLearningApi {
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
    method: 'GET' | 'POST' = 'GET',
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${PEER_LEARNING_API_URL}${path}`, {
        method,
        headers: this.getHeaders(),
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const result = await response.json();
      return { success: response.ok, data: result as T, message: result.message };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }

  // ── Student Analysis ────────────────────────────

  async getStudentAnalysis(studentId: string): Promise<ApiResponse<{ analysis: StudentAnalysisDocument }>> {
    return this.request<{ analysis: StudentAnalysisDocument }>(`/api/student/analysis/${studentId}`);
  }

  // ── Issue Token ─────────────────────────────────

  async issueToken(studentId: string, expiresMinutes = 60): Promise<ApiResponse<IssueTokenResponse>> {
    return this.request<IssueTokenResponse>('/api/student/issue-token', 'POST', {
      student_id: studentId,
      expires_minutes: expiresMinutes,
    });
  }

  // ── Peer Matching (JWT-only, no body) ──────────

  async matchPeer(): Promise<ApiResponse<PeerMatchResponse>> {
    return this.request<PeerMatchResponse>('/api/peer/match', 'POST');
  }

  async onboardAndDiagnose(): Promise<ApiResponse<DiagnosticSessionResponse>> {
    return this.request<DiagnosticSessionResponse>(
      '/api/student/onboard-and-diagnose',
      'POST',
    );
  }

  async resetDiagnosticSession(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request<{ status: string; message: string }>(
      '/api/student/diagnostic-session/reset',
      'POST',
    );
  }

  async evaluateDiagnosticQuiz(submissions: DiagnosticEvaluationSubmission[]): Promise<ApiResponse<DiagnosticEvaluationResult>> {
    return this.request<DiagnosticEvaluationResult>(
      '/api/student/evaluate-diagnostic-quiz',
      'POST',
      { submissions },
    );
  }

  // ── Code Assessment (body: { code }) ───────────

  async evaluateCode(code: string): Promise<ApiResponse<CodeEvaluationResponse>> {
    return this.request<CodeEvaluationResponse>('/api/assessment/evaluate', 'POST', { code });
  }

  // ── Content Recommendation (JWT-only, no body) ─

  async recommendContent(params?: {
    studentId?: string;
    topic?: string;
    weak_subskill?: string;
    misconception?: string;
    difficulty_level?: string;
  }): Promise<ApiResponse<ContentRecommendResponse>> {
    let studentId = params?.studentId || '';
    if (!studentId && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored) as Record<string, unknown>;
          studentId = String(u.student_id || u._id || '');
        }
      } catch {
        studentId = '';
      }
    }
    return this.request<ContentRecommendResponse>('/api/content/recommend', 'POST', {
      student_id: studentId,
      topic: params?.topic || 'Java Programming',
      weak_subskill: params?.weak_subskill || 'General Concepts',
      misconception: params?.misconception || 'None',
      difficulty_level: params?.difficulty_level || 'beginner',
    });
  }

  // ── Chat Summarize (room_id as query) ──────────

  async summarizeSession(roomId: string): Promise<ApiResponse<SummaryResponse>> {
    return this.request<SummaryResponse>(`/api/chat/summarize-session?room_id=${encodeURIComponent(roomId)}`, 'POST');
  }

  // ── Individual Quiz (code-based, 7 questions) ──

  async startIndividualQuiz(): Promise<ApiResponse<IndividualQuizStartResponse>> {
    return this.request<IndividualQuizStartResponse>('/api/individual-quiz/start', 'POST');
  }

  async submitQuizAnswer(studentAnswer: string): Promise<ApiResponse<SubmitAnswerResponse>> {
    return this.request<SubmitAnswerResponse>('/api/individual-quiz/submit-answer', 'POST', {
      student_answer: studentAnswer,
    });
  }

  async getQuizSummary(sessionId: string): Promise<ApiResponse<QuizSummaryResponse>> {
    return this.request<QuizSummaryResponse>(`/api/individual-quiz/summary/${encodeURIComponent(sessionId)}`);
  }

  // ── Chat Support (AI Assistant Teacher) ────────

  async chatSupport(message: string): Promise<ApiResponse<ChatSupportResponse>> {
    return this.request<ChatSupportResponse>('/api/chat/support', 'POST', {
      message,
    });
  }

  // ── Collaboration Rooms ─────────────────────────

  async initializeCollabSession(roomId: string, topicId = 'JAVA_GENERAL'): Promise<ApiResponse<{ status: string; room_id: string; student_id: string; topic_id: string }>> {
    return this.request(`/api/collab/initialize-session?room_id=${encodeURIComponent(roomId)}&topic_id=${encodeURIComponent(topicId)}`, 'POST');
  }

  async listActiveRooms(): Promise<ApiResponse<{ active_rooms_count: number; rooms: Record<string, number> }>> {
    return this.request('/api/collab/rooms');
  }

  async getRoomState(roomId: string): Promise<ApiResponse<{ room_id: string; code: string }>> {
    return this.request(`/api/collab/rooms/${roomId}/state`);
  }

  // ── WebSocket: Chat (Discussion Moderator) ──────
  //    Backend: ws://host/api/chat/ws/{room_id}/{student_id}?token=...
  //    Messages sent as raw text. Broadcasts as JSON {sender, content}.

  connectChatWebSocket(
    roomId: string,
    studentId: string,
    onMessage: (msg: ChatWsMessage) => void,
    onOpen?: () => void,
    onClose?: () => void,
  ): WebSocket {
    const token = this.getAccessToken() || '';
    const url = `${PEER_LEARNING_API_URL.replace('http', 'ws')}/api/chat/ws/${roomId}/${studentId}?token=${token}`;
    const ws = new WebSocket(url);

    ws.onopen = () => onOpen?.();

    ws.onmessage = (event) => {
      try {
        const data: ChatWsMessage = JSON.parse(event.data);
        onMessage(data);
      } catch {
        onMessage({ sender: 'unknown', content: event.data });
      }
    };

    ws.onclose = () => onClose?.();
    ws.onerror = () => onClose?.();

    return ws;
  }

  // ── WebSocket: Collaborative Editor ─────────────
  //    Backend: ws://host/api/collab/ws/collab/{room_id}?token=...
  //    Sends JSON messages. Receives INIT_STATE on connect, then CODE_CHANGE broadcasts.

  connectCollabWebSocket(
    roomId: string,
    onMessage: (msg: CollabWsMessage) => void,
    onOpen?: () => void,
    onClose?: () => void,
  ): WebSocket {
    const token = this.getAccessToken() || '';
    const url = `${PEER_LEARNING_API_URL.replace('http', 'ws')}/api/collab/ws/collab/${roomId}?token=${token}`;
    const ws = new WebSocket(url);

    ws.onopen = () => onOpen?.();

    ws.onmessage = (event) => {
      try {
        const data: CollabWsMessage = JSON.parse(event.data);
        onMessage(data);
      } catch {
        onMessage({ type: 'CODE_CHANGE', code: event.data });
      }
    };

    ws.onclose = () => onClose?.();
    ws.onerror = () => onClose?.();

    return ws;
  }

  // ── Peer Notifications ─────────────────────────

  async getPeerNotifications(status: 'unread' | 'read' | 'all' = 'unread'): Promise<ApiResponse<PeerNotificationsResponse>> {
    return this.request<PeerNotificationsResponse>(`/api/peer/notifications?status=${status}`);
  }

  async getUnreadNotificationCount(): Promise<number> {
    const result = await this.getPeerNotifications('unread');
    if (result.success && result.data) {
      return result.data.unread_count || 0;
    }
    return 0;
  }

  async markNotificationRead(notificationId: string): Promise<ApiResponse> {
    return this.request(`/api/peer/notifications/${notificationId}/read`, 'POST');
  }

  async markAllNotificationsRead(): Promise<ApiResponse> {
    return this.request('/api/peer/notifications/read-all', 'POST');
  }

  async markNotificationUnread(notificationId: string): Promise<ApiResponse> {
    return this.request(`/api/peer/notifications/${notificationId}/unread`, 'POST');
  }

  // ── Health Check ────────────────────────────────

  async healthCheck(): Promise<ApiResponse> {
    return this.request('/');
  }
}

export const peerLearningApi = new PeerLearningApi();

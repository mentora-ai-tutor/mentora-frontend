const LMG_API_URL = process.env.NEXT_PUBLIC_LMG_API_URL || 'http://localhost:5012';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  details?: any[];
  error?: string;
}

interface PaginatedData<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface KnowledgeGap {
  topic: string;
  topic_id: string;
  gap_type: 'FUNDAMENTAL_GAP' | 'PARTIAL_GAP' | 'SURFACE_GAP';
  confidence?: number;
  misconceptions?: string[];
  observed_error_patterns?: Record<string, string[]>;
  evidence_summary?: string;
  prerequisite_topics?: string[];
  related_topics?: string[];
  suggested_intervention?: {
    primary: string;
    secondary: string[];
    difficulty_level: string;
    estimated_time_minutes: number;
    learning_objectives: string[];
  };
}

type StrengthItem = string | {
  topic: string;
  topic_id: string;
  confidence?: number;
  mastery_level?: string;
  evidence_summary?: string;
  can_teach_others?: boolean;
};

interface MasteryProfile {
  overall_mastery_score: number;
  knowledge_gaps: KnowledgeGap[];
  strengths: StrengthItem[];
}

interface SubmitProfilePayload {
  student_id: string;
  analysis_timestamp?: string;
  mastery_profile: MasteryProfile;
  recommendations?: {
    priority_order?: string[];
    general_advice?: string;
    for_instructor?: string;
  };
  data_sources?: Record<string, string>;
}

interface GenerationJob {
  job_id: string;
  student_id: string;
  profile_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'partial' | 'closed';
  gaps_total: number;
  gaps_completed: number;
  gaps_failed: number;
  materials_generated: number;
  materials_failed: number;
  created_at: string;
  completed_at?: string;
  error?: string;
}

interface Lesson {
  page_title?: string;
  introduction?: {
    what_is_it: string;
    why_learn_it: string;
    prerequisite_note: string;
  };
  concept_explained?: {
    core_definition: string;
    analogy: string;
    how_java_handles_it: string;
    misconceptions_corrected: string;
  };
  syntax_reference?: {
    basic_syntax: string;
    syntax_breakdown: string[];
    important_rules: string[];
  };
  examples?: Record<string, {
    title: string;
    description: string;
    code: string;
    output: string;
    explanation: string;
  }>;
  step_by_step_guide?: {
    overview: string;
    steps: Array<{
      step_number: number;
      title: string;
      instruction: string;
      java_tip: string;
    }>;
  };
  common_mistakes?: Array<{
    mistake_number: number;
    title: string;
    description: string;
    bad_code: string;
    good_code: string;
    explanation: string;
  }>;
  debugging_exercise?: {
    title: string;
    scenario: string;
    broken_code: string;
    error_output: string;
    hint: string;
    solution_code: string;
    solution_explanation: string;
  };
  quick_reference?: {
    cheat_sheet: string;
    important_rules: string[];
  };
  connections?: any;
}

interface QuizQuestion {
  question_number: number;
  type: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  misconception_targeted: string;
  difficulty: string;
  code_snippet?: string;
}

interface Assessment {
  quiz: QuizQuestion[];
  concept_summary: string;
  practice_challenge: {
    title: string;
    difficulty: string;
    time_estimate: string;
    problem_statement: string;
    requirements: string[];
    starter_code: string;
    example_input: string;
    expected_output: string;
    bonus?: string;
  };
  self_check?: {
    can_you: string[];
    if_stuck: string;
  };
}

interface LearningMaterial {
  _id: string;
  structured_material: {
    material_id: string;
    student_id: string;
    topic: string;
    topic_id: string;
    gap_type: string;
    difficulty_level: string;
    generated_at: string;
    generation_models?: {
      llm?: string;
      slm?: string;
    };
    lesson: Lesson;
    assessment: Assessment;
    personalisation?: any;
    study_plan?: any;
    agentic_metadata?: any;
    quality_flags?: any;
  };
  created_at: string;
  updated_at: string;
}

interface AgentStats {
  total_jobs: number;
  active_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  materials_generated: number;
  latest_profile?: {
    overall_mastery_score: number;
    gaps_count: number;
  };
}

interface StudentProgress {
  _id: string;
  student_id: string;
  material_id: string;
  topic_id: string;
  topic: string;
  total_steps: number;
  completed_steps: number[];
  quiz_score: number | null;
  started_at: string;
  completed_at: string | null;
  last_active_step: number;
  createdAt: string;
  updatedAt: string;
}

interface ProgressStats {
  total_materials: number;
  completed_materials: number;
  in_progress_materials: number;
  not_started_materials: number;
  total_steps: number;
  completed_steps: number;
  progress_percentage: number;
  avg_quiz_score: number | null;
}

class LearningGeneratorApi {
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
    const url = `${LMG_API_URL}${path}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const result = await response.json();
    return result;
  }

  async checkHealth(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${LMG_API_URL}/health`);
    return response.json();
  }

  async submitProfile(payload: SubmitProfilePayload): Promise<ApiResponse<{
    job_id: string;
    student_id: string;
    gaps_queued: number;
    topics: string[];
    check_status_at: string;
    materials_available_at: string;
  }>> {
    return this.request('POST', '/api/mastery/submit', payload);
  }

  async getProfile(studentId: string): Promise<ApiResponse> {
    return this.request('GET', `/api/mastery/${studentId}`);
  }

  async getProfileHistory(studentId: string, page = 1, limit = 10): Promise<ApiResponse> {
    return this.request('GET', `/api/mastery/${studentId}/history?page=${page}&limit=${limit}`);
  }

  async getMaterials(studentId: string, params?: { topic?: string; gap_type?: string; limit?: number; page?: number }): Promise<ApiResponse<LearningMaterial[]>> {
    const qs = new URLSearchParams();
    if (params?.topic) qs.set('topic', params.topic);
    if (params?.gap_type) qs.set('gap_type', params.gap_type);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.page) qs.set('page', String(params.page));
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return this.request('GET', `/api/materials/${studentId}${query}`);
  }

  async getMaterial(materialId: string): Promise<ApiResponse<LearningMaterial>> {
    return this.request('GET', `/api/materials/item/${materialId}`);
  }

  async getTopics(studentId: string): Promise<ApiResponse<string[]>> {
    return this.request('GET', `/api/materials/${studentId}/topics`);
  }

  async getMaterialStats(studentId: string): Promise<ApiResponse> {
    return this.request('GET', `/api/materials/${studentId}/stats`);
  }

  async deleteMaterial(materialId: string): Promise<ApiResponse> {
    return this.request('DELETE', `/api/materials/item/${materialId}`);
  }

  async getJobStatus(jobId: string): Promise<ApiResponse<GenerationJob>> {
    return this.request('GET', `/api/agent/jobs/${jobId}`);
  }

  async completeJob(jobId: string): Promise<ApiResponse<GenerationJob>> {
    return this.request('POST', `/api/agent/jobs/${jobId}/complete`);
  }

  async closeJob(jobId: string): Promise<ApiResponse<GenerationJob>> {
    return this.request('PATCH', `/api/agent/jobs/${jobId}`, { status: 'closed' });
  }

  async getJobsByStudent(studentId: string): Promise<ApiResponse<GenerationJob[]>> {
    return this.request('GET', `/api/agent/jobs/student/${studentId}`);
  }

  async getGlobalStats(): Promise<ApiResponse<AgentStats>> {
    return this.request('GET', '/api/agent/stats/global');
  }

  async getAgentLogs(studentId: string): Promise<ApiResponse> {
    return this.request('GET', `/api/agent/logs/${studentId}`);
  }

  async retryMaterial(materialId: string): Promise<ApiResponse> {
    return this.request('POST', `/api/agent/retry/${materialId}`);
  }

  async getProgressByMaterial(materialId: string): Promise<ApiResponse<StudentProgress | null>> {
    return this.request('GET', `/api/progress/material/${materialId}`);
  }

  async updateProgress(materialId: string, data: {
    total_steps?: number;
    completed_step?: number;
    active_step?: number;
    quiz_score?: number;
    completed_all?: boolean;
  }): Promise<ApiResponse<StudentProgress>> {
    return this.request('PUT', `/api/progress/material/${materialId}`, data);
  }

  async getProgressByStudent(studentId: string): Promise<ApiResponse<StudentProgress[]>> {
    return this.request('GET', `/api/progress/student/${studentId}`);
  }

  async getProgressStats(studentId: string): Promise<ApiResponse<ProgressStats>> {
    return this.request('GET', `/api/progress/student/${studentId}/stats`);
  }
}

export const learningGeneratorApi = new LearningGeneratorApi();
export type {
  ApiResponse,
  KnowledgeGap,
  StrengthItem,
  MasteryProfile,
  SubmitProfilePayload,
  GenerationJob,
  LearningMaterial,
  Lesson,
  Assessment,
  QuizQuestion,
  AgentStats,
  StudentProgress,
  ProgressStats,
};

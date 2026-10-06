import { authApi } from "@/lib/api/auth";
import { ReviewJob } from "@/lib/api/review";

const KNOWLEDGE_API_BASE_URL =
  process.env.NEXT_PUBLIC_KNOWLEDGE_API_URL || "http://localhost:5007";

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  detail?: string;
}

export interface SandboxAttemptPayload {
  challenge_id: string;
  title: string;
  topic: string;
  difficulty?: string;
  code: string;
  stdin?: string;
  expected_output: string;
  output?: string | null;
  error?: string | null;
  success: boolean;
  passed: boolean;
  attempt_number: number;
  runtime_ms?: number;
  review_job_id?: string;
}

export interface SandboxAttempt {
  attempt_id: string;
  challenge_id: string;
  title: string;
  topic: string;
  difficulty?: string;
  code: string;
  stdin?: string;
  expected_output: string;
  output?: string | null;
  error?: string | null;
  success: boolean;
  passed: boolean;
  attempt_number: number;
  runtime_ms?: number;
  created_at: string;
}

export interface QuizTopicPerformance {
  topic: string;
  correct: number;
  total: number;
  avg_time_seconds: number;
  retry_count: number;
}

export interface QuizQuestionResult {
  qid: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  type: "mcq" | "predict_output";
  correct: boolean;
  chosen_option_id: string;
  time_seconds: number;
}

export interface QuizResultSummary {
  result_id: string;
  session_id: string;
  public_student_id?: string;
  mode: string;
  score_percent: number;
  correct: number;
  total: number;
  difficulty_reached: "easy" | "medium" | "hard";
  topic_performance: QuizTopicPerformance[];
  questions: QuizQuestionResult[];
  completed_at?: string;
}

export interface KnowledgeProfile {
  student_id: string;
  public_student_id: string;
  generated_at: string;
  review_summary: {
    jobs: number;
    total_repos: number;
    reviewed: number;
    failed: number;
    findings: number;
    high_risk: number;
    latest_java_level?: string | null;
    latest_evidence?: string | null;
  };
  sandbox_summary: {
    total_attempts: number;
    recent_attempts: number;
    recent_passed: number;
    recent_pass_rate: number;
    topics: Array<{
      topic: string;
      challenge_id?: string;
      title?: string;
      attempts: number;
      passed: number;
      latest_code?: string;
      latest_output?: string | null;
      latest_error?: string | null;
      latest_at?: string;
    }>;
  };
  quiz_summary: {
    total_quizzes: number;
    avg_score: number;
    best_score: number;
    latest_score: number;
    questions_answered: number;
    questions_correct: number;
    topic_mastery: Array<{
      topic: string;
      correct: number;
      total: number;
      accuracy_percent: number;
    }>;
  };
  latest_reviews: ReviewJob[];
  latest_sandbox_attempts: SandboxAttempt[];
  latest_quiz_results: QuizResultSummary[];
  timeline: Array<{
    type: "github_review" | "sandbox_attempt" | "quiz";
    id: string;
    label: string;
    time?: string;
    status?: string;
    repo_count?: number;
    attempt_number?: number;
  }>;
}

export interface SubskillDiagnosis {
  subskill: string;
  subskill_id: string;
  status: "weak" | "mastered";
  evidence?: string | null;
  recommended_content_focus?: string | null;
}

export interface SuggestedIntervention {
  primary: string;
  secondary: string[];
  difficulty_level: string;
  estimated_time_minutes: number;
  learning_objectives: string[];
}

export interface KnowledgeGap {
  topic: string;
  topic_id: string;
  gap_type: "FUNDAMENTAL_GAP" | "PARTIAL_GAP" | "SURFACE_GAP";
  confidence: number;
  mastery_score: number;
  weak_subskills: SubskillDiagnosis[];
  known_subskills: SubskillDiagnosis[];
  misconceptions: string[];
  observed_error_patterns: Record<string, string[]>;
  evidence_summary: string;
  prerequisite_topics: string[];
  related_topics: string[];
  suggested_intervention: SuggestedIntervention;
}

export interface Strength {
  topic: string;
  topic_id: string;
  confidence: number;
  mastery_score: number;
  mastery_level: "beginner" | "proficient" | "advanced";
  evidence_summary: string;
  known_subskills: SubskillDiagnosis[];
  can_teach_others: boolean;
}

export interface CanonicalMasteryProfile {
  profile_id?: string;
  schema_version: string;
  student_id: string;
  analysis_timestamp: string;
  data_sources: Record<string, string>;
  mastery_profile: {
    overall_mastery_score: number;
    knowledge_gaps: KnowledgeGap[];
    strengths: Strength[];
  };
  recommendations: {
    priority_order?: string[];
    general_advice?: string;
    for_instructor?: string;
    [key: string]: unknown;
  };
  overall_mastery_score: number;
  knowledge_gaps: KnowledgeGap[];
  strengths: Strength[];
  gap_topic_ids: string[];
  created_at?: string;
  updated_at?: string;
}

const authHeaders = (): HeadersInit => {
  const token = authApi.getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const unwrap = async <T>(res: Response): Promise<T> => {
  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    body = {};
  }

  if (!res.ok || body.status === "error") {
    throw new Error(body.detail || `HTTP ${res.status}`);
  }

  if (body.data === undefined) {
    throw new Error("Knowledge Profile API returned an empty response");
  }

  return body.data;
};

export const knowledgeProfileApi = {
  async getMine(): Promise<KnowledgeProfile> {
    const res = await fetch(`${KNOWLEDGE_API_BASE_URL}/api/v1/knowledge-profile/me`, {
      headers: authHeaders(),
    });
    return unwrap<KnowledgeProfile>(res);
  },

  async saveSandboxAttempt(payload: SandboxAttemptPayload): Promise<SandboxAttempt> {
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/knowledge-profile/sandbox-attempts`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      },
    );
    return unwrap<SandboxAttempt>(res);
  },

  async getLatestMasteryProfile(studentId: string): Promise<CanonicalMasteryProfile> {
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/mastery-profiles/${encodeURIComponent(studentId)}/latest`,
      {
        headers: authHeaders(),
      },
    );
    return unwrap<CanonicalMasteryProfile>(res);
  },
};

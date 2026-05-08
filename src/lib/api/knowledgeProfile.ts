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
  latest_reviews: ReviewJob[];
  latest_sandbox_attempts: SandboxAttempt[];
  timeline: Array<{
    type: "github_review" | "sandbox_attempt";
    id: string;
    label: string;
    time?: string;
    status?: string;
    repo_count?: number;
    attempt_number?: number;
  }>;
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
};

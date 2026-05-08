import { authApi } from "@/lib/api/auth";

const KNOWLEDGE_API_BASE_URL =
  process.env.NEXT_PUBLIC_KNOWLEDGE_API_URL || "http://localhost:5007";

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  detail?: string;
}

export interface ReviewRepo {
  full_name: string;
  name: string;
  private: boolean;
  size: number;
  language?: string | null;
  default_branch: string;
  html_url?: string | null;
  description?: string | null;
  updated_at?: string | null;
}

export interface RepoReviewError {
  severity: "low" | "medium" | "high";
  file: string;
  line?: number | null;
  why: string;
  fix_hint: string;
}

export interface RepoReview {
  repo: string;
  summary: string;
  java_signals: {
    level?: string;
    evidence?: string;
    [key: string]: unknown;
  };
  errors: RepoReviewError[];
  suggestions: string[];
}

export interface ReviewRepoResult {
  full_name: string;
  status: "queued" | "running" | "done" | "error";
  review?: RepoReview | null;
  error?: string | null;
  finished_at?: string;
}

export interface RepoSelectionResponse {
  seed_version: string;
  eligible_count: number;
  selected: ReviewRepo[];
  repos: ReviewRepo[];
}

export interface ReviewJob {
  job_id: string;
  student_id: string;
  public_student_id?: string;
  gh_login?: string;
  seed_version: string;
  status: "running" | "done" | "partial" | "failed";
  repos: ReviewRepoResult[];
  java_level_inferred?: string | null;
  signals_evidence?: string | null;
  created_at?: string;
  updated_at?: string;
  error?: string | null;
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
    const err = new Error(body.detail || `HTTP ${res.status}`) as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }

  if (body.data === undefined) {
    throw new Error("Review API returned an empty response");
  }

  return body.data;
};

export const reviewApi = {
  async selectRepos(): Promise<RepoSelectionResponse> {
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/github-review/select-repos`,
      {
        method: "POST",
        headers: authHeaders(),
      },
    );
    return unwrap<RepoSelectionResponse>(res);
  },

  async reviewTopFive(repos: string[]): Promise<ReviewJob> {
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/github-review/review-top-5`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ repos }),
      },
    );
    return unwrap<ReviewJob>(res);
  },

  async getStatus(jobId: string): Promise<ReviewJob> {
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/github-review/status/${jobId}`,
      {
        headers: authHeaders(),
      },
    );
    return unwrap<ReviewJob>(res);
  },

  async reReview(repo: string): Promise<ReviewJob> {
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/github-review/re-review`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ repo }),
      },
    );
    return unwrap<ReviewJob>(res);
  },
};

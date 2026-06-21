// Career-fit prediction client. Mirrors knowledgeProfile.ts conventions: same KAA base
// URL, JWT header, { status, data } envelope + unwrap. Backed by KAA's hand-made NumPy
// classifier at /api/v1/career.
import { authApi } from "@/lib/api/auth";

const KNOWLEDGE_API_BASE_URL =
  process.env.NEXT_PUBLIC_KNOWLEDGE_API_URL || "http://localhost:5007";

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  detail?: string;
}

export interface RankedRole {
  role: string;
  fit_score: number; // calibrated probability 0..1
  confidence: number;
}

export interface CompetencyGap {
  axis: string;
  axis_name: string;
  your_score: number; // 0..1
  required_score: number; // 0..1
  gap: number; // 0..1
}

export interface AspirationAlignment {
  stated_role: string;
  fit_to_stated: number;
  gap_to_stated: CompetencyGap[];
  est_hours_to_ready: number;
}

export interface CareerNarrative {
  headline: string;
  why_fit: string[];
  gap_plan: string[];
  encouragement: string;
}

export interface CareerPrediction {
  schema_version: string;
  student_id: string;
  generated_at: string;
  method: string;
  model_version: string;
  evidence_sufficient: boolean;
  evidence: {
    topics_covered?: number;
    questions_answered?: number;
    github_available?: boolean;
    sufficient?: boolean;
  };
  best_fit_role: string | null;
  readiness_level: string | null;
  ranked_roles: RankedRole[];
  matched_competencies: string[];
  missing_competencies: CompetencyGap[];
  aspiration_alignment: AspirationAlignment | null;
  narrative: CareerNarrative | null;
  note: string | null;
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
    throw new Error("Career API returned an empty response");
  }
  return body.data;
};

export const careerApi = {
  // Run a fresh prediction from the student's latest mastery profile + quiz result.
  async predict(studentId: string, targetRole?: string): Promise<CareerPrediction> {
    const res = await fetch(`${KNOWLEDGE_API_BASE_URL}/api/v1/career/predict`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ student_id: studentId, target_role: targetRole || undefined }),
    });
    return unwrap<CareerPrediction>(res);
  },

  // Read the most recent saved prediction (no recompute).
  async getLatest(studentId: string): Promise<CareerPrediction> {
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/career/${encodeURIComponent(studentId)}/latest`,
      { headers: authHeaders() },
    );
    return unwrap<CareerPrediction>(res);
  },
};

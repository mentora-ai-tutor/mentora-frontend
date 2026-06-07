import { authApi } from "@/lib/api/auth";

// Mirrors review.ts/quiz.ts conventions: same KAA base URL, JWT header, { status, data }
// envelope. Endpoint: GET /api/v1/sandbox/challenges — Gemini-generated, ai-engine-verified
// Java coding challenges, used to rotate the sandbox questions over time.
const KNOWLEDGE_API_BASE_URL =
  process.env.NEXT_PUBLIC_KNOWLEDGE_API_URL || "http://localhost:5007";

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  detail?: string;
}

export type ChallengeSource = "generated" | "seed" | "mixed";

/** Shape consumed by the sandbox page (camelCase). */
export interface SandboxChallenge {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  prompt: string;
  expectedOutput: string;
  starterCode: string;
  stdin?: string;
}

export interface SandboxChallengesResult {
  challenges: SandboxChallenge[];
  source: ChallengeSource;
  degraded: boolean;
}

interface RawChallenge {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  prompt: string;
  expected_output: string;
  starter_code: string;
  stdin?: string | null;
  source?: string;
}

interface RawBatch {
  challenges: RawChallenge[];
  source: ChallengeSource;
  degraded: boolean;
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
    const err = new Error(body.detail || `HTTP ${res.status}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  if (body.data === undefined) {
    throw new Error("Sandbox API returned an empty response");
  }
  return body.data;
};

const toChallenge = (r: RawChallenge): SandboxChallenge => ({
  id: r.id,
  title: r.title,
  topic: r.topic,
  difficulty: r.difficulty,
  prompt: r.prompt,
  expectedOutput: r.expected_output,
  starterCode: r.starter_code,
  stdin: r.stdin ?? undefined,
});

export const sandboxApi = {
  async getChallenges(count = 3, topics?: string[]): Promise<SandboxChallengesResult> {
    const params = new URLSearchParams({ count: String(count) });
    if (topics?.length) params.set("topics", topics.join(","));
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/sandbox/challenges?${params.toString()}`,
      { headers: authHeaders() },
    );
    const data = await unwrap<RawBatch>(res);
    return {
      challenges: (data.challenges || []).map(toChallenge),
      source: data.source,
      degraded: data.degraded,
    };
  },
};

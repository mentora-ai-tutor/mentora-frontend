import { authApi } from "@/lib/api/auth";

// Mirrors the conventions in review.ts: same KAA base URL, same JWT header, same
// { status, data } envelope unwrap. The KAA quiz endpoints live under /api/v1/quiz.
const KNOWLEDGE_API_BASE_URL =
  process.env.NEXT_PUBLIC_KNOWLEDGE_API_URL || "http://localhost:5007";

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  detail?: string;
}

export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuizQuestionType = "mcq" | "predict_output";
export type QuizMode = "repo-aware" | "sandbox" | "onboarding";
export type QuizSource = "generated" | "seed" | "mixed";
export type OptionId = "A" | "B" | "C" | "D";

export interface QuizOption {
  id: OptionId;
  text: string;
}

/** Answer key and explanation are intentionally absent — the server withholds them. */
export interface ClientQuestion {
  qid: string;
  topic: string;
  difficulty: QuizDifficulty;
  type: QuizQuestionType;
  question: string;
  code_snippet?: string | null;
  options: QuizOption[];
}

export interface QuizTopicPerformance {
  topic: string;
  correct: number;
  total: number;
  avg_time_seconds: number;
  retry_count: number;
}

export interface QuizResults {
  score_percent: number;
  correct: number;
  total: number;
  quiz_performance: QuizTopicPerformance[];
}

export interface StartSessionResponse {
  session_id: string;
  mode: QuizMode;
  source: QuizSource;
  degraded: boolean;
  total_planned: number;
  answered: number;
  difficulty: QuizDifficulty;
  question: ClientQuestion | null;
}

export interface AnswerResult {
  qid: string;
  correct: boolean;
  correct_option_id: OptionId;
  explanation: string;
  concept_tested: string;
}

export interface AnswerResponse {
  result: AnswerResult | null;
  completed: boolean;
  answered: number;
  total_planned: number;
  difficulty: QuizDifficulty;
  next_question: ClientQuestion | null;
  results: QuizResults | null;
}

export interface StartSessionPayload {
  mode?: QuizMode;
  topics?: string[];
  job_id?: string;
  max_questions?: number;
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
    throw new Error("Quiz API returned an empty response");
  }

  return body.data;
};

export const quizApi = {
  async startSession(payload: StartSessionPayload = {}): Promise<StartSessionResponse> {
    const res = await fetch(`${KNOWLEDGE_API_BASE_URL}/api/v1/quiz/session`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return unwrap<StartSessionResponse>(res);
  },

  async submitAnswer(
    sessionId: string,
    qid: string,
    chosenOptionId: OptionId,
    timeSeconds: number,
  ): Promise<AnswerResponse> {
    const res = await fetch(
      `${KNOWLEDGE_API_BASE_URL}/api/v1/quiz/session/${sessionId}/answer`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          qid,
          chosen_option_id: chosenOptionId,
          time_seconds: timeSeconds,
        }),
      },
    );
    return unwrap<AnswerResponse>(res);
  },

  async analyzeAuto(): Promise<void> {
    const res = await fetch(`${KNOWLEDGE_API_BASE_URL}/analyze/auto`, {
      method: "POST",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as ApiEnvelope<unknown>;
      throw new Error(body.detail || `HTTP ${res.status}`);
    }
  },
};

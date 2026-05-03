const AI_ENGINE_API_URL = process.env.NEXT_PUBLIC_AI_ENGINE_API_URL || 'http://localhost:5010';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  details?: any[];
  error?: string;
}

interface CodeExecutionResult {
  success: boolean;
  output: string | null;
  error: string | null;
  is_compilation_error: boolean;
  exit_code: number | null;
}

interface AIFeedbackResult {
  feedback: string;
  model: string;
}

interface AIInsightResult {
  insight: string;
  model: string;
  type: string;
}

interface CodeReviewAnnotation {
  line_start: number;
  line_end: number;
  category: string;
  severity: string;
  message: string;
  suggestion: string;
}

interface CodeReviewResult {
  annotations: CodeReviewAnnotation[];
  summary: string;
  overall_score: number;
  model: string;
}

interface Flashcard {
  concept: string;
  definition: string;
  example: string;
  difficulty: string;
}

interface FlashcardResult {
  flashcards: Flashcard[];
  model: string;
}

interface TestGeneratorResult {
  test_code: string;
  test_explanation: string;
  model: string;
}

class AIEngineApi {
  private async request<T>(method: string, path: string, body?: any): Promise<ApiResponse<T>> {
    const url = `${AI_ENGINE_API_URL}${path}`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  }

  async executeCode(code: string, context?: string, stdin?: string): Promise<ApiResponse<CodeExecutionResult>> {
    return this.request('POST', '/api/execute', { code, context, stdin });
  }

  async getFeedback(code: string, output?: string, error?: string, context?: string): Promise<ApiResponse<AIFeedbackResult>> {
    return this.request('POST', '/api/feedback', { code, output, error, context });
  }

  async runWithFeedback(code: string, context?: string, stdin?: string): Promise<ApiResponse<{
    execution: CodeExecutionResult;
    feedback: string | null;
    model: string | null;
  }>> {
    return this.request('POST', '/api/run-with-feedback', { code, context, stdin });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${AI_ENGINE_API_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async explainSimpler(content: string, topic?: string, stepType?: string): Promise<ApiResponse<AIInsightResult>> {
    return this.request('POST', '/api/explain-simpler', { content, topic, stepType });
  }

  async getAnalogy(content: string, topic?: string, stepType?: string): Promise<ApiResponse<AIInsightResult>> {
    return this.request('POST', '/api/analogy', { content, topic, stepType });
  }

  async explainHighlightedCode(code: string, highlightedCode: string, question?: string): Promise<ApiResponse<{ explanation: string; model: string }>> {
    return this.request('POST', '/api/explain-code', { code, highlighted_code: highlightedCode, question });
  }

  async fixError(code: string, error: string): Promise<ApiResponse<{ suggested_fix: string; fixed_code: string; explanation: string; model: string }>> {
    return this.request('POST', '/api/fix-error', { code, error });
  }

  async codeReview(code: string, focus?: string): Promise<ApiResponse<CodeReviewResult>> {
    return this.request('POST', '/api/code-review', { code, focus });
  }

  async getFlashcards(code: string): Promise<ApiResponse<FlashcardResult>> {
    return this.request('POST', '/api/flashcards', { code });
  }

  async generateTests(code: string, className?: string): Promise<ApiResponse<TestGeneratorResult>> {
    return this.request('POST', '/api/generate-tests', { code, class_name: className });
  }
}

export const aiEngineApi = new AIEngineApi();
export type { CodeExecutionResult, AIFeedbackResult, AIInsightResult, CodeReviewAnnotation, CodeReviewResult, Flashcard, FlashcardResult, TestGeneratorResult };

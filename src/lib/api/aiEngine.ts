const AI_ENGINE_API_URL = process.env.NEXT_PUBLIC_AI_ENGINE_API_URL || 'http://localhost:3005';

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

  async executeCode(code: string, context?: string): Promise<ApiResponse<CodeExecutionResult>> {
    return this.request('POST', '/api/execute', { code, context });
  }

  async getFeedback(code: string, output?: string, error?: string, context?: string): Promise<ApiResponse<AIFeedbackResult>> {
    return this.request('POST', '/api/feedback', { code, output, error, context });
  }

  async runWithFeedback(code: string, context?: string): Promise<ApiResponse<{
    execution: CodeExecutionResult;
    feedback: string | null;
    model: string | null;
  }>> {
    return this.request('POST', '/api/run-with-feedback', { code, context });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${AI_ENGINE_API_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async explainSimpler(code: string, topic?: string): Promise<ApiResponse<AIInsightResult>> {
    return this.request('POST', '/api/explain-simpler', { code, topic });
  }

  async getAnalogy(code: string, topic?: string): Promise<ApiResponse<AIInsightResult>> {
    return this.request('POST', '/api/analogy', { code, topic });
  }
}

export const aiEngineApi = new AIEngineApi();
export type { CodeExecutionResult, AIFeedbackResult, AIInsightResult };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

const authHeader = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface GithubStartResponse {
  url: string;
  state: string;
}

export interface GithubStatusResponse {
  linked: boolean;
  gh_login?: string;
  linked_at?: string;
  scopes?: string[];
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  data?: T;
}

const unwrap = async <T>(res: Response): Promise<T> => {
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !body.success) {
    const msg = body.error || body.message || `HTTP ${res.status}`;
    const err = new Error(msg) as Error & { code?: string; status?: number };
    err.code = body.code;
    err.status = res.status;
    throw err;
  }
  return body.data as T;
};

export const githubApi = {
  async oauthStart(): Promise<GithubStartResponse> {
    const res = await fetch(`${API_BASE_URL}/api/github/oauth/start`, {
      headers: { ...authHeader() },
    });
    return unwrap<GithubStartResponse>(res);
  },

  async getStatus(): Promise<GithubStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/api/github/status`, {
      headers: { ...authHeader() },
    });
    return unwrap<GithubStatusResponse>(res);
  },

  async unlink(): Promise<{ linked: false }> {
    const res = await fetch(`${API_BASE_URL}/api/github/unlink`, {
      method: 'POST',
      headers: { ...authHeader() },
    });
    return unwrap<{ linked: false }>(res);
  },
};

export const FRONTEND_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

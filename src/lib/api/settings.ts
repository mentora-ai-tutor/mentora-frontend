const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ProfileUpdatePayload {
  name?: string;
  profile?: {
    avatar_url?: string;
    bio?: string;
    java_level?: "beginner" | "intermediate" | "advanced";
    institution?: string;
    country?: string;
  };
}

export interface PreferencesPayload {
  notifications?: {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
  };
  language?: string;
  timezone?: string;
}

export interface Preferences {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
}

export interface SettingsResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

const API_HEADERS = (): HeadersInit => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<SettingsResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: API_HEADERS(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const result = (await response.json()) as SettingsResponse<T>;
    return result;
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export const settingsApi = {
  async updateProfile(payload: ProfileUpdatePayload): Promise<SettingsResponse> {
    return request("PUT", "/api/students/me", payload);
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<SettingsResponse> {
    return request("PUT", "/api/students/me/password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  async getPreferences(): Promise<SettingsResponse<Preferences>> {
    return request<Preferences>("GET", "/api/students/me/preferences");
  },

  async updatePreferences(payload: PreferencesPayload): Promise<SettingsResponse<Preferences>> {
    return request<Preferences>("PUT", "/api/students/me/preferences", payload);
  },

  async deleteAccount(password: string): Promise<SettingsResponse> {
    return request("DELETE", "/api/students/me", { password });
  },
};
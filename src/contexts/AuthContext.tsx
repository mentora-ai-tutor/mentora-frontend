'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, User, LoginData, RegisterData } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null; // handle parse errors
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const currentUser = await authApi.getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (authApi.isAuthenticated()) {
        await refreshUser();
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    const result = await authApi.login(data);
    if (result.success) {
      if (result.data?.user) setUser(result.data.user);
      return { success: true };
    }
    return { success: false, message: result.message || 'Login failed' };
  };

  const register = async (data: RegisterData) => {
    const result = await authApi.register(data);
    if (result.success) {
      if (result.data?.user) setUser(result.data.user);
      return { success: true };
    }
    return { success: false, message: result.message || 'Registration failed' };
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

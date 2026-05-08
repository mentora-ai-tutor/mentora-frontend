'use client';

import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ActiveReviewProvider } from '@/contexts/ActiveReviewContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ActiveReviewProvider>{children}</ActiveReviewProvider>
      <Toaster richColors position="top-right" theme="dark" />
    </AuthProvider>
  );
}

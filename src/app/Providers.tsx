'use client';

import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ActiveReviewProvider } from '@/contexts/ActiveReviewContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster richColors position="top-right" theme={theme} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ActiveReviewProvider>{children}</ActiveReviewProvider>
        <ThemedToaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

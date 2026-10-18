'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SessionError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Assessment session crashed:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <AlertTriangle className="w-16 h-16 text-amber-700 dark:text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Session Error</h2>
        <p className="text-muted-foreground mb-4 break-words">
          {error.message || 'Something went wrong while rendering this session.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => retry()}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            Reload to try again
          </Button>
          <Button
            onClick={() => router.push('/assessment')}
            variant="outline"
            className="border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10"
          >
            Back to Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}

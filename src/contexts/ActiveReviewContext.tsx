"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { ReviewJob, ReviewRepoResult, reviewApi } from "@/lib/api/review";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "mentora.activeReview";
const POLL_INTERVAL_MS = 5000;

type FinalReviewStatus = "done" | "partial" | "failed";

export interface ActiveReviewState {
  jobId: string;
  studentId?: string;
  status: ReviewJob["status"];
  repos: ReviewRepoResult[];
  startedAt: string;
  completedAt?: string;
  lastError?: string;
}

interface ActiveReviewContextValue {
  activeReview: ActiveReviewState | null;
  isReviewRunning: boolean;
  trackReviewJob: (job: ReviewJob) => ActiveReviewState;
  refreshActiveReview: (jobId?: string) => Promise<ActiveReviewState | null>;
  clearActiveReview: () => void;
  sandboxHref: (jobId?: string, source?: string) => string;
  forensicsHref: (jobId?: string) => string;
}

const ActiveReviewContext = createContext<ActiveReviewContextValue | undefined>(
  undefined,
);

const finalStatuses = new Set<ReviewJob["status"]>(["done", "partial", "failed"]);

const isFinalStatus = (status: ReviewJob["status"]): status is FinalReviewStatus =>
  finalStatuses.has(status);

const readStoredReview = (): ActiveReviewState | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveReviewState;
    return parsed.jobId ? parsed : null;
  } catch {
    return null;
  }
};

const persistReview = (review: ActiveReviewState | null) => {
  if (typeof window === "undefined") return;

  if (!review) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(review));
};

const buildStateFromJob = (
  job: ReviewJob,
  previous?: ActiveReviewState | null,
): ActiveReviewState => {
  const now = new Date().toISOString();
  const completedAt = isFinalStatus(job.status)
    ? previous?.completedAt ?? now
    : undefined;

  return {
    jobId: job.job_id,
    studentId: job.student_id,
    status: job.status,
    repos: job.repos,
    startedAt: previous?.startedAt ?? job.created_at ?? now,
    completedAt,
    lastError: job.error ?? previous?.lastError,
  };
};

export function ActiveReviewProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [activeReview, setActiveReview] = useState<ActiveReviewState | null>(
    readStoredReview,
  );
  const activeReviewRef = useRef<ActiveReviewState | null>(activeReview);
  const notifiedJobRef = useRef<string | null>(null);

  useEffect(() => {
    activeReviewRef.current = activeReview;
  }, [activeReview]);

  const saveReview = useCallback((next: ActiveReviewState | null) => {
    activeReviewRef.current = next;
    setActiveReview(next);
    persistReview(next);
  }, []);

  const trackReviewJob = useCallback(
    (job: ReviewJob) => {
      const previous =
        activeReviewRef.current?.jobId === job.job_id
          ? activeReviewRef.current
          : null;
      const next = buildStateFromJob(job, previous);
      saveReview(next);
      return next;
    },
    [saveReview],
  );

  const refreshActiveReview = useCallback(
    async (jobId?: string) => {
      const current = activeReviewRef.current;
      const targetJobId = jobId ?? current?.jobId;
      if (!targetJobId) return null;

      try {
        const job = await reviewApi.getStatus(targetJobId);
        const previous =
          activeReviewRef.current?.jobId === job.job_id
            ? activeReviewRef.current
            : null;
        const next = buildStateFromJob(job, previous);
        saveReview(next);

        if (
          previous?.status === "running" &&
          isFinalStatus(next.status) &&
          notifiedJobRef.current !== next.jobId
        ) {
          notifiedJobRef.current = next.jobId;
          if (next.status === "done") {
            toast.success("GitHub repository review completed");
          } else if (next.status === "partial") {
            toast.warning("GitHub review finished with repository issues");
          } else {
            toast.error("GitHub repository review failed");
          }
        }

        return next;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not refresh review status";

        if (current?.jobId === targetJobId) {
          saveReview({ ...current, lastError: message });
        }

        return null;
      }
    },
    [saveReview],
  );

  const clearActiveReview = useCallback(() => {
    saveReview(null);
  }, [saveReview]);

  useEffect(() => {
    if (isLoading) return;

    const shouldClear =
      (!user && !!activeReview) ||
      (!!user && user.github?.linked !== true && !!activeReview) ||
      (!!user &&
        !!activeReview?.studentId &&
        activeReview.studentId !== user._id);

    if (!shouldClear) return;

    const frame = window.requestAnimationFrame(() => {
      saveReview(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeReview, isLoading, saveReview, user]);

  useEffect(() => {
    if (!activeReview?.jobId || isFinalStatus(activeReview.status)) return;

    const firstRefresh = window.setTimeout(() => {
      void refreshActiveReview(activeReview.jobId);
    }, 250);
    const interval = window.setInterval(() => {
      void refreshActiveReview(activeReview.jobId);
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearTimeout(firstRefresh);
      window.clearInterval(interval);
    };
  }, [activeReview?.jobId, activeReview?.status, refreshActiveReview]);

  const value = useMemo<ActiveReviewContextValue>(
    () => ({
      activeReview,
      isReviewRunning: activeReview?.status === "running",
      trackReviewJob,
      refreshActiveReview,
      clearActiveReview,
      sandboxHref: (jobId, source = "active-review") => {
        const targetJobId = jobId ?? activeReview?.jobId;
        const params = new URLSearchParams({ source });
        if (targetJobId) params.set("reviewJobId", targetJobId);
        return `/knowledge-assist/sandbox?${params.toString()}`;
      },
      forensicsHref: (jobId) => {
        const targetJobId = jobId ?? activeReview?.jobId;
        return targetJobId
          ? `/knowledge-assist/forensics?reviewJobId=${encodeURIComponent(targetJobId)}`
          : "/knowledge-assist/forensics";
      },
    }),
    [
      activeReview,
      trackReviewJob,
      refreshActiveReview,
      clearActiveReview,
    ],
  );

  return (
    <ActiveReviewContext.Provider value={value}>
      {children}
    </ActiveReviewContext.Provider>
  );
}

export function useActiveReview() {
  const context = useContext(ActiveReviewContext);
  if (!context) {
    throw new Error("useActiveReview must be used within ActiveReviewProvider");
  }
  return context;
}

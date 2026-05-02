"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkspaceRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/learning-generator");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-white/50 text-sm">Redirecting...</p>
    </div>
  );
}

'use client';

import { useParams } from 'next/navigation';
import WorkspaceRoom from '@/components/peer-learning/workspace/WorkspaceRoom';

export default function WorkspaceRoomPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = Array.isArray(params?.workspaceId) ? params.workspaceId[0] : params?.workspaceId;

  if (!workspaceId) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-sm text-subtle-foreground">
        Invalid workspace id.
      </div>
    );
  }

  return <WorkspaceRoom workspaceId={workspaceId} />;
}

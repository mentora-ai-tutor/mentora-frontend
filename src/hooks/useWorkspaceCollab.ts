'use client';

import { useEffect, useRef, useState } from 'react';
import {
  WorkspaceCollabProvider,
  type CollabStatus,
} from '@/lib/workspace/collab';
import type { AwarenessState, ChatMessage, PresenceParticipant } from '@/lib/api/workspaces';

export interface WorkspaceCollab {
  providerRef: React.RefObject<WorkspaceCollabProvider | null>;
  status: CollabStatus;
  presence: PresenceParticipant[];
  awareness: AwarenessState[];
  liveMessages: ChatMessage[];
  appendLocalMessage: (message: ChatMessage) => void;
}

/**
 * Connects a workspace room to the real-time relay and exposes presence,
 * awareness and incoming chat. The provider itself is available through
 * `providerRef` for file preparation and outgoing messages.
 */
export function useWorkspaceCollab(workspaceId: string | null): WorkspaceCollab {
  const providerRef = useRef<WorkspaceCollabProvider | null>(null);
  const [status, setStatus] = useState<CollabStatus>('connecting');
  const [presence, setPresence] = useState<PresenceParticipant[]>([]);
  const [awareness, setAwareness] = useState<AwarenessState[]>([]);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!workspaceId) return;
    const instance = new WorkspaceCollabProvider(workspaceId);
    providerRef.current = instance;

    const offStatus = instance.on('status', setStatus);
    const offPresence = instance.on('presence', setPresence);
    const offAwareness = instance.on('awareness', setAwareness);
    const offChat = instance.on('chat', (message) => {
      setLiveMessages((prev) =>
        prev.some((existing) => existing.message_id === message.message_id)
          ? prev
          : [...prev, message],
      );
    });

    instance.connect();

    return () => {
      offStatus();
      offPresence();
      offAwareness();
      offChat();
      instance.destroy();
      providerRef.current = null;
      setLiveMessages([]);
    };
  }, [workspaceId]);

  const appendLocalMessage = (message: ChatMessage) => {
    setLiveMessages((prev) =>
      prev.some((existing) => existing.message_id === message.message_id)
        ? prev
        : [...prev, message],
    );
  };

  return { providerRef, status, presence, awareness, liveMessages, appendLocalMessage };
}

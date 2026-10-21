'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  WorkspaceCollabProvider,
  type CollabSelf,
  type CollabStatus,
} from '@/lib/workspace/collab';
import type { AwarenessState, ChatMessage, PresenceParticipant } from '@/lib/api/workspaces';

export interface WorkspaceCollab {
  providerRef: React.RefObject<WorkspaceCollabProvider | null>;
  status: CollabStatus;
  self: CollabSelf | null;
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
  const [self, setSelf] = useState<CollabSelf | null>(null);
  const [presence, setPresence] = useState<PresenceParticipant[]>([]);
  const [awareness, setAwareness] = useState<AwarenessState[]>([]);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!workspaceId) return;
    const instance = new WorkspaceCollabProvider(workspaceId);
    providerRef.current = instance;

    const offStatus = instance.on('status', setStatus);
    const offSelf = instance.on('self', setSelf);
    const offPresence = instance.on('presence', setPresence);
    const offAwareness = instance.on('awareness', setAwareness);
    const offChat = instance.on('chat', (message) => {
      setLiveMessages((prev) =>
        prev.some((existing) => existing.id === message.id) ? prev : [...prev, message],
      );
    });

    instance.connect();

    return () => {
      offStatus();
      offSelf();
      offPresence();
      offAwareness();
      offChat();
      instance.destroy();
      providerRef.current = null;
      setSelf(null);
      setLiveMessages([]);
    };
  }, [workspaceId]);

  const appendLocalMessage = useCallback((message: ChatMessage) => {
    setLiveMessages((prev) =>
      prev.some((existing) => existing.id === message.id) ? prev : [...prev, message],
    );
  }, []);

  return { providerRef, status, self, presence, awareness, liveMessages, appendLocalMessage };
}

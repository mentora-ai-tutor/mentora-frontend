import * as Y from 'yjs';
import {
  workspaceApi,
  type AwarenessState,
  type ChatMessage,
  type PresenceParticipant,
} from '@/lib/api/workspaces';

export type CollabStatus = 'connecting' | 'connected' | 'disconnected';

export interface CollabEventMap {
  status: CollabStatus;
  presence: PresenceParticipant[];
  awareness: AwarenessState[];
  chat: ChatMessage;
  error: string;
}

type Listener<T> = (payload: T) => void;

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

interface ServerMessage {
  type?: string;
  [key: string]: unknown;
}

const SYNC_TIMEOUT_MS = 2500;
const SEND_DEBOUNCE_MS = 120;

/**
 * A Yjs provider for the peer-learning Project Workspace relay.
 *
 * The backend is a stateless fan-out relay: it does not run a Yjs server, it
 * only forwards opaque updates between members and caches the latest update per
 * file so late joiners can catch up. This provider therefore sends the *full*
 * encoded document state on each change (rather than deltas) so the server's
 * per-file cache always contains a complete snapshot.
 */
export class WorkspaceCollabProvider {
  readonly workspaceId: string;

  private url: string;
  private ws: WebSocket | null = null;
  private status: CollabStatus = 'connecting';
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private closedByUser = false;

  private docs = new Map<string, Y.Doc>();
  private sendTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readyFiles = new Set<string>();
  private syncResolvers = new Map<string, (hasState: boolean) => void>();
  private connectWaiters: (() => void)[] = [];

  private presenceMap = new Map<string, PresenceParticipant>();
  private awarenessMap = new Map<string, AwarenessState>();

  private listeners = new Map<keyof CollabEventMap, Set<Listener<never>>>();

  self: PresenceParticipant | null = null;

  constructor(workspaceId: string, url?: string) {
    this.workspaceId = workspaceId;
    this.url = url || workspaceApi.getWebSocketUrl(workspaceId);
  }

  // ── Event emitter ─────────────────────────────

  on<K extends keyof CollabEventMap>(event: K, listener: Listener<CollabEventMap[K]>): () => void {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener as Listener<never>);
    this.listeners.set(event, set);
    return () => {
      set.delete(listener as Listener<never>);
    };
  }

  private emit<K extends keyof CollabEventMap>(event: K, payload: CollabEventMap[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const listener of set) {
      (listener as Listener<CollabEventMap[K]>)(payload);
    }
  }

  getStatus(): CollabStatus {
    return this.status;
  }

  getPresence(): PresenceParticipant[] {
    return Array.from(this.presenceMap.values());
  }

  getAwareness(): AwarenessState[] {
    return Array.from(this.awarenessMap.values());
  }

  // ── Connection lifecycle ──────────────────────

  connect(): void {
    if (typeof window === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.closedByUser = false;
    this.setStatus('connecting');
    const socket = new WebSocket(this.url);
    this.ws = socket;

    socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus('connected');
      this.startPing();
      for (const waiter of this.connectWaiters.splice(0)) waiter();
      // Re-announce locally-held documents and re-sync after a reconnect.
      for (const fileId of this.readyFiles) {
        this.broadcastFullState(fileId);
        this.requestSync(fileId).catch(() => undefined);
      }
    };

    socket.onmessage = (event) => this.handleMessage(event);

    socket.onerror = () => {
      this.emit('error', 'Real-time connection error.');
    };

    socket.onclose = () => {
      this.stopPing();
      this.setStatus('disconnected');
      if (!this.closedByUser) this.scheduleReconnect();
    };
  }

  disconnect(): void {
    this.closedByUser = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopPing();
    const socket = this.ws;
    this.ws = null;
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      try {
        socket.close();
      } catch {
        // ignore
      }
    }
    this.setStatus('disconnected');
  }

  destroy(): void {
    this.disconnect();
    for (const timer of this.sendTimers.values()) clearTimeout(timer);
    this.sendTimers.clear();
    for (const doc of this.docs.values()) doc.destroy();
    this.docs.clear();
    this.readyFiles.clear();
    this.listeners.clear();
  }

  private setStatus(status: CollabStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.emit('status', status);
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private startPing(): void {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      this.send({ type: 'PING' });
    }, 25000);
  }

  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private send(payload: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      this.ws.send(JSON.stringify(payload));
    } catch {
      // ignore — reconnect logic will recover
    }
  }

  private waitForConnection(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return Promise.resolve();
    return new Promise((resolve) => {
      this.connectWaiters.push(resolve);
      setTimeout(resolve, SYNC_TIMEOUT_MS);
    });
  }

  // ── Document management ───────────────────────

  getDoc(fileId: string): Y.Doc {
    let doc = this.docs.get(fileId);
    if (!doc) {
      doc = new Y.Doc();
      doc.on('update', (_update: Uint8Array, origin: unknown) => {
        if (origin === 'remote') return;
        this.scheduleSend(fileId);
      });
      this.docs.set(fileId, doc);
    }
    return doc;
  }

  getText(fileId: string): Y.Text {
    return this.getDoc(fileId).getText('monaco');
  }

  /**
   * Ensures the Y.Text for a file is ready to bind to the editor. Seeds the
   * document from the persisted REST content only when the relay holds no
   * cached state for the file (i.e. nobody has edited it since the last server
   * restart).
   */
  async prepareFile(fileId: string, initialContent: string): Promise<Y.Text> {
    const doc = this.getDoc(fileId);
    const ytext = doc.getText('monaco');
    if (this.readyFiles.has(fileId)) return ytext;

    await this.waitForConnection();
    const hasState = await this.requestSync(fileId);
    if (!hasState && ytext.length === 0 && initialContent) {
      doc.transact(() => {
        ytext.insert(0, initialContent);
      }, 'seed');
    }
    this.readyFiles.add(fileId);
    return ytext;
  }

  requestSync(fileId: string): Promise<boolean> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return Promise.resolve(false);
    return new Promise((resolve) => {
      const existing = this.syncResolvers.get(fileId);
      if (existing) existing(false);
      this.syncResolvers.set(fileId, resolve);
      this.send({ type: 'SYNC_REQUEST', file_id: fileId });
      setTimeout(() => {
        if (this.syncResolvers.get(fileId) === resolve) {
          this.syncResolvers.delete(fileId);
          resolve(false);
        }
      }, SYNC_TIMEOUT_MS);
    });
  }

  private scheduleSend(fileId: string): void {
    const existing = this.sendTimers.get(fileId);
    if (existing) clearTimeout(existing);
    this.sendTimers.set(
      fileId,
      setTimeout(() => {
        this.sendTimers.delete(fileId);
        this.broadcastFullState(fileId);
      }, SEND_DEBOUNCE_MS),
    );
  }

  private broadcastFullState(fileId: string): void {
    const doc = this.docs.get(fileId);
    if (!doc) return;
    const update = Y.encodeStateAsUpdate(doc);
    this.send({ type: 'YJS_UPDATE', file_id: fileId, update: toBase64(update) });
  }

  // ── Awareness ─────────────────────────────────

  sendAwareness(fileId: string, cursor?: unknown, selection?: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.send({ type: 'AWARENESS', file_id: fileId, cursor, selection });
  }

  // ── Chat ──────────────────────────────────────

  sendChat(message: string, messageType: 'text' | 'code' | 'system' = 'text', replyTo?: string): void {
    this.send({ type: 'CHAT_MESSAGE', message, message_type: messageType, reply_to: replyTo });
  }

  // ── Incoming message handling ─────────────────

  private handleMessage(event: MessageEvent): void {
    if (typeof event.data !== 'string') return;
    let payload: ServerMessage;
    try {
      payload = JSON.parse(event.data) as ServerMessage;
    } catch {
      return;
    }
    switch (payload.type) {
      case 'INIT_STATE':
        this.handleInitState(payload);
        break;
      case 'PRESENCE_JOINED':
      case 'PRESENCE_LEFT':
        this.handlePresence(payload);
        break;
      case 'AWARENESS':
        this.handleAwareness(payload);
        break;
      case 'YJS_UPDATE':
        this.handleYjsUpdate(payload);
        break;
      case 'SYNC_STATE':
        this.handleSyncState(payload);
        break;
      case 'CHAT_MESSAGE':
        if (payload.message) this.emit('chat', payload.message as ChatMessage);
        break;
      case 'ERROR':
        if (typeof payload.message === 'string') this.emit('error', payload.message);
        break;
      default:
        break;
    }
  }

  private handleInitState(payload: ServerMessage): void {
    const self = payload.self as PresenceParticipant | undefined;
    if (self) this.self = self;
    const presence = (payload.presence as PresenceParticipant[] | undefined) ?? [];
    this.presenceMap.clear();
    for (const participant of presence) this.presenceMap.set(participant.student_id, participant);
    this.emit('presence', this.getPresence());

    const cursors = (payload.cursors as AwarenessState[] | undefined) ?? [];
    this.awarenessMap.clear();
    for (const cursor of cursors) this.awarenessMap.set(cursor.student_id, cursor);
    this.emit('awareness', this.getAwareness());
  }

  private handlePresence(payload: ServerMessage): void {
    const presence = (payload.presence as PresenceParticipant[] | undefined) ?? [];
    this.presenceMap.clear();
    for (const participant of presence) this.presenceMap.set(participant.student_id, participant);
    this.emit('presence', this.getPresence());
  }

  private handleAwareness(payload: ServerMessage): void {
    const awareness = payload.awareness as AwarenessState | undefined;
    if (!awareness) return;
    this.awarenessMap.set(awareness.student_id, awareness);
    this.emit('awareness', this.getAwareness());
  }

  private handleSyncState(payload: ServerMessage): void {
    const fileId = typeof payload.file_id === 'string' ? payload.file_id : '';
    const resolver = this.syncResolvers.get(fileId);
    if (resolver) {
      this.syncResolvers.delete(fileId);
      resolver(false);
    }
  }

  private handleYjsUpdate(payload: ServerMessage): void {
    const fileId = typeof payload.file_id === 'string' ? payload.file_id : '';
    const update = typeof payload.update === 'string' ? payload.update : '';
    if (!fileId || !update) return;

    const isServerSync = payload.sender_student_id === 'server';
    if (isServerSync) {
      const resolver = this.syncResolvers.get(fileId);
      if (resolver) {
        this.syncResolvers.delete(fileId);
        resolver(true);
      }
    }

    const doc = this.getDoc(fileId);
    try {
      Y.applyUpdate(doc, fromBase64(update), 'remote');
    } catch {
      // ignore malformed updates
    }
  }
}

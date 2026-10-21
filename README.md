# mentora-frontend
Agentic AI-Driven Multi-Agent Tutoring System for Personalized Learning and Mastery Assessment (R26-SE-030)

## Project Workspace module

Real-time collaborative workspaces (shared editor, chat, tasks, comments, AI assistant).

### Architecture

| Layer | Path | Notes |
|---|---|---|
| API client | `src/lib/api/workspaces.ts` | Typed REST client for `/api/workspaces/*`; reads Bearer token from `localStorage.accessToken`; base URL from `NEXT_PUBLIC_PEER_LEARNING_API_URL` (default `http://localhost:8001`). |
| Yjs provider | `src/lib/workspace/collab.ts` | WebSocket provider for `/api/workspaces/ws/{workspace_id}?token=…`. Sends **full-document** Yjs snapshots (server is a stateless relay + snapshot cache). Handles `INIT_STATE` (flat fields + `presence[]`), single-student `PRESENCE_JOINED/LEFT`, `YJS_UPDATE` by `student_id`, `SYNC_STATE` (applies base64 state, resolves sync waiters), chat/activity/file-tree/task/comment/notification events, close codes 4401/4403, 25 s PING keepalive, exponential reconnect. |
| React hook | `src/hooks/useWorkspaceCollab.ts` | Connects the provider for a room; exposes `status`, `self`, `presence`, `awareness`, `liveMessages` (deduped by `id`), `appendLocalMessage`, `providerRef`. |
| Room UI | `src/components/peer-learning/workspace/` | `WorkspaceRoom` (3-pane: file tree / Monaco editor / tabbed panel) plus `WorkspaceFileTree`, `WorkspaceEditor` (y-monaco binding), `WorkspaceChatPanel`, `WorkspaceTasksPanel`, `WorkspaceCommentsPanel`, `WorkspaceAssistantPanel` (local Q/A state — assistant responses are not persisted as chat messages), `WorkspaceActivityPanel`, `WorkspaceMembersPanel`, `WorkspaceAnalyticsPanel`, `WorkspaceInvitePanel`, `WorkspaceVersionsDialog`, `WorkspaceTerminal`. |
| Pages | `src/app/(dashboard)/peer-learning/workspaces/` | `page.tsx` (list: create, join-key, pending invitations Accept/Decline) and `[workspaceId]/page.tsx` (room wrapper). |

### Contract essentials

- Roles: `leader | member | viewer` (`canWrite` = leader/member, `canManage` = leader). Status: `active | archived` (archived → read-only).
- REST returns `{ status, … }` envelopes; list endpoints include `total`. Chat/versions/activity include `has_more`/`next_before`/`unread_count` where applicable. Field names: `id` (not `file_id`/`message_id`), `name`/`color` on chat docs, `student_id` for actors, `target` on activity, `activities` (plural) on activity responses, `keys` (plural) on join-key lists, `analytics.members`/`analytics.activity_by_day` (not `per_member`/`timeline`).
- Chat: `message_type` is `text | code | system` (no `ai` — assistant answers live only in the AI panel). `POST /chat` and the WS `CHAT_MESSAGE` event both publish the canonical doc to **all** members including the sender; the hook dedupes by `id`.
- Files: no `parent_path`/`size` fields — derive parent via `path` (`dirname`); single `PUT /files/{id}` endpoint handles content/rename/language changes.
- Code run: Java sandbox stub — result `{ status: 'stub'|'unsupported', language, stdout, stderr, exit_code, compile_output, duration_ms, message? }`.
- WS snapshot sync: client sends `Y.encodeStateAsUpdate` full state per change; on join, `SYNC_REQUEST` → `SYNC_STATE { file_id, state }` (base64 or null; null → seed from REST content).

### Env

```bash
NEXT_PUBLIC_PEER_LEARNING_API_URL=http://localhost:8001   # peer-learning backend
```

Backend lives in `mentora-backend/services/peer-learning` (`app/api/workspace_routes.py`, `app/api/workspace_ws.py`); run its tests with `C:\Python313\python.exe -m pytest -q tests\test_workspace_routes.py` from the backend root (repo venv is broken on Windows).

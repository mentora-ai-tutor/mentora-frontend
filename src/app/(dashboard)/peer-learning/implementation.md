# Peer Learning Module — Implementation Document

## Architecture Overview

The peer learning module follows a **client-heavy frontend** architecture. All algorithmic logic (pair matching, group formation, mastery computation, Bloom's taxonomy analysis) resides on a **separate backend server** at the URL configured by `NEXT_PUBLIC_PEER_LEARNING_API_URL` (default `http://localhost:8000`). The frontend handles:

- UI rendering and state management
- REST API calls to trigger backend operations
- WebSocket connections for real-time collaboration
- WebRTC for screen sharing

An auxiliary **Learning Material Generator (LMG)** backend at `NEXT_PUBLIC_LMG_API_URL` (default `http://localhost:5012`) handles mastery profile submission, learning material generation, and progress tracking.

---

## Directory Structure & File Purposes

```
peer-learning/
├── page.tsx                              # Main dashboard — master hub for peer learning
├── implementation.md                     # This document
└── pair-session/
    ├── page.tsx                          # 1-on-1 tutoring session (learner/teacher)
    └── performance/
        └── page.tsx                      # Post-session performance analytics

src/
├── components/
│   ├── peer-learning/
│   │   └── group-session.tsx             # Group session (3 roles: EXPLAINER/SOLVER/REVIEWER)
│   └── notification/
│       └── page.tsx                      # Notification components for pairing events
└── lib/
    └── api/
        ├── peerLearning.ts               # API client for peer-learning backend (port 8000)
        └── learningGenerator.ts          # API client for LMG backend (port 5012) + type definitions
```

---

## 1. Pair Matching Algorithm (1-on-1 Tutoring)

### Trigger Flow

1. **Dashboard** (`peer-learning/page.tsx`, line 79): User clicks "Initialize Match" → calls `peerLearningApi.findTeacher()`
2. **API Client** (`peerLearning.ts`, line 41): Sends `POST /api/sessions/pair/match-me` with JWT auth
3. **Backend** processes the pairing algorithm and returns:
   - **Matched** — `{ status: "matched", session_id, session_details: { topic_name, ... }, partner_info }`
   - **Queued** — `{ status: "queued", message, position }`
   - **Unavailable** — `{ status: "no_teachers_available" }`

### Pending/Incomplete Features

- **Find Teacher** button triggers the match
- **Hold Position** button (page.tsx line 296): labeled but has no `onClick` handler
- **Connect Agent** button (page.tsx line 304): labeled but has no `onClick` handler

### States Handled by Frontend

| State | UI Behavior |
|-------|------------|
| `matchLoading` | Button shows spinner + "Locating Peer..." |
| `matchResult.status === 'matched'` | Green panel with peer details + "Connect Session" link |
| `matchResult.status !== 'matched'` | Amber panel with hold/connect buttons |
| No match yet | Queue stats (Active Pool: 24, Avg Wait: 45s, Match Rate: 92%) shown as static mock data |

---

## 2. Group Formation Algorithm

### Trigger Flow

1. **Group Session Form** (`group-session.tsx`, line 271): User enters a `Topic ID` and clicks "FORM GROUP SESSION"
2. **API Client** (`peerLearning.ts`, line 302): Sends `POST /api/groups/form` with `{ topic_id }`
3. **Backend** forms the group and returns session data including role assignments

### Group Roles

| Role | Color | Action | Description |
|------|-------|--------|-------------|
| `EXPLAINER` | teal | "Explain logic" | Articulates reasoning and guides discussion |
| `SOLVER` | blue | "Write code" | Implements the solution in the collaborative editor |
| `REVIEWER` | purple | "Audit logic" | Reviews code for correctness, checks edge cases |

### Activity Types

| Type | Icon | Timer Duration | Theme |
|------|------|---------------|-------|
| `coding` | Code2 | 25:00 | Standard group coding session |
| `debugging` | Bug | 25:00 | Debugging with anomaly tracker (4 bugs) |
| `mini_project` | Sparkles | 45:00 | Mini project with feature deployment phases |

### Session Phases

Three predefined phases (`group-session.tsx`, line 94):
1. **Phase 1: Conceptual Sync** — Understanding the problem
2. **Phase 2: Logic Articulation** — Building the solution
3. **Phase 3: Final Verification** — Review and validation

### Score Submission

Each member submits three scores via `POST /api/groups/{sessionId}/submit`:
- `task_completion_score` (0-100) — How well the task was completed
- `collaboration_score` (0-100) — How well the member collaborated
- `communication_score` (0-100) — How effectively the member communicated

Backend returns:
- `group_average_score` — Average across all members
- `group_action` — Either `"continue"` (next round) or `"group_disbanded"`

### Missing Implementation

`connectGroupWebSocket` (`peerLearning.ts`) is **not implemented** — `group-session.tsx` line 231 calls `peerLearningApi.connectGroupWebSocket(...)` which does not exist. Only `connectLiveRoomWebSocket` and `connectSessionWebSocket` exist.

---

## 3. Live Room / WebSocket Architecture

### Pair Session WebSocket

- **Endpoint**: `ws://{API}/api/live-room/ws/{sessionId}?student_id={sid}&token={token}`
- **Setup**: `connectLiveRoomWebSocket()` in `peerLearning.ts` (line 363)

#### Message Types Handled

| Type | Direction | Purpose |
|------|-----------|---------|
| `welcome` | Server→Client | Informs the client of their assigned role (teacher/learner) |
| `chat` | Bidirectional | Real-time text messaging in the live room |
| `user_joined` | Server→Client | Notification of new participant |
| `user_left` | Server→Client | Notification of participant departure |
| `presence` | Server→Client | Online/offline status updates |
| `screen_share` | Bidirectional | WebRTC signaling for screen sharing (offer/answer/ICE/directives) |
| `session_action` | Bidirectional | Question started / answer submitted events |
| `pong` | Server→Client | Keep-alive response |

### Group Session WebSocket

- Not yet implemented in the API client (see above)

---

## 4. Screen Sharing (WebRTC)

### Architecture

Uses **WebRTC** with a **STUN server** (`stun:stun.l.google.com:19302`) and **WebSocket signaling channel**.

### Flow

1. **Learner** (only the learner can share, per UI logic at pair-session.tsx line 538):
   - Calls `navigator.mediaDevices.getDisplayMedia({ video: true })`
   - Creates an `RTCPeerConnection`, adds tracks from the stream
   - Creates an SDP offer and sends it via WebSocket as `{ type: "screen_share", signal_type: "offer", signal_data: ... }`

2. **Teacher** (receives offer):
   - Creates a new `RTCPeerConnection`
   - Sets the remote description from the offer
   - Creates an SDP answer and sends it back

3. **ICE Candidate Exchange**: Both peers exchange ICE candidates through the WebSocket signaling channel

4. **Stream Rendering**: The teacher's `video` element receives the remote stream via `ontrack`

### States

| State Variable | Purpose |
|---------------|---------|
| `isSharing` | Whether the current user is sharing their screen |
| `screenShareActive` | Whether any screen share is active in the session |
| `sharerId` | student_id of who is sharing |
| `videoPlaying` | Whether the video element has started playing |

---

## 5. Question & Answer System

### Flow (Pair Session)

1. **Start Question** (`pair-session.tsx`, line 343):
   - Learner clicks "START QUESTION"
   - Calls `POST /api/sessions/my/start-question`
   - Backend returns question with `question_id`, `question_text`
   - Broadcasts via WebSocket to teacher

2. **Submit Answer** (line 365):
   - Learner types answer in textarea
   - Calls `POST /api/sessions/my/answer` with `{ answer }`
   - Backend returns `{ is_correct, feedback, current_mastery_score, questions_asked, performance? }`
   - Broadcasts via WebSocket to teacher

3. **Next Question** (line 390):
   - After 5 questions, session finishes and shows results

### Teacher Role

- Cannot start questions or submit answers
- Can see the learner's current question in real-time
- Can see the learner's screen via WebRTC
- Role is "monitoring" the session

---

## 6. Mastery Profile & Bloom's Taxonomy

### Types (from `learningGenerator.ts`)

```typescript
interface KnowledgeGap {
  gap_type: 'FUNDAMENTAL_GAP' | 'PARTIAL_GAP' | 'SURFACE_GAP'
  topic: string
  topic_id: string
  confidence?: number
  // ...additional metadata
}

interface MasteryProfile {
  overall_mastery_score: number
  knowledge_gaps: KnowledgeGap[]
  strengths: StrengthItem[]
}
```

### Displayed Metrics

| Metric | Source | Display Location |
|--------|--------|-----------------|
| Overall Mastery Score | `student.mastery_profile.overall_mastery_score` | Dashboard Mastery Ring |
| Knowledge Gaps | `student.mastery_profile.knowledge_gaps` | Dashboard Focus Areas (top 3) |
| Strengths | `student.mastery_profile.strengths` | Dashboard Core Strengths (top 3) |
| Bloom Level Before | `bloom_level_before` | Pair Session Results |
| Bloom Level After | `bloom_level_after` | Pair Session Results |
| Mastery Before | `previous_mastery_score` | Pair Session Results |
| Mastery After | `current_mastery_score` | Pair Session Results |
| Score Improvement | Calculated from before/after | Pair Session Results |

### Performance Page Metrics

- `current_mastery` — Current overall mastery percentage
- `initial_mastery` — Initial mastery before sessions
- `masteryGain` — Calculated as `currentMastery - initialMastery`
- Mastery threshold: **90%** (hardcoded threshold for "Mastery Achieved" status)

---

## 7. Notification System

### Types

```typescript
type NotificationType = "pairing_success" | "queue_entry" | "no_teachers_available" | "knowledge_gap_completed"
```

### API Endpoints (via `peerLearning.ts`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notifications` | GET | Fetch all notifications |
| `/api/notifications/{id}/read` | POST | Mark single notification as read |
| `/api/notifications/read-all` | POST | Mark all as read |
| `/api/notifications/{id}/accept` | POST | Accept pairing notification → join session |

### Polling

Dashboard polls `loadNotifications()` every **10 seconds** via `setInterval`.

### UI States

- **Pairing Success**: Shows "SESSION READY" badge with "Join Session" button → navigates to `/peer-learning/pair-session?sessionId={id}`
- **Queue/Unavailable**: Shows informational message with "Hold Position" and "Connect Agent" buttons (unimplemented)

---

## 8. Group Session Scoring & Lifecycle

### Scoring Dimensions

| Dimension | Slider Range | Default |
|-----------|-------------|---------|
| Task Completion | 0-100 | 85 |
| Collaboration | 0-100 | 80 |
| Communication | 0-100 | 75 |

### Post-Submission States

- **Continue** (`group_action === "continue"`) — Group advances to next round
- **Disbanded** (`group_action === "group_disbanded"`) — Session ends
- **Group Average Score** displayed alongside outcome

### Collaborative Editor

- Shared textarea for code editing
- Changes broadcast in real-time via WebSocket `sandbox_update` messages
- Hints system (3 levels max): Initial Analysis → Edge Cases → Final Review

---

## 9. Collaborative Tutoring Session Performance Page

Located at `/peer-learning/pair-session/performance/`

### API
- `GET /api/performance/{studentId}` via `getStudentPerformance()`

### Display Sections
1. **Mastery Evaluation** — Large score display with initial vs current mastery
2. **Mastery Trajectory** — Progress bar toward 90% threshold
3. **Efficiency Metrics** — Sessions count (learner/teacher/group), avg scores, remaining gaps
4. **Mastery Progression** — Visual initial→current→gain display
5. **Topics Progress** — Tags for improved and mastered topics
6. **Next Steps** — Link back to active session or dashboard

---

## 10. Pending / Incomplete Features

| Feature | Location | Status |
|---------|----------|--------|
| `connectGroupWebSocket` | `peerLearning.ts` | **Missing method** — called by `group-session.tsx` line 231 |
| Hold Position button | `page.tsx` line 296 | No `onClick` handler |
| Connect Agent button | `page.tsx` line 304 | No `onClick` handler |
| `NEXT_PUBLIC_PEER_LEARNING_API_URL` | `.env` | Not defined in any `.env` file (defaults to `localhost:8000`) |

---

## 11. Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_PEER_LEARNING_API_URL` | `http://localhost:8000` | Peer learning / live room / pairing backend |
| `NEXT_PUBLIC_LMG_API_URL` | `http://localhost:5012` | Learning material generation + mastery profile backend |

---

## 12. Key Data Interfaces (Frontend)

### From Backend (via APIs)

| Interface | Defined In | Key Fields |
|-----------|-----------|------------|
| `ChatMessage` | `pair-session/page.tsx:10` | type, from, role, message, timestamp |
| `Participant` | `pair-session/page.tsx:18` | student_id, role, is_online |
| `GroupMember` | `group-session.tsx:22` | student_id, role, score, task_completion, collaboration, communication |
| `GroupSessionData` | `group-session.tsx:31` | session_id, members, activity_type, problem_statement, role guides, scores |
| `Notification` | `notification/page.tsx:8` | notification_id, type, message, session_id, role, status |
| `MasteryProfile` | `learningGenerator.ts:50` | overall_mastery_score, knowledge_gaps, strengths |
| `KnowledgeGap` | `learningGenerator.ts:22` | topic, gap_type (FUNDAMENTAL_GAP/PARTIAL_GAP/SURFACE_GAP), confidence |
| `GenerationJob` | `learningGenerator.ts:68` | job_id, status, gaps_total, gaps_completed |
| `StudentProgress` | `learningGenerator.ts:214` | material_id, total_steps, completed_steps, quiz_score |

---

## 13. Backend Coupling Summary

All algorithmic processing is done server-side. The frontend assumes the backend provides:

1. **Pair Matching** (`POST /api/sessions/pair/match-me`) — Returns match result or queue status
2. **Group Formation** (`POST /api/groups/form`) — Returns assembled group with role assignments
3. **Question Generation** (`POST /api/sessions/my/start-question`) — Generates next adaptive question
4. **Answer Evaluation** (`POST /api/sessions/my/answer`) — Evaluates answer, returns feedback + mastery update
5. **Session Readiness** (`GET /api/live-room/{id}/ready`) — Returns countdown or ready status
6. **Screen Share State** (`GET /api/live-room/{id}/screen-share`) — Returns current sharing status
7. **Performance Aggregation** (`GET /api/performance/{studentId}`) — Returns aggregated performance metrics
8. **Notification Management** (`GET/POST /api/notifications/*`) — CRUD for pairing notifications
9. **Group Score Aggregation** (`POST /api/groups/{id}/submit`) — Receives + aggregates peer scores

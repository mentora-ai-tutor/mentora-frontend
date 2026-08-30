# Assessment Module — Implementation Guide

## Overview

The Assessment Module is an AI-powered adaptive testing system within the Mentora platform. It evaluates learner knowledge through dynamically generated questions, provides real-time feedback, tracks mastery across multiple topics, and generates comprehensive performance reports.

### Key Capabilities

- Adaptive questioning based on learner mastery profile
- Multiple question types: MCQ, code completion, code tracing, debugging, coding challenge
- Real-time AI evaluation with detailed feedback
- Multi-topic session orchestration with automatic topic transitions
- Mastery tracking per topic with visual progress indicators
- Comprehensive session reports and Q&A review
- Remediation mode for struggling learners
- Difficulty adjustment based on performance

---

## Architecture

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Client-side state via localStorage** | Session state persists across page navigations and survives page refreshes. The n8n backend is stateless for session progress; the frontend manages the state machine. |
| **Mock launch profile** | Launch page uses hardcoded `MOCK_PROFILE` to simulate a learner's mastery profile. In production, this would come from the AI Engine or LMG. |
| **AME microservice on port 5002** | Separated from the main API (port 3001) and AI Engine (port 5010) to isolate assessment-specific logic. |
| **7-page SPA-like flow** | Each phase of the assessment lifecycle gets its own route for clean separation of concerns and deep-linkability. |

### Module Boundaries

```
Frontend (this module)            Backend (AME — port 5002)
┌──────────────────────┐         ┌──────────────────────────┐
│  Launch Screen       │  POST   │  /api/ame/start-session  │
│  Session Page        │  ─────► │  /api/ame/submit-answer  │
│  Feedback Panel      │  ◄───── │                          │
│  Transition Page     │  GET    │  /api/ame/session/:id    │
│  Summary Page        │  ─────► │  /api/ame/sessions       │
│  Report Page         │  ─────► │  /api/ame/questions      │
│  Q&A Page            │  ─────► │  /api/ame/feedback-rept  │
└──────────────────────┘         └──────────────────────────┘
```

---

## Repository Structure

```
assessment/
├── page.tsx                          # Root route — delegates to LaunchScreen
├── launch/
│   └── page.tsx                      # Pre-session: profile review & begin
├── session/
│   └── page.tsx                      # Core Q&A loop: question → answer → feedback
├── summary/
│   └── page.tsx                      # Session complete: grade, stats, topic breakdown
├── report/
│   └── page.tsx                      # Full feedback report with learning path
├── transition/
│   └── page.tsx                      # Topic mastered → next topic handoff
├── questions-answers/
│   └── page.tsx                      # Q&A history review (grouped by topic)
└── components/
    └── FeedbackPanel.tsx             # Reusable post-answer feedback component
```

---

## Data Flow

### Session Lifecycle

```
                  ┌──────────────┐
                  │  /assessment │  (redirects to /assessment/launch)
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │  Launch      │  POST /api/ame/start-session
                  │              │  Stores session to localStorage
                  └──────┬───────┘
                         │ sessionId in URL
                  ┌──────▼───────┐
            ┌────►│  Session     │  GET /api/ame/session/:id  (on load)
            │     │              │  POST /api/ame/submit-answer  (on answer)
            │     └──────┬───────┘
            │            │
            │     ┌──────▼───────┐
            │     │ Feedback     │  (FeedbackPanel component)
            │     │ Panel        │  User clicks "Next Question"
            │     └──────┬───────┘
            │            │
            │     ┌──────▼───────┐
            │     │ Topic        │  (if topic_mastered === true)
            │     │ Transition   │
            │     └──────┬───────┘
            └────────────┘  (back to Session with same sessionId)
                         │
                  ┌──────▼───────┐
                  │  Summary     │  (if session_complete === true)
                  │              │  GET /api/ame/feedback-report/:id
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │  Report      │  GET /api/ame/feedback-report/:id
                  │              │  GET /api/ame/session/:id
                  └──────────────┘
```

### State Management

The frontend uses **localStorage as the primary state store**, not React context or a state library. This approach:

1. **Survives refreshes** — navigation between pages doesn't lose state
2. **Offline-capable** — doesn't require constant API calls for page transitions
3. **Simple** — no additional dependencies needed

**localStorage keys:**

| Key | Format | Written By | Read By |
|-----|--------|------------|---------|
| `assessment_session` | JSON object | launch, session | session, summary |
| `assessment_next_question` | JSON object | session | session |
| `assessment_qa` | JSON array | session | summary, report, qa |
| `assessment_qa_learner` | string | session | qa |
| `assessment_feedback_report` | JSON object | session | report |
| `assessment_qa_review` | JSON array | session | report |
| `assessment_session_summary` | JSON object | session | summary |
| `assessment_transition` | JSON object | session | transition |

---

## API Endpoints

All assessment endpoints are defined in `src/lib/api/assessment.ts` and proxy through `AssessmentApi` class.

### Endpoint Reference

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/ame/start-session` | Initialize a new assessment session with mastery profile |
| `POST` | `/api/ame/submit-answer` | Submit learner answer and receive AI evaluation |
| `GET`  | `/api/ame/session/:id` | Get current session state (question, stats, topics) |
| `GET`  | `/api/ame/sessions` | List all sessions for authenticated learner |
| `GET`  | `/api/ame/questions` | Get all Q&A records (optional `?topic=` filter) |
| `GET`  | `/api/ame/feedback-report/:id` | Get comprehensive feedback report |

### Auth

All requests include `Authorization: Bearer <accessToken>` header. The access token is stored in localStorage by the `AuthApi` login/register flow.

---

## Key Components

### Question Types

Every code-based generated question (`code_completion`, `code_tracing`, `debugging`, `coding_challenge`) gets full sandbox support — a Monaco sandbox editor with a **Run Code** button that executes against the Judge0 sandbox before submission, and on-submit sandbox execution used as evaluation evidence.

| Type | Badge | Input UI | Evaluation |
|------|-------|----------|------------|
| `mcq` | Multiple Choice | Clickable option buttons (A/B/C/D) | Letter match |
| `code_completion` | Code Completion | Sandbox code editor + Run Code | AI evaluation + Judge0 execution |
| `code_tracing` | Code Tracing | Output textarea + sandbox runner for the snippet | AI evaluation + reference snippet execution |
| `debugging` | Debugging | Sandbox code editor + Run Code | AI evaluation + Judge0 execution |
| `coding_challenge` | Coding Challenge | Sandbox code editor + Run Code | AI evaluation + Judge0 execution |

### Sandbox Execution

- **Preview ("Run Code")** — `POST /api/ame/run-code` compiles and runs code via Judge0 without touching scoring, mastery, or MongoDB. Available on every code-based question; for `code_tracing` it pre-fills the learner's editable copy with the question's `code_snippet`.
- **On submit** — code answers (`debugging` included) are executed by Judge0 during evaluation, and the normalized `sandbox_result` grounds the LLM evaluator and is rendered by the FeedbackPanel.
- **Reference runs** — for `code_tracing`, the learner's answer is expected output (not runnable Java), so the workflow executes the question's original snippet instead (`sandbox_mode: "reference_snippet"`) to capture ground-truth output as grading evidence.
- Sandbox unavailability never fails an evaluation — results degrade gracefully to text-only grading.

### Hints System

Questions can include a `hints[]` array. Users reveal hints one at a time via a "Need a hint?" toggle. Each hint is displayed in an amber-styled card with numbered badge.

### Mastery Tracking

Each topic has a mastery percentage (0–100). The target is 85%. Mastery is visualized:
- **Progress ring** with animated stroke-dasharray
- **Color coding**: emerald (≥85%), blue (≥60%), amber (≥40%), red (<40%)
- **Topic progress bars** in sidebar

### Feedback Panel

After each answer, `FeedbackPanel` displays:
- Result banner (correct/partial/incorrect)
- Immediate evaluation summary
- Concept explanation
- What was correct / what was wrong
- Correct answer explanation
- Improvement tip
- Deeper insight
- Suggested resources
- Mastery progress visualization (before → after)
- Remediation status notifications
- Difficulty change notification
- Next action button

---

## Development Workflow

### Prerequisites

- Node.js ≥ 18
- npm or yarn

### Local Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend URLs

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Required Backend Services

The assessment module requires the AME (Assessment Microservice) running on the port specified by `NEXT_PUBLIC_AME_API_URL` (default `http://localhost:5002`).

---

## Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| No sessionId in URL | Falls back to localStorage `assessment_session` |
| No stored session either | Falls back to `assessment_next_question` |
| API call fails silently | Caught exceptions proceed to next fallback |
| Submit answer fails | Constructs a fallback feedback object with encouragement |
| Session complete | `router.push('/assessment/summary')` |
| Topic mastered | Transition data saved → `router.push('/assessment/transition')` |
| No questions available | Error state with "Back to Assessment" button |
| Empty Q&A on review page | Empty state with "Start Assessment" prompt |

---

## Technology Stack

| Technology | Version | Usage |
|------------|---------|-------|
| Next.js | 16.2.1 | App Router, React Server Components |
| React | 19.2.4 | UI components |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling (CSS-first config) |
| Lucide React | 1.8.0 | Icons |
| shadcn/ui | — | UI primitives (Card, Badge, Button) |
| class-variance-authority | 0.7.1 | Variant management |
| clsx + tailwind-merge | — | Class utility composition |

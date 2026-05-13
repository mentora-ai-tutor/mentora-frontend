# Mentora Assessment Module

AI-powered adaptive assessment system for the Mentora learning platform. Dynamically evaluates learner knowledge through multi-topic sessions with real-time AI feedback, mastery tracking, and comprehensive reporting.

## Project Overview

The Assessment Module orchestrates end-to-end assessment sessions:

1. **Launch** — Review mastery profile, knowledge gaps, and strengths before starting
2. **Session** — Answer adaptive questions (MCQ, code tracing, debugging, coding challenges) with AI-powered evaluation
3. **Feedback** — Receive detailed per-question feedback with concept explanations, improvement tips, and mastery updates
4. **Transition** — Automatic topic-to-topic handoff when a topic is mastered
5. **Summary** — View session results: grade, stats, topic-by-topic performance
6. **Report** — Deep-dive into full feedback report with learning path and recommendations
7. **Q&A Review** — Browse all answered questions grouped by topic

## Repository Structure

```
assessment/
├── page.tsx                        # Route: /assessment — delegates to LaunchScreen
├── launch/
│   └── page.tsx                    # Pre-assessment profile review
├── session/
│   └── page.tsx                    # Core Q&A loop (question → answer → evaluation)
├── summary/
│   └── page.tsx                    # Post-session grade & stats summary
├── report/
│   └── page.tsx                    # Detailed feedback report with learning path
├── transition/
│   └── page.tsx                    # Topic-mastered handoff screen
├── questions-answers/
│   └── page.tsx                    # Q&A history grouped by topic
├── components/
│   └── FeedbackPanel.tsx           # Reusable answer feedback component
├── implementation.md               # Architecture deep-dive
└── README.md                       # This file
```

### Key Shared Files

| File | Purpose |
|------|---------|
| `src/lib/api/assessment.ts` | API client for all assessment endpoints |
| `src/lib/api/auth.ts` | Auth client (login/register/token management) |
| `src/contexts/AuthContext.tsx` | Auth state provider |

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.2.1 (App Router) |
| React | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Lucide React | 1.8.0 |
| shadcn/ui | — |

## Development Workflow

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- **AME Backend** running on `http://localhost:5002` (or your configured URL)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
#    Create .env.local in the project root with:
#    NEXT_PUBLIC_AME_API_URL=http://localhost:5002
#    NEXT_PUBLIC_API_URL=http://localhost:3001

# 3. Start development server
npm run dev
```

The app will be available at `http://localhost:3000`. Navigate to `/assessment` to begin.

### Available Commands

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Architecture Notes

- **State**: Session state is persisted in `localStorage` (not React context) to survive page navigations and refreshes.
- **Auth**: Bearer token authentication via `accessToken` in localStorage. Set by the login flow in `/login`.
- **API**: All assessment calls go through `AssessmentApi` class in `src/lib/api/assessment.ts` to the AME microservice.

### Required Backend API

The module communicates with the Assessment Microservice (AME). See [implementation.md](./implementation.md) for the full API reference with request/response shapes.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_AME_API_URL` | `http://localhost:5002` | Assessment service base URL |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Main API base URL |
| `NEXT_PUBLIC_AI_ENGINE_API_URL` | `http://localhost:5010` | AI Engine base URL |
| `NEXT_PUBLIC_LMG_API_URL` | `http://localhost:5012` | Learning Material Generator URL |

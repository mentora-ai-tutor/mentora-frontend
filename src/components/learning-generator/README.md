# MENTORA - Learning Material Generator (Frontend)

**Author:** Jayarathna S.K.N.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Pages & Routes](#pages--routes)
- [Component Library (24 Total)](#component-library-24-total)
  - [Dashboard Components](#dashboard-components)
  - [Knowledge Gap Components](#knowledge-gap-components)
  - [Materials Gallery Components](#materials-gallery-components)
  - [Learning Workspace Components](#learning-workspace-components)
  - [Code Sandbox Components](#code-sandbox-components)
- [API Clients](#api-clients)
- [Hooks & State Management](#hooks--state-management)
- [Data Flow](#data-flow)
- [Frontend Navigation](#frontend-navigation)

---

## Overview

The **Learning Material Generator (LMG) frontend** is the student-facing UI layer of the MENTORA AI-powered personalized learning platform. It consumes the LMG Service (Express.js, port `5012`) and the AI Engine (port `5010`) to deliver an end-to-end adaptive learning experience:

1. **Dashboard** – overview of knowledge gaps, active AI generation jobs, progress statistics.
2. **Knowledge Gaps** – detailed analysis of gaps detected by mastery profiling.
3. **Materials Gallery** – searchable/filterable library of AI-generated learning materials.
4. **Material Workspace** – guided step-by-step learning path with inline code execution, AI insights, quizzes, and progress tracking.
5. **Code Sandbox** – standalone Java workspace with code execution, AI feedback, code review, flashcards, and JUnit test generation.

All components are **client components** (`"use client"`) that live under `src/components/learning-generator/` and are rendered by pages under `src/app/(dashboard)/learning-generator/`.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                          │
│             Port 3000 · React 19 · TypeScript · Tailwind           │
│                                                                    │
│  ┌──────────────┐ ┌────────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │   Overview   │ │ Knowledge Gaps │ │  Materials  │ │  Code    │ │
│  │  Dashboard   │ │   Analysis     │ │   Gallery   │ │ Sandbox  │ │
│  │  (page.tsx)  │ │  (page.tsx)    │ │  (page.tsx) │ │(page.tsx)│ │
│  └──────┬───────┘ └───────┬────────┘ └──────┬──────┘ └────┬─────┘ │
│         │                 │           ┌─────┴─────┐        │       │
│         │                 │           │  Material │        │       │
│         │                 │           │ Workspace │        │       │
│         │                 │           │[materialId]│       │       │
│         │                 │           └───────────┘        │       │
│         └─────────────────┴───────────────┬────────────────┘       │
│                        Components (24) + API Clients               │
└──────────────────────────────────────────┬──────────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
        ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
        │  LMG Service      │   │  AI Engine       │   │ User Service     │
        │  Port 5012        │   │  Port 5010       │   │ Port 3001 (Auth) │
        │  REST + JWT       │   │  REST (local)    │   │                  │
        └──────────────────┘   └──────────────────┘   └──────────────────┘
```

**Client-side state persistence:** React hooks + `sessionStorage` (`mentora-workspace-session`, `mentora_<materialId>_<step>_<key>`) persist code, outputs, AI insights, and progress across page reloads.

---

## Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | React meta-framework, routing, SSR |
| **UI Library** | React 19 | Component framework |
| **Language** | TypeScript | Type safety across all components & API clients |
| **Styling** | Tailwind CSS | Utility-first styling (dark theme, teal accents) |
| **Icons** | lucide-react | Icon set used across all components |
| **Code Editor** | Custom textarea-based editor | In-browser Java editing (no external editor library) |
| **State** | React hooks + `sessionStorage` | Client-side state persistence |
| **Data Fetching** | Native `fetch` (wrapped in typed API classes) | LMG Service & AI Engine communication |
| **Auth** | JWT via `AuthContext` + `localStorage` | `accessToken` attached to LMG requests |

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/learning-generator` | Overview Dashboard | Hero card with gap/material counts, `ActiveJobsList` (live 5s polling), `ProgressStatsCards`, `KnowledgeGapCard` list, sidebar (`QuickActions`, `ModuleProgressList`, `ScoreHistory`, `StrengthsList`), `SubmitProfileDialog`. Submits a hardcoded sample mastery profile via `submitProfile()` |
| `/learning-generator/knowledge-gaps` | Knowledge Gaps | `GapSummaryCards` (total/fundamental/partial/surface), `GapFilters` (with counts + filtering helpers), `ExpandableGapCard` accordion list with evidence, misconceptions, error patterns, prerequisites, interventions |
| `/learning-generator/materials` | Materials Gallery | Summary cards by gap type, `SearchFilterBar` (topic/topic-id search + gap-type filter), `MaterialCard` grid linking to workspaces |
| `/learning-generator/materials/[materialId]` | Material Workspace | `LearningPathSidebar`, `ContentRenderer` (step-by-step content + AI insights), `CodeEditorPanel` (execution + AI feedback), `QuizSection`, `BottomNav`. Builds steps dynamically from material data; persists AI insights to `sessionStorage` |
| `/learning-generator/workspace` | Code Sandbox | Standalone Java workspace using `useWorkspaceSession` hook: `WorkspaceTopBar`, `StdinBar`, `WorkspaceEditor` (inline AI explanation + review overlays), `WorkspaceTabs` (Output/AI/Review/Fix), `ExecutionTimeline`, `FlashcardsPanel`, `TestsPanel` |

**Step building (`MaterialWorkspace`):** The `buildSteps()` function (in `[materialId]/page.tsx`) derives the learning path from available material sections:

| Order | Step `id` | Title | Type |
|-------|-----------|-------|------|
| 1 | `intro` | Introduction | `read` |
| 2 | `concepts` | Concepts & Syntax | `read` |
| 3 | `guide` | Step-by-Step Guide | `read` |
| 4 | `example` | Code Examples | `code` |
| 5 | `mistakes` | Common Mistakes | `read` |
| 6 | `practice` | Practice Challenge | `code` |
| 7 | `debug` | Debugging | `code` |
| 8 | `quiz` | Mastery Quiz | `quiz` |

---

## Component Library (24 Total)

All components are in `src/components/learning-generator/` and default-exported (or co-exported) client components.

### Dashboard Components

| Component | File | Details |
|-----------|------|---------|
| `JobCard` | `JobCard.tsx` | Displays a single `GenerationJob`. Status derivation: `queued`/`processing` → "Generating Materials..." (sparkle icon, teal), `completed`/`partial` → "Generation Complete" (green check), else "Generation Failed" (red cross). Renders a progress bar (`gaps_completed / gaps_total`) and a "materials ready" counter. Dismiss button calls `closeJob` via the parent and shows a spinner while closing. **Also exports `ActiveJobsList`**, which renders a titled list of active jobs (or `null` if empty) |
| `ProgressStats` | `ProgressStats.tsx` | Exports `ProgressStatsCards`. Receives `ProgressStats`, optional `StudentProgress[]`, and `LearningMaterial[]`. Computes 4 stat cards (Overall Progress %, Modules Completed, In Progress, Avg Quiz Score) plus a "Learning Progress" panel with a steps-completed progress bar and completed/in-progress/not-started counts. Returns `null` if no stats |
| `KnowledgeGapCard` | `KnowledgeGapCard.tsx` | Compact dashboard card for a single `KnowledgeGap`. Color-coded gap-type badge (red/amber/blue), evidence summary (2-line clamp), up to 3 misconception chips (`+N more` overflow), optional material progress bar, confidence %, completed state, and a link to the material workspace (or "Pending generation" placeholder) |
| `SubmitProfileDialog` | `SubmitProfileDialog.tsx` | Portal-based modal (`createPortal` → `document.body`, z-index 9999). Lists what gets sent (knowledge gaps, strengths/skill level, evidence from quizzes/sandbox/GitHub). Buttons: Cancel + "Submit & Generate". Disables both while submitting, shows spinner, backdrop click-to-close disabled while submitting |
| `OverviewSidebar` | `OverviewSidebar.tsx` | Exports 4 named components: **`QuickActions`** (Generate Materials button → opens submit dialog + Browse Materials link), **`ModuleProgressList`** (progress list of modules with per-module bars, quiz scores, completion check), **`ScoreHistory`** (list of mastery profile scores color-coded by score range: ≥80 green, ≥60 amber, ≥40 orange, else red), **`StrengthsList`** (list of strengths from profile, with confidence/mastery level when provided). All return `null` on empty input |

### Knowledge Gap Components

| Component | File | Details |
|-----------|------|---------|
| `GapSummaryCards` | `GapSummaryCards.tsx` | 4 stat cards: Total Gaps, Fundamental (red), Partial (amber), Surface (blue). Computes counts directly from `profile.knowledge_gaps` |
| `GapFilters` | `GapFilters.tsx` | Filter buttons for `ALL` / `FUNDAMENTAL_GAP` / `PARTIAL_GAP` / `SURFACE_GAP` with live counts, color-coded when active. **Exports 3 helpers:** `getGapCounts(profile)` → `Record<gapType, count>`, `getFilteredGaps(profile, filter)` → filtered `KnowledgeGap[]`, `getGapColors(gapType)` → Tailwind color map (shared by `ExpandableGapCard`) |
| `ExpandableGapCard` | `ExpandableGapCard.tsx` | Accordion card with header (topic, topic_id, colored gap-type badge, confidence %) and expandable body containing: evidence summary, misconceptions list, observed error patterns grouped by source (grid), prerequisites chips, related topics chips, and a suggested-intervention block (primary approach, estimated time, secondary approaches, learning objectives). Fundamental gaps get an animated pulsing dot |

### Materials Gallery Components

| Component | File | Details |
|-----------|------|---------|
| `MaterialCard` | `MaterialCard.tsx` | Card for a `LearningMaterial`: difficulty badge (green/amber/red), gap-type badge, topic + topic_id, content-type summary (Concepts/Examples/Quiz), generated date, generation model, and an "Open Workspace" link to `/learning-generator/materials/{_id}` |
| `SearchFilterBar` | `SearchFilterBar.tsx` | Search input (topic or topic_id, case-insensitive) + gap-type filter buttons derived from `gapTypes` prop. Active filter color-coded; "All" uses teal |

### Learning Workspace Components

| Component | File | Details |
|-----------|------|---------|
| `LearningPathSidebar` | `LearningPathSidebar.tsx` | Fixed 288px left sidebar (xl screens): back link, difficulty badge, topic, step/completion counters, progress bar, and scrollable step list. Each step shows completed (`CheckCircle2`) / active (highlighted teal) / locked (`Lock`) state. **Unlock rule:** `maxUnlocked = max(completedSteps, -1) + 1` — steps are only clickable up to the next step after the highest completed one. Clicking a step selects it and calls `saveProgress(idx)` |
| `ContentRenderer` | `ContentRenderer.tsx` | Renders content by `currentStepId` using `prose prose-invert prose-teal`: **intro** (what_is_it, why_learn_it, prerequisite warning box), **concepts** (core definition, analogy box, syntax reference with basic_syntax `pre` + syntax_breakdown list), **guide** (overview + numbered step cards with `java_tip` hints), **example** (description, explanation, copyable reference code with hover copy button), **mistakes** (bad/correct pattern side-by-side code blocks), **practice** (problem statement, requirements list, example input/output), **debug** (scenario, runtime error box). Includes AI action buttons — **Explain Simpler** (teal) and **Give a Real-life Analogy** (amber) — with disabled/loading states, plus "Open Code Editor" for code steps. Delegates insight display to `InsightPanel`. Header uses `ShieldAlert` for debug steps, `Brain` otherwise |
| `InsightPanel` | `InsightPanel.tsx` | Renders the AI insight result panel (or a "Mentora AI is Thinking" bouncing-dots loading state). Color/icon varies by tab type (`simpler` = teal/Sparkles, `analogy` = amber/Lightbulb). Close button calls `onClose`. Returns `null` when no insight and no loading type |
| `formatInsightText` | `formatInsightText.tsx` | Pure formatter: splits insight text into paragraphs, detects numbered/bullet lists, parses `**bold**` markdown into teal `<strong>` spans. Used by `InsightPanel` |
| `QuizSection` | `QuizSection.tsx` | Two states. **Before submit:** "Knowledge Check" header + each question card (question_number, type badge, optional `code_snippet` pre, clickable options with letter prefix + radio-style indicator). Submit button disabled until all questions answered or while saving. **After submit:** mastery result screen — animated award circle, "Mastery Achieved!" (≥80) or "Good Try!" gradient title, score, rewards panel (+score Mastery Points, badge if ≥80), "Return to Hub" link |
| `CodeEditorPanel` | `CodeEditorPanel.tsx` | Right-side embedded editor (flex-1.2, dark `#0b1021`): header with `Main.java` label, Close/Reset buttons, and Run button (disabled when empty/executing, "Compiling..." state). Code area is a full-size transparent `<textarea>` (placeholder varies by step: practice/debug/default). Bottom 256px tabbed panel: **Output** (exit-code badge, stdout `pre`, compilation/runtime error states with red/amber distinction) and **AI Feedback** (Mentora AI thinking loader, then feedback text). Auto-switches to Output tab on run |
| `BottomNav` | `BottomNav.tsx` | Fixed bottom bar: "Previous" (disabled at step 0) and "Next Concept" (hidden on last step, spinner while `savingProgress`) |

### Code Sandbox Components

| Component | File | Details |
|-----------|------|---------|
| `WorkspaceTopBar` | `WorkspaceTopBar.tsx` | Top toolbar: back link to materials, "Code Sandbox" title, Java badge. Toolbar buttons — stdin toggle (amber/teal active), flashcards (Layers), JUnit tests (TestTube), execution timeline (BarChart3, active state), code review (Eye, purple active state, "Review" label on sm+), reset (RotateCcw), and Run (spinner while executing) |
| `WorkspaceEditor` | `WorkspaceEditor.tsx` | Main editor column. `Main.java` tab header with "Ctrl+Enter to run" hint. Textarea with `onKeyDown` (Tab = 4 spaces, Cmd/Ctrl+Enter = run) and `onMouseUp` text-selection detection (5–500 chars). **Review annotations:** when `reviewMode`, renders absolutely-positioned color-coded line overlays (red=high, amber=medium, blue=low) with numbered severity dots and hover tooltips (category/message/suggestion). **AI Explainer popup:** positioned near the text selection, shows highlighted code snippet, then "Explain This" button → loading → AI explanation |
| `WorkspaceTabs` | `WorkspaceTabs.tsx` | Right panel (40% width) with 4 tabs — **Output** (compiling state, structured JSON view for object output, stdout, compile/runtime errors), **AI** (Mentora AI feedback), **Review** (score bar `/10`, summary, color-coded annotation cards with line range + severity + category + suggestion, retry on error, "Start Review" empty state), **Fix** ("AI Fix This Error" button → suggested fix, fixed code with `// FIX:` highlights + "Apply Fix", and explanation). Red dot indicators on tabs with pending error/feedback/annotation data |
| `StdinBar` | `StdinBar.tsx` | Amber-styled standard-input bar for Java `Scanner` programs: terminal icon, `stdin:` label, text input, Clear button. Persisted via workspace session |
| `FlashcardsPanel` | `FlashcardsPanel.tsx` | Right-side slide-in drawer (z-50): concept flashcards with difficulty badges (beginner/intermediate/advanced). Click a card to expand its definition + example code. States: loading ("Generating flashcards..."), empty (Generate button), populated (list + Regenerate button) |
| `TestsPanel` | `TestsPanel.tsx` | Right-side slide-in drawer: "JUnit Test Generator". States: loading, generated (explanation + copyable test code `pre` with copy button), empty (Generate JUnit Tests button) |
| `ExecutionTimeline` | `ExecutionTimeline.tsx` | Bottom horizontal bar chart of method-level execution timings (`{ method, duration }[]`). Each bar is a flex segment with the method name; tooltip shows `method — duration`. Returns `null` when empty. Data is synthesized client-side from output lines in the workspace page (`extractTimeline`) |

---

## API Clients

### Learning Generator API — `src/lib/api/learningGenerator.ts`

- **Base URL:** `NEXT_PUBLIC_LMG_API_URL` (default `http://localhost:5012`)
- **Auth:** attaches `Authorization: Bearer <accessToken>` from `localStorage` to every request (except `/health`)
- **Class:** `LearningGeneratorApi` (exported as singleton `learningGeneratorApi`)
- **Types exported:** `ApiResponse`, `KnowledgeGap`, `StrengthItem`, `MasteryProfile`, `SubmitProfilePayload`, `GenerationJob`, `LearningMaterial`, `Lesson`, `Assessment`, `QuizQuestion`, `AgentStats`, `StudentProgress`, `ProgressStats`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `checkHealth` | `GET /health` | Service health (no auth) |
| `submitProfile` | `POST /api/mastery/submit` | Submit mastery profile → returns `job_id`, `gaps_queued`, `topics`, polling checkpoints |
| `getProfile` | `GET /api/mastery/:studentId` | Latest mastery profile |
| `getProfileHistory` | `GET /api/mastery/:studentId/history?page=&limit=` | Paginated profile history |
| `getMaterials` | `GET /api/materials/:studentId` | Materials list with optional `topic`/`gap_type`/`limit`/`page` query params |
| `getMaterial` | `GET /api/materials/item/:materialId` | Single material |
| `getTopics` | `GET /api/materials/:studentId/topics` | Distinct topics |
| `getMaterialStats` | `GET /api/materials/:studentId/stats` | Material statistics |
| `deleteMaterial` | `DELETE /api/materials/item/:materialId` | Soft-delete material |
| `getJobStatus` | `GET /api/agent/jobs/:jobId` | Generation job status |
| `completeJob` | `POST /api/agent/jobs/:jobId/complete` | Force-complete job |
| `closeJob` | `PATCH /api/agent/jobs/:jobId` | Close job (`status: 'closed'`) — used by dashboard dismiss |
| `getJobsByStudent` | `GET /api/agent/jobs/student/:studentId` | Last 10 jobs for a student |
| `getGlobalStats` | `GET /api/agent/stats/global` | Global agent statistics |
| `getAgentLogs` | `GET /api/agent/logs/:studentId` | Agent scoring logs |
| `retryMaterial` | `POST /api/agent/retry/:materialId` | Re-trigger n8n for a failed material |
| `getProgressByMaterial` | `GET /api/progress/material/:materialId` | Progress for one material |
| `updateProgress` | `PUT /api/progress/material/:materialId` | Update step completion, active step, quiz score, completion |
| `getProgressByStudent` | `GET /api/progress/student/:studentId` | All progress records |
| `getProgressStats` | `GET /api/progress/student/:studentId/stats` | Progress statistics |

### AI Engine API — `src/lib/api/aiEngine.ts`

- **Base URL:** `NEXT_PUBLIC_AI_ENGINE_API_URL` (default `http://localhost:5010`)
- **Auth:** none (local service)
- **Class:** `AIEngineApi` (exported as singleton `aiEngineApi`); throws on non-OK responses

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `executeCode` | `POST /api/execute` | Execute Java code (`code`, `context`, optional `stdin`) |
| `getFeedback` | `POST /api/feedback` | AI feedback on code (`code`, `output`, `error`, `context`) |
| `runWithFeedback` | `POST /api/run-with-feedback` | Execute + feedback in one call |
| `healthCheck` | `GET /health` | AI Engine availability |
| `explainSimpler` | `POST /api/explain-simpler` | Simplified explanation (`content`, `topic`, `stepType`) |
| `getAnalogy` | `POST /api/analogy` | Real-life analogy |
| `explainHighlightedCode` | `POST /api/explain-code` | Explain selected code (`code`, `highlighted_code`, optional `question`) |
| `fixError` | `POST /api/fix-error` | AI error fixing (`code`, `error`) |
| `codeReview` | `POST /api/code-review` | Code review with annotations (`code`, optional `focus`) |
| `getFlashcards` | `POST /api/flashcards` | Generate concept flashcards |
| `generateTests` | `POST /api/generate-tests` | Generate JUnit tests (`code`, `class_name`) |

---

## Hooks & State Management

### `src/hooks/useWorkspaceSession.ts`

Powers the Code Sandbox with `sessionStorage` persistence (key: `mentora-workspace-session`).

| Export | Description |
|--------|-------------|
| `session` | Full `WorkspaceSession` object (36 fields): code, output, executionError, isExecuting, isCompilationError, aiFeedback, isAiLoading, activeTab (`output`/`feedback`/`review`/`fix`), stdinInput, showStdin, highlightedCode, aiExplanation, isExplaining, showExplanation, explanationPosition, fixSuggestion, isFixing, reviewMode, reviewData, isReviewing, flashcards, showFlashcards, isLoadingFlashcards, activeFlashcard, testCode, testExplanation, showTests, isGeneratingTests, structuredOutput, showTimeline, executionTimeline |
| `update` | `(patch: Partial<WorkspaceSession>)` — merges a patch into session state |
| `reset` | Clears `sessionStorage` and restores `DEFAULT_STATE` (default code = `public class Main { ... "Hello, Mentora!" }`) |

Persistence flow: loads from `sessionStorage` on mount, then writes on every session change (guarded by an `initialized` flag; all reads/writes wrapped in try/catch).

### Per-material `sessionStorage` (Material Workspace)

The `[materialId]/page.tsx` uses `sessionStorage` keys `mentora_<materialId>_<activeStep>_<key>` to persist:
- `simpler` — "Explain Simpler" AI insight
- `analogy` — "Real-life Analogy" AI insight
- `code_feedback` — AI feedback from the code editor

On step change, previously stored insights are rehydrated automatically.

---

## Data Flow

1. **Dashboard load:** `fetchData` runs `Promise.all` over materials, profile, profile history, jobs, progress, and progress stats. If any non-closed jobs exist, a **5-second polling interval** is started that refreshes materials + jobs.
2. **Profile submission:** `handleSubmitProfile` posts a sample mastery profile → on success, a new `GenerationJob` (status `processing`) is optimistically appended to `activeJobs` and the dialog closes.
3. **Job dismissal:** `handleDismissJob` calls `closeJob` then removes the job from the local list.
4. **Workspace load:** parallel `getMaterial` + `getProgressByMaterial` → builds steps, restores completed steps / active step / quiz score.
5. **Code execution:** `aiEngineApi.executeCode` → output or error (compilation flagged) → then `aiEngineApi.getFeedback` → AI feedback tab. Successful practice runs auto-complete the current step.
6. **AI insights:** step context is assembled from the material (intro/concepts/guide/mistakes/practice/debug) and sent to `explainSimpler` / `getAnalogy`; results cached in `sessionStorage`.
7. **Progress:** every step navigation calls `saveProgress` (updates `total_steps`, `active_step`, `completed_step`); quiz submission sends `quiz_score` + `completed_all: true`.
8. **Sandbox:** `handleRunCode` executes with optional stdin, auto-formats JSON output (`tryAutoFormatOutput`), builds a synthetic execution timeline, then fetches AI feedback. Fix flow: `fixError` → apply fix replaces the code. Review flow: `codeReview` → annotations overlaid on the editor + tab list.

---

## Frontend Navigation

The sidebar (`src/components/dashboard/Sidebar.tsx`) includes a **Material Generator** section:

- Overview → `/learning-generator`
- Knowledge Gaps → `/learning-generator/knowledge-gaps`
- Materials → `/learning-generator/materials`
- Learn Code → `/learning-generator/workspace`

Internal cross-links: dashboard gap cards → `/learning-generator/materials/{_id}`, material cards → workspace, sidebar module links → material workspaces, workspace top bar → materials gallery, quiz result → dashboard hub.

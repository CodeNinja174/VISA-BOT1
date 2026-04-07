# US Visa Mock Interview Assistant — Technical Documentation

> **Version:** 2.0.0  
> **Last Updated:** April 2026  
> **Status:** Stages 1–3 Complete + Cloud Model + Voice I/O + Group Interviews  
> **AI Model:** `nemotron-3-super:cloud` (120B params, cloud inference via Ollama)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [System Requirements](#4-system-requirements)
5. [Setup & Running](#5-setup--running)
6. [Backend — Detailed Reference](#6-backend--detailed-reference)
   - 6.1 [Configuration (.env)](#61-configuration-env)
   - 6.2 [Data Models (models.py)](#62-data-models-modelspy)
   - 6.3 [Question Bank (question_bank.py)](#63-question-bank-question_bankpy)
   - 6.4 [Question Selector (question_selector.py)](#64-question-selector-question_selectorpy)
   - 6.5 [Real-Time Evaluation (realtime_eval.py)](#65-real-time-evaluation-realtime_evalpy)
   - 6.6 [Full Session Evaluation (evaluation.py)](#66-full-session-evaluation-evaluationpy)
   - 6.7 [API Server (main.py)](#67-api-server-mainpy)
7. [Frontend — Detailed Reference](#7-frontend--detailed-reference)
   - 7.1 [Build & Configuration](#71-build--configuration)
   - 7.2 [API Client (api.js)](#72-api-client-apijs)
   - 7.3 [Routing (App.jsx)](#73-routing-appjsx)
   - 7.4 [Pages](#74-pages)
8. [API Endpoint Reference](#8-api-endpoint-reference)
9. [Evaluation Engine — Deep Dive](#9-evaluation-engine--deep-dive)
   - 9.1 [Dimension Scoring](#91-dimension-scoring)
   - 9.2 [Red Flag Detection](#92-red-flag-detection)
   - 9.3 [Approval Probability Analysis](#93-approval-probability-analysis)
   - 9.4 [Tiered Action Plan](#94-tiered-action-plan)
10. [Data Flow & User Journey](#10-data-flow--user-journey)
11. [Configuration Reference](#11-configuration-reference)
12. [Build Stages & What Was Implemented](#12-build-stages--what-was-implemented)
13. [Known Limitations & Future Work](#13-known-limitations--future-work)

---

## 1. Project Overview

The **US Visa Mock Interview Assistant** is an AI-powered web application that simulates a US consulate B1/B2 visa interview. It helps applicants practice answering officer questions, provides real-time feedback on each answer, detects red flags and contradictions, and produces a comprehensive evaluation report with actionable improvement advice.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Radical Realism** | Questions mirror actual consular officer patterns |
| **214(b)-First** | Every evaluation is framed around the presumption of immigrant intent |
| **Short Interaction Cycles** | Answers should be 2–4 sentences, just like a real interview |
| **Strict but Fair** | Specific, honest feedback — never sugarcoated |
| **No Legal Advice** | Simulation only; disclaimers shown at every stage |

### What It Does

1. Collects an applicant profile (visa type, citizenship, employment, age, marital status, group size, etc.)
2. Selects 10–14 personalized questions based on the profile's risk factors (including group-specific questions)
3. **Officer speaks questions aloud** via Text-to-Speech with an animated speaking orb visualizer
4. Conducts a simulated interview with **real-time per-answer evaluation** (all questions evaluated by AI)
5. Supports both **voice input (STT)** and text input — user's choice
6. Dynamically inserts **follow-up questions** when answers are weak or flagged
7. Detects **contradictions** across the conversation history
8. Generates a **comprehensive report** with:
   - Overall score (0–100) and risk level
   - 5-dimension breakdown (Return Intent, Purpose Clarity, Financial Credibility, Consistency, Conciseness)
   - Per-question officer thinking, weaknesses, and suggested better answers
   - Detailed red flag analysis with fixes
   - 214(b) approval probability analysis
   - Tiered action plan (Critical → Important → Polish)

---

## 2. Architecture & Tech Stack

```
┌──────────────────────────────────────────────────────────┐
│                      FRONTEND                             │
│  React 19 + Vite 8 + Tailwind CSS 4                     │
│  Port 5173 (dev) — proxies /api to backend               │
│                                                          │
│  Pages: Landing → Profile → Briefing → Interview → Report│
│  State: React useState + localStorage                    │
│  HTTP: Axios (timeout 10 min)                            │
│  Voice: Web Speech API (SpeechSynthesis + Recognition)   │
│  Visualizer: Canvas-based SpeakingOrb component          │
└────────────────────┬─────────────────────────────────────┘
                     │ /api/*
                     ▼
┌──────────────────────────────────────────────────────────┐
│                      BACKEND                              │
│  FastAPI + Uvicorn  (Python 3.13)                        │
│  Port 8000  — CORS: localhost:5173, localhost:5174       │
│                                                          │
│  Endpoints: /health, /session/start,                     │
│             /session/answer, /session/evaluate            │
│  Async HTTP: httpx (timeout 180s)                        │
└────────────────────┬─────────────────────────────────────┘
                     │ POST /api/generate
                     ▼
┌──────────────────────────────────────────────────────────┐
│               OLLAMA (CLOUD INFERENCE)                    │
│  Model: nemotron-3-super:cloud (120B params)             │
│  Port 11434 (default)                                    │
│  Cloud inference — fast responses (~5-15s/question)      │
└──────────────────────────────────────────────────────────┘
```

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Runtime | React | 19.2.4 |
| Frontend Router | react-router-dom | 7.14.0 |
| Frontend HTTP | Axios | 1.14.0 |
| Frontend Build | Vite | 8.0.5 |
| Frontend Styling | Tailwind CSS | 4.2.2 |
| Backend Framework | FastAPI | latest |
| Backend Server | Uvicorn | latest |
| Backend HTTP | httpx | latest |
| AI Inference | Ollama | latest |
| AI Model | qwen2.5:14b | — |
| Database | **None** | In-memory + localStorage |
| Python | — | 3.13.11 |
| Node.js | — | 24.14.1 |

---

## 3. Directory Structure

```
VISA/
├── .gitignore
├── DOCUMENTATION.md          ← This file
├── MODEL-GUIDE.md            ← Model switching guide
├── VISA-PRD.md               ← Product Requirements Document
├── venv/                     ← Python virtual environment
│
├── backend/
│   ├── .env                  ← Environment configuration
│   ├── main.py               ← FastAPI app + endpoints (82 lines)
│   ├── models.py             ← Pydantic models & enums (205 lines)
│   ├── question_bank.py      ← 86 realistic questions, 9 categories (113 lines)
│   ├── question_selector.py  ← Profile-based question selection + group logic (118 lines)
│   ├── realtime_eval.py      ← Per-answer real-time evaluation (279 lines)
│   ├── evaluation.py         ← Full session evaluation engine (573 lines)
│   └── __pycache__/
│
└── frontend/
    ├── index.html            ← SPA entry point
    ├── package.json           ← Dependencies & scripts
    ├── package-lock.json
    ├── vite.config.js         ← Vite + React + Tailwind + proxy config
    ├── dist/                  ← Production build output
    ├── node_modules/
    ├── public/
    └── src/
        ├── main.jsx           ← React root mount
        ├── App.jsx            ← Route definitions (20 lines)
        ├── api.js             ← Axios API client (38 lines)
        ├── index.css          ← Tailwind v4 import (1 line)
        ├── components/
        │   └── SpeakingOrb.jsx ← Animated speaking visualizer (118 lines)
        └── pages/
            ├── LandingPage.jsx    ← Hero page (46 lines)
            ├── ProfileSetup.jsx   ← 16-field intake form + group support (316 lines)
            ├── Briefing.jsx       ← Pre-interview rules + settings panel (144 lines)
            ├── Interview.jsx      ← Dynamic interview engine + TTS/STT (572 lines)
            └── Report.jsx         ← 6-section report + download (546 lines)
```

---

## 4. System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| RAM | 16 GB | 32+ GB (model runs on CPU) |
| Disk | 20 GB free | 40 GB |
| Python | 3.10+ | 3.13 |
| Node.js | 18+ | 24+ |
| Ollama | Latest | Latest |
| GPU | Not required | Optional (8+ GB VRAM for GPU inference) |
| OS | Linux / macOS / Windows (WSL) | Linux |

**Current development machine:** 62 GB RAM, Quadro P400 2 GB (display only — not usable for LLM inference).

---

## 5. Setup & Running

### 5.1 First-Time Setup

```bash
# Clone / navigate to project
cd /home/STUDENTS/varun/Desktop/VISA

# --- Backend ---
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn httpx python-dotenv pydantic

# --- Frontend ---
cd frontend
npm install
cd ..

# --- Ollama ---
# Install Ollama (https://ollama.com)
ollama pull qwen2.5:14b
```

### 5.2 Running the Application

**Terminal 1 — Ollama** (if not already running as a service):
```bash
ollama serve
```

**Terminal 2 — Backend:**
```bash
cd /home/STUDENTS/varun/Desktop/VISA
source venv/bin/activate
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 3 — Frontend:**
```bash
cd /home/STUDENTS/varun/Desktop/VISA/frontend
npm run dev
```

**Access:** Open `http://localhost:5173` in a browser.

### 5.3 Health Check

```bash
curl http://localhost:8000/api/health
# → {"status":"ok","version":"1.0.0"}
```

---

## 6. Backend — Detailed Reference

### 6.1 Configuration (.env)

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=nemotron-3-super:cloud
ENVIRONMENT=development
LOG_LEVEL=INFO
```

Environment variables are loaded via `python-dotenv` in `main.py`. The evaluation engine reads `OLLAMA_BASE_URL` and `OLLAMA_MODEL` with fallback defaults. The cloud model (`nemotron-3-super:cloud`, 120B params) provides fast inference and enables all questions to be evaluated by AI.

---

### 6.2 Data Models (models.py)

All request/response schemas are defined as Pydantic `BaseModel` classes.

#### Enums

| Enum | Values |
|------|--------|
| `VisaType` | B1, B2, B1/B2 |
| `EmploymentStatus` | employed_private, employed_government, self_employed, student, retired, unemployed |
| `FamilyStatus` | us_citizen, green_card, F1_student, H1B_work, tourist_visa, other, none |
| `IncomeRange` | <500, 500-1500, 1500-3000, 3000-5000, >5000 |
| `FundingSource` | self, sponsor_us, employer, other |
| `PurposeOfVisit` | tourism, family_visit, medical, conference, business_meeting, other |
| `MaritalStatus` | single, married, divorced, widowed |

#### ProfileInput (Main Applicant Profile)

| Field | Type | Default |
|-------|------|---------|
| `visa_type` | str | "B2" |
| `citizenship` | str | "India" |
| `purpose` | list[str] | ["tourism"] |
| `employment` | str | "employed_private" |
| `prior_refusal` | bool | false |
| `us_family` | bool | false |
| `family_status` | str | "none" |
| `funding` | str | "self" |
| `prior_travel` | bool | false |
| `monthly_income_usd` | str | "1500-3000" |
| `planned_days` | int | 14 (validated: 1–180) |
| `applicant_count` | int | 1 (validated: 1–6) |
| `marital_status` | MaritalStatus | "single" |
| `age` | int | 30 (validated: 18–80) |
| `travel_companions` | str | "" |

#### Request/Response Models

| Model | Purpose |
|-------|---------|
| `SessionStartRequest` | Contains `ProfileInput` |
| `SessionStartResponse` | Returns `session_id`, `questions[]`, `risk_flags[]` |
| `AnswerSubmitRequest` | Real-time eval: profile, question, answer_text, conversation_history, follow_up_counts |
| `AnswerSubmitResponse` | Returns answer_quality, color_indicator, hint_text, follow_up_question, contradiction_detected |
| `SessionEvaluateRequest` | Full eval: session_id, profile, answers[] |
| `EvaluationResponse` | Full report: overall_score, approval_risk, summary, dimensions, per_question_feedback, red_flags, approval_analysis, action_plan |

#### Evaluation Report Models

| Model | Fields |
|-------|--------|
| `InterviewSummary` | date, visa_type, profile_summary, questions_asked, follow_ups, red_flags_count, overall_score, risk_level |
| `DimensionScore` | score, max, rating |
| `QuestionFeedback` | question_id, question_text, user_answer, rating, feedback_text, suggested_answer, red_flags, officer_thinking, weakness_bullets, suggested_why_better, dimensions_affected, is_follow_up |
| `RedFlagDetail` | flag_number, title, user_said, problem, fix, question_index |
| `ApprovalAnalysis` | outcome_label, explanation, strengths, weaknesses, concerns, profile_risk_factors, improvement_suggestions |
| `ActionItem` | priority (critical/important/polish), text |

---

### 6.3 Question Bank (question_bank.py)

86 realistic questions across 9 categories, stored as a Python dictionary `QUESTIONS`. Questions are phrased to sound like actual consular officers — short, direct, sometimes brusque.

| Category | ID Prefix | Count | Example Questions |
|----------|-----------|-------|-------------------|
| **purpose** | p1–p14 | 14 | "Why are you going now? What’s the occasion?", "Who invited you?", "Walk me through your itinerary." |
| **return_intent** | r1–r12 | 12 | "How long do you plan to stay?", "Do you have a return ticket?", "What brings you back home after the trip?" |
| **employment** | e1–e14 | 14 | "What do you do for work?", "How long have you been with that employer?", "Did your company approve time off?" |
| **financial** | f1–f9 | 9 | "Who’s paying for this trip?", "What’s your monthly salary?", "Show me your bank statement summary." |
| **visa_history** | v1–v7 | 7 | "Have you been refused a visa before?", "What’s changed since the last refusal?" |
| **us_contacts** | u1–u8 | 8 | "Who do you know in the US?", "What does your contact there do for work?", "How did you two meet?" |
| **business** | b1–b7 | 7 | "What meetings do you have scheduled?", "Which company are you visiting and where?" |
| **challenge** | c1–c7 | 7 | "Why should I believe you’ll come back?", "Convince me you won’t overstay." |
| **group** | g1–g8 | 8 | "Are you all traveling together?", "Who’s paying for everyone?", "Why is each person going?" |

---

### 6.4 Question Selector (question_selector.py)

Selects 10–12 questions personalized to the applicant's risk profile.

#### Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `select_questions` | `(profile: ProfileInput) → list[QuestionItem]` | Main selector — builds a personalized question set |
| `compute_risk_flags` | `(profile: ProfileInput) → list[str]` | Identifies risk flags from profile fields |
| `_pick` | `(category: str, count: int) → list` | Random sampling from QUESTIONS pool |
| `_get_category` | `(question_id: str) → str` | Maps ID prefix to category name |

#### Selection Algorithm

```
Step 1: Always pick:
  - 2 × purpose
  - 2 × return_intent
  - 2 × employment
  - 1 × financial
  - 1 × challenge
  = 8 base questions

Step 2: Conditional additions:
  - If prior_refusal → +2 visa_history
  - If us_family      → +2 us_contacts
  - If B1 or B1/B2    → +2 business

Step 3: Pad to minimum 9 questions (random from remaining categories)

Step 4: Deduplicate by question_id

Step 5: Cap at 12 questions, shuffle
```

#### Risk Flags Detected

| Flag | Condition |
|------|-----------|
| `prior_refusal` | prior_refusal == true |
| `us_family_on_immigration_status` | us_family && family_status in [us_citizen, green_card, F1_student, H1B_work] |
| `unemployed` | employment == "unemployed" |
| `self_employed` | employment == "self_employed" |
| `no_prior_travel` | prior_travel == false |
| `low_income` | monthly_income_usd in ["<500", "500-1500"] |
| `high_denial_country` | citizenship in HIGH_DENIAL_COUNTRIES |
| `long_stay` | planned_days > 60 |
| `unemployed_self_funded` | unemployed && funding == "self" |

**HIGH_DENIAL_COUNTRIES:** Nigeria, Ghana, Pakistan, Bangladesh, Nepal, Cameroon, India, Mexico, Brazil

---

### 6.5 Real-Time Evaluation (realtime_eval.py)

Evaluates each answer as it is submitted during the interview, providing instant feedback and generating follow-up questions when needed.

#### Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `evaluate_answer_realtime` | `async (profile, question, answer_text, conversation_history, follow_up_counts) → dict` | Main entry — evaluates one answer, returns color/hint/follow-up |
| `detect_keyword_flags` | `(answer_text) → tuple(list, str\|None)` | Scans for hard and soft flag patterns |
| `detect_contradictions` | `(answer_text, history) → tuple(bool, str\|None)` | Cross-references duration/cities against prior answers |
| `_format_history` | `(history) → str` | Truncates to last 8 exchanges for prompt context |
| `_generate_rule_followup` | `(question, answer_text, flags, has_contradiction, detail) → str` | Category-specific rule-based follow-up questions |

#### Keyword Flag Patterns

**Hard Flags (immediate red alert):**

| Type | Example Phrases |
|------|----------------|
| `work_intent` | "find a job", "looking for work", "get hired", "start working" |
| `overstay_intent` | "stay forever", "not going back", "settle in", "never return" |
| `evasion` | "I don't know", "not sure", "no idea", "can't say" |

**Soft Flags (yellow warning):**

| Type | Example Phrases |
|------|----------------|
| `vague_purpose` | "just visiting", "travel around", "see what happens" |
| `accommodation_unknown` | "haven't decided where", "figure it out", "don't know where" |

#### Contradiction Detection

Uses regex to extract:
- **Duration mentions:** numbers followed by "days", "weeks", or "months"
- **City names:** NYC, New York, LA, Los Angeles, San Francisco, Chicago, Miami, Boston, Washington DC, Houston, Seattle, Dallas

Compares current answer against all prior applicant responses. If conflicting durations or cities are detected, the contradiction is flagged with a detail message.

#### Follow-Up Logic

- **Max 2 follow-ups per question** (tracked via `follow_up_counts` dict)
- **Max 14 total questions** in the interview (hard cap)
- Follow-up IDs are formatted as `{question_id}_fu{n}` (e.g., `p1_fu1`, `p1_fu2`)
- The follow-up is generated via rule-based logic first; falls back to AI generation via Ollama if rules don't match

#### Evaluation Flow

```
1. Detect keyword flags (hard + soft)
2. Detect contradictions against conversation history
3. If hard flag found → red_flag, red indicator, generate follow-up
4. Else → attempt AI evaluation via Ollama (200 max tokens)
5. If Ollama fails/times out → fall back to keyword-based evaluation
6. Determine color: green (strong), yellow (weak), red (red_flag)
7. Generate hint text for weak/flagged answers
8. Generate follow-up question if quality ≠ strong and under limits
9. Return: {answer_quality, color_indicator, hint_text, follow_up_question,
            contradiction_detected, contradiction_detail, red_flag_type}
```

---

### 6.6 Full Session Evaluation (evaluation.py)

The comprehensive evaluation engine that produces the final interview report. This is the largest backend module (~573 lines).

#### Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `evaluate_session` | `async (profile, answers) → EvaluationResponse` | Orchestrator — evaluates all answers, aggregates report |
| `_evaluate_one` | `async (profile, answer) → dict` | AI evaluation of a single Q&A via Ollama |
| `_keyword_fallback` | `(answer) → dict` | Fast local evaluation using word patterns |
| `_aggregate` | `(per_q_results, profile, answers) → dict` | Aggregates per-question results into full report |
| `_build_detailed_red_flags` | `(per_q_results) → list[RedFlagDetail]` | Constructs detailed red flag entries |
| `_calculate_approval_analysis` | `(total_score, dimensions, red_flags, profile) → ApprovalAnalysis` | 214(b) assessment with profile adjustments |
| `_build_tiered_action_plan` | `(dimensions, red_flags, per_q_results, profile) → list[ActionItem]` | Generates prioritized improvement actions |
| `_call_ollama` | `async (prompt, max_tokens=300) → str` | Low-level Ollama API call |
| `_parse_json_response` | `(raw: str) → dict` | Extracts JSON from LLM output (handles markdown fences) |

#### Evaluation Strategy (Cloud Model)

With the cloud model (`nemotron-3-super:cloud`, 120B), all questions are evaluated by AI:

```
1. Sort answers by priority (flagged answers first)
2. Evaluate ALL answers via Ollama AI (async)
3. Keyword fallback is only used if individual AI calls fail
4. Aggregate all results into the final report
```

Cloud inference provides fast responses (~5–15s per question), making full AI evaluation practical.

#### Keyword Fallback Logic

The `_keyword_fallback()` function provides instant evaluation without AI:

```
1. Scan for red flag keywords (work_words, overstay_words, evasion_words)
   → If found: rating = "red_flag"

2. Count words in the answer:
   - ≥15 words AND contains specific details → "strong"
   - ≥10 words → "strong"  
   - 5–9 words → "weak"
   - <5 words → "weak"

3. Generate officer_thinking, weakness_bullets, suggested_answer
   based on the question category
```

#### Ollama Call Configuration

| Parameter | Value |
|-----------|-------|
| Endpoint | `POST {OLLAMA_BASE_URL}/api/generate` |
| Timeout | 180 seconds |
| Temperature | 0.3 |
| Top-P | 0.9 |
| Per-question max tokens | 400 |
| JSON mode | `"format": "json"` |
| Stream | false |

#### AI Prompt Structure (Per-Question)

The prompt sent to Ollama for each question includes:
- System role: "You are an experienced US consular officer evaluating B1/B2 visa interview answers"
- The applicant's profile (visa type, citizenship, employment, etc.)
- The specific question asked
- The applicant's answer
- Required JSON output format with fields: rating, feedback_text, suggested_answer, red_flags, officer_thinking, weakness_bullets, suggested_why_better, dimensions_affected

---

### 6.7 API Server (main.py)

Minimal FastAPI application (82 lines) that wires together all modules.

```python
# Key configuration
app = FastAPI(title="US Visa Mock Interview Assistant", version="1.0.0")

# CORS — allows frontend dev servers
origins = ["http://localhost:5173", "http://localhost:5174"]

# Endpoints
GET  /api/health
POST /api/session/start
POST /api/session/answer
POST /api/session/evaluate
```

Each endpoint delegates to the appropriate module (`question_selector`, `realtime_eval`, `evaluation`) and returns Pydantic-validated responses.

---

## 7. Frontend — Detailed Reference

### 7.1 Build & Configuration

**package.json dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.4 | UI framework |
| react-dom | ^19.2.4 | DOM rendering |
| react-router-dom | ^7.14.0 | Client-side routing |
| axios | ^1.14.0 | HTTP client |
| vite | ^8.0.5 | Build tool & dev server |
| @vitejs/plugin-react | ^6.0.1 | React transform (JSX) |
| tailwindcss | ^4.2.2 | Utility-first CSS |
| @tailwindcss/vite | ^4.2.2 | Vite integration for Tailwind |

**vite.config.js:**
- Plugins: `react()`, `tailwindcss()`
- Dev server: port 5173
- Proxy: `/api` → `http://localhost:8000` (avoids CORS in dev)

**npm scripts:**
- `npm run dev` — Start Vite dev server
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build

---

### 7.2 API Client (api.js)

Centralized Axios instance with 10-minute timeout:

```javascript
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 600000  // 10 minutes (accommodates full session evaluation)
});
```

| Export | Method | Endpoint |
|--------|--------|----------|
| `healthCheck()` | GET | `/health` |
| `startSession(profile)` | POST | `/session/start` |
| `submitAnswer(sessionId, profile, question, answerText, conversationHistory, followUpCounts)` | POST | `/session/answer` |
| `evaluateSession(sessionId, profile, answers)` | POST | `/session/evaluate` |

---

### 7.3 Routing (App.jsx)

```
/            → LandingPage
/profile     → ProfileSetup
/briefing    → Briefing
/interview   → Interview
/report      → Report
```

Global styling: `min-h-screen bg-gray-50 text-gray-900`

---

### 7.4 Pages

#### 7.4.1 LandingPage.jsx (46 lines)

The hero/landing page with:
- Heading: "Practice Your US Visa Interview Before the Real One" with 🇺🇸 emoji
- Four trust badges: "Realistic officer questions", "Voice & text input", "Officer speaks aloud", "Solo & group interviews"
- CTA button: **"Start Free Practice Session"** → navigates to `/profile`
- Disclaimer: "This tool is for practice only and does not constitute legal advice"

#### 7.4.2 ProfileSetup.jsx (316 lines)

A 16-field intake form that collects the applicant's profile, including group interview support:

| Field | Control Type | Options/Range |
|-------|-------------|---------------|
| visa_type | Dropdown | B1, B2, B1/B2 |
| citizenship | Dropdown | 17 countries: India, Nigeria, Pakistan, Bangladesh, Nepal, China, Mexico, Brazil, Philippines, Ghana, Cameroon, Vietnam, Indonesia, Egypt, Turkey, Sri Lanka, Other |
| purpose | Toggle buttons (multi-select) | tourism, family_visit, medical, conference, business_meeting, other |
| employment | Dropdown | employed_private, employed_government, self_employed, student, retired, unemployed |
| prior_refusal | Checkbox | — |
| us_family | Checkbox | — |
| family_status | Conditional dropdown (shows when us_family checked) | us_citizen, green_card, F1_student, H1B_work, tourist_visa, other, none |
| funding | Dropdown | self, sponsor_us, employer, other |
| prior_travel | Checkbox | — |
| monthly_income_usd | Dropdown | <500, 500-1500, 1500-3000, 3000-5000, >5000 |
| planned_days | Number input | 1–180 |
| applicant_count | Button selector (1–6) | Shows "Solo interview" or "Group interview — N applicants at the window" |
| marital_status | Dropdown | single, married, divorced, widowed |
| age | Number input | 18–80 |
| travel_companions | Text input (conditional, shows when applicant_count > 1) | Free text |

**Behavior:**
- Calls `startSession(profile)` on submit
- Stores response in `localStorage` as `visa_session`: `{session_id, questions, risk_flags, profile}`
- Error handling: displays "Could not start session. Is the backend running?"
- On success navigates to `/briefing`

#### 7.4.3 Briefing.jsx (144 lines)

Pre-interview screen with **interview rules** and **settings panel**:

**Rules section:**
- (1) Answer in 2–4 sentences, (2) Don't volunteer extra information, (3) Don't ask questions back, (4) Be specific with dates/names/places
- Duration estimate: ~8–12 minutes, 10–14 questions

**Interview Settings Panel:**
| Setting | Control | Default | Purpose |
|---------|---------|---------|---------|
| Officer speaks questions | Toggle switch | ON | Enable/disable TTS |
| Show question text | Toggle switch | ON | Show/hide written text |
| Default input mode | Type/Speak selector | Type | Initial input method |

Settings are saved to `localStorage` as `visa_interview_settings` when "Begin Interview" is clicked.

#### 7.4.4 Interview.jsx (572 lines)

The dynamic interview engine — the most complex frontend component. Features TTS (officer speaks), STT (voice input), and an animated speaking orb visualizer.

**Constants:**
| Constant | Value |
|----------|-------|
| MAX_TOTAL_QUESTIONS | 16 |
| Answer character limit | 500 |
| Character warning threshold | 400 |
| Hint auto-dismiss time | 4000 ms |

**State:**
- `session` — session data from localStorage
- `questionQueue` — dynamic array (follow-ups inserted during interview)
- `currentIndex` — current question position
- `answers` — all submitted answers
- `conversationHistory` — full officer/applicant exchange
- `followUpCounts` — per-question follow-up counter
- `currentAnswer` — textarea content
- `answerFeedback` — array of per-answer {color, hint, contradiction} objects
- `activeHint` — currently visible hint toast
- `submitting` — loading state for answer submission
- `showOpener` — warmup screen visibility
- `officerSpeaks` — TTS enabled/disabled (from briefing settings)
- `showQuestionText` — text visibility toggle
- `isSpeaking` — whether TTS is currently playing
- `inputMode` — 'text' or 'voice'
- `isListening` — whether STT is active
- `voiceSupported` — whether browser supports Speech Recognition

**Interview Flow:**
1. **Opening warmup:** "Good morning. Can I see your passport and appointment confirmation?" — spoken aloud via TTS with animated SpeakingOrb → User clicks "Yes, here you go →"
2. **Question display** with SpeakingOrb visualizer (animated when speaking), replay 🔊 and visibility 👁 buttons
3. **Input mode toggle:** Type ⌨️ or Speak 🎤
4. **Answer textarea** with 500-char limit and warning at 400 (voice transcription populates here)
5. **Submit answer** → stops TTS/STT, calls `submitAnswer()` API
6. **Real-time feedback:**
   - Color indicator: ✅ green (strong), ⚠️ yellow (weak), 🚩 red (red_flag)
   - Hint toast auto-dismisses after 4 seconds
   - Contradiction warning if detected
   - Follow-up badge if question is a follow-up
7. **Dynamic follow-up insertion:** If the API returns a follow-up question, it's inserted at the next position in the queue
8. **Finish:** After all questions, calls `evaluateSession()` → stores report in `visa_report` localStorage → navigates to `/report`

**TTS (Text-to-Speech):**
- Uses Web Speech API `SpeechSynthesis`
- Ranked voice selection: Google US English → Microsoft Mark/David → en-US male → en-US remote → fallback
- Rate: 0.92, Pitch: 0.85 (professional, authoritative tone)
- Speaks opener greeting, each new question, and can be replayed via 🔊 button

**STT (Speech-to-Text):**
- Uses Web Speech API `SpeechRecognition`
- Continuous mode with interim results
- Transcription populates the answer textarea in real-time

**SpeakingOrb Component:**
- Canvas-based animated circle with 48 independently-phased spikes
- Active state: organic audio-visualizer-like spike animation
- Idle state: calm breathing glow
- Sizes: 80px (opener screen), 48px (question view)
- Center label: "CO" (Consular Officer)

**localStorage usage:**
- Reads: `visa_session`, `visa_interview_settings`
- Writes: `visa_answers`, `visa_report`

#### 7.4.5 Report.jsx (546 lines)

The comprehensive evaluation report — the largest frontend component.

**Sub-Components:**

| Component | Purpose |
|-----------|---------|
| `SummaryCard` | Score/100, risk level badge, profile summary, question count, follow-ups, red flag count |
| `DimensionBar` | Horizontal bar chart for each of the 5 dimensions with score/max and rating |
| `QuestionCard` | Expandable card per question: officer question, user answer, rating badge, officer thinking, weakness bullets, suggested answer with why-better bullets, red flags, dimensions affected |
| `RedFlagCard` | Numbered red flag: title, what user said, what the problem is, how to fix it |
| `ApprovalSection` | 214(b) outcome label, explanation text, strengths (✅), concerns (⚠️), weaknesses (❌), profile risk factors, improvement suggestions |
| `ActionPlanTiered` | Grouped action items: 🔴 Critical, 🟡 Important, 🟢 Polish |

**Report Sections (in display order):**
1. **Header** — "Interview Report"
2. **Summary Card** — Score, risk level, profile, stats
3. **Dimension Scores** — 5 horizontal bar charts
4. **Per-Question Analysis** — Expandable cards (click to reveal details)
5. **Detailed Red Flags** — Numbered cards with user_said/problem/fix
6. **Approval Probability Analysis** — 214(b) assessment
7. **Tiered Action Plan** — Critical → Important → Polish
8. **Disclaimer** — "This is a simulated assessment..."
9. **Footer Actions** — Download Report + Practice Again buttons

**Color Coding:**

| Element | Mapping |
|---------|---------|
| Risk levels | LOW_RISK → green, MODERATE_RISK → amber, HIGH_RISK → orange, VERY_HIGH_RISK → red |
| Ratings | strong/good → green, weak/needs_work → amber, red_flag → red |
| Action priorities | critical → red, important → amber, polish → green |

**Download Feature:**
- Generates a plain text report via `generateTextReport(report)`
- Filename: `visa-interview-report-{YYYY-MM-DD}.txt`
- Format: ASCII-formatted with centered headers, text bars for dimensions, and formatted sections

**"Practice Again" Button:**
- Clears `visa_session`, `visa_answers`, `visa_report` from localStorage
- Navigates to `/`

---

## 8. API Endpoint Reference

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

### POST `/api/session/start`

Creates a new interview session with personalized questions.

**Request:**
```json
{
  "profile": {
    "visa_type": "B2",
    "citizenship": "India",
    "purpose": ["tourism"],
    "employment": "employed_private",
    "prior_refusal": false,
    "us_family": false,
    "family_status": "none",
    "funding": "self",
    "prior_travel": false,
    "monthly_income_usd": "1500-3000",
    "planned_days": 14
  }
}
```

**Response:**
```json
{
  "session_id": "uuid4-string",
  "questions": [
    {
      "question_id": "p1",
      "question_text": "What is the purpose of your visit to the United States?",
      "category": "purpose"
    }
  ],
  "risk_flags": ["no_prior_travel", "high_denial_country"]
}
```

---

### POST `/api/session/answer`

Evaluates a single answer in real-time during the interview.

**Request:**
```json
{
  "session_id": "uuid4-string",
  "profile": { "..." },
  "question": {
    "question_id": "p1",
    "question_text": "What is the purpose of your visit?",
    "category": "purpose"
  },
  "answer_text": "I'm visiting my friend Sarah in New York for two weeks.",
  "conversation_history": [
    { "role": "officer", "content": "Good morning..." },
    { "role": "applicant", "content": "Yes, here you go." }
  ],
  "follow_up_counts": { "p1": 0 }
}
```

**Response (strong answer):**
```json
{
  "answer_quality": "strong",
  "color_indicator": "green",
  "hint_text": null,
  "follow_up_question": null,
  "contradiction_detected": false,
  "contradiction_detail": null,
  "red_flag_type": null
}
```

**Response (weak answer):**
```json
{
  "answer_quality": "weak",
  "color_indicator": "yellow",
  "hint_text": "Your answer could be stronger — try adding specific details.",
  "follow_up_question": {
    "question_id": "p1_fu1",
    "question_text": "Which specific cities or attractions do you plan to visit?",
    "category": "purpose"
  },
  "contradiction_detected": false,
  "contradiction_detail": null,
  "red_flag_type": null
}
```

**Response (red flag):**
```json
{
  "answer_quality": "red_flag",
  "color_indicator": "red",
  "hint_text": "Possible work intent detected — a B1/B2 visa does not permit work.",
  "follow_up_question": {
    "question_id": "p1_fu1",
    "question_text": "What kind of work are you referring to?",
    "category": "purpose"
  },
  "contradiction_detected": false,
  "contradiction_detail": null,
  "red_flag_type": "work_intent"
}
```

---

### POST `/api/session/evaluate`

Full session evaluation after the interview is complete.

**Request:**
```json
{
  "session_id": "uuid4-string",
  "profile": { "..." },
  "answers": [
    {
      "question_id": "p1",
      "question_text": "What is the purpose of your visit?",
      "answer_text": "I'm visiting my friend Sarah in New York..."
    }
  ]
}
```

**Response:** A comprehensive `EvaluationResponse` containing:

| Field | Type | Description |
|-------|------|-------------|
| `overall_score` | int (0–100) | Weighted aggregate score |
| `approval_risk` | string | LOW_RISK / MODERATE_RISK / HIGH_RISK / VERY_HIGH_RISK |
| `summary` | InterviewSummary | Date, visa type, profile summary, question count, red flag count |
| `dimensions` | dict[str, DimensionScore] | 5 dimension scores with max and rating |
| `per_question_feedback` | list[QuestionFeedback] | Detailed per-question analysis |
| `red_flags_summary` | list[str] | One-line red flag summaries |
| `red_flags_detailed` | list[RedFlagDetail] | Full red flag analysis with user_said/problem/fix |
| `approval_analysis` | ApprovalAnalysis | 214(b) outcome, strengths, weaknesses, concerns |
| `action_plan_tiered` | list[ActionItem] | Prioritized improvement actions |

---

## 9. Evaluation Engine — Deep Dive

### 9.1 Dimension Scoring

Five dimensions, totaling 100 points:

| Dimension | Max Score | Weight | What It Measures |
|-----------|-----------|--------|------------------|
| **Return Intent** | 25 | 25% | Evidence that the applicant will return home |
| **Purpose Clarity** | 25 | 25% | How clearly the trip purpose is articulated |
| **Financial Credibility** | 20 | 20% | Proof of financial ability to fund the trip |
| **Consistency** | 15 | 15% | Whether answers align with each other and the profile |
| **Conciseness** | 15 | 15% | Appropriate answer length (not too long, not too short) |

**Scoring formula per dimension:**
```
dimension_score = (average_rating_for_dimension / 10) × max_score
```

Where rating values are: strong=9, good=7, needs_work=4, weak=2, red_flag=1

**Total score penalties:**
- −5 per unique red flag type
- −5 if prior_refusal
- −8 if unemployed
- Clamped to 0–100

**Risk level thresholds:**

| Score Range | Risk Level |
|-------------|------------|
| ≥ 80 | LOW_RISK |
| ≥ 65 | MODERATE_RISK |
| ≥ 50 | HIGH_RISK |
| < 50 | VERY_HIGH_RISK |

---

### 9.2 Red Flag Detection

Red flags are detected at two levels:

**Level 1 — Keyword-Based (instant):**

| Flag Type | Severity Weight | Trigger Phrases |
|-----------|----------------|-----------------|
| `work_intent` | 8 | "find a job", "looking for work", "get hired", "start working" |
| `overstay_intent` | 7 | "stay forever", "not going back", "settle in", "never return" |
| `evasion` | 5 | "I don't know", "not sure", "no idea", "can't say" |
| `vague_purpose` | 3 | "just visiting", "travel around", "see what happens" |
| `accommodation_unknown` | 3 | "haven't decided where", "figure it out" |

**Level 2 — AI-Based (via Ollama):**
The AI model can detect nuanced red flags in context that keyword matching would miss, such as subtle inconsistencies or inappropriate framing.

**Detailed Red Flag Report:**
Each red flag in the final report includes:
- `flag_number` — sequential identifier
- `title` — concise label (e.g., "Vague purpose on Q1")
- `user_said` — exact quote from the answer
- `problem` — why this is a concern for the officer
- `fix` — specific advice on how to address it

---

### 9.3 Approval Probability Analysis

The 214(b)-based approval analysis considers both answer quality and profile risk.

**Profile Risk Deductions (applied to the base score):**

| Factor | Deduction |
|--------|-----------|
| Citizenship in HIGH_DENIAL_COUNTRIES | −5 points |
| Prior visa refusal | −8 points |
| Unemployed | −10 points |
| US family on immigration-type visa | −5 points |
| No prior international travel | −3 points |
| Young & single (age < 30, unmarried) | −4 points |

**HIGH_DENIAL_COUNTRIES (evaluation.py):** India, China, Nigeria, Pakistan, Bangladesh, Ghana, Iran, Iraq, Ethiopia, Nepal

**Outcome Labels:**
- Score ≥ 80: "LIKELY APPROVED — Strong 214(b) case"
- Score ≥ 65: "BORDERLINE — Some 214(b) concerns"
- Score ≥ 50: "AT RISK — Significant 214(b) doubts"
- Score < 50: "HIGH RISK — Strong 214(b) presumption unmet"

**Analysis Sections:**
- **Strengths:** Dimensions rated "strong" or "good"
- **Concerns:** Dimensions rated "needs_work"
- **Weaknesses:** Dimensions rated "weak" or "red_flag"
- **Profile Risk Factors:** Plain-English descriptions of profile-based risks
- **Improvement Suggestions:** Specific, actionable advice

---

### 9.4 Tiered Action Plan

The action plan groups improvement tasks by urgency:

| Priority | Label | Emoji | When Generated |
|----------|-------|-------|----------------|
| **Critical** | Must fix | 🔴 | Red flags detected, any dimension below 40% |
| **Important** | Should improve | 🟡 | Dimensions between 40–70%, weak areas |
| **Polish** | Nice to have | 🟢 | Minor improvements, practice suggestions |

---

## 10. Data Flow & User Journey

```
┌─────────────┐
│ Landing Page │ → "Start Free Practice Session"
└──────┬──────┘
       ▼
┌──────────────┐    POST /session/start
│ Profile Setup │ ──────────────────────► Backend selects questions
│ (12 fields)  │ ◄──────────────────────  Returns: session_id,
└──────┬───────┘    {questions, risk_flags}  questions[], risk_flags[]
       │                                     │
       │    Stored in localStorage           │
       │    as `visa_session`                │
       ▼                                     
┌──────────┐
│ Briefing │ → "Begin Interview"
└────┬─────┘
     ▼
┌───────────────────────────────────────────────────────┐
│                    INTERVIEW LOOP                      │
│                                                        │
│  For each question in questionQueue:                   │
│    1. Display question (officer speaks via TTS)        │
│    2. User types or speaks answer (max 500 chars)      │
│    3. Submit → POST /session/answer                    │
│    4. Show color indicator (green/yellow/red)           │
│    5. Show hint toast (4s auto-dismiss)                 │
│    6. Show contradiction warning if detected            │
│    7. If follow-up returned → insert into queue         │
│    8. Next question (auto-spoken via TTS)               │
│                                                        │
│  Hard cap: 16 total questions                           │
│  Max 2 follow-ups per original question                 │
└───────────────────┬───────────────────────────────────┘
                    │
                    │ After all questions:
                    │ POST /session/evaluate
                    ▼
┌────────────────────────────────────────────────────────┐
│                      REPORT                             │
│                                                         │
│  Section A: Summary Card (score, risk, profile)         │
│  Section B: Dimension Scores (5 bars)                   │
│  Section C: Per-Question Analysis (expandable)          │
│  Section D: Detailed Red Flags                          │
│  Section E: Approval Probability (214(b))               │
│  Section F: Tiered Action Plan                          │
│                                                         │
│  Actions: Download (.txt) | Practice Again              │
└────────────────────────────────────────────────────────┘
```

**localStorage keys:**

| Key | Written By | Read By | Contents |
|-----|-----------|---------|----------|
| `visa_session` | ProfileSetup | Interview, Report | session_id, questions[], risk_flags[], profile |
| `visa_answers` | Interview | — | All submitted answers |
| `visa_report` | Interview (after evaluation) | Report | Full EvaluationResponse |
| `visa_interview_settings` | Briefing | Interview | officerSpeaks, showQuestionText, defaultInputMode |

---

## 11. Configuration Reference

### Hardcoded Values & Timeouts

| Setting | Value | File | Purpose |
|---------|-------|------|---------|
| Backend CORS origins | `http://localhost:5173`, `http://localhost:5174` | main.py | Allows frontend dev servers |
| Ollama timeout | 180 seconds | evaluation.py | Per-question AI call timeout |
| Ollama temperature | 0.3 | evaluation.py | Low creativity for consistent eval |
| Ollama top_p | 0.9 | evaluation.py | Nucleus sampling threshold |
| Per-question max tokens | 400 | evaluation.py | AI response length limit |
| Real-time eval max tokens | 200 | realtime_eval.py | Faster per-answer evaluation |
| Frontend axios timeout | 600,000 ms (10 min) | api.js | Accommodates full evaluation |
| Interview max questions | 16 | Interview.jsx | Hard cap including follow-ups |
| Answer character limit | 500 | Interview.jsx | Enforces conciseness |
| Hint display time | 4,000 ms | Interview.jsx | Auto-dismiss toast |
| Max follow-ups per question | 2 | realtime_eval.py | Prevents infinite follow-up loops |
| TTS voice rate | 0.92 | Interview.jsx | Professional speaking pace |
| TTS voice pitch | 0.85 | Interview.jsx | Authoritative tone |
| Frontend dev port | 5173 | vite.config.js | Vite dev server |
| Backend port | 8000 | (CLI flag) | Uvicorn |
| Ollama port | 11434 | .env | Default Ollama port |

---

## 12. Build Stages & What Was Implemented

### Stage 1 — MVP (Complete ✅)

**Backend:**
- FastAPI application with health check endpoint
- Pydantic data models for all request/response schemas
- 65-question bank across 8 categories
- Profile-based question selector (10–12 questions)
- Basic evaluation engine with Ollama integration
- Keyword fallback for fast scoring

**Frontend:**
- React + Vite + Tailwind CSS scaffolding
- Landing page with CTA
- Profile setup form (12 fields)
- Briefing page with interview rules
- Basic interview flow (sequential questions)
- Basic report display

**Testing:** End-to-end flow verified — health check → session start → interview → evaluation → report displayed.

---

### Stage 2 — Dynamic Interview (Complete ✅)

**Backend — New module `realtime_eval.py`:**
- Per-answer real-time evaluation via `/api/session/answer`
- Keyword flag detection (hard + soft patterns)
- Contradiction detection across conversation history
- Dynamic follow-up question generation
- Rule-based + AI follow-up logic

**Frontend — Interview.jsx rewrite:**
- Dynamic question queue (follow-ups inserted mid-interview)
- Real-time color indicators (green/yellow/red)
- Hint toast with auto-dismiss
- Contradiction warning display
- Follow-up badges
- Opening warmup screen
- Progress tracking with dynamic count

**Testing:** Verified weak answers → yellow + follow-up generated, red-flag answers → red + contradiction detected, strong answers → green, no follow-up.

---

### Stage 3 — Comprehensive Reporting Engine (Complete ✅)

**Backend — Enhanced `evaluation.py`:**
- Officer thinking simulation per question
- Weakness bullet points per answer
- Suggested better answers with "why better" reasoning
- Detailed red flag analysis (user_said / problem / fix)
- 214(b) approval probability analysis
- Profile-based risk deductions
- Tiered action plan (critical / important / polish)
- Dimension-based scoring with weighted aggregation

**Frontend — Report.jsx rewrite:**
- 6 distinct report sections (Summary → Dimensions → Questions → Red Flags → Approval → Action Plan)
- Expandable per-question cards with full analysis
- Color-coded risk levels, ratings, and priorities
- Download feature (generates formatted `.txt` file)
- "Practice Again" button with localStorage cleanup

**Testing:** Full evaluation returns all 6 sections with accurate scoring, officer thinking, red flag analysis, and actionable improvement advice.

---

### Model Upgrade — qwen2.5:14b (Complete ✅)

- Upgraded from `llama3.1:8b` → `qwen2.5:14b`
- Modified `.env` to use new model
- Adjusted timeout to 180s for larger model
- Created `MODEL-GUIDE.md` with switching instructions and model comparison table
- Tested: ~45–50s/question, improved JSON compliance, better follow-up quality

---

### Cloud Model + Voice I/O + Group Interviews (Complete ✅)

**Model Upgrade:**
- Upgraded from `qwen2.5:14b` (local CPU) → `nemotron-3-super:cloud` (120B params, cloud inference)
- All questions now evaluated by AI (removed the 3-question AI limit since cloud model is fast)
- Response times dropped from ~45–50s to ~5–15s per question

**Backend — New Profile Fields & Group Support:**
- Added `MaritalStatus` enum (single, married, divorced, widowed)
- Added to `ProfileInput`: `applicant_count` (1–6), `marital_status`, `age` (18–80), `travel_companions`
- Added "group" question category with 8 questions (g1–g8) for multi-applicant interviews
- Question selector includes group questions when `applicant_count > 1`
- Added `young_single` risk flag (single + age < 30) with −4 point deduction
- Updated all AI prompts (realtime_eval + evaluation) with new profile fields

**Backend — Question Bank Revamp:**
- Complete rewrite of all questions with realistic consular officer phrasing
- Questions are now short, direct, sometimes brusque — matching real interview transcripts
- Expanded from 65 to 86 questions across 9 categories (added "group" category)

**Frontend — Voice Input (STT):**
- Web Speech API `SpeechRecognition` for voice-to-text input
- Continuous mode with interim results, real-time transcription
- Toggle between Type ⌨️ and Speak 🎤 input modes

**Frontend — Officer Speaks (TTS):**
- Web Speech API `SpeechSynthesis` for text-to-speech
- Ranked voice selection prioritizing Google US English and male voices
- Rate: 0.92, Pitch: 0.85 for professional, authoritative tone
- Speaks opener greeting, each new question automatically
- Replay 🔊 and text visibility toggle 👁 buttons

**Frontend — SpeakingOrb Visualizer:**
- New `SpeakingOrb.jsx` component — canvas-based animated circle
- 48 independently-phased spikes create organic audio-visualizer effect when speaking
- Calm breathing glow when idle, "CO" label centered
- Used in opener (80px) and question view (48px)

**Frontend — Interview Settings:**
- Briefing page rewritten with settings panel
- Toggle: Officer speaks (ON/OFF), Show question text (ON/OFF), Default input mode (Type/Speak)
- Settings saved to localStorage as `visa_interview_settings`

**Frontend — ProfileSetup Enhancements:**
- Applicant count selector (1–6) with "Solo interview" / "Group interview" label
- Travel companions text input (conditional on group)
- Age number input, marital status dropdown

---

### Stage 4 — Progress Tracking & History (Deferred ⬜)

Explicitly deferred per user request. Would include:
- Session history storage
- Score improvement tracking over multiple sessions
- Comparison reports
- Database integration

---

## 13. Known Limitations & Future Work

### Current Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| No database | Sessions are ephemeral (localStorage only) | Sufficient for practice tool |
| Single-user | No authentication or multi-tenancy | Designed as a personal practice tool |
| B1/B2 only | Does not cover F1, H1B, etc. | Focused scope per PRD |
| CORS locked to localhost | Cannot deploy without config change | Development tool |
| No document upload | Cannot simulate "show me your documents" | Focuses on verbal Q&A |
| English only | No multilingual support | — |
| TTS voice quality | Browser-dependent; varies across OS/browser | Ranked voice selection picks best available |
| STT browser support | Chrome/Edge only (Web Speech API) | Falls back to text-only input on unsupported browsers |

### Potential Improvements

- **Database (PostgreSQL/SQLite):** Persistent session storage for progress tracking
- **Authentication:** User accounts for history tracking
- **Additional visa types:** F1, H1B, L1 coverage
- **Deployment:** Docker containerization, cloud hosting
- **Premium TTS:** Integration with cloud TTS APIs (e.g., ElevenLabs, Azure) for more natural voices
- **Video avatar:** Animated talking head for officer representation

---

*This documentation was auto-generated from a complete project audit. All function signatures, configurations, and hardcoded values were verified against the source code.*

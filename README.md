# 🇺🇸 US Visa Mock Interview Assistant

An AI-powered web app that simulates a real US B1/B2 visa consular interview. Practice with a speaking AI officer, get real-time feedback on every answer, and receive a detailed evaluation report.

![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Ollama](https://img.shields.io/badge/Ollama-Cloud-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Realistic consular officer questions** — 86 questions across 9 categories, phrased like a real officer
- **Officer speaks aloud** — Text-to-Speech with animated speaking orb visualizer
- **Voice & text input** — Answer by speaking (STT) or typing
- **Real-time feedback** — Color-coded answer quality (green/yellow/red), hints, contradiction detection
- **Dynamic follow-ups** — Weak answers trigger officer follow-up questions
- **Solo & group interviews** — Supports 1–6 applicants at the window
- **Comprehensive report** — Score out of 100, 5-dimension breakdown, red flag analysis, 214(b) approval probability, tiered action plan
- **Cloud AI** — Powered by `nemotron-3-super:cloud` (120B parameters) via Ollama

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| **Python** | 3.10+ |
| **Node.js** | 18+ |
| **Ollama** | Latest ([install](https://ollama.com)) |
| **Browser** | Chrome or Edge (required for voice features) |

---

## Quick Start

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd VISA
```

### 2. Set up the backend

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install fastapi uvicorn httpx python-dotenv pydantic
```

### 3. Pull the AI model

```bash
ollama pull nemotron-3-super:cloud
```

> **Using a different model?** Edit `backend/.env` and change `OLLAMA_MODEL`. See [MODEL-GUIDE.md](MODEL-GUIDE.md) for options.

### 4. Set up the frontend

```bash
cd frontend
npm install
cd ..
```

### 5. Start everything

Open **three terminals**:

**Terminal 1 — Ollama** (skip if running as a system service):
```bash
ollama serve
```

**Terminal 2 — Backend:**
```bash
source venv/bin/activate
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Open the app

Go to **http://localhost:5173** in Chrome or Edge.

---

## How to Use

### Step 1: Fill in your profile

Click **"Start Free Practice Session"** on the landing page. Fill in your applicant profile:

- Visa type, citizenship, purpose of visit
- Employment, income, funding source
- Prior refusals, US family connections
- **Age, marital status** (used for risk assessment)
- **Number of applicants** (1–6 for group interviews)

Click **"Start Interview"** to generate your personalized question set.

### Step 2: Configure interview settings

On the **Briefing** page, adjust your preferences:

| Setting | What it does |
|---------|-------------|
| **Officer speaks questions** | Toggle TTS on/off — the AI reads questions aloud |
| **Show question text** | Show/hide the written question (for listening practice) |
| **Default input mode** | Start with typing or voice input |

Click **"Begin Interview"** when ready.

### Step 3: Take the interview

- The **consular officer** (animated blue orb) greets you and asks questions
- Answer each question by **typing** or **speaking** (toggle with the ⌨️/🎤 buttons)
- Keep answers to **2–4 sentences** — just like a real interview (500 character limit)
- Press **Enter** or click **Submit Answer**
- Watch for real-time feedback:
  - 🟢 **Green** — Good answer
  - 🟡 **Yellow** — Could be stronger (hint shown)
  - 🔴 **Red** — Red flag detected
- The officer may ask **follow-up questions** if your answer is weak
- Use the **🔊** button to replay a question, **👁** to toggle text visibility

### Step 4: Get your report

After all questions, click **"Get My Report"**. You'll receive:

1. **Overall score** (0–100) with risk level
2. **5 dimension scores** — Return Intent, Purpose Clarity, Financial Credibility, Consistency, Conciseness
3. **Per-question analysis** — Officer thinking, weaknesses, suggested better answers
4. **Red flag breakdown** — What you said, why it's a problem, how to fix it
5. **214(b) approval probability** — Strengths, concerns, profile risk factors
6. **Tiered action plan** — Critical → Important → Polish items

Click **"Download Report"** to save as a `.txt` file, or **"Practice Again"** to start over.

---

## Project Structure

```
VISA/
├── backend/
│   ├── .env                  # AI model configuration
│   ├── main.py               # FastAPI endpoints
│   ├── models.py             # Pydantic data models
│   ├── question_bank.py      # 86 realistic interview questions
│   ├── question_selector.py  # Profile-based question selection
│   ├── realtime_eval.py      # Per-answer real-time evaluation
│   └── evaluation.py         # Full session evaluation engine
│
├── frontend/
│   └── src/
│       ├── App.jsx            # Route definitions
│       ├── api.js             # Axios API client
│       ├── components/
│       │   └── SpeakingOrb.jsx  # Animated officer visualizer
│       └── pages/
│           ├── LandingPage.jsx
│           ├── ProfileSetup.jsx
│           ├── Briefing.jsx
│           ├── Interview.jsx
│           └── Report.jsx
│
├── DOCUMENTATION.md          # Full technical documentation
├── MODEL-GUIDE.md            # Model switching guide
├── VISA-PRD.md               # Product requirements document
└── README.md                 # This file
```

---

## Configuration

### Backend (`backend/.env`)

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=nemotron-3-super:cloud
```

### Switching AI models

See [MODEL-GUIDE.md](MODEL-GUIDE.md) for a full comparison table and instructions. Quick steps:

```bash
ollama pull <model_name>
# Edit backend/.env → OLLAMA_MODEL=<model_name>
# Backend auto-restarts if using --reload
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| POST | `/api/session/start` | Create interview session with personalized questions |
| POST | `/api/session/answer` | Submit answer for real-time evaluation |
| POST | `/api/session/evaluate` | Generate full evaluation report |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Voice I/O | Web Speech API (SpeechSynthesis + SpeechRecognition) |
| Backend | FastAPI, Python 3.13 |
| AI Model | nemotron-3-super:cloud (120B) via Ollama |
| Database | None (localStorage + in-memory) |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Could not start session" | Make sure the backend is running on port 8000 and Ollama is serving |
| No voice/speak buttons | Use Chrome or Edge — Firefox/Safari don't support Web Speech API |
| Officer doesn't speak | Check browser TTS settings; ensure "Officer speaks" is ON in Briefing |
| Slow responses | If using a local model, responses take ~45–60s. Cloud model is ~5–15s |
| Blank interview page | Open browser console (F12) and check for errors. Restart the frontend |
| Report takes too long | Cloud model evaluates all questions (~1–2 min total). Local models may need 5+ min |

---

## Browser Support

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Core interview | ✅ | ✅ | ✅ | ✅ |
| Officer speaks (TTS) | ✅ | ✅ | ✅ | ✅ |
| Voice input (STT) | ✅ | ✅ | ❌ | ❌ |

---

## Disclaimer

This tool is for **practice purposes only**. It does not constitute legal advice, does not guarantee visa approval, and is not affiliated with any government agency. Results are AI-generated simulations.

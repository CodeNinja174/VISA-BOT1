# Model Switching Guide — Visa Interview Assistant

## Current Setup
- **Active Model**: `nemotron-3-super:cloud` (120B params)
- **Provider**: Ollama (cloud inference)
- **Hardware**: 62GB RAM, Quadro P400 2GB (display only)
- **Config File**: `backend/.env`
- **Performance**: ~5–15s per question (cloud inference)

## Model History

| Date | Model | Params | Type | Notes |
|------|-------|--------|------|-------|
| Initial | `llama3.1:8b` | 8B | Local CPU | First model, decent quality |
| Mid 2025 | `qwen2.5:14b` | 14B | Local CPU | Better JSON compliance, ~45–50s/question |
| Apr 2026 | `nemotron-3-super:cloud` | 120B | Cloud | **Current** — fast, all questions AI-evaluated |

## How to Switch Models

### Step 1: Pull the new model
```bash
ollama pull <model_name>
```

### Step 2: Update config
Edit `backend/.env` and change:
```
OLLAMA_MODEL=<model_name>
```

### Step 3: Restart backend
```bash
cd backend
# If using uvicorn with --reload, it auto-restarts on .env change
# Otherwise:
pkill -f "uvicorn main:app"
source ../venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Step 4: Verify
```bash
curl -s http://localhost:8000/api/health
# Then test an evaluation call
```

## Recommended Models (CPU, 62GB RAM)

| Model | Pull Command | RAM | Speed/Question | JSON Quality | Overall Quality | Notes |
|---|---|---|---|---|---|---|
| **nemotron-3-super:cloud** | `ollama pull nemotron-3-super:cloud` | N/A (cloud) | ~5-15s | Excellent | Outstanding | **Current — cloud inference, 120B params** |
| qwen2.5:14b | `ollama pull qwen2.5:14b` | ~9GB | ~60-70s | Excellent | Excellent | Previous model — best local balance |
| qwen2.5:32b | `ollama pull qwen2.5:32b` | ~19GB | ~2-3min | Excellent | Outstanding | Best local quality, but slow |
| qwen2.5:7b | `ollama pull qwen2.5:7b` | ~4.7GB | ~35s | Very Good | Good | Faster, lower quality |
| mistral-small:22b | `ollama pull mistral-small:22b` | ~13GB | ~90s | Good | Very Good | Good alternative to 32b |
| gemma2:9b | `ollama pull gemma2:9b` | ~5.4GB | ~40s | Good | Good+ | Google's model |
| llama3.1:8b | `ollama pull llama3.1:8b` | ~4.9GB | ~37s | Decent | Good | Original model |
| llama3.1:70b | `ollama pull llama3.1:70b` | ~40GB | ~8-10min | Good | Excellent | Fits in RAM but very slow |

> **Note:** With the cloud model, all questions are now evaluated by AI (the previous 3-question AI limit was removed). If switching back to a local model, consider re-enabling the AI evaluation limit in `evaluation.py` for performance.

## Model Selection Criteria

### For this project, prioritize:
1. **JSON reliability** — The app parses structured JSON from every AI response. Models that hallucinate extra text around JSON break the parser.
2. **Instruction following** — Officer role-play, critique generation, and bullet-point analysis require strong instruction adherence.
3. **Speed** — Real-time per-answer evaluation (Stage 2) needs responses in reasonable time. Final report (Stage 3) can tolerate longer waits.

### Why Qwen2.5 family excels here:
- Best-in-class JSON output compliance at every size
- Strong structured reasoning (bullet points, multi-field JSON)
- Excellent at role-play and perspective-taking (officer POV)
- Good at maintaining consistent output format across calls

### Why nemotron-3-super:cloud is the current choice:
- 120B parameters — significantly better reasoning than local models
- Cloud inference eliminates hardware bottleneck
- Fast enough to evaluate ALL questions with AI (no keyword fallback needed)
- Excellent JSON compliance and instruction following

## Timeout Configuration

If switching to a slower model, update the timeout in `backend/evaluation.py`:
```python
# Line in _call_ollama function:
async with httpx.AsyncClient(timeout=120.0) as client:
#                                    ^^^^^ increase this
```

Recommended timeouts:
- 7B-9B models: `120.0` (2 min)
- 14B models: `180.0` (3 min)
- 22B-32B models: `300.0` (5 min)
- 70B models: `600.0` (10 min)

Also update the frontend timeout in `frontend/src/api.js`:
```javascript
timeout: 600000,  // in milliseconds — current setting (10 min)
```

## Managing Installed Models

```bash
# List installed models
ollama list

# Remove a model (free disk space)
ollama rm <model_name>

# Check model details
ollama show <model_name>

# Test a model interactively
ollama run <model_name>
# Then type a prompt and see the response quality

# Check Ollama is running
curl http://localhost:11434/api/tags
```

## If You Get a GPU Upgrade

If you later get a GPU with sufficient VRAM:

| GPU VRAM | Best Model | Speed Improvement |
|---|---|---|
| 8GB | qwen2.5:7b (full GPU) | ~5-8x faster |
| 12GB | qwen2.5:14b (partial offload) | ~3-4x faster |
| 16GB | qwen2.5:14b (full GPU) | ~8-10x faster |
| 24GB | qwen2.5:32b (partial offload) | ~4-5x faster |
| 48GB | qwen2.5:32b (full GPU) | ~10x faster |

Ollama automatically uses GPU when available. No config changes needed — just ensure NVIDIA drivers and CUDA are installed.

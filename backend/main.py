"""FastAPI main application — US Visa Mock Interview Assistant."""

import uuid
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import (
    SessionStartRequest,
    SessionStartResponse,
    SessionEvaluateRequest,
    AnswerSubmitRequest,
    AnswerSubmitResponse,
)
from question_selector import select_questions, compute_risk_flags
from evaluation import evaluate_session
from realtime_eval import evaluate_answer_realtime

app = FastAPI(
    title="US Visa Mock Interview Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/api/session/start", response_model=SessionStartResponse)
async def start_session(req: SessionStartRequest):
    session_id = str(uuid.uuid4())
    risk_flags = compute_risk_flags(req.profile)
    questions = select_questions(req.profile)

    return SessionStartResponse(
        session_id=session_id,
        questions=questions,
        risk_flags=risk_flags,
    )


@app.post("/api/session/evaluate")
async def evaluate(req: SessionEvaluateRequest):
    if not req.answers:
        raise HTTPException(status_code=400, detail="No answers provided")

    try:
        result = await evaluate_session(req.profile, req.answers)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@app.post("/api/session/answer", response_model=AnswerSubmitResponse)
async def submit_answer(req: AnswerSubmitRequest):
    """Evaluate a single answer in real-time and optionally return a follow-up."""
    if not req.answer_text.strip():
        raise HTTPException(status_code=400, detail="Answer text is empty")

    try:
        result = await evaluate_answer_realtime(
            profile=req.profile,
            question=req.question,
            answer_text=req.answer_text,
            conversation_history=req.conversation_history,
            follow_up_counts=req.follow_up_counts,
        )
        return AnswerSubmitResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Real-time evaluation failed: {str(e)}")

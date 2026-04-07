"""Pydantic models for the Visa Interview Assistant."""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class VisaType(str, Enum):
    B1 = "B1"
    B2 = "B2"
    B1_B2 = "B1/B2"


class EmploymentStatus(str, Enum):
    EMPLOYED_PRIVATE = "employed_private"
    EMPLOYED_GOVERNMENT = "employed_government"
    SELF_EMPLOYED = "self_employed"
    STUDENT = "student"
    RETIRED = "retired"
    UNEMPLOYED = "unemployed"


class FamilyStatus(str, Enum):
    US_CITIZEN = "us_citizen"
    GREEN_CARD = "green_card"
    F1_STUDENT = "F1_student"
    H1B_WORK = "H1B_work"
    TOURIST_VISA = "tourist_visa"
    OTHER = "other"
    NONE = "none"


class IncomeRange(str, Enum):
    BELOW_500 = "<500"
    R500_1500 = "500-1500"
    R1500_3000 = "1500-3000"
    R3000_5000 = "3000-5000"
    ABOVE_5000 = ">5000"


class FundingSource(str, Enum):
    SELF = "self"
    SPONSOR_US = "sponsor_us"
    EMPLOYER = "employer"
    OTHER = "other"


class PurposeOfVisit(str, Enum):
    TOURISM = "tourism"
    FAMILY_VISIT = "family_visit"
    MEDICAL = "medical"
    CONFERENCE = "conference"
    BUSINESS_MEETING = "business_meeting"
    OTHER = "other"


class ProfileInput(BaseModel):
    visa_type: VisaType = VisaType.B2
    citizenship: str = "India"
    purpose: list[PurposeOfVisit] = [PurposeOfVisit.TOURISM]
    employment: EmploymentStatus = EmploymentStatus.EMPLOYED_PRIVATE
    prior_refusal: bool = False
    us_family: bool = False
    family_status: FamilyStatus = FamilyStatus.NONE
    funding: FundingSource = FundingSource.SELF
    prior_travel: bool = False
    monthly_income_usd: IncomeRange = IncomeRange.R1500_3000
    planned_days: int = Field(default=14, ge=1, le=180)


class RiskProfile(BaseModel):
    profile: ProfileInput
    risk_flags: list[str] = []


class QuestionItem(BaseModel):
    question_id: str
    question_text: str
    category: str


class AnswerItem(BaseModel):
    question_id: str
    question_text: str
    answer_text: str


class SessionStartRequest(BaseModel):
    profile: ProfileInput


class SessionStartResponse(BaseModel):
    session_id: str
    questions: list[QuestionItem]
    risk_flags: list[str]


class SessionEvaluateRequest(BaseModel):
    session_id: str
    profile: ProfileInput
    answers: list[AnswerItem]


class ConversationEntry(BaseModel):
    role: str  # "officer" or "applicant"
    content: str


class AnswerSubmitRequest(BaseModel):
    session_id: str
    profile: ProfileInput
    question: QuestionItem
    answer_text: str
    conversation_history: list[ConversationEntry] = []
    follow_up_counts: dict[str, int] = {}  # question_id -> count of follow-ups so far


class AnswerSubmitResponse(BaseModel):
    answer_quality: str  # "strong", "weak", "red_flag"
    color_indicator: str  # "green", "yellow", "red"
    hint_text: Optional[str] = None
    follow_up_question: Optional[QuestionItem] = None
    contradiction_detected: bool = False
    contradiction_detail: Optional[str] = None
    red_flag_type: Optional[str] = None


class DimensionScore(BaseModel):
    score: int
    max: int
    rating: str  # "good", "needs_work", "weak"


class QuestionFeedback(BaseModel):
    question_id: str
    question_text: str
    user_answer: str
    rating: str  # "strong", "weak", "red_flag"
    feedback_text: str
    suggested_answer: str
    red_flags: list[str]
    officer_thinking: Optional[str] = None  # "What a real officer would think"
    weakness_bullets: list[str] = []  # Why answer was weak/strong
    suggested_why_better: list[str] = []  # Why suggested answer works
    dimensions_affected: list[str] = []  # Which dimensions this impacts
    is_follow_up: bool = False


class RedFlagDetail(BaseModel):
    flag_number: int
    title: str  # e.g. "Evasion on Accommodation (Q7)"
    user_said: str
    problem: str
    fix: str
    question_index: int


class ApprovalAnalysis(BaseModel):
    outcome_label: str  # e.g. "BORDERLINE — LIKELY 214(b) CONCERN"
    explanation: str
    strengths: list[str]  # items with ✅
    weaknesses: list[str]  # items with ❌
    concerns: list[str]  # items with ⚠️
    profile_risk_factors: list[str]
    improvement_suggestions: list[str]


class ActionItem(BaseModel):
    priority: str  # "critical", "important", "polish"
    text: str


class InterviewSummary(BaseModel):
    date: str
    visa_type: str
    profile_summary: str
    questions_asked: int
    follow_ups: int
    red_flags_count: int
    overall_score: int
    risk_level: str


class EvaluationResponse(BaseModel):
    overall_score: int
    approval_risk: str
    summary: Optional[InterviewSummary] = None
    dimensions: dict[str, DimensionScore]
    per_question_feedback: list[QuestionFeedback]
    red_flags_summary: list[str]
    red_flags_detailed: list[RedFlagDetail] = []
    approval_analysis: Optional[ApprovalAnalysis] = None
    action_plan: list[str]  # kept for backwards compat
    action_plan_tiered: list[ActionItem] = []

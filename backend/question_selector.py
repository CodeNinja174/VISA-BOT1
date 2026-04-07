"""Question selector: picks 10-14 questions based on applicant profile.

Handles group interviews (applicant_count > 1) by including group-specific
questions. Applies profile-based risk weighting for question category selection.
"""

import random
from models import ProfileInput, QuestionItem
from question_bank import QUESTIONS


def _pick(category: str, count: int) -> list[dict]:
    pool = QUESTIONS.get(category, [])
    return random.sample(pool, min(count, len(pool)))


def compute_risk_flags(profile: ProfileInput) -> list[str]:
    flags = []

    HIGH_DENIAL_COUNTRIES = [
        "Nigeria", "Ghana", "Pakistan", "Bangladesh", "Nepal",
        "Cameroon", "India", "Mexico", "Brazil",
    ]

    if profile.prior_refusal:
        flags.append("prior_refusal")
    if profile.us_family and profile.family_status in ("F1_student", "H1B_work"):
        flags.append("us_family_on_immigration_status")
    if profile.employment.value == "unemployed":
        flags.append("unemployed")
    if profile.employment.value == "self_employed":
        flags.append("self_employed")
    if not profile.prior_travel:
        flags.append("no_prior_travel")
    if profile.monthly_income_usd.value in ("<500", "500-1500"):
        flags.append("low_income")
    if profile.citizenship in HIGH_DENIAL_COUNTRIES:
        flags.append("high_denial_country")
    if profile.planned_days > 60:
        flags.append("long_stay")
    if (profile.funding.value == "self"
            and profile.employment.value == "unemployed"):
        flags.append("unemployed_self_funded")
    if profile.marital_status.value == "single" and profile.age < 30:
        flags.append("young_single")
    if profile.applicant_count > 1:
        flags.append("group_interview")

    return flags


def select_questions(profile: ProfileInput) -> list[QuestionItem]:
    selected: list[dict] = []

    # Always include core categories
    selected += _pick("purpose", 2)
    selected += _pick("return_intent", 2)
    selected += _pick("employment", 2)
    selected += _pick("financial", 1)

    # Conditional additions based on profile
    if profile.prior_refusal:
        selected += _pick("visa_history", 2)

    if profile.us_family:
        selected += _pick("us_contacts", 2)

    if profile.visa_type in ("B1", "B1/B2"):
        selected += _pick("business", 2)

    # Group interview questions
    if profile.applicant_count > 1:
        selected += _pick("group", min(2, len(QUESTIONS.get("group", []))))

    # Young/single applicants get more challenge questions
    if profile.marital_status.value == "single" and profile.age < 30:
        selected += _pick("challenge", 1)

    # If not enough yet, pad from purpose/employment/return
    while len(selected) < 10:
        pool_cat = random.choice(["purpose", "return_intent", "employment"])
        candidate = _pick(pool_cat, 1)
        if candidate and candidate[0]["id"] not in {q["id"] for q in selected}:
            selected += candidate

    # Always include at least 1 challenge question
    if not any(q["id"].startswith("c") for q in selected):
        selected += _pick("challenge", 1)

    # Deduplicate by id, cap at 14
    seen_ids = set()
    deduped = []
    for q in selected:
        if q["id"] not in seen_ids:
            seen_ids.add(q["id"])
            deduped.append(q)
        if len(deduped) >= 14:
            break

    return [
        QuestionItem(question_id=q["id"], question_text=q["text"], category=_get_category(q["id"]))
        for q in deduped
    ]


def _get_category(question_id: str) -> str:
    prefix_map = {
        "p": "purpose",
        "r": "return_intent",
        "e": "employment",
        "f": "financial",
        "v": "visa_history",
        "u": "us_contacts",
        "b": "business",
        "c": "challenge",
        "g": "group",
    }
    return prefix_map.get(question_id[0], "unknown")

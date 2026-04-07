"""Evaluation engine: builds prompts, calls Ollama, parses AI responses.

Optimized for cloud-inference Ollama models. Uses per-question evaluation
with concise prompts then aggregates results.

Stage 3: Enhanced with officer thinking, weakness bullets, detailed red flags,
approval probability analysis, and tiered action plans.
"""

import json
import os
import httpx
import asyncio
import logging
from datetime import date
from models import ProfileInput, AnswerItem

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

# ── Enhanced per-question prompt (Stage 3) ─────────────────────────────────

PER_Q_PROMPT = """You are a US consular officer evaluating a B1/B2 visa interview answer under INA 214(b).

Applicant: {citizenship}, age {age}, {marital_status}, {employment}, visa={visa_type}, prior_refusal={prior_refusal}, us_family={us_family}, applicants={applicant_count}

Question: "{question}"
Answer: "{answer}"

Evaluate from the perspective of a real consular officer. Be direct and realistic.

Respond ONLY with this JSON:
{{"rating":"<strong|weak|red_flag>","feedback":"<2 sentences>","officer_thinking":"<2-3 sentences from officer POV, first person, blunt and realistic — what you'd actually think hearing this>","weakness_bullets":["<bullet1>","<bullet2>"],"suggested_answer":"<better 2-3 sentence answer using [BRACKETS] for personal details>","suggested_why_better":["<reason1>","<reason2>"],"red_flags":["<flag or empty list>"],"dimension":"<return_intent|purpose_clarity|financial_credibility|consistency|conciseness>","score":<0-10>}}"""

# ── Category to dimension mapping ──────────────────────────────────────────

CAT_TO_DIM = {
    "purpose": "purpose_clarity",
    "return_intent": "return_intent",
    "employment": "return_intent",
    "financial": "financial_credibility",
    "visa_history": "consistency",
    "us_contacts": "return_intent",
    "business": "purpose_clarity",
    "challenge": "conciseness",
    "group": "consistency",
}

DIM_MAX = {
    "return_intent": 25,
    "purpose_clarity": 25,
    "financial_credibility": 20,
    "consistency": 15,
    "conciseness": 15,
}

DIM_LABELS = {
    "return_intent": "Return Intent",
    "purpose_clarity": "Purpose Clarity",
    "financial_credibility": "Financial Credibility",
    "consistency": "Consistency",
    "conciseness": "Conciseness",
}

# ── High-denial countries (statistical reality) ───────────────────────────

HIGH_DENIAL_COUNTRIES = {
    "India", "China", "Nigeria", "Pakistan", "Bangladesh",
    "Ghana", "Iran", "Iraq", "Ethiopia", "Nepal",
}

# ── Red flag severity weights ─────────────────────────────────────────────

RED_FLAG_WEIGHTS = {
    "Possible work intent detected": 8,
    "Possible overstay intent": 7,
    "Evasive answer": 5,
    "Detected: work intent": 8,
    "Detected: overstay intent": 7,
    "Detected: evasion": 5,
    "Possible concern: vague purpose": 3,
    "Possible concern: accommodation unknown": 3,
}


def _compact_profile(profile: ProfileInput) -> dict:
    return {
        "citizenship": profile.citizenship,
        "employment": profile.employment.value,
        "visa_type": profile.visa_type.value,
        "prior_refusal": profile.prior_refusal,
        "us_family": profile.us_family,
        "age": profile.age,
        "marital_status": profile.marital_status.value,
        "applicant_count": profile.applicant_count,
    }


def _profile_summary(profile: ProfileInput) -> str:
    parts = [profile.employment.value.replace("_", " ").title()]
    parts.append(profile.citizenship)
    parts.append(f"Age {profile.age}, {profile.marital_status.value}")
    if profile.prior_refusal:
        parts.append("Prior Refusal")
    if profile.prior_travel:
        parts.append("Has Prior Travel")
    else:
        parts.append("First-time US Applicant")
    if profile.us_family:
        parts.append(f"US Family ({profile.family_status.value})")
    if profile.applicant_count > 1:
        parts.append(f"Group ({profile.applicant_count} applicants)")
    return ", ".join(parts)


async def evaluate_session(
    profile: ProfileInput,
    answers: list[AnswerItem],
) -> dict:
    """Evaluate answers using AI for key questions and keyword fallback for the rest."""
    prof = _compact_profile(profile)

    # Cloud model is fast — evaluate ALL questions with AI
    per_q_results = []
    for i, ans in enumerate(answers):
        result = await _evaluate_one(prof, ans)
        result["question_id"] = ans.question_id
        result["question_text"] = ans.question_text
        result["user_answer"] = ans.answer_text
        per_q_results.append(result)

    return _aggregate(per_q_results, profile, answers)


async def _evaluate_one(prof: dict, ans: AnswerItem) -> dict:
    prompt = PER_Q_PROMPT.format(
        question=ans.question_text,
        answer=ans.answer_text,
        **prof,
    )
    try:
        raw = await _call_ollama(prompt, max_tokens=400)
        parsed = _parse_json_response(raw)
        if "rating" in parsed:
            return parsed
    except Exception as e:
        logger.warning(f"Ollama eval failed for {ans.question_id}: {e}")

    return _keyword_fallback(ans)


def _keyword_fallback(ans: AnswerItem) -> dict:
    """Fast local fallback if Ollama is too slow or fails."""
    text = ans.answer_text.lower()
    red_flags = []
    rating = "weak"
    score = 4
    weakness_bullets = []
    suggested_why_better = []

    # Red flag detection
    work_words = ["find work", "get a job", "work there", "job opportunities", "employment in us"]
    if any(w in text for w in work_words):
        red_flags.append("Possible work intent detected")
        rating = "red_flag"
        score = 1
        weakness_bullets.append("Mentions seeking employment — a B1/B2 visa does not permit work")

    overstay_words = ["might stay", "see how it goes", "no return ticket", "maybe longer"]
    if any(w in text for w in overstay_words):
        red_flags.append("Possible overstay intent")
        rating = "red_flag"
        score = 1
        weakness_bullets.append("Suggests flexible or open-ended stay — signals overstay risk")

    evasion_words = ["i don't know", "not sure", "can't say", "no idea"]
    if any(w in text for w in evasion_words):
        red_flags.append("Evasive answer")
        rating = "red_flag"
        score = 2
        weakness_bullets.append("Evasive or uncertain response — applicant should know basic trip details")

    # Strong answer indicators
    word_count = len(text.split())
    has_specifics = any(c.isdigit() for c in text)

    if word_count >= 15 and has_specifics and not red_flags:
        rating = "strong"
        score = 8
        weakness_bullets = ["Answer provides specific details with concrete numbers or dates"]
        suggested_why_better = ["Already includes verifiable specifics"]
    elif word_count >= 10 and not red_flags:
        rating = "strong"
        score = 7
        weakness_bullets = ["Reasonable length but could include more specifics"]
        suggested_why_better = ["Adding numbers, dates, or names would strengthen further"]
    elif word_count < 5 and not red_flags:
        rating = "weak"
        score = 3
        weakness_bullets.append("Answer is too brief — provides almost no information")
        weakness_bullets.append("Officer cannot make a positive assessment from this")
    else:
        if not weakness_bullets:
            weakness_bullets.append("Answer lacks specific details like names, dates, or numbers")
            weakness_bullets.append("Officer would need to ask follow-up questions")
        suggested_why_better = [
            "Includes verifiable company/organization name",
            "States specific dates and duration",
            "Provides concrete details the officer can evaluate",
        ]

    # Generate officer thinking for keyword-fallback
    if rating == "strong":
        officer_thinking = "This answer gives me enough to work with. They clearly have a plan and can articulate it. I can move on."
    elif rating == "red_flag":
        officer_thinking = "This is concerning. The answer either suggests intent that conflicts with B1/B2 status, or the applicant is being evasive. I need to probe further."
    else:
        officer_thinking = f"This answer tells me almost nothing. It's only {word_count} words with no specifics. I can't verify anything from this — the burden of proof is on the applicant and they haven't met it."

    return {
        "rating": rating,
        "feedback": f"Your answer was {word_count} words. {'It lacked specific details like names, dates, or numbers.' if rating == 'weak' else 'Consider adding more concrete details.' if rating != 'red_flag' else 'This answer raises concerns.'}",
        "officer_thinking": officer_thinking,
        "weakness_bullets": weakness_bullets,
        "suggested_answer": "Provide a more specific answer mentioning [specific details like company name, dates, amounts, or names relevant to the question].",
        "suggested_why_better": suggested_why_better or [
            "Names verifiable entities",
            "Gives specific dates or numbers",
            "Demonstrates clear planning and intent",
        ],
        "red_flags": red_flags,
        "dimension": "conciseness",
        "score": score,
    }


def _build_detailed_red_flags(per_q_results: list[dict]) -> list[dict]:
    """Build detailed red flag entries with user answer, problem, and fix."""
    detailed = []
    flag_num = 0
    for i, r in enumerate(per_q_results):
        flags = r.get("red_flags", [])
        if not flags:
            continue
        flag_num += 1
        # Build a human-readable title
        flag_types = ", ".join(flags)
        title = f"{flag_types} (Q{i + 1})"

        # Build fix text
        fix = r.get("suggested_answer", "Provide a specific, concise answer with verifiable details.")

        detailed.append({
            "flag_number": flag_num,
            "title": title,
            "user_said": r.get("user_answer", ""),
            "problem": "; ".join(r.get("weakness_bullets", flags)),
            "fix": fix,
            "question_index": i,
        })
    return detailed


def _calculate_approval_analysis(
    total_score: int,
    dimensions: dict,
    red_flags: list[str],
    profile: ProfileInput,
) -> dict:
    """Generate the approval probability analysis per PRD spec."""

    # Profile-based risk deductions
    risk_deductions = 0
    profile_risk_factors = []

    if profile.citizenship in HIGH_DENIAL_COUNTRIES:
        risk_deductions += 5
        profile_risk_factors.append(f"{profile.citizenship} nationality (historically higher scrutiny)")

    if profile.prior_refusal:
        risk_deductions += 8
        profile_risk_factors.append("Prior visa refusal on record")

    if profile.employment.value == "unemployed":
        risk_deductions += 10
        profile_risk_factors.append("Unemployed — weaker employment ties")

    if profile.us_family and profile.family_status.value in ("F1_student", "H1B_work"):
        risk_deductions += 5
        profile_risk_factors.append(f"Family member on {profile.family_status.value} in the US")

    if not profile.prior_travel:
        risk_deductions += 3
        profile_risk_factors.append("First-time US visa applicant (higher scrutiny)")

    if profile.marital_status.value == "single" and profile.age < 30:
        risk_deductions += 4
        profile_risk_factors.append("Young and unmarried — weaker ties to home country")

    # Red flag deductions
    for flag in red_flags:
        risk_deductions += RED_FLAG_WEIGHTS.get(flag, 3)

    adjusted = total_score - risk_deductions

    # Classify
    if adjusted >= 80:
        outcome = "LOW RISK — Strong likelihood of approval"
        explanation = "Your answers demonstrate strong ties to your home country and clear, legitimate travel purpose. You've communicated effectively."
    elif adjusted >= 65:
        outcome = "BORDERLINE — Some 214(b) concerns"
        explanation = "Under Section 214(b), consular officers presume every applicant intends to immigrate unless proven otherwise. Your answers left some areas of doubt."
    elif adjusted >= 50:
        outcome = "HIGH RISK — Likely 214(b) refusal without improvement"
        explanation = "Your interview performance showed significant weaknesses. Multiple answers failed to establish the non-immigrant intent required under 214(b)."
    else:
        outcome = "VERY HIGH RISK — Refusal highly probable"
        explanation = "Critical weaknesses in your interview. Your answers did not overcome the presumption of immigrant intent. Major preparation is needed."

    # Strengths / weaknesses / concerns
    strengths = []
    weaknesses = []
    concerns = []

    for dim_key, dim_val in dimensions.items():
        label = DIM_LABELS.get(dim_key, dim_key.replace("_", " ").title())
        if dim_val["rating"] == "good":
            strengths.append(label)
        elif dim_val["rating"] == "weak":
            weaknesses.append(label)
        else:
            concerns.append(label)

    improvement = []
    if "Return Intent" in weaknesses or "Return Intent" in concerns:
        improvement.append("Prepare to clearly articulate employment details (company, role, tenure, approved leave)")
    if "Purpose Clarity" in weaknesses or "Purpose Clarity" in concerns:
        improvement.append("Have a specific itinerary ready (dates, cities, hotel names)")
    if "Financial Credibility" in weaknesses or "Financial Credibility" in concerns:
        improvement.append("Know your approximate bank balance and planned trip budget")
    if "Consistency" in weaknesses or "Consistency" in concerns:
        improvement.append("Ensure all answers are consistent — don't contradict yourself")
    if "Conciseness" in weaknesses or "Conciseness" in concerns:
        improvement.append("Practice answers in 2–4 sentences — direct and specific")
    if profile.us_family:
        improvement.append("Prepare to explain your US-based family relationship and state you have no intent to immigrate")

    return {
        "outcome_label": outcome,
        "explanation": explanation,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "concerns": concerns,
        "profile_risk_factors": profile_risk_factors,
        "improvement_suggestions": improvement,
    }


def _build_tiered_action_plan(
    dimensions: dict,
    red_flags: list[str],
    per_q_results: list[dict],
    profile: ProfileInput,
) -> list[dict]:
    """Generate prioritized action items: critical > important > polish."""
    items = []

    # CRITICAL — red flags and worst dimensions
    if red_flags:
        items.append({"priority": "critical", "text": "Address the red flags identified — these are immediate disqualifiers"})

    weak_dims = [k for k, v in dimensions.items() if v["rating"] == "weak"]
    for dim in weak_dims:
        label = DIM_LABELS.get(dim, dim)
        if dim == "return_intent":
            items.append({"priority": "critical", "text": f"Prepare your employment answer: company name, role, tenure, approved leave, return date"})
        elif dim == "financial_credibility":
            items.append({"priority": "critical", "text": "Know your approximate bank balance and planned trip budget"})
        elif dim == "purpose_clarity":
            items.append({"priority": "critical", "text": "Decide on your exact return date and commit to it in all answers"})

    # IMPORTANT — needs_work dimensions
    nw_dims = [k for k, v in dimensions.items() if v["rating"] == "needs_work"]
    for dim in nw_dims:
        if dim == "purpose_clarity":
            items.append({"priority": "important", "text": "Create a specific itinerary: cities, dates, hotels, activities"})
        elif dim == "return_intent":
            items.append({"priority": "important", "text": "Emphasize your job stability and responsibilities that require your return"})
        elif dim == "financial_credibility":
            items.append({"priority": "important", "text": "Prepare to discuss your salary smoothly, without hesitation"})
        elif dim == "consistency":
            items.append({"priority": "important", "text": "Review your answers for consistency — dates, durations, cities should match"})
        elif dim == "conciseness":
            items.append({"priority": "important", "text": "Practice giving answers in 3 sentences or less"})

    if profile.us_family:
        items.append({"priority": "important", "text": f"Prepare an explanation for your {profile.family_status.value} relative that emphasizes your own strong ties"})

    # POLISH
    items.append({"priority": "polish", "text": "Practice the challenge question: 'Why should I believe you'll return?'"})

    weak_answers = sum(1 for r in per_q_results if r.get("rating") == "weak")
    if weak_answers > 0:
        items.append({"priority": "polish", "text": f"Re-practice the {weak_answers} weak answers identified above"})

    items.append({"priority": "polish", "text": "Avoid filler words like 'maybe', 'probably', 'I think' — sound confident"})

    if not any(i["priority"] == "critical" for i in items):
        items.insert(0, {"priority": "polish", "text": "Your answers are generally strong — focus on polishing details"})

    return items


def _aggregate(per_q_results: list[dict], profile: ProfileInput, answers: list[AnswerItem]) -> dict:
    """Combine individual question evaluations into the full Stage 3 report."""
    dim_scores = {d: [] for d in DIM_MAX}

    per_question_feedback = []
    all_red_flags = []
    follow_up_count = 0

    for i, r in enumerate(per_q_results):
        dim = r.get("dimension", "conciseness")
        if dim not in dim_scores:
            dim = "conciseness"
        dim_scores[dim].append(r.get("score", 5))

        flags = r.get("red_flags", [])
        if flags:
            all_red_flags.extend(flags)

        is_fu = "_fu" in r["question_id"]
        if is_fu:
            follow_up_count += 1

        # Determine dimensions affected
        dims_affected = [dim]
        if dim != "conciseness":
            dims_affected.append("conciseness")

        per_question_feedback.append({
            "question_id": r["question_id"],
            "question_text": r["question_text"],
            "user_answer": r["user_answer"],
            "rating": r.get("rating", "weak"),
            "feedback_text": r.get("feedback", ""),
            "suggested_answer": r.get("suggested_answer", ""),
            "red_flags": flags,
            "officer_thinking": r.get("officer_thinking", ""),
            "weakness_bullets": r.get("weakness_bullets", []),
            "suggested_why_better": r.get("suggested_why_better", []),
            "dimensions_affected": [DIM_LABELS.get(d, d) for d in dims_affected],
            "is_follow_up": is_fu,
        })

    # Calculate dimension scores
    dimensions = {}
    total = 0
    for dim, max_val in DIM_MAX.items():
        scores = dim_scores[dim]
        if scores:
            avg = sum(scores) / len(scores)
            scaled = min(int(avg / 10 * max_val), max_val)
        else:
            scaled = int(max_val * 0.5)
        dimensions[dim] = {
            "score": scaled,
            "max": max_val,
            "rating": "good" if scaled >= max_val * 0.7 else ("needs_work" if scaled >= max_val * 0.4 else "weak"),
        }
        total += scaled

    # Red flag penalty
    total = max(0, total - len(all_red_flags) * 5)

    # Profile risk adjustment
    if profile.prior_refusal:
        total = max(0, total - 5)
    if profile.employment.value == "unemployed":
        total = max(0, total - 8)

    # Approval risk label
    if total >= 80:
        risk = "LOW_RISK"
    elif total >= 65:
        risk = "MODERATE_RISK"
    elif total >= 50:
        risk = "HIGH_RISK"
    else:
        risk = "VERY_HIGH_RISK"

    # Legacy action plan (backwards compat)
    action_plan = []
    if dimensions.get("return_intent", {}).get("rating") != "good":
        action_plan.append("Prepare your employment answer: company name, role, tenure, approved leave, return date")
    if dimensions.get("purpose_clarity", {}).get("rating") != "good":
        action_plan.append("Create a specific itinerary: cities, dates, hotels, activities")
    if dimensions.get("financial_credibility", {}).get("rating") != "good":
        action_plan.append("Know your approximate bank balance and planned trip budget")
    if dimensions.get("conciseness", {}).get("rating") != "good":
        action_plan.append("Practice giving answers in 2-4 sentences — direct and specific")
    if all_red_flags:
        action_plan.insert(0, "Address the red flags identified in your answers immediately")
    if not action_plan:
        action_plan.append("Continue practicing — your answers are strong overall")

    # ── Stage 3 additions ──────────────────────────────────────────────────

    # Interview Summary
    summary = {
        "date": date.today().isoformat(),
        "visa_type": profile.visa_type.value,
        "profile_summary": _profile_summary(profile),
        "questions_asked": len(answers),
        "follow_ups": follow_up_count,
        "red_flags_count": len(set(all_red_flags)),
        "overall_score": total,
        "risk_level": risk,
    }

    # Detailed red flags
    red_flags_detailed = _build_detailed_red_flags(per_q_results)

    # Approval analysis
    approval_analysis = _calculate_approval_analysis(total, dimensions, all_red_flags, profile)

    # Tiered action plan
    action_plan_tiered = _build_tiered_action_plan(dimensions, all_red_flags, per_q_results, profile)

    return {
        "overall_score": total,
        "approval_risk": risk,
        "summary": summary,
        "dimensions": dimensions,
        "per_question_feedback": per_question_feedback,
        "red_flags_summary": list(set(all_red_flags)),
        "red_flags_detailed": red_flags_detailed,
        "approval_analysis": approval_analysis,
        "action_plan": action_plan,
        "action_plan_tiered": action_plan_tiered,
    }


async def _call_ollama(prompt: str, max_tokens: int = 300) -> str:
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9,
            "num_predict": max_tokens,
        },
    }
    async with httpx.AsyncClient(timeout=180.0) as client:
        resp = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload)
        resp.raise_for_status()
        return resp.json()["response"]


def _parse_json_response(raw: str) -> dict:
    text = raw.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        json_str = text[start : end + 1]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    return {}

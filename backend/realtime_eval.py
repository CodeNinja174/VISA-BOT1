"""Stage 2: Real-time per-answer evaluation with follow-up generation and contradiction detection."""

import json
import logging
from models import ProfileInput, QuestionItem, ConversationEntry
from evaluation import _call_ollama, _parse_json_response, _keyword_fallback
from models import AnswerItem

logger = logging.getLogger(__name__)

# ── Compact real-time evaluation prompt ────────────────────────────────────

REALTIME_EVAL_PROMPT = """You are a US consular officer evaluating a B1/B2 visa answer in real-time under 214(b).

Applicant: {citizenship}, {employment}, visa={visa_type}, prior_refusal={prior_refusal}, us_family={us_family}

Conversation so far:
{history_text}

Latest question: "{question}"
Latest answer: "{answer}"

Tasks:
1. Rate: strong, weak, or red_flag
2. If weak/red_flag: write a 1-sentence follow-up question an officer would ask (different from the original). If strong: null.
3. Check if this answer contradicts anything in the conversation history.

Respond ONLY with JSON:
{{"quality":"<strong|weak|red_flag>","concern":"<1 sentence or null>","follow_up":"<follow-up question or null>","contradiction":false,"contradiction_detail":null,"red_flag_type":null}}"""

# ── Red flag keyword patterns ──────────────────────────────────────────────

HARD_FLAG_PATTERNS = {
    "work_intent": ["find work", "get a job", "work there", "job opportunities", "employment in us", "look for work", "find employment"],
    "overstay_intent": ["might stay longer", "see how it goes", "maybe longer", "no return ticket", "don't have return ticket", "extend my stay"],
    "evasion": ["i don't know", "not sure about that", "can't say", "no idea", "haven't decided"],
}

SOFT_FLAG_PATTERNS = {
    "vague_purpose": ["see some places", "visit the country", "explore america", "just want to go"],
    "accommodation_unknown": ["figure it out", "not sure where", "haven't booked", "find a place"],
}


def detect_keyword_flags(answer_text: str) -> tuple[list[str], str | None]:
    """Fast local red flag detection. Returns (flags, flag_type)."""
    text = answer_text.lower()
    flags = []
    flag_type = None

    for ftype, patterns in HARD_FLAG_PATTERNS.items():
        if any(p in text for p in patterns):
            flags.append(f"Detected: {ftype.replace('_', ' ')}")
            flag_type = ftype

    for ftype, patterns in SOFT_FLAG_PATTERNS.items():
        if any(p in text for p in patterns):
            flags.append(f"Possible concern: {ftype.replace('_', ' ')}")
            if not flag_type:
                flag_type = ftype

    return flags, flag_type


def detect_contradictions(answer_text: str, history: list[ConversationEntry]) -> tuple[bool, str | None]:
    """Simple contradiction detection based on key factual details."""
    text = answer_text.lower()

    # Extract previous applicant answers
    prev_answers = [e.content.lower() for e in history if e.role == "applicant"]
    if not prev_answers:
        return False, None

    # Check for duration contradictions
    import re
    duration_patterns = re.findall(r'(\d+)\s*(?:days?|weeks?|months?)', text)
    for prev in prev_answers:
        prev_durations = re.findall(r'(\d+)\s*(?:days?|weeks?|months?)', prev)
        if duration_patterns and prev_durations:
            # Simple check: if numbers differ significantly
            for d1 in duration_patterns:
                for d2 in prev_durations:
                    if abs(int(d1) - int(d2)) > 3 and int(d1) != int(d2):
                        return True, f"You previously mentioned {d2} but now said {d1} — duration inconsistency."

    # Check for city contradictions
    cities_now = set(re.findall(r'\b(new york|los angeles|san francisco|chicago|miami|boston|washington|houston|seattle|dallas)\b', text))
    for prev in prev_answers:
        cities_prev = set(re.findall(r'\b(new york|los angeles|san francisco|chicago|miami|boston|washington|houston|seattle|dallas)\b', prev))
        if cities_now and cities_prev and cities_now != cities_prev and not cities_now.issubset(cities_prev) and not cities_prev.issubset(cities_now):
            return True, f"Earlier you mentioned {', '.join(cities_prev)} but now you said {', '.join(cities_now)}."

    return False, None


def _format_history(history: list[ConversationEntry]) -> str:
    if not history:
        return "(none)"
    lines = []
    for e in history[-8:]:  # Keep last 8 exchanges to stay compact
        role = "Officer" if e.role == "officer" else "Applicant"
        lines.append(f"{role}: {e.content}")
    return "\n".join(lines)


async def evaluate_answer_realtime(
    profile: ProfileInput,
    question: QuestionItem,
    answer_text: str,
    conversation_history: list[ConversationEntry],
    follow_up_counts: dict[str, int],
) -> dict:
    """Evaluate a single answer in real-time. Returns quality, follow-up, flags."""

    # 1. Fast keyword-based checks first (instant)
    keyword_flags, flag_type = detect_keyword_flags(answer_text)
    has_contradiction, contradiction_detail = detect_contradictions(answer_text, conversation_history)

    # 2. Basic quality assessment via keyword fallback (instant)
    ans_item = AnswerItem(
        question_id=question.question_id,
        question_text=question.question_text,
        answer_text=answer_text,
    )
    keyword_result = _keyword_fallback(ans_item)
    quality = keyword_result["rating"]

    # Override quality if hard red flags found
    if keyword_flags and any("Detected" in f for f in keyword_flags):
        quality = "red_flag"
    if has_contradiction:
        quality = "red_flag" if quality != "red_flag" else quality

    # 3. Try Ollama for richer evaluation (may timeout on CPU — that's OK)
    follow_up_question = None
    concern = None
    ai_succeeded = False

    try:
        prof = {
            "citizenship": profile.citizenship,
            "employment": profile.employment.value,
            "visa_type": profile.visa_type.value,
            "prior_refusal": profile.prior_refusal,
            "us_family": profile.us_family,
        }
        prompt = REALTIME_EVAL_PROMPT.format(
            history_text=_format_history(conversation_history),
            question=question.question_text,
            answer=answer_text,
            **prof,
        )
        raw = await _call_ollama(prompt, max_tokens=200)
        parsed = _parse_json_response(raw)

        if "quality" in parsed:
            quality = parsed["quality"]
            concern = parsed.get("concern")
            if parsed.get("follow_up"):
                follow_up_text = parsed["follow_up"]
                follow_up_question = follow_up_text
            if parsed.get("contradiction") and parsed.get("contradiction_detail"):
                has_contradiction = True
                contradiction_detail = parsed["contradiction_detail"]
            if parsed.get("red_flag_type"):
                flag_type = parsed["red_flag_type"]
            ai_succeeded = True
    except Exception as e:
        logger.warning(f"Ollama real-time eval failed: {e}")

    # 4. Generate follow-up if quality is weak/red_flag and we haven't exceeded limit
    current_fu_count = follow_up_counts.get(question.question_id, 0)
    should_follow_up = (
        quality in ("weak", "red_flag")
        and current_fu_count < 2
    )

    fu_question_item = None
    if should_follow_up:
        if follow_up_question and ai_succeeded:
            fu_question_item = QuestionItem(
                question_id=f"{question.question_id}_fu{current_fu_count + 1}",
                question_text=follow_up_question,
                category=question.category,
            )
        else:
            # Generate a rule-based follow-up
            fu_text = _generate_rule_followup(question, answer_text, keyword_flags, has_contradiction, contradiction_detail)
            if fu_text:
                fu_question_item = QuestionItem(
                    question_id=f"{question.question_id}_fu{current_fu_count + 1}",
                    question_text=fu_text,
                    category=question.category,
                )

    # If contradiction, generate specific follow-up
    if has_contradiction and not fu_question_item and current_fu_count < 2:
        fu_question_item = QuestionItem(
            question_id=f"{question.question_id}_fu{current_fu_count + 1}",
            question_text=f"Earlier you mentioned something different. {contradiction_detail or 'Can you clarify?'}",
            category=question.category,
        )

    # 5. Map quality to color
    color = {"strong": "green", "weak": "yellow", "red_flag": "red"}.get(quality, "yellow")

    # 6. Build hint text
    hint = None
    if quality == "weak":
        hint = concern or "Your answer could be stronger — try adding specific details."
    elif quality == "red_flag":
        hint = concern or (keyword_flags[0] if keyword_flags else "This answer raises a concern.")

    return {
        "answer_quality": quality,
        "color_indicator": color,
        "hint_text": hint,
        "follow_up_question": fu_question_item,
        "contradiction_detected": has_contradiction,
        "contradiction_detail": contradiction_detail,
        "red_flag_type": flag_type,
    }


def _generate_rule_followup(
    question: QuestionItem,
    answer_text: str,
    flags: list[str],
    has_contradiction: bool,
    contradiction_detail: str | None,
) -> str | None:
    """Generate a follow-up question based on rules when Ollama is unavailable."""
    text = answer_text.lower()
    cat = question.category

    if has_contradiction and contradiction_detail:
        return contradiction_detail.replace(".", "") + " — can you clarify?"

    # Work intent detected
    if any("work_intent" in f.lower() or "work intent" in f.lower() for f in flags):
        return "What kind of work are you referring to? Are you planning to seek employment in the US?"

    # Overstay
    if any("overstay" in f.lower() for f in flags):
        return "Under what circumstances might you stay longer than planned?"

    # Evasion
    if any("evasion" in f.lower() or "evasive" in f.lower() for f in flags):
        return "That's a basic detail about your trip — can you be more specific?"

    # Category-based follow-ups for weak answers
    word_count = len(text.split())

    if cat == "purpose" and word_count < 10:
        return "Which specific cities or attractions do you plan to visit, and for how many days?"

    if cat == "return_intent" and "date" not in text and "ticket" not in text:
        return "What is your exact return date, and do you have a ticket booked?"

    if cat == "employment" and word_count < 8:
        return "Can you tell me the name of your employer, your role, and how long you've been there?"

    if cat == "financial" and not any(c.isdigit() for c in text):
        return "Approximately how much do you have set aside for this trip?"

    if cat == "us_contacts":
        return "Do you have plans to move to the US yourself in the future?"

    if cat == "challenge" and word_count < 10:
        return "Give me one specific reason — a commitment or obligation — that ensures you will return."

    # Generic
    if word_count < 5:
        return "Can you elaborate on that? Your answer was very brief."

    return None

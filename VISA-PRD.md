# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## AI-Powered US Visa Mock Interview Assistant — B1/B2 Tourist/Business Visa

---

**Document Version:** 1.0
**Status:** Implementation-Ready Draft
**Prepared By:** Senior Product Manager
**Last Updated:** 2025
**Classification:** Internal Product Blueprint

---

## TABLE OF CONTENTS

1. Product Overview
2. Goals & Success Metrics
3. Target Users & Personas
4. Core Product Principles
5. User Journey (Detailed)
6. Stage-Wise Development Plan
7. Feature Requirements (Detailed)
8. AI System Design
9. Technical Architecture
10. Risks & Mitigations
11. Future Scope
12. Appendix

---

---

# SECTION 1: PRODUCT OVERVIEW

---

## 1.1 Problem Statement

Every year, hundreds of thousands of applicants from countries like India, Nigeria, Pakistan, Bangladesh, Brazil, Mexico, and the Philippines apply for a US B1/B2 (Business/Tourist) visa. A significant portion of these applicants — often exceeding 30–40% in high-denial countries — are rejected at the consular interview stage.

The reasons for rejection are frequently not about the applicant's actual intent or qualifications. They are about **how the applicant communicates** during a short, high-pressure, 2–5 minute interview with a US Consular Officer. Applicants answer vaguely, provide information the officer did not ask for, appear nervous, contradict themselves, or fail to establish the three pillars that consular officers are trained to verify.

**There is currently no accessible, realistic, and structured tool that prepares visa applicants for this specific high-stakes interaction.** Existing preparation methods include:

- Watching YouTube videos (passive, non-interactive)
- Reading blog posts with sample Q&A (static, non-personalized)
- Hiring expensive visa consultants ($100–$500/session)
- Asking friends/family who have been through the process (anecdotal, unreliable)

None of these simulate the actual dynamic, adversarial nature of a consular interview. None of them provide real-time, structured feedback on the quality, confidence, specificity, and risk profile of an applicant's answers.

## 1.2 Why This Product Is Needed

### The Reality of a B1/B2 Interview

A US Consular Officer conducting B1/B2 interviews is:
- Making a decision in **2–5 minutes**
- Trained to assess **three core pillars**: intent to return home, financial stability, and legitimate travel purpose
- Operating under **Section 214(b) of the Immigration and Nationality Act**, which presumes every applicant is an intending immigrant **unless they prove otherwise**
- Asking **short, direct questions** and expecting **short, direct, confident answers**
- Watching for **red flags**: vague answers, inconsistency, prior overstays, weak home-country ties, inability to explain the trip purpose clearly

### The Preparation Gap

Most applicants:
- Over-explain (volunteering unnecessary information that raises red flags)
- Under-explain (giving one-word answers to questions requiring context)
- Cannot clearly articulate their purpose, itinerary, or financial plan
- Panic when asked follow-up questions they did not prepare for
- Don't understand why their previous application was denied

This product solves that gap by putting the applicant in front of a **simulated, AI-powered consular officer** that thinks, probes, and evaluates exactly like a real officer would.

## 1.3 Key Risks in Real B1/B2 Visa Interviews

| Risk Category | Description | Example |
|---|---|---|
| **214(b) Presumption** | Applicant fails to demonstrate strong home-country ties | "I don't have a job right now" with no property or family ties |
| **Weak Return Intent** | Officer not convinced applicant will return home | Single, unemployed, no assets, no dependents |
| **Vague Purpose** | Trip purpose is unclear or inconsistent with DS-160 | "I want to see America" without specific itinerary |
| **Financial Instability** | Cannot credibly prove ability to fund trip | "My friend will pay for everything" without sponsor letter |
| **Prior Immigration Issues** | Previous overstays, rejections, or violations | Rejected twice before; no explanation for change in circumstances |
| **Inconsistency** | Answers conflict with DS-160 or previous answers | Said visiting a friend but mentioned tourism on the form |
| **Over-sharing** | Volunteering information that raises red flags | "I also want to look for jobs while I'm there" |
| **Nervous/Evasive Behavior** | Short, fearful, or contradictory responses | Avoiding eye contact, saying "I don't know" to basic questions |
| **Weak Employment Ties** | Self-employed with no verifiable income proof | "I run a small shop" with no documentation reference |
| **Travel Pattern Issues** | First-time traveler to any country with no passport history | No prior international travel, applying for 10-year visa |

---

# SECTION 2: GOALS & SUCCESS METRICS

---

## 2.1 Product Goals

| Goal | Description |
|---|---|
| **G1: Preparation Quality** | Enable applicants to walk into their interview prepared for any question a consular officer might ask |
| **G2: Self-Awareness** | Help applicants understand exactly which of their answers are weak and why |
| **G3: Realistic Simulation** | Create the closest possible simulation of the actual consular interview experience |
| **G4: Actionable Improvement** | Give users specific, rewritten answer suggestions — not generic advice |
| **G5: Accessibility** | Make high-quality interview preparation available at zero or minimal cost |

## 2.2 Key Performance Indicators (KPIs)

### Product Health KPIs

| KPI | Target (Stage 1) | Target (Stage 3) | Target (Stage 5) | Measurement Method |
|---|---|---|---|---|
| **Session Completion Rate** | >60% | >75% | >85% | Sessions completed / sessions started |
| **User Return Rate (7-day)** | >25% | >40% | >55% | Users who practice ≥2 times in 7 days |
| **Average Sessions Per User** | 2 | 4 | 6+ | Total sessions / unique users |
| **Feedback Satisfaction Score** | >3.5/5 | >4.0/5 | >4.3/5 | Post-session rating |
| **Self-Reported Score Improvement** | N/A | >30% of users improve by 15+ points by session 3 | >50% improve | Score delta between session 1 and session 3 |
| **Time-to-First-Feedback** | <3 min | <2 min | <1 min | Time from first answer to receiving feedback |
| **Red Flag Detection Accuracy** | Manually validated on 50 test cases | >90% accuracy on test suite | >95% | Internal QA test suite |
| **Answer Rewrite Quality** | Manual review | Peer-rated ≥4/5 | User-rated ≥4.2/5 | User rating on suggested rewrites |

### Business KPIs (Post-Launch)

| KPI | Description | Target (Month 3) |
|---|---|---|
| **Monthly Active Users (MAU)** | Unique users completing ≥1 session per month | 5,000 |
| **Conversion Rate (Free → Paid)** | Users upgrading to premium tier | >8% |
| **Net Promoter Score (NPS)** | Would-recommend score | >45 |
| **Social Shares/Referrals** | Users sharing their report | >15% of completions |

---

# SECTION 3: TARGET USERS & PERSONAS

---

## 3.1 Primary Personas

### Persona 1: "First-Timer Farida"

| Attribute | Detail |
|---|---|
| **Name** | Farida Hossain |
| **Age** | 26 |
| **Location** | Dhaka, Bangladesh |
| **Occupation** | Junior Software Engineer, 2 years at current job |
| **Travel Purpose** | Visiting a university friend in New York for 2 weeks |
| **Interview Experience** | Zero — never applied for any visa before |
| **Primary Fear** | "I don't know what they'll ask me. I might say something wrong." |
| **Financial Profile** | Stable salary but no significant assets; parents own home |
| **Key Vulnerabilities** | No prior travel history, single, young, first-time applicant |
| **What She Needs** | Full practice from scratch, explanation of why each answer matters, what NOT to say |
| **Session Pattern** | Will practice 4–6 times before the interview |

---

### Persona 2: "Rejected Ravi"

| Attribute | Detail |
|---|---|
| **Name** | Ravi Shankar |
| **Age** | 34 |
| **Location** | Chennai, India |
| **Occupation** | Self-employed IT consultant, 5 years |
| **Travel Purpose** | Attending a tech conference in San Francisco + tourism |
| **Interview Experience** | Rejected once under 214(b) 18 months ago |
| **Primary Fear** | "I don't know why I was rejected. I'm afraid it'll happen again." |
| **Financial Profile** | Good income but irregular; no payslips, relies on bank statements |
| **Key Vulnerabilities** | Self-employment (hard to verify), prior rejection, needs to explain change in circumstances |
| **What He Needs** | Red flag identification, specific coaching on self-employment answers, prior rejection handling |
| **Session Pattern** | Intensive — 6–10 sessions, focused on weak areas |

---

### Persona 3: "Family Traveler Priya"

| Attribute | Detail |
|---|---|
| **Name** | Priya Mehta |
| **Age** | 42 |
| **Location** | Mumbai, India |
| **Occupation** | School principal |
| **Travel Purpose** | Visiting daughter who is on F-1 student visa in Boston |
| **Interview Experience** | Applied once 8 years ago, got a 5-year visa, now reapplying |
| **Primary Fear** | "My daughter just graduated and is on OPT. Will they think I won't come back?" |
| **Financial Profile** | Strong — government salary, owns home, husband employed |
| **Key Vulnerabilities** | Daughter on OPT (immigration risk flag), explaining purpose of visit now vs. before |
| **What She Needs** | Handling tricky follow-up questions about dependent's immigration status |
| **Session Pattern** | 3–4 sessions, focused on specific scenarios |

---

### Persona 4: "Business Traveler Bashir"

| Attribute | Detail |
|---|---|
| **Name** | Bashir Al-Rashidi |
| **Age** | 45 |
| **Location** | Lagos, Nigeria |
| **Occupation** | Export business owner |
| **Travel Purpose** | B1 — meeting with US suppliers and attending trade show |
| **Interview Experience** | Has a valid Schengen visa, never applied for US visa |
| **Primary Fear** | "Nigeria has a high rejection rate. I need to prove I'm coming back." |
| **Financial Profile** | Strong business, but documents are informal |
| **Key Vulnerabilities** | High-denial country, informal business documentation, first US visa |
| **What He Needs** | Business purpose articulation, strong ties to Nigeria emphasis |
| **Session Pattern** | 5–7 sessions |

---

# SECTION 4: CORE PRODUCT PRINCIPLES

---

## 4.1 Principles

### Principle 1: Radical Realism
The AI must simulate the behavior of an actual consular officer — not a friendly tutor. This means:
- Questions are phrased exactly as officers phrase them (short, direct, sometimes blunt)
- The AI does NOT explain why it's asking a question
- The AI does NOT provide encouragement mid-interview
- The AI follows up aggressively on vague or inconsistent answers
- The AI does NOT accept non-answers

### Principle 2: 214(b) First
Every evaluation must be anchored to Section 214(b). The default presumption is that the applicant intends to immigrate. Every answer is evaluated for whether it overcomes that presumption through evidence of:
- Strong home-country ties (job, family, property, community)
- Clear, specific, legitimate travel purpose
- Financial ability to make the trip without needing to work
- Demonstrated history of returning from prior travel

### Principle 3: Short Interaction Cycles
Like real interviews, each exchange must be tight:
- Officer question: ≤2 sentences
- Expected applicant answer: 2–4 sentences
- If answer is >6 sentences, the system flags it as "over-explaining"
- The AI moves through 8–12 questions in a session (matching real interview pace)

### Principle 4: Strict but Fair Evaluation
The system must not be cruel, but it must not be lenient. An answer is only "good" if it would actually satisfy a real officer. Generic praise is not permitted. Every piece of feedback must be specific and actionable.

### Principle 5: No Legal Advice
The system explicitly disclaims that it is not a legal advisor. It simulates interview preparation only. It does not advise on document preparation, visa strategy, or legal matters.

### Principle 6: Specificity Over Generality
Feedback must always reference the user's actual answer. "Your answer was vague" is not acceptable feedback. "You said 'I want to visit America' without naming a specific city, duration, or who you're visiting. An officer will interpret this as a lack of genuine travel plan." is acceptable.

---

# SECTION 5: USER JOURNEY (VERY DETAILED)

---

## 5.1 Complete User Flow

```
[Landing Page] → [Profile Setup] → [Pre-Interview Briefing] → [Mock Interview Session]
      → [Real-Time Feedback Indicators] → [Post-Session Report] → [Improvement Plan]
      → [Repeat Sessions] → [Progress Dashboard]
```

---

## 5.2 Step-by-Step Journey

### Step 1: Landing Page

**What the user sees:**
- Headline: "Practice Your US Visa Interview Before the Real One"
- Subtext: "Simulated by AI trained on real B1/B2 consular interview patterns"
- CTA Button: "Start Free Practice Session"
- Trust indicators: "Questions based on actual consular interview reports", "Used by 10,000+ applicants"
- A brief 30-second explainer (text or animation) about what the product does

**What happens technically:**
- No login required for first session (reduces friction)
- Anonymous session ID generated
- User is taken to Profile Setup

---

### Step 2: Profile Setup (Intake Form)

**Purpose:** Personalize the interview simulation to the user's actual situation

**Fields collected:**

| Field | Type | Options/Format | Why It Matters |
|---|---|---|---|
| **Visa Type** | Dropdown | B1 (Business), B2 (Tourist), B1/B2 (Both) | Changes question set |
| **Country of Citizenship** | Dropdown | All countries (flagged high-risk: India, Nigeria, Pakistan, etc.) | Adjusts risk profile |
| **Purpose of Visit** | Multi-select | Tourism, Family Visit, Medical, Conference, Business Meeting, Other | Core question axis |
| **Employment Status** | Dropdown | Employed (Private), Employed (Government), Self-Employed, Student, Retired, Unemployed | Determines tie questions |
| **Have you previously applied for a US Visa?** | Radio | Yes / No | Triggers prior rejection flow |
| **If Yes — were you refused?** | Radio | Yes / No / Multiple Times | Triggers 214(b) coaching mode |
| **Do you have family members in the US?** | Radio | Yes / No | Triggers immigrant intent questions |
| **If Yes — what is their immigration status?** | Dropdown | US Citizen, Green Card Holder, Student Visa (F-1), Work Visa (H-1B), Tourist Visa, Other | Risk calibration |
| **Who is funding your trip?** | Radio | Self-funded, Sponsor in US, Employer, Other | Financial question axis |
| **Have you traveled internationally before?** | Radio | Yes / No | Travel history axis |
| **Your approximate monthly income (USD equivalent)** | Dropdown range | <$500, $500–1500, $1500–3000, $3000–5000, >$5000 | Financial stability calibration |
| **How many days do you plan to stay?** | Number input | 1–180 | Duration appropriateness check |

**Edge Cases:**
- User skips fields → defaults to "standard" profile, notified that questions may be less personalized
- User selects "Unemployed" with "Self-funded" → system pre-flags this combination as high-risk
- User selects family member on F-1/H-1B → system activates immigrant intent interrogation track

**Output:** A risk profile object stored in session:
```json
{
  "visa_type": "B2",
  "citizenship": "India",
  "purpose": ["family_visit"],
  "employment": "employed_private",
  "prior_refusal": true,
  "us_family": true,
  "family_status": "F1_student",
  "funding": "self",
  "prior_travel": true,
  "monthly_income_usd": "1500-3000",
  "planned_days": 21,
  "risk_flags": ["prior_refusal", "us_family_on_immigration_status", "moderate_income"]
}
```

---

### Step 3: Pre-Interview Briefing

**What the user sees:**
- A single screen (not a tutorial — keep it brief)
- "You are about to begin your mock consular interview. Answer as you would in the real interview. The AI will play the role of a US Consular Officer. Answers should be concise and honest."
- Brief rules:
  - "Answer in 2–4 sentences unless more detail is required"
  - "Do not volunteer information not asked for"
  - "Do not ask the officer questions"
- A "Begin Interview" button
- Optional: Estimated duration "~8–12 minutes"

---

### Step 4: Mock Interview Session

**Interface Layout:**
```
[Officer Avatar/Icon] — Left or top panel
[Officer Question] — Displayed as text, centered, bold
[User Text Input Box] — Below question
[Submit Answer Button]
[Question Progress: 3/10] — Top right
[Red Flag Warning Area] — Hidden until triggered
[Timer (optional, Stage 4)] — Simulates interview pace pressure
```

**Session Flow:**

#### Opening (Always First)

Officer: *"Good morning. Can I see your passport and appointment confirmation?"*
→ This is a non-evaluative warmup prompt. User types "Yes, here you go" or similar. No evaluation. This sets the tone.

#### Core Question Sequence

The system selects 8–12 questions from the question bank based on the user's profile. The sequence follows a real officer's logic:

```
1. Purpose opening question
2. Destination/itinerary question
3. Duration and return date
4. Employment/home ties
5. Financial capability
6. Relationship to US contact (if applicable)
7. Prior travel/visa history
8. Prior refusal (if flagged)
9. Dynamic follow-up 1 (based on answer risk)
10. Dynamic follow-up 2 (based on answer risk)
11. Closing challenge question (always included)
```

#### Question Display Rules
- Only ONE question visible at a time
- Previous questions and answers NOT displayed (mirrors real interview — officer has your file, not you)
- User cannot go back to edit previous answers
- 500 character limit on answers (enforces conciseness)
- If user types >400 characters, a soft warning appears: "Real interview answers should be brief. Consider tightening your response."

#### Edge Case Handling During Interview

| Edge Case | System Behavior |
|---|---|
| **User submits blank answer** | Prompt: "Please enter an answer to continue. In a real interview, silence is noted negatively." |
| **User submits single word answer** | Accepted but flagged in evaluation as "insufficient detail" |
| **User submits answer with "I don't know"** | Accepted but flagged as "high risk response" — triggers red flag |
| **User answer contradicts a previous answer** | System detects contradiction via context window and triggers follow-up: "Earlier you mentioned X, but now you're saying Y — can you clarify?" |
| **User mentions wanting to work/study** | Immediate red flag triggered — follow-up question about intent |
| **User answer is copy-pasted and very formal** | Not technically detectable in Stage 1–2, added in Stage 3 via linguistic pattern detection |
| **User refreshes mid-session** | Session state saved in localStorage — can resume if within 30 minutes |

---

### Step 5: Real-Time Feedback Indicators (Stage 2+)

During the session (not disruptive, shown after each answer is submitted):

- A subtle **color indicator** on the answer bubble:
  - 🟢 Green: Answer appears strong
  - 🟡 Yellow: Answer has concerns
  - 🔴 Red: Answer contains red flags
- A **one-line hint** (not full feedback): "Your answer could be stronger — you didn't mention your return date"
- This is shown for 3 seconds then fades — does not interrupt flow

---

### Step 6: Post-Interview Report (Full Screen)

After the final question, a "Generating Your Report..." loading screen appears (2–5 seconds).

The report contains:

**A. Overall Score**
```
Your Interview Score: 68/100
Likelihood of Approval (Simulated): MODERATE RISK
```

**B. Score Breakdown Table**

| Dimension | Your Score | Max | Rating |
|---|---|---|---|
| Return Intent | 14 | 25 | ⚠️ Needs Work |
| Travel Purpose Clarity | 20 | 25 | ✅ Good |
| Financial Credibility | 15 | 20 | ⚠️ Needs Work |
| Consistency | 12 | 15 | ✅ Good |
| Conciseness & Confidence | 7 | 15 | ❌ Weak |
| **Total** | **68** | **100** | |

**C. Per-Question Feedback (Most Critical Section)**

For each question:
```
Q3: "What do you do for work?"
Your Answer: "I work at a software company."
Rating: ⚠️ WEAK

Why this is risky:
You provided no specifics. An officer wants to hear: company name, your role, 
how long you've been there, and implicitly — that you have a job to return to. 
Vague employment answers are a common 214(b) red flag.

Suggested Answer:
"I work as a software engineer at [Company Name] in Chennai. I've been with them 
for 3 years. I have approved leave for this trip and will return to my role on [date]."

What made this answer better:
✓ Named the company
✓ Stated tenure (shows stability)
✓ Confirmed return to work (demonstrates return intent)
```

**D. Red Flags Detected**

```
⚠️ RED FLAGS IDENTIFIED IN YOUR INTERVIEW:

1. You mentioned your cousin is on an H-1B visa in the US but did not establish 
   that this does not affect your intent to return. Consider proactively stating 
   your own home ties.

2. When asked about your return date, you said "around 3 weeks." Officers expect 
   a specific date, matching your DS-160 application.

3. You said you were "not sure" about your accommodation. This suggests your trip 
   may not be fully planned, which raises doubt about legitimacy.
```

**E. Approval Probability Statement**

```
⚠️ SIMULATED ASSESSMENT:
Based on your answers in this session, a consular officer applying 214(b) standards 
would likely find your application BORDERLINE. Your travel purpose is clear, but 
your return intent evidence and financial specifics are insufficient.

This is NOT a guarantee of any outcome. This simulation is for preparation purposes only.
```

**F. Action Plan**
```
Before your next practice session, prepare specific answers for:
1. Your exact return date and reason for returning (job, family obligation, etc.)
2. Your monthly salary and how you've saved for this trip
3. A clear, specific itinerary (cities, dates, accommodation names)
```

---

### Step 7: Repeat Sessions & Progress Tracking (Stage 4)

- User creates an account after first session (email or Google)
- Dashboard shows:
  - Session history with scores
  - Score trend chart
  - "Weakest Areas" panel
  - "Ready for Interview?" readiness indicator (unlocks at 3 sessions with improving trend)

---

# SECTION 6: STAGE-WISE DEVELOPMENT PLAN

---

## STAGE 1: MVP — Text-Based Interview Engine

### 6.1.1 Scope

Build the minimum viable product that allows a user to:
1. Set up their profile
2. Receive a sequence of relevant visa interview questions
3. Submit text answers
4. Receive basic evaluation and feedback at the end

**Out of Scope for Stage 1:**
- Dynamic follow-up questions
- Real-time answer indicators
- Voice
- User accounts / progress tracking
- Detailed answer rewriting

---

### 6.1.2 Features

| Feature ID | Feature Name | Description |
|---|---|---|
| F1.1 | Profile Intake Form | Collect user's visa context data |
| F1.2 | Static Question Bank | Pre-defined set of B1/B2 interview questions organized by category |
| F1.3 | Profile-Based Question Selection | Select 10 questions from the bank based on user's profile |
| F1.4 | Interview Chat Interface | Sequential question display with text input |
| F1.5 | Basic Answer Evaluation | Send answers to AI for evaluation using a fixed prompt |
| F1.6 | Session Report | Display score and basic feedback after interview ends |
| F1.7 | Disclaimer Page | Legal disclaimer that this is not legal advice |

---

### 6.1.3 Question Bank (Stage 1 — Static)

The question bank must have a minimum of 60 questions across 8 categories:

#### Category 1: Purpose of Visit (12 questions)
1. "What is the purpose of your visit to the United States?"
2. "Who are you visiting?"
3. "How do you know this person?"
4. "Where exactly will you be staying in the US?"
5. "What places do you plan to visit?"
6. "Do you have a specific itinerary?"
7. "Is this a personal trip or are you traveling for work?"
8. "Have you ever been to the US before?"
9. "Why do you want to visit the US specifically, rather than other countries?"
10. "How long have you been planning this trip?"
11. "Why are you going at this particular time?"
12. "Will anyone be traveling with you?"

#### Category 2: Duration & Return Intent (10 questions)
1. "How long do you plan to stay?"
2. "What is your return date?"
3. "What is waiting for you back home that ensures you will return?"
4. "Do you have a return ticket booked?"
5. "What will you do when you get back?"
6. "Do you have any commitments in [home country] during the time of your visit?"
7. "Has anyone in your family previously overstayed a US visa?"
8. "Do you plan to travel to any other countries during or after this trip?"
9. "Why only [X] weeks? / Why [X] weeks — that seems like a long time?"
10. "Do you plan to extend your stay once you arrive?"

#### Category 3: Employment & Home Ties (12 questions)
1. "What do you do for work?"
2. "Where do you work?"
3. "How long have you been at this job?"
4. "Does your employer know you're taking this trip?"
5. "Have you taken leave approval for this trip?"
6. "What is your position at your company?"
7. "Who will handle your work while you're away?"
8. "Are you self-employed? Tell me about your business."
9. "What is your monthly income?"
10. "Do you own property in [home country]?"
11. "Are you married? Do you have children?"
12. "Where does your family live?"

#### Category 4: Financial Stability (8 questions)
1. "Who is paying for this trip?"
2. "How much do you expect to spend during your visit?"
3. "How much money do you have in your bank account?"
4. "Can you show proof of funds?"
5. "Is someone sponsoring your visit? Do you have a sponsorship letter?"
6. "How did you save for this trip?"
7. "Do you have any outstanding loans?"
8. "What is your annual salary?"

#### Category 5: Prior Visa History (6 questions)
1. "Have you previously applied for a US visa?"
2. "Were you ever refused a US visa? When and why?"
3. "Have you applied for a visa to any other country?"
4. "What countries have you traveled to previously?"
5. "Have you ever overstayed a visa in any country?"
6. "Do you have a valid visa for any other country currently?"

#### Category 6: US Contacts & Relationships (6 questions)
1. "Do you have relatives in the United States?"
2. "What is your relationship to your host?"
3. "What does your host do in the United States?"
4. "What is the immigration status of your relatives in the US?"
5. "Has your US contact ever visited you in [home country]?"
6. "Are you planning to live with your relative during the entire visit?"

#### Category 7: Business-Specific (B1) (6 questions)
1. "What company do you work for and what is your role?"
2. "Who are you meeting with in the US?"
3. "What is the name and location of the conference/meeting?"
4. "Will you be receiving any payment from a US company during your visit?"
5. "What is the nature of the business transaction?"
6. "Does your US counterpart know you are coming?"

#### Category 8: Challenge/Closing Questions (always include 1) (5 questions)
1. "Why should I believe you will return home?"
2. "What makes your situation different from someone who intends to stay illegally?"
3. "If I approved your visa and you had a great time — why wouldn't you just stay?"
4. "Many people from [country] overstay their visas. How are you different?"
5. "You said you're visiting a friend — why hasn't your friend visited you instead?"

---

### 6.1.4 Profile-to-Question Mapping Logic

```python
def select_questions(profile):
    question_set = []
    
    # Always include: 2 purpose questions, 2 return intent, 2 employment, 
    #                 1 financial, 1 challenge
    question_set += random_select(purpose_questions, 2)
    question_set += random_select(return_intent_questions, 2)
    question_set += random_select(employment_questions, 2)
    question_set += random_select(financial_questions, 1)
    question_set += [challenge_questions[random]]  # always 1
    
    # Conditional additions:
    if profile.prior_refusal:
        question_set += random_select(visa_history_questions, 2)
    if profile.us_family:
        question_set += random_select(us_contacts_questions, 2)
    if profile.visa_type == "B1":
        question_set += random_select(business_questions, 2)
    
    # Cap at 12 questions total, ensure no duplicates
    return deduplicate_and_cap(question_set, max=12)
```

---

### 6.1.5 Technical Stack (Stage 1 — Free Tools Only)

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React.js (Create React App or Vite) | Free, component-based, fast |
| **Styling** | Tailwind CSS | Free, rapid UI development |
| **State Management** | React useState + Context API | No additional library needed for MVP |
| **Backend** | FastAPI (Python) | Free, lightweight, async support |
| **AI Model** | Ollama running Llama 3.1 8B locally OR OpenAI GPT-4o-mini (API, low cost) | Ollama = fully free; GPT-4o-mini = ~$0.001/session |
| **Session Storage** | Browser localStorage (Stage 1) | No database needed at MVP |
| **Hosting** | Render.com (free tier) for backend; Vercel (free tier) for frontend | Both free |
| **Version Control** | GitHub (free) | Standard |
| **API Communication** | REST (JSON) | Simple, fast to implement |

---

### 6.1.6 Data Flow (Stage 1)

```
User fills Profile Form
        ↓
Frontend sends profile JSON to Backend (POST /api/session/start)
        ↓
Backend runs question_selector(profile) → returns ordered list of 10–12 questions
        ↓
Frontend stores question list in localStorage
        ↓
User answers Question 1 → submits
        ↓
Answer stored in localStorage: {question_id: "q1", answer: "..."}
        ↓
[Continue for all questions]
        ↓
User completes final question → Frontend sends all Q&A pairs to Backend (POST /api/session/evaluate)
        ↓
Backend constructs evaluation prompt + sends to AI model
        ↓
AI returns structured JSON evaluation
        ↓
Backend parses + validates response
        ↓
Frontend renders Post-Interview Report
```

---

### 6.1.7 API Endpoints (Stage 1)

| Method | Endpoint | Input | Output |
|---|---|---|---|
| POST | /api/session/start | Profile JSON | Session ID + ordered question list |
| POST | /api/session/evaluate | Session ID + Q&A pairs array | Evaluation JSON |
| GET | /api/health | None | {"status": "ok"} |

**Evaluate Endpoint Input Schema:**
```json
{
  "session_id": "abc123",
  "profile": { ...profile fields... },
  "answers": [
    {
      "question_id": "q1",
      "question_text": "What is the purpose of your visit?",
      "answer_text": "I want to visit my friend in New York for 2 weeks."
    },
    ...
  ]
}
```

**Evaluate Endpoint Output Schema:**
```json
{
  "overall_score": 72,
  "approval_risk": "MODERATE",
  "dimensions": {
    "return_intent": {"score": 16, "max": 25, "rating": "needs_work"},
    "purpose_clarity": {"score": 20, "max": 25, "rating": "good"},
    "financial_credibility": {"score": 14, "max": 20, "rating": "needs_work"},
    "consistency": {"score": 12, "max": 15, "rating": "good"},
    "conciseness": {"score": 10, "max": 15, "rating": "good"}
  },
  "per_question_feedback": [
    {
      "question_id": "q1",
      "question_text": "What is the purpose of your visit?",
      "user_answer": "I want to visit my friend in New York for 2 weeks.",
      "rating": "good",
      "feedback_text": "Clear purpose stated...",
      "suggested_answer": "I'm visiting my close friend [Name] in New York City for 14 days...",
      "red_flags": []
    }
  ],
  "red_flags_summary": [],
  "action_plan": []
}
```

---

### 6.1.8 Evaluation Prompt (Stage 1 — Core Prompt)

```
SYSTEM PROMPT:
You are a strict evaluation engine trained to assess US B1/B2 visa interview answers 
using the same criteria a US Consular Officer would apply under Section 214(b) of the 
Immigration and Nationality Act.

Your job is to evaluate a set of interview answers provided by a visa applicant and 
return a structured JSON evaluation. Do not be lenient. Apply the following standards:

EVALUATION CRITERIA:
1. RETURN INTENT (25 points): Does the answer demonstrate strong ties to the home 
   country? (Employment, family, property, community obligations)
2. TRAVEL PURPOSE CLARITY (25 points): Is the stated purpose specific, consistent, 
   and credible? Does it match a genuine tourist/business visit?
3. FINANCIAL CREDIBILITY (20 points): Does the answer suggest the applicant can 
   genuinely fund the trip without needing to work?
4. CONSISTENCY (15 points): Are answers internally consistent? Do they match what 
   a typical DS-160 would say?
5. CONCISENESS & CONFIDENCE (15 points): Are answers direct and appropriately brief? 
   Vague, rambling, or one-word answers score low.

RED FLAG TRIGGERS (Automatic deductions):
- Mentioning interest in working in the US (-10 points)
- Saying "I don't know" to a basic factual question (-5 points per instance)
- Inconsistency between two answers (-8 points)
- No specific return date or plan (-7 points)
- No mention of employment/ties when asked about work (-8 points)
- US family member on immigration-seeking status without counter-explanation (-5 points)
- Accommodation described as "not sure" or "figure it out" (-6 points)

APPLICANT PROFILE:
{profile_json}

INTERVIEW TRANSCRIPT:
{qa_pairs}

Return a JSON object matching this exact schema:
{output_schema}

Do not include any text outside the JSON object. Do not hallucinate questions or answers 
not in the transcript. Base your evaluation ONLY on what was said.
```

---

### 6.1.9 Success Criteria (Stage 1)

| Criterion | Target |
|---|---|
| A user can complete a full session (profile → interview → report) without errors | 100% of test sessions |
| Question selection is profile-appropriate (validated manually on 20 test profiles) | ≥18/20 correct |
| Evaluation JSON always returns valid, parseable JSON | 100% |
| Evaluation identifies obviously bad answers as "weak" or "red flag" | ≥90% on 30 test cases |
| Session completes in under 15 minutes for an average typist | Timed on 10 users |
| Page loads in under 3 seconds on standard connection | Lighthouse score ≥85 |
| No data is sent to any third party other than the AI model provider | Code audit |

---

### 6.1.10 Verification Checklist (Stage 1)

**Before moving to Stage 2, all items below must be manually verified:**

```
FUNCTIONAL VERIFICATION:
[ ] Profile form submits without error for all 15 edge case profiles
[ ] Question selector returns exactly 10–12 questions for every profile type
[ ] No question is repeated in a session
[ ] Challenge question always appears in every session
[ ] Business questions appear ONLY when visa_type = B1 or B1/B2
[ ] Prior refusal questions appear ONLY when prior_refusal = true
[ ] Answer input enforces 500 character limit
[ ] Empty answer submission is blocked with appropriate message
[ ] Session state persists on page refresh (via localStorage)
[ ] Report renders correctly on mobile (320px width minimum)

EVALUATION QUALITY VERIFICATION (run 30 test cases):
[ ] Test Case 1: Perfect answers → Score > 85
[ ] Test Case 2: All vague answers → Score < 50
[ ] Test Case 3: "I want to work in the US" mentioned → Red flag detected
[ ] Test Case 4: "I don't know" given twice → 2 red flags detected
[ ] Test Case 5: Employment answered with company name + tenure → Green rating
[ ] Test Case 6: Inconsistent return date mentioned → Consistency score < 10
[ ] Test Case 7: Self-employed, no income details → Financial score < 10
[ ] Test Case 8: Strong ties mentioned (job, family, property) → Return intent > 18
[ ] Test Case 9: Unemployed applicant → Red flag in return intent
[ ] Test Case 10: B1 applicant with business meeting details → Purpose score > 18
[ ] JSON output is valid and parseable for all 30 test cases
[ ] Suggested answers are always more specific than user's answer (manual review)

TECHNICAL VERIFICATION:
[ ] API responds in < 8 seconds for evaluation endpoint
[ ] No 500 errors on any standard path
[ ] Frontend handles API timeout gracefully (shows error message)
[ ] No console errors in browser for standard flow
[ ] Disclaimer is visible before interview begins
[ ] No PII is logged to console or stored beyond session
```

---

## STAGE 2: Intelligent Interview System

### 6.2.1 Scope

Transform the static question sequence into a **dynamic, context-aware interview system** that behaves like a real consular officer — following up on weak answers, detecting inconsistencies in real time, and probing where necessary.

**New Additions over Stage 1:**
- Real-time follow-up question generation (after each answer)
- Context window that tracks all previous Q&A
- Real-time red flag detection per answer
- In-session soft indicators (color-coded feedback)
- Scoring system updated per answer (not just at the end)
- Handling "I don't know" and deflection answers
- Contradiction detection across answers

---

### 6.2.2 Dynamic Follow-Up Logic

The system evaluates each answer **immediately after submission** and decides:

```
IF answer_quality == "weak" OR red_flag_detected:
    → Generate 1 follow-up question specific to the weakness
    → Insert it as the next question
    → Maximum 2 follow-ups per original question
ELSE:
    → Proceed to next scheduled question
```

**Follow-Up Trigger Conditions:**

| Trigger | Example Answer | Follow-Up Generated |
|---|---|---|
| Vague purpose | "I want to see the US" | "Which specific cities or attractions do you plan to visit?" |
| No return date | "Maybe 3 weeks or so" | "What is your exact return date and do you have a ticket booked?" |
| Vague employment | "I work somewhere" | "Can you tell me the name of your employer and your role?" |
| No financial detail | "I have enough money" | "Approximately how much do you have set aside for this trip?" |
| US family on visa | "My brother is there on H-1B" | "Do you have plans to move to the US yourself in the future?" |
| Prior refusal | "Yes, I was refused before" | "What has changed in your circumstances since your last application?" |
| Accommodation unclear | "I'll figure it out when I get there" | "You don't have accommodation arranged — who exactly will you be staying with?" |
| Overly long answer | (answer >400 chars with irrelevant info) | "Let me ask you more specifically: [targeted version of original question]" |

---

### 6.2.3 Context Window Implementation

The backend maintains a **session context object** that is sent with every AI call:

```json
{
  "session_id": "abc123",
  "profile": { ...profile... },
  "conversation_history": [
    {"role": "officer", "content": "What is the purpose of your visit?"},
    {"role": "applicant", "content": "I want to visit my friend."},
    {"role": "officer", "content": "Which city will your friend be in?"},
    {"role": "applicant", "content": "New York."}
  ],
  "red_flags_so_far": ["vague_purpose"],
  "questions_remaining": ["employment", "financial", "challenge"],
  "follow_up_count": {"q1": 1}
}
```

---

### 6.2.4 Real-Time Evaluation Prompt (Per Answer)

This prompt is called after EACH answer (not just at the end):

```
SYSTEM PROMPT (Per-Answer Evaluator):

You are a US Consular Officer evaluating a B1/B2 visa applicant's answer in real time.

Based on the conversation history below and the latest answer, determine:
1. Is this answer STRONG, WEAK, or RED_FLAG?
2. Should a follow-up question be asked? If yes, generate it.
3. What specific concern does this answer raise (if any)?
4. Has the applicant contradicted any previous answer?

APPLICANT PROFILE:
{profile}

CONVERSATION HISTORY:
{conversation_history}

LATEST QUESTION:
{latest_question}

LATEST ANSWER:
{latest_answer}

Return JSON:
{
  "answer_quality": "strong" | "weak" | "red_flag",
  "concern": "string or null",
  "follow_up_required": true | false,
  "follow_up_question": "string or null",
  "contradiction_detected": true | false,
  "contradiction_detail": "string or null",
  "red_flag_type": "string or null" 
    // Options: "work_intent", "vague_purpose", "no_return_plan", 
    //          "financial_instability", "inconsistency", "evasion", null
}
```

---

### 6.2.5 Red Flag Detection Logic

**Hard Red Flags (Automatic Score Impact, Logged Immediately):**

| Red Flag | Detection Pattern | Score Impact | Response |
|---|---|---|---|
| **Work Intent** | Answer contains: "job", "work there", "find work", "employment in US" | -15 points | Immediate follow-up: "What kind of work are you referring to?" |
| **Overstay Intent** | "might stay longer", "see how it goes", "don't have return ticket" | -12 points | Follow-up: "Under what circumstances might you stay longer than planned?" |
| **Contradiction** | Location mentioned in Answer 3 conflicts with Answer 7 | -8 points | Follow-up: "Earlier you said [X], now you're saying [Y]. Can you clarify?" |
| **Evasion** | "I don't know", "not sure", "maybe" on factual questions | -5 per instance | Follow-up: "That's a basic detail — can you be more specific?" |
| **No Ties** | No job, no family, no property mentioned across all tie questions | -10 points cumulative | Incorporated into challenge question |

**Soft Red Flags (Noted, Affect Feedback But Not Hard Scored):**

| Soft Flag | Pattern | Feedback Note |
|---|---|---|
| Over-explaining | Answer >400 chars, multiple sentences not asked for | "Applicants who over-explain raise suspicion" |
| Vague itinerary | No cities, dates, or specific activities mentioned | "Trip appears unplanned" |
| Third-party funded without explanation | "My friend/cousin will pay" with no clarification | "Sponsorship must be established" |
| First-time traveler + long duration | No prior travel history + >30-day requested stay | "Pattern raises intent concerns" |

---

### 6.2.6 Scoring System (Updated in Stage 2)

The score is now **updated after each answer** (not just at the end):

```python
def update_running_score(session_state, answer_evaluation):
    dimension = map_question_to_dimension(session_state.current_question)
    
    if answer_evaluation.quality == "strong":
        session_state.scores[dimension] += 3
    elif answer_evaluation.quality == "weak":
        session_state.scores[dimension] += 1
    elif answer_evaluation.quality == "red_flag":
        session_state.scores[dimension] -= 2
    
    # Apply hard red flag penalties
    for flag in answer_evaluation.red_flags:
        session_state.total_penalty += RED_FLAG_PENALTIES[flag]
    
    # Cap dimension scores at max
    session_state.scores[dimension] = min(
        session_state.scores[dimension], 
        DIMENSION_MAXES[dimension]
    )
    
    return session_state
```

---

### 6.2.7 New API Endpoints (Stage 2)

| Method | Endpoint | Input | Output |
|---|---|---|---|
| POST | /api/session/answer | Session ID + current answer + conversation history | Next question OR follow-up question + real-time flag |
| POST | /api/session/evaluate | Full session data | Complete evaluation JSON (enhanced) |

---

### 6.2.8 Success Criteria (Stage 2)

| Criterion | Target |
|---|---|
| Follow-up questions are generated for ≥80% of weak/red-flag answers | Tested on 20 weak-answer sessions |
| Follow-up questions are contextually relevant (manually reviewed) | ≥85% relevant |
| Contradiction detection works on 10 test cases with planted contradictions | ≥8/10 detected |
| "Work intent" red flag detected in 10/10 test cases | 100% |
| Per-answer evaluation API responds in < 4 seconds | Load tested |
| Session context accurately tracks all previous Q&A | 100% (unit tested) |
| In-session color indicators render correctly after each answer | 100% on Chrome, Firefox, Safari |
| No false positive "work intent" flag on legitimate answers | <5% false positive rate on 50 test answers |

---

### 6.2.9 Verification Checklist (Stage 2)

```
DYNAMIC QUESTIONING VERIFICATION:
[ ] Follow-up generated when answer contains "I don't know"
[ ] Follow-up generated when employment answer has no company name
[ ] No follow-up generated when answer is strong (verified on 10 cases)
[ ] Maximum 2 follow-ups per original question (hard limit tested)
[ ] Session does not exceed 14 questions total (including follow-ups)
[ ] Follow-up is contextually different from original question (manual check)

CONTRADICTION DETECTION:
[ ] Contradiction detected when city changes between Q3 and Q8
[ ] Contradiction detected when stay duration changes
[ ] Contradiction NOT falsely detected on clarifying/elaborating answers
[ ] Contradiction follow-up question is specific to the contradiction

RED FLAG DETECTION:
[ ] "I want to find work there" → work_intent flag triggered
[ ] "I'll see how it goes about coming back" → overstay_intent flag triggered
[ ] "I don't know" on accommodation question → evasion flag triggered
[ ] "My brother on H-1B will pay for everything" → soft flag noted
[ ] False positive test: "I work in IT" → NO work_intent flag

SCORING:
[ ] Running score updates after each answer (visible in debug mode)
[ ] Strong answers increase dimension score
[ ] Red flag answers decrease dimension score
[ ] Final score is consistent with per-answer scores
[ ] Score never exceeds 100 or goes below 0

PERFORMANCE:
[ ] Per-answer API call completes in <4 seconds (measured 20 times)
[ ] No session state loss between questions
[ ] Browser back button does not break session
```

---

## STAGE 3: Feedback & Reporting Engine

### 6.3.1 Scope

Build a comprehensive, highly specific **post-interview report** that serves as the user's primary value output. This stage transforms basic evaluation output into a professional, actionable document.

**New Additions over Stage 2:**
- Per-answer detailed feedback with specific reasoning
- AI-generated rewritten answers (suggested best version)
- Approval probability logic with explanation
- Downloadable/shareable report
- "What the officer was thinking" insight per question
- Action plan with prioritized improvement items

---

### 6.3.2 Report Sections (Detailed)

#### Section A: Interview Summary Card
```
Date: [Date]
Visa Type: B2 Tourist
Profile: Employed, India, First-time US Applicant
Questions Asked: 11 (including 2 follow-ups)
Red Flags Triggered: 3
Overall Score: 68/100
Simulated Risk Level: ⚠️ MODERATE RISK
```

#### Section B: Dimension Scores (Visual)

Rendered as a horizontal bar chart or table:

```
Return Intent        ████████░░░░░░░ 14/25  ⚠️
Purpose Clarity      █████████████░░ 22/25  ✅
Financial Credibility ███████████░░░░ 14/20  ⚠️
Consistency          ████████████░░░ 12/15  ✅
Conciseness          ██████░░░░░░░░░  9/15  ❌
```

#### Section C: Per-Question Analysis (The Core)

For EVERY question asked, the report includes:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION 3 OF 11
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Officer Asked:
"What do you do for work?"

Your Answer:
"I work in IT."

Officer Assessment Rating: ⚠️ WEAK

What a Real Officer Would Think:
"This answer tells me nothing. I can't verify this person has a real job, 
how stable it is, or whether they have a reason to return. The burden is 
on them to prove ties. They haven't."

Why Your Answer Was Weak:
• No company name given (officer cannot verify employment)
• No role or seniority mentioned (could be freelance/informal)
• No tenure mentioned (new employees have less tie to return to)
• No mention of approved leave (doesn't confirm they have permission to be away)

Suggested Answer:
"I'm a software engineer at [Company Name] in Bangalore. I've been there 
for 4 years. I've taken 3 weeks of approved annual leave for this trip 
and will be reporting back to work on [specific date]."

Why the Suggested Answer Works:
✓ Names the company (verifiable, professional)
✓ States role (establishes legitimate employment)
✓ States tenure (4 years = strong employment tie)
✓ Mentions approved leave (shows this is a planned, permitted absence)
✓ Gives specific return-to-work date (return intent evidence)

Dimension Affected: Return Intent, Financial Credibility
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Section D: Red Flags Summary

```
🚩 RED FLAGS DETECTED IN YOUR SESSION (3)

RED FLAG #1: Evasion on Accommodation (Q7)
You said: "I'll stay somewhere comfortable, maybe a hotel."
Problem: No specific accommodation plan suggests the trip is not genuine or 
fully planned. Officers interpret vague accommodation as a sign of unclear 
intent.
Fix: "I'll be staying at [specific hotel name] in [city] for the first week, 
then with my friend [name] at [their address] for the remaining days."

RED FLAG #2: No Specific Return Date (Q5)
You said: "Around three weeks, maybe a bit longer."
Problem: "Maybe a bit longer" is an indirect signal of possible overstay intent. 
You must give a specific date.
Fix: "My return flight is on [specific date]. I'll be back at work on [date]."

RED FLAG #3: Weak Financial Answer (Q8)
You said: "I have enough to cover my expenses."
Problem: "Enough" is not a number. An officer needs to believe you can 
genuinely afford this trip without needing to seek income in the US.
Fix: "I've saved approximately $3,000 for this trip, which covers flights, 
accommodation, and daily expenses for 21 days. I also have [X] in my bank account."
```

#### Section E: Approval Probability Analysis

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMULATED APPROVAL PROBABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Based on your session performance:

Your Simulated Outcome: ⚠️ BORDERLINE — LIKELY 214(b) CONCERN

What this means:
Under Section 214(b), consular officers presume every applicant intends to 
immigrate unless proven otherwise. Your answers did not sufficiently establish:

❌ Strong employment ties (you gave minimal employment detail)
❌ Clear financial capability (no specific amounts given)
⚠️ Clear travel purpose (good, but lacking itinerary specifics)
✅ Consistency across answers
✅ Appropriate trip duration

Risk Factors in Your Profile:
• First-time US visa applicant (higher scrutiny)
• India nationality (historically high denial rate)
• No mention of property ownership
• Family member on H-1B in the US

What Would Strengthen Your Application:
• Prepare to clearly articulate employment details
• Have a specific itinerary ready (dates, cities, hotel names)
• Know your approximate bank balance and trip budget
• Prepare to explain your relationship with your US-based family member 
  and state clearly that you have no intention to immigrate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANT DISCLAIMER: This is a simulated assessment based on interview 
performance only. It does not consider your actual documents, financial records, 
or official application. This tool does not provide legal advice. Consult a 
licensed immigration attorney for official guidance.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Section F: Prioritized Action Plan

```
BEFORE YOUR NEXT PRACTICE SESSION — DO THESE (IN ORDER):

🔴 CRITICAL (Fix Before Any Session):
1. Prepare your employment answer: company name, role, tenure, approved leave, return date
2. Decide on your exact return date and commit to it in all answers
3. Know your approximate bank balance and planned trip budget

🟡 IMPORTANT (Fix This Week):
4. Create a specific itinerary: cities, dates, hotels, activities
5. Prepare an explanation for your H-1B relative that emphasizes your own strong ties
6. Practice giving answers in 3 sentences or less

🟢 POLISH (Before Final Interview):
7. Practice the challenge question: "Why should I believe you'll return?"
8. Prepare to answer questions about your salary smoothly, without hesitation
9. Practice sounding confident — avoid filler words like "maybe", "probably", "I think"
```

---

### 6.3.3 Approval Probability Logic

```python
def calculate_approval_probability(scores, red_flags, profile):
    
    base_score = scores['total']  # out of 100
    
    # Risk adjustments based on profile
    risk_deductions = 0
    
    if profile.citizenship in HIGH_DENIAL_COUNTRIES:
        risk_deductions += 5  # Not unfair — it's a statistical reality officers face
    
    if profile.prior_refusal:
        risk_deductions += 8
    
    if profile.employment == "unemployed":
        risk_deductions += 10
    
    if profile.us_family_status in ["F1", "H1B", "OPT"]:
        risk_deductions += 5
    
    if profile.prior_travel == False:
        risk_deductions += 3
    
    # Red flag severity
    for flag in red_flags:
        risk_deductions += RED_FLAG_WEIGHTS[flag]
    
    adjusted_score = base_score - risk_deductions
    
    if adjusted_score >= 80:
        return "LOW_RISK", "Strong likelihood of approval based on interview performance"
    elif adjusted_score >= 65:
        return "MODERATE_RISK", "Borderline — some concerns that could trigger 214(b)"
    elif adjusted_score >= 50:
        return "HIGH_RISK", "Significant concerns — likely 214(b) refusal without improvement"
    else:
        return "VERY_HIGH_RISK", "Critical weaknesses — refusal highly probable at current level"
```

---

### 6.3.4 Report Generation Prompt

```
SYSTEM PROMPT (Report Generator):

You are generating a detailed visa interview feedback report for a B1/B2 visa applicant.

For each question-answer pair, generate:
1. A "What a real officer would think" insight (2–3 sentences, written from officer's POV)
2. A specific critique of why the answer is weak or strong (bullet points)
3. A rewritten suggested answer that is specific, concise, and confidence-inspiring
4. An explanation of why the rewritten answer is better (bullet points)

RULES FOR SUGGESTED ANSWERS:
- Must be 2–5 sentences maximum
- Must address the specific weakness in the original answer
- Must include placeholder [brackets] where user should insert personal specifics
- Must sound natural and human (not robotic or overly formal)
- Must NOT coach applicants to lie or misrepresent facts
- Must NOT include information not consistent with the profile provided

APPLICANT PROFILE:
{profile}

FULL INTERVIEW TRANSCRIPT:
{qa_transcript}

PER-ANSWER EVALUATION RESULTS:
{evaluation_results}

Generate the full report JSON per the schema below:
{report_schema}
```

---

### 6.3.5 Success Criteria (Stage 3)

| Criterion | Target |
|---|---|
| Report generates in under 10 seconds | 100% of sessions |
| Per-question feedback is specific to the user's actual answer (no generic text) | Manual review of 30 reports — 100% specific |
| Suggested answers are always more specific than user's original answer | 100% (manual review) |
| Suggested answers never coach the user to lie or misrepresent | 100% (manual review) |
| Approval probability rating matches evaluator judgment on 20 test cases | ≥85% agreement |
| Report is readable on mobile (scrollable, no overflow) | 100% |
| Report can be downloaded as PDF or shared via link | Functional test |

---

### 6.3.6 Verification Checklist (Stage 3)

```
REPORT CONTENT VERIFICATION:
[ ] All 8–14 questions have per-question feedback entries
[ ] Each feedback entry has: officer_thought, critique_bullets, suggested_answer, improvement_bullets
[ ] Suggested answers contain [placeholder] brackets for personal details
[ ] No suggested answer exceeds 5 sentences
[ ] Red flags section matches red_flags detected during session
[ ] Approval probability matches score + profile risk adjustments
[ ] Action plan has at least 3 items, prioritized by severity
[ ] Disclaimer is present and prominent on report

SUGGESTED ANSWER QUALITY (Manual Review of 20 Reports):
[ ] Suggested answers are more specific than user answers in all cases
[ ] No suggested answer coaches lying or misrepresentation
[ ] Suggested answers are appropriate for the question asked
[ ] Suggested answers mention return intent where relevant
[ ] Suggested answers use natural language (not bureaucratic)

TECHNICAL:
[ ] Report renders correctly on Chrome, Firefox, Safari, Edge
[ ] Report renders correctly on iOS Safari and Android Chrome
[ ] PDF download produces readable, formatted document
[ ] Share link expires after 7 days
[ ] Report data is not accessible to other users via share link manipulation
```

---

## STAGE 4: Personalization Layer

### 6.4.1 Scope

Introduce user accounts, progress tracking, adaptive question difficulty, and personalized practice plans. This stage turns a one-time tool into a **practice platform**.

**New Additions:**
- User registration and login (email / Google OAuth)
- Session history storage (database)
- Progress dashboard with score trends
- Adaptive difficulty (harder follow-ups as scores improve)
- "Weak Area" focused practice mode
- Interview readiness indicator
- Spaced repetition reminders

---

### 6.4.2 User Account Features

| Feature | Description |
|---|---|
| **Registration** | Email + password OR Google OAuth |
| **Session History** | All past sessions stored with date, score, and report |
| **Score Trend Chart** | Line chart showing dimension scores across sessions |
| **Weak Area Identification** | Automatically identifies lowest 2 dimensions across last 3 sessions |
| **Focused Practice Mode** | Launches a session with 80% questions targeting weak dimensions |
| **Interview Readiness Score** | Composite readiness indicator: "Ready" / "Almost Ready" / "Needs More Practice" |
| **Email Reminders** | Optional: "Practice reminder — your visa interview is approaching" |

---

### 6.4.3 Readiness Score Logic

```python
def calculate_readiness(user_sessions):
    if len(user_sessions) < 2:
        return "INSUFFICIENT_DATA"
    
    last_3_sessions = user_sessions[-3:]
    avg_score = mean([s.score for s in last_3_sessions])
    trend = last_3_sessions[-1].score - last_3_sessions[0].score
    red_flags_in_last_session = last_3_sessions[-1].red_flag_count
    
    if avg_score >= 80 and trend >= 0 and red_flags_in_last_session == 0:
        return "READY", "Your last 3 sessions show consistent strength."
    elif avg_score >= 70 and trend > 0:
        return "ALMOST_READY", "Improving trend — focus on your weak areas."
    elif avg_score < 60 or red_flags_in_last_session >= 2:
        return "NEEDS_WORK", "Critical weaknesses persist. Keep practicing."
    else:
        return "PROGRESSING", "Solid improvement, but more practice recommended."
```

---

### 6.4.4 Adaptive Question Difficulty

As user scores improve, the system adjusts:

| User Average Score | Question Mode |
|---|---|
| < 60 | Standard questions + generous follow-up triggers |
| 60–75 | Standard questions + standard follow-up triggers |
| 75–85 | Harder phrasing + challenge questions prioritized |
| > 85 | Advanced adversarial mode: officer is skeptical, interrupts, asks unexpected angles |

**Advanced Adversarial Mode Examples:**
- "I've heard this story before. Give me one specific reason you'll actually return."
- "Your income seems low for a [X]-day trip to New York. Convince me."
- "You mentioned your cousin is on H-1B. Have you ever thought about applying for a work visa yourself?"

---

### 6.4.5 Database Schema (Stage 4 Introduction)

**Technology:** SQLite (free, local) → PostgreSQL on Render.com free tier for production

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    created_at TIMESTAMP,
    last_login TIMESTAMP
);

-- Profiles table (user's visa context)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    visa_type VARCHAR(10),
    citizenship VARCHAR(100),
    employment_status VARCHAR(50),
    us_family BOOLEAN,
    prior_refusal BOOLEAN,
    profile_json JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    profile_id UUID REFERENCES user_profiles(id),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    total_score INTEGER,
    approval_risk VARCHAR(20),
    dimension_scores JSONB,
    red_flag_count INTEGER,
    session_mode VARCHAR(20) -- 'standard', 'focused', 'adversarial'
);

-- Question-Answer log
CREATE TABLE session_answers (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES sessions(id),
    question_text TEXT,
    question_category VARCHAR(50),
    answer_text TEXT,
    answer_quality VARCHAR(20),
    red_flags JSONB,
    feedback_text TEXT,
    suggested_answer TEXT,
    sequence_order INTEGER
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES sessions(id),
    report_json JSONB,
    share_token VARCHAR(64),
    share_expires_at TIMESTAMP,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP
);
```

---

### 6.4.6 Verification Checklist (Stage 4)

```
ACCOUNT & AUTH:
[ ] User can register with email + password
[ ] User can register/login with Google OAuth
[ ] Password is hashed (bcrypt, not plaintext)
[ ] Session token expires after 30 days (or on logout)
[ ] User cannot access another user's sessions via URL manipulation

PROGRESS TRACKING:
[ ] All completed sessions appear in history
[ ] Score trend chart updates after each session
[ ] Weak area identified correctly (lowest average dimension across last 3 sessions)
[ ] Focused practice mode selects 80% questions from weak category
[ ] Readiness score updates after each session

ADAPTIVE DIFFICULTY:
[ ] Standard mode questions for score < 75 (verified on test accounts)
[ ] Adversarial mode activates at score > 85 (verified)
[ ] Adversarial questions are more challenging versions, not just rephrased
[ ] User can manually override to standard mode

DATABASE:
[ ] All sessions persisted correctly (spot check 20 records)
[ ] No data loss on server restart
[ ] User can delete their account and all data (GDPR compliance)
[ ] Share tokens expire after 7 days (verified by setting clock forward)
```

---

## STAGE 5: Voice AI (ONLY AFTER STAGES 1–4 ARE STABLE)

### 6.5.1 Scope

Add voice interaction capability — making the simulation feel like a real interview where the officer speaks to you and you respond verbally. This is the most technically complex stage and must only begin after all previous stages are stable, tested, and proven.

**New Additions:**
- Text-to-Speech (TTS) for officer questions
- Speech-to-Text (STT) for user answers
- Latency management
- Voice confidence analysis (hesitation, filler words)
- Voice session mode (parallel to text mode — user chooses)

---

### 6.5.2 Technology Stack (Voice)

| Component | Technology | Cost |
|---|---|---|
| **Speech-to-Text** | OpenAI Whisper (open-source, self-hosted via Ollama or direct) | Free (self-hosted) |
| **Text-to-Speech** | Coqui TTS (open-source) OR Mozilla TTS | Free |
| **Audio Processing** | Web Audio API (browser-native) | Free |
| **Audio Streaming** | WebSockets (FastAPI WebSocket support) | Free |
| **Fallback** | If voice fails → auto-switch to text mode | N/A |

---

### 6.5.3 Voice Flow

```
[Officer TTS plays question]
        ↓
[Recording starts automatically after question ends]
        ↓
[User speaks answer]
        ↓
[User clicks "Done Speaking" OR silence detected after 3 seconds]
        ↓
[Audio sent to backend via WebSocket]
        ↓
[Whisper transcribes audio → text]
        ↓
[Text goes through same evaluation pipeline as text mode]
        ↓
[Per-answer evaluation runs]
        ↓
[IF follow-up needed: TTS generates follow-up question]
        ↓
[Report at end includes: transcribed answers + voice analysis]
```

---

### 6.5.4 Voice Confidence Analysis (New in Stage 5)

Beyond the text content, the system analyzes voice patterns:

| Signal | Detection Method | Impact |
|---|---|---|
| **Filler words** | Count "um", "uh", "like", "you know" in transcript | Flagged in report: "Excessive fillers indicate nervousness" |
| **Hesitation pauses** | Audio silence gap > 2 seconds mid-answer | Flagged as "Hesitation detected" |
| **Very fast speech** | Words per minute > 180 | Flagged as "Speaking too quickly — may be hard to follow" |
| **Very slow speech** | Words per minute < 80 | Flagged as "Unusually slow — may appear uncertain" |
| **Answer length** | Whisper transcript word count | Same logic as text mode (too short/too long) |

---

### 6.5.5 Latency Requirements

| Operation | Maximum Acceptable Latency | Target |
|---|---|---|
| TTS generation + playback start | 3 seconds | < 2 seconds |
| STT transcription (Whisper) | 5 seconds for 30-second audio | < 4 seconds |
| Per-answer evaluation | 4 seconds | < 3 seconds |
| Total cycle (question → answer → next question) | < 15 seconds | < 10 seconds |

If latency exceeds limits → Show "Processing..." indicator and allow user to switch to text mode.

---

### 6.5.6 Verification Checklist (Stage 5)

```
VOICE FUNCTIONALITY:
[ ] Officer question plays via TTS without manual click
[ ] Recording starts immediately after TTS finishes
[ ] User can stop recording manually
[ ] Silence detection stops recording after 3 seconds
[ ] Whisper transcription is ≥90% accurate on standard English accents (tested)
[ ] Whisper transcription is ≥80% accurate on Indian, Nigerian, Pakistani accents (tested)
[ ] Transcription is displayed to user for confirmation before submission
[ ] User can edit transcription if incorrect before submitting

PERFORMANCE:
[ ] End-to-end voice cycle < 15 seconds on standard WiFi
[ ] Graceful fallback to text mode on voice failure
[ ] No audio feedback loop (microphone picking up TTS output)
[ ] Works on Chrome, Firefox, Edge (Safari limited by Web Audio API)
[ ] Works on Android Chrome mobile
[ ] Explicitly tested on iOS Safari (WebSocket limitations)

VOICE ANALYSIS:
[ ] Filler word count appears in report
[ ] Hesitation detection triggers on 3-second silence
[ ] Speaking rate calculated and reported
[ ] Voice analysis section clearly labeled "supplementary — not official"

RELIABILITY:
[ ] System handles network interruption during audio upload gracefully
[ ] System handles Whisper timeout gracefully (retry + fallback)
[ ] No session data lost if voice mode fails mid-session
```

---

# SECTION 7: FEATURE REQUIREMENTS (DETAILED)

---

## 7.1 Feature: Profile Intake Form

| Attribute | Detail |
|---|---|
| **Description** | Collects applicant's visa context to personalize the interview simulation |
| **Input** | User selections on intake form fields |
| **Output** | Profile JSON object stored in session/database |
| **Minimum Fields** | 12 fields (see Section 5.2, Step 2) |
| **Optional Fields** | All beyond minimum are optional (with defaults) |
| **Edge Cases** | Incomplete form → proceed with partial profile + notify user; contradictory selections (e.g., "unemployed" + "self-funded" with very low income) → pre-flag |
| **Acceptance Criteria** | Form submission creates valid profile JSON ≥ 99% of the time; Invalid combinations trigger warning, not blocking |

---

## 7.2 Feature: Question Bank & Selector

| Attribute | Detail |
|---|---|
| **Description** | Selects and orders a set of 10–12 interview questions based on user profile |
| **Input** | Profile JSON |
| **Output** | Ordered array of question objects |
| **Rules** | Always include 1 challenge question; Max 2 questions per category except Purpose (min 2); No duplicates |
| **Edge Cases** | Profile has no differentiating flags → use standard tourist question set; B1 profile → replace 2 tourist questions with business questions |
| **Acceptance Criteria** | Question set is profile-appropriate in ≥90% of test cases; No session has fewer than 8 or more than 14 questions (including follow-ups) |

---

## 7.3 Feature: Dynamic Follow-Up Question Generator

| Attribute | Detail |
|---|---|
| **Description** | Generates a contextually relevant follow-up question when an answer is weak or contains a red flag |
| **Input** | Current question, current answer, conversation history, profile |
| **Output** | Follow-up question text OR "null" (no follow-up needed) |
| **Rules** | Maximum 2 follow-ups per original question; Follow-up must be different from original question; Follow-up must address specific weakness |
| **Edge Cases** | If answer is borderline → no follow-up (threshold: only generate for "weak" or "red_flag" rating, not "moderate"); If max follow-ups reached → move to next question |
| **Acceptance Criteria** | Follow-up is generated for ≥80% of weak/red-flag answers; Follow-up is contextually relevant in ≥85% of cases (manual review); False positive rate < 10% |

---

## 7.4 Feature: Per-Answer Evaluation Engine

| Attribute | Detail |
|---|---|
| **Description** | Evaluates each individual answer in real time using AI |
| **Input** | Question, answer, conversation history, profile |
| **Output** | {quality, concern, follow_up_required, follow_up_question, contradiction_detected, red_flag_type} |
| **Latency Requirement** | < 4 seconds |
| **Edge Cases** | AI returns unparseable JSON → retry once; If retry fails → default to "moderate" rating, log error; Empty answer → "weak" rating without AI call |
| **Acceptance Criteria** | Valid JSON returned ≥99%; Latency < 4s in ≥95% of calls; "Work intent" detection accuracy ≥98% |

---

## 7.5 Feature: Post-Session Report Generator

| Attribute | Detail |
|---|---|
| **Description** | Generates full interview analysis report after session completion |
| **Input** | Full session data (all Q&A + real-time evaluations + profile) |
| **Output** | Report JSON (rendered to UI) + optional PDF |
| **Generation Time** | < 10 seconds |
| **Edge Cases** | AI fails mid-report → show partial report with error note for missing sections; User has fewer than 5 answers → report still generates with note "short session" |
| **Acceptance Criteria** | All questions have feedback entries; Suggested answers are more specific than user's answers; No suggested answer coaches lying; Disclaimer is present |

---

## 7.6 Feature: Red Flag Detection System

| Attribute | Detail |
|---|---|
| **Description** | Identifies specific red flag types in user answers, both during session and in final report |
| **Input** | Answer text + conversation context |
| **Output** | {flag_type, severity, description, suggested_fix} |
| **Flag Types** | work_intent, overstay_intent, contradiction, evasion, financial_instability, weak_ties, vague_purpose, accommodation_unknown |
| **Edge Cases** | Ambiguous language (e.g., "I might work on some personal projects") → classify as soft flag, not hard flag; Non-English answers → flag for translation issue, evaluate what's transcribed |
| **Acceptance Criteria** | Hard red flags detected with ≥95% accuracy; False positive rate < 5%; All detected flags appear in final report |

---

# SECTION 8: AI SYSTEM DESIGN

---

## 8.1 AI Model Configuration

| Parameter | Stage 1–2 Value | Stage 3–5 Value |
|---|---|---|
| **Model** | Llama 3.1 8B (Ollama) or GPT-4o-mini | GPT-4o-mini or Llama 3.1 70B |
| **Temperature** | 0.3 (consistent, not creative) | 0.4 (slightly more nuanced) |
| **Max Tokens (Per-Answer Eval)** | 400 | 600 |
| **Max Tokens (Report)** | 4000 | 6000 |
| **Top-P** | 0.9 | 0.9 |
| **Retry Logic** | 1 retry on failure | 2 retries with exponential backoff |
| **Timeout** | 8 seconds | 12 seconds |

---

## 8.2 Complete Prompt Library

### PROMPT 1: Session Opener Prompt (System Context)

```
You are acting as a US Consular Officer conducting a B1/B2 visa interview at a US Embassy.

BEHAVIORAL RULES:
- You are professional, direct, and neutral. Not friendly, not hostile.
- You ask one question at a time.
- You do not explain why you are asking a question.
- You do not give the applicant feedback or hints during the interview.
- You follow up when answers are vague, inconsistent, or raise concerns.
- Your questions are short (1–2 sentences maximum).
- You are trained to identify intending immigrants attempting to enter on tourist/business visas.
- You apply Section 214(b) presumption: the applicant is presumed to be an intending immigrant 
  until they prove otherwise.

APPLICANT PROFILE:
{profile_json}

PLANNED QUESTION SEQUENCE:
{question_sequence}

Begin the interview with the first question. Do not introduce yourself. 
Do not say "Welcome" or "Good morning." Just ask the first question.
```

---

### PROMPT 2: Per-Answer Real-Time Evaluation Prompt

```
You are a visa interview evaluation engine. Your task is to evaluate a single answer 
given by a B1/B2 visa applicant in real time.

APPLICANT PROFILE:
{profile_json}

FULL CONVERSATION SO FAR:
{conversation_history}

LATEST QUESTION ASKED:
{question}

APPLICANT'S LATEST ANSWER:
{answer}

EVALUATION TASK:
1. Rate the answer: "strong", "weak", or "red_flag"
   - strong: Clear, specific, credible, addresses the question fully
   - weak: Vague, incomplete, lacks specifics, doesn't address return intent or purpose
   - red_flag: Contains indicators of work intent, overstay intent, evasion, 
               contradiction, or other disqualifying patterns
               
2. If rating is "weak" or "red_flag", generate a follow-up question the officer would ask.
   The follow-up must:
   - Be 1–2 sentences maximum
   - Address the specific weakness in the answer
   - Not be identical to the original question
   - Sound like a real consular officer speaking, not a chatbot

3. Check for contradiction with any previous answer in the conversation history.

4. Identify the specific red flag type if applicable.

RESPOND IN THIS EXACT JSON FORMAT (no text outside JSON):
{
  "answer_quality": "strong" | "weak" | "red_flag",
  "concern": "string describing the specific concern, or null if strong",
  "follow_up_required": true | false,
  "follow_up_question": "string or null",
  "contradiction_detected": true | false,
  "contradiction_detail": "string or null",
  "red_flag_type": "work_intent" | "overstay_intent" | "evasion" | "contradiction" | 
                   "financial_instability" | "weak_ties" | "vague_purpose" | 
                   "accommodation_unknown" | null,
  "dimension_affected": "return_intent" | "purpose_clarity" | "financial_credibility" | 
                        "consistency" | "conciseness" | null
}
```

---

### PROMPT 3: Full Session Evaluation Prompt

```
You are a US Consular Officer review system evaluating a complete B1/B2 visa mock interview.

You will evaluate the ENTIRE interview transcript and return a structured assessment.

APPLICANT PROFILE:
{profile_json}

FULL INTERVIEW TRANSCRIPT:
{transcript_array}
// Format: [{"sequence": 1, "question": "...", "answer": "...", "was_follow_up": false}, ...]

RED FLAGS DETECTED DURING SESSION:
{real_time_flags}

EVALUATION DIMENSIONS AND SCORING:
Score each dimension on its specified scale. Be strict — these scores represent 
what a real officer would assign, not an encouraging tutor.

1. RETURN INTENT (0–25):
   - 20–25: Strong ties clearly established (employment with tenure, family, property, obligations)
   - 14–19: Some ties mentioned but not fully established
   - 8–13: Weak ties, vague references
   - 0–7: No ties established, unemployed, no dependents, no property

2. PURPOSE CLARITY (0–25):
   - 20–25: Specific itinerary, named cities, activities, host, dates
   - 14–19: General purpose clear but details missing
   - 8–13: Purpose stated but vague or inconsistent with profile
   - 0–7: Unclear, contradictory, or implausible purpose

3. FINANCIAL CREDIBILITY (0–20):
   - 16–20: Specific amounts, clear funding source, reasonable for trip duration
   - 11–15: Funding mentioned but amounts vague or source unclear
   - 5–10: "I have enough" or third-party funding without establishment
   - 0–4: No financial information, implausible funding

4. CONSISTENCY (0–15):
   - 13–15: All answers consistent with each other and with profile
   - 9–12: Minor inconsistencies
   - 4–8: Notable inconsistencies
   - 0–3: Direct contradictions detected

5. CONCISENESS & CONFIDENCE (0–15):
   - 13–15: Answers are direct, appropriate length, no evasion
   - 9–12: Mostly direct with occasional filler or over-explanation
   - 4–8: Frequent hedging, filler words, or one-word answers
   - 0–3: Evasive, unable to answer directly, "I don't know" repeatedly

AUTOMATIC DEDUCTIONS (apply these before finalizing scores):
- Mention of work intent in the US: -15 from total
- Overstay language: -12 from total
- Contradiction between two answers: -8 from consistency dimension
- "I don't know" on factual question: -5 per instance from conciseness dimension
- No specific return date given: -7 from return intent
- No accommodation plan: -6 from purpose clarity

Return the following JSON (no text outside JSON):
{
  "overall_score": integer (0–100),
  "approval_risk": "LOW_RISK" | "MODERATE_RISK" | "HIGH_RISK" | "VERY_HIGH_RISK",
  "dimensions": {
    "return_intent": {"score": int, "max": 25, "rating": "good"|"needs_work"|"weak"},
    "purpose_clarity": {"score": int, "max": 25, "rating": "good"|"needs_work"|"weak"},
    "financial_credibility": {"score": int, "max": 20, "rating": "good"|"needs_work"|"weak"},
    "consistency": {"score": int, "max": 15, "rating": "good"|"needs_work"|"weak"},
    "conciseness": {"score": int, "max": 15, "rating": "good"|"needs_work"|"weak"}
  },
  "per_question_evaluation": [
    {
      "sequence": int,
      "question": "string",
      "answer": "string",
      "rating": "strong"|"weak"|"red_flag",
      "officer_perspective": "string (2-3 sentences from officer's POV)",
      "specific_weaknesses": ["string", ...],
      "suggested_answer": "string",
      "suggested_answer_improvements": ["string", ...],
      "red_flags": ["string", ...]
    }
  ],
  "red_flags_summary": [
    {
      "flag_type": "string",
      "question_sequence": int,
      "description": "string",
      "suggested_fix": "string"
    }
  ],
  "approval_reasoning": "string (3–5 sentences explaining the approval risk assessment)",
  "action_plan": [
    {"priority": "critical"|"important"|"polish", "action": "string"}
  ]
}
```

---

### PROMPT 4: Answer Rewrite Prompt

```
A B1/B2 visa applicant gave the following answer to a consular officer's question.
Your task is to rewrite the answer so it would satisfy a consular officer evaluating 
under Section 214(b) standards.

ORIGINAL QUESTION: {question}
ORIGINAL ANSWER: {answer}
SPECIFIC WEAKNESSES IDENTIFIED: {weaknesses}
APPLICANT PROFILE: {profile}

REWRITE RULES:
1. Maximum 5 sentences
2. Use [PLACEHOLDER] brackets where personal details should be inserted
3. Do NOT fabricate specific facts (income, company names, etc.) — use placeholders
4. Address every weakness listed above
5. Include return intent signals where natural
6. Use natural, conversational language — not formal or robotic
7. Do NOT coach the applicant to lie or misrepresent their situation

RETURN JSON:
{
  "suggested_answer": "string",
  "what_makes_it_better": ["string", ...],
  "placeholders_to_fill": ["[PLACEHOLDER_NAME]: description of what to insert", ...]
}
```

---

## 8.3 Good vs. Bad Answer Examples

### Example Set 1: Purpose of Visit

**Question:** "What is the purpose of your visit to the United States?"

| Answer Type | Answer | Rating | Why |
|---|---|---|---|
| **Strong** | "I'm visiting my university friend Priya in New York City for 14 days. We've been friends for 8 years and she's been living there for 3 years. I have my return flight booked for [specific date]." | ✅ STRONG | Named purpose (friend visit), specific city, specific duration, mentions return |
| **Weak** | "I want to visit the US and see some places." | ⚠️ WEAK | No specific destination, no clear purpose, sounds like exploratory immigration |
| **Red Flag** | "I want to visit and maybe look for some opportunities there." | 🚩 RED FLAG | "Opportunities" signals potential work intent |

---

### Example Set 2: Employment

**Question:** "What do you do for work?"

| Answer Type | Answer | Rating | Why |
|---|---|---|---|
| **Strong** | "I'm a senior accountant at Infosys in Pune. I've been there for 6 years. I have 3 weeks of approved annual leave for this trip and I'm scheduled to return to work on September 15th." | ✅ STRONG | Named company, role, tenure (6 years = strong tie), leave approved, specific return to work date |
| **Weak** | "I work in finance." | ⚠️ WEAK | No company, no role, no tenure — nothing verifiable |
| **Red Flag** | "I'm between jobs right now, but I'm looking." | 🚩 RED FLAG | Unemployed = no home-country tie; "looking" may imply looking in the US |

---

### Example Set 3: Return Intent

**Question:** "What is waiting for you back home that ensures you'll return?"

| Answer Type | Answer | Rating | Why |
|---|---|---|---|
| **Strong** | "My wife and two children are in Chennai. I own a home there and I've been at my company for 8 years. My annual performance review is actually coming up next month — I can't afford to miss it." | ✅ STRONG | Family (spouse + children), property ownership, long employment, specific reason to return |
| **Weak** | "My family is there. I'll come back." | ⚠️ WEAK | Vague — "my family" could mean anyone; no specifics on what creates the tie |
| **Red Flag** | "I mean, there's nothing really holding me back but I plan to come back." | 🚩 RED FLAG | Literally stating nothing is holding them back — death of application |

---

### Example Set 4: Financial Stability

**Question:** "Who is paying for this trip?"

| Answer Type | Answer | Rating | Why |
|---|---|---|---|
| **Strong** | "I'm paying for it myself. I've saved approximately $4,000 for this trip over the past 8 months. That covers my roundtrip flight, 14 nights of accommodation, and daily expenses. I earn [X] monthly." | ✅ STRONG | Self-funded, specific amount, explains how saved, covers expected expenses |
| **Weak** | "I have enough money for the trip." | ⚠️ WEAK | "Enough" is not a number. Officer cannot assess credibility |
| **Red Flag** | "My cousin in New York will pay for everything." | 🚩 RED FLAG | Third-party funding with no sponsorship letter reference raises reliance concerns |

---

# SECTION 9: TECHNICAL ARCHITECTURE

---

## 9.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Profile Form │  │ Interview UI │  │  Report Display         │ │
│  │  (Intake)    │  │  (Chat-like) │  │  (Score + Feedback)     │ │
│  └──────────────┘  └──────────────┘  └────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Dashboard    │  │  Progress    │  │  Voice UI (Stage 5)     │ │
│  │  (Stage 4)   │  │  Tracker     │  │  (Mic + Audio Player)   │ │
│  └──────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │ REST API (JSON)
                              │ WebSocket (Stage 5)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI / Python)                  │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐ │
│  │ Session       │  │  Question     │  │  Evaluation Engine   │ │
│  │ Manager       │  │  Selector     │  │  (Prompt Builder +   │ │
│  │               │  │               │  │   Response Parser)   │ │
│  └──────────────┘  └───────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐ │
│  │ Report       │  │  Red Flag     │  │  Auth Module         │ │
│  │ Generator    │  │  Detector     │  │  (Stage 4)           │ │
│  └──────────────┘  └───────────────┘  └──────────────────────┘ │
│  ┌──────────────┐                                               │
│  │ Voice        │  (Stage 5 only)                               │
│  │ Processor    │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
       ┌────────────────────┐  ┌──────────────────────┐
       │   AI LAYER          │  │   DATA STORAGE        │
       │                    │  │                       │
       │  Ollama (local)    │  │  Stage 1-3:           │
       │  - Llama 3.1 8B    │  │  localStorage (browser│
       │  OR                │  │                       │
       │  OpenAI API        │  │  Stage 4+:            │
       │  - GPT-4o-mini     │  │  PostgreSQL (Render)  │
       │                    │  │                       │
       │  Whisper (Stage 5) │  │  Redis (optional,     │
       │  Coqui TTS (Stage5)│  │  session caching)     │
       └────────────────────┘  └──────────────────────┘
```

---

## 9.2 Backend Module Breakdown

### Module 1: Session Manager
- Creates session on profile submission
- Stores session state (questions remaining, answers given, running scores)
- Manages session lifecycle (start, active, completed, expired)

### Module 2: Question Selector
- Receives profile JSON
- Runs question selection algorithm
- Returns ordered question list with metadata

### Module 3: Evaluation Engine
```python
class EvaluationEngine:
    def evaluate_single_answer(self, question, answer, context, profile) -> dict
    def evaluate_full_session(self, session_data) -> dict
    def build_evaluation_prompt(self, prompt_type, **kwargs) -> str
    def call_ai_model(self, prompt, model_params) -> str
    def parse_ai_response(self, raw_response) -> dict
    def validate_response_schema(self, response) -> bool
    def retry_on_failure(self, callable, max_retries=2) -> dict
```

### Module 4: Red Flag Detector
```python
class RedFlagDetector:
    HARD_FLAGS = {
        "work_intent": ["find work", "get a job", "work there", "employment in us", "job opportunities"],
        "overstay_intent": ["maybe longer", "see how it goes", "might stay", "no return ticket"],
        "evasion": ["i don't know", "not sure about that", "can't say"],
    }
    
    def detect_keyword_flags(self, answer_text) -> list[str]
    def detect_contextual_flags(self, answer, context, ai_evaluation) -> list[str]
    def calculate_flag_penalty(self, flag_type) -> int
    def format_flag_for_report(self, flag) -> dict
```

### Module 5: Report Generator
```python
class ReportGenerator:
    def generate_full_report(self, session_data, evaluation_results) -> dict
    def calculate_approval_probability(self, scores, red_flags, profile) -> str
    def generate_action_plan(self, dimension_scores, red_flags) -> list
    def render_pdf(self, report_json) -> bytes  # Stage 3
    def create_share_token(self, report_id) -> str  # Stage 3
```

---

## 9.3 Frontend Component Tree

```
App
├── Router
│   ├── LandingPage
│   ├── ProfileSetup
│   │   └── IntakeForm
│   │       ├── VisaTypeSelector
│   │       ├── CountrySelector
│   │       ├── PurposeSelector
│   │       └── ProfileFormFields
│   ├── PreInterviewBriefing
│   ├── InterviewSession
│   │   ├── OfficerQuestionDisplay
│   │   ├── AnswerInput
│   │   │   ├── TextInput (Stage 1–4)
│   │   │   └── VoiceInput (Stage 5)
│   │   ├── AnswerQualityIndicator (Stage 2+)
│   │   ├── ProgressBar
│   │   └── CharacterCounter
│   ├── LoadingScreen ("Generating Report...")
│   ├── ReportPage
│   │   ├── ScoreSummaryCard
│   │   ├── DimensionScoreChart
│   │   ├── QuestionFeedbackList
│   │   │   └── QuestionFeedbackCard (per question)
│   │   ├── RedFlagsSummary
│   │   ├── ApprovalProbabilityPanel
│   │   ├── ActionPlan
│   │   └── ShareDownloadButtons (Stage 3+)
│   ├── Dashboard (Stage 4+)
│   │   ├── ReadinessIndicator
│   │   ├── ScoreTrendChart
│   │   ├── WeakAreaPanel
│   │   └── SessionHistoryList
│   └── AuthPages (Stage 4+)
│       ├── LoginPage
│       └── RegisterPage
└── SharedComponents
    ├── Disclaimer
    ├── NavigationHeader
    ├── LoadingSpinner
    └── ErrorBoundary
```

---

## 9.4 Environment Setup (Free Stack)

### Local Development

```bash
# Backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic sqlalchemy psycopg2 python-jose bcrypt httpx

# Run locally
uvicorn main:app --reload --port 8000

# AI Model (Option A: Ollama - fully local)
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b
# No API key needed

# AI Model (Option B: OpenAI - minimal cost)
pip install openai
# Set OPENAI_API_KEY in .env

# Frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install tailwindcss axios react-router-dom recharts
npm run dev
```

### Environment Variables

```env
# Backend .env
AI_PROVIDER=ollama  # or "openai"
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
OPENAI_API_KEY=sk-...  # only if using OpenAI
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=postgresql://user:pass@localhost/visa_interview
JWT_SECRET=your-secret-key
ENVIRONMENT=development
LOG_LEVEL=INFO

# Stage 5 additions
WHISPER_MODEL=base  # base, small, medium
TTS_MODEL=coqui-v1
AUDIO_STORAGE_PATH=/tmp/audio
```

---

## 9.5 API Contract (Complete)

### Stage 1 APIs

```
POST /api/session/start
Request: { profile: ProfileJSON }
Response: { session_id: string, questions: QuestionArray }

POST /api/session/evaluate
Request: { session_id, profile, answers: QAArray }
Response: EvaluationJSON

GET /api/health
Response: { status: "ok", version: string }
```

### Stage 2 APIs (Additional)

```
POST /api/session/answer
Request: { session_id, question, answer, conversation_history }
Response: { 
  quality: string,
  follow_up_question: string | null,
  color_indicator: "green"|"yellow"|"red",
  hint_text: string | null 
}
```

### Stage 3 APIs (Additional)

```
GET /api/report/{session_id}
Response: FullReportJSON

GET /api/report/{session_id}/pdf
Response: Binary PDF

POST /api/report/{session_id}/share
Response: { share_url: string, expires_at: timestamp }

GET /api/shared/{share_token}
Response: FullReportJSON (read-only)
```

### Stage 4 APIs (Additional)

```
POST /api/auth/register
Request: { email, password } 
Response: { user_id, token }

POST /api/auth/login
Response: { token, user_id }

GET /api/user/sessions
Response: [ SessionSummaryArray ]

GET /api/user/progress
Response: { 
  score_trend: [...],
  weak_areas: [...],
  readiness: string,
  total_sessions: int
}

POST /api/session/start-focused
Request: { user_id, weak_area: string }
Response: { session_id, questions: QAArray }  // focused on weak area
```

---

# SECTION 10: RISKS & MITIGATIONS

---

## 10.1 Risk Register

| Risk ID | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| **R1** | AI hallucination — generating false feedback | Medium | High | Use low temperature (0.3); validate JSON schema; unit test on 50+ cases; show "AI-generated" labels |
| **R2** | AI coaches applicant to lie or misrepresent | Low | Very High | Explicit "no fabrication" instruction in all prompts; manual review of suggested answers monthly; legal disclaimer on every screen |
| **R3** | Incorrect approval probability misleads applicant | High (probability of inaccuracy) | High | Call out prominently as "simulated" and "not predictive"; include disclaimer in bold; never say "you will be approved" |
| **R4** | Latency too high — API calls take >8 seconds | Medium | Medium | Implement streaming responses for report; show loading states; set user expectation; async evaluation |
| **R5** | Red flag false positives — discourages valid applicants | Medium | Medium | Tune thresholds conservatively; manual review of false positive reports quarterly; allow user to flag incorrect feedback |
| **R6** | Data breach — user interview data exposed | Low | Very High | No PII in AI prompts (use placeholders); encrypt database; token-based auth; rate limiting; HTTPS enforced |
| **R7** | Voice STT inaccuracy causes wrong evaluation | High | High | Show transcript to user before submission; allow manual correction; Whisper accuracy baseline testing by accent |
| **R8** | User takes product as legal advice | Medium | Very High | Disclaimer on every screen (not just landing); "NOT LEGAL ADVICE" in report header; footer on every page |
| **R9** | AI model cost spikes (if using OpenAI) | Medium | Medium | Monitor tokens/session; set hard limits (max 6000 tokens/session); fallback to Ollama if cost threshold exceeded |
| **R10** | Question bank becomes stale/outdated | Medium | Medium | Quarterly review of question bank; track real applicant feedback on question relevance |
| **R11** | Competitor with visa consultant access builds better product | Medium | Low (short term) | Focus on accessibility and price (free tier); speed of iteration advantage |
| **R12** | Misuse — applicants using AI suggested answers verbatim without understanding | Medium | Medium | Require placeholders in suggestions; add "Understand your answer" prompt before report completion |

---

## 10.2 Specific Mitigations (Technical)

### AI Hallucination Mitigation

```python
def validate_ai_response(response_json, expected_schema):
    """
    Validates AI response against expected schema.
    Returns (is_valid: bool, errors: list)
    """
    required_fields = expected_schema['required_fields']
    type_checks = expected_schema['type_checks']
    value_constraints = expected_schema['value_constraints']
    
    errors = []
    
    # Check required fields
    for field in required_fields:
        if field not in response_json:
            errors.append(f"Missing required field: {field}")
    
    # Type validation
    for field, expected_type in type_checks.items():
        if field in response_json:
            if not isinstance(response_json[field], expected_type):
                errors.append(f"Type mismatch on {field}")
    
    # Value constraint validation
    for field, allowed_values in value_constraints.items():
        if field in response_json:
            if response_json[field] not in allowed_values:
                errors.append(f"Invalid value for {field}: {response_json[field]}")
    
    return len(errors) == 0, errors
```

### Misleading Advice Mitigation

Every AI prompt contains:
```
CRITICAL RULE: Do NOT suggest that the applicant provide false information, 
misrepresent their status, income, employment, purpose, or any material fact. 
If an applicant's situation is genuinely weak, acknowledge it honestly and 
help them present their real situation in the strongest truthful way possible.
Suggesting misrepresentation is grounds for visa denial and can result in 
permanent ineligibility for US visas.
```

---

# SECTION 11: FUTURE SCOPE

---

## 11.1 Feature Roadmap (Post-Stage 5)

| Feature | Description | Effort | Timeline |
|---|---|---|---|
| **Webcam Analysis** | Use browser webcam to analyze eye contact, body language, facial expression during voice sessions. Provide feedback: "You looked away frequently" | Very High | Q3 post-launch |
| **Document Pre-Check** | Allow user to describe their documents (bank statements, employer letter, etc.) and receive guidance on what an officer might probe based on document type | High | Q2 post-launch |
| **SOP / Cover Letter Builder** | AI-assisted builder for visa application supporting letters; templates for different situations (first-time, reapplying, self-employed) | High | Q2 post-launch |
| **Multi-Visa Expansion** | Expand to F-1 (Student), H-1B (Work), J-1 (Exchange), UK Visitor Visa, Schengen, Canada TRV | Very High | Year 2 |
| **Peer Practice Mode** | Two users simulate officer/applicant roles with each other; AI evaluates both | High | Year 2 |
| **Consulate-Specific Calibration** | Different consulates have different question styles (Mumbai vs. Chennai vs. Hyderabad). Allow users to select their consulate for calibrated simulation | Medium | Q4 post-launch |
| **DS-160 Integration** | User uploads or inputs DS-160 answers; system detects potential inconsistencies between DS-160 and likely interview answers | High | Year 2 |
| **Multi-Language Support** | Questions and feedback in Hindi, Yoruba, Portuguese, Spanish for non-English-first users | High | Year 2 |
| **Visa Attorney Partnership** | After report generation, offer to connect users with licensed immigration attorneys for a consultation (revenue model) | Medium | Q3 post-launch |
| **Interview Day Checklist** | Personalized checklist: documents to carry, what to wear, how to greet, what NOT to say in the waiting room | Low | Q1 post-launch |
| **Community Forum** | Moderated forum where applicants share real interview experiences, contributing to question bank improvement | Medium | Q2 post-launch |

---

## 11.2 Revenue Model (Future)

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | 2 sessions/month, basic report, no account |
| **Practice Plus** | $9.99/month | Unlimited sessions, full report, progress tracking, PDF download |
| **Interview Ready** | $24.99/month | All above + voice mode, focused practice, attorney consultation credit |
| **Institutional** | Custom | Visa consultancies, embassies, universities (bulk licenses) |

---

# SECTION 12: APPENDIX

---

## Appendix A: High-Denial Countries (Calibration Reference)

Countries where B1/B2 denial rates are historically high (for risk profile calibration):

| Country | Approximate Denial Rate (Historical) | Key Risk Factors |
|---|---|---|
| Nigeria | ~55–65% | Weak ties perception, economic immigration concern |
| Ghana | ~50% | Similar to Nigeria |
| Pakistan | ~45% | Geopolitical factors, weak tie documentation |
| India | ~20–30% | Large applicant volume, inconsistent tie evidence |
| Bangladesh | ~35–45% | Low average income, limited property ties |
| Nepal | ~40% | Young applicants, limited travel history |
| Cameroon | ~55% | Poor economic tie documentation |
| Mexico | ~20–25% | Border proximity concerns |
| China | ~15–20% | Improving but immigrant intent concerns remain |
| Brazil | ~25–35% | Economic factors |

*Note: These are approximate historical estimates based on public State Department data and are used solely for calibrating the simulation's realism — not to discriminate.*

---

## Appendix B: 214(b) Explanation (Internal Reference)

Section 214(b) of the Immigration and Nationality Act states:

*"Every alien (other than a nonimmigrant described in subparagraph (L) or (V) of section 1101(a)(15) of this title, and other than a nonimmigrant described in any provision of section 1101(a)(15)(H)(i) of this title except subclause (b1) of such section) shall be presumed to be an immigrant until he establishes to the satisfaction of the consular officer, at the time of application for a visa, and the immigration officers, at the time of application for admission, that he is entitled to a nonimmigrant status..."*

**In plain language:** You are presumed to be trying to immigrate permanently until YOU prove otherwise. The burden of proof is on the applicant, not the officer. This means:
- Silence is not neutral — it's evidence against you
- Vague answers support the presumption of immigrant intent
- Every question is an opportunity to rebut the 214(b) presumption

The system must internalize this logic in every evaluation prompt.

---

## Appendix C: Sample Session Transcript (Complete Example)

**User Profile:** 28-year-old female, IT professional, India, B2 tourist, visiting friend in NYC, employed (private company), self-funded, no prior US application, prior international travel (Dubai, Singapore).

```
Session ID: sess_789xyz

Q1 [Purpose]: "What is the purpose of your visit to the United States?"
A1: "I'm visiting my close friend Neha in New York. She's been there for 2 years on an H-1B 
    visa. I plan to stay for 15 days and return home."
Evaluation: WEAK — Mentions friend on H-1B (soft flag); has specific duration and friend 
            identified, but doesn't mention own return ties.
Follow-up generated: Yes

Q1-FU [Follow-up]: "Your friend is on a work visa in the US. Do you have any intentions of 
                    applying for work authorization in the US yourself?"
A1-FU: "No, I have a stable job at a software company in Bangalore. I'm just visiting for 
        a holiday. I have no intention to work in the US."
Evaluation: STRONG — Directly addressed the concern, stated job, stated no work intent.

Q2 [Duration]: "How long do you plan to stay and when is your return flight?"
A2: "15 days. I return on September 28th. I have my ticket booked."
Evaluation: STRONG — Specific date, return ticket confirmed.

Q3 [Employment]: "What do you do for work?"
A3: "I work in IT."
Evaluation: WEAK — No company, no role, no tenure.
Follow-up generated: Yes

Q3-FU: "Can you be more specific — who is your employer and what is your role?"
A3-FU: "I'm a product analyst at Wipro in Bangalore. I've been there 3 years. My manager 
        approved 3 weeks of annual leave for this trip."
Evaluation: STRONG — Named company, role, tenure, approved leave.

Q4 [Financial]: "Who is paying for this trip and how much do you expect to spend?"
A4: "I'm paying for it myself. I've saved about $3,500 for the trip which covers my flight, 
    hotel for the first week, and expenses."
Evaluation: STRONG — Self-funded, specific amount, covers expenses.

Q5 [Return Intent]: "What will you be coming back to in India after this trip?"
A5: "My job, my family — my parents and my younger sister live with me. I also have my 
    annual performance review in October which I absolutely cannot miss."
Evaluation: STRONG — Family ties (parents, sister), employment, specific reason (performance review).

Q6 [Prior Travel]: "Have you traveled internationally before?"
A6: "Yes, I've visited Dubai twice and Singapore once over the past 4 years."
Evaluation: STRONG — Prior travel history, multi-country, no overstays implied.

Q7 [Challenge]: "Your friend is on an H-1B. What stops you from trying to transition to a 
                 work visa once you're inside the US?"
A7: "I understand why that might be a concern. But I genuinely have no reason to do that. 
    I have a well-paying job in India that I've built for 3 years. My family is here. My 
    life is here. 15 days is a vacation, not a migration plan."
Evaluation: STRONG — Acknowledges concern directly, states home ties clearly, confident tone.

--- END OF SESSION ---

SCORES:
Return Intent: 21/25 ✅
Purpose Clarity: 22/25 ✅
Financial Credibility: 17/20 ✅
Consistency: 14/15 ✅
Conciseness: 12/15 ✅

Total: 86/100
Approval Risk: LOW RISK

Red Flags: 1 (soft) — Friend on H-1B. Addressed successfully in follow-up.

Action Plan:
- POLISH: In Q3, lead with your company name without needing a follow-up prompt.
- POLISH: In Q1, proactively mention your own job when you mention your friend's visa status.
```

---

## Appendix D: Definition of Terms

| Term | Definition |
|---|---|
| **214(b)** | Section of US Immigration law creating immigrant presumption |
| **DS-160** | Online nonimmigrant visa application form |
| **Intending Immigrant** | Someone suspected of seeking permanent US residence on a temporary visa |
| **Home-Country Ties** | Evidence binding applicant to their home country (job, family, property) |
| **Red Flag** | An answer pattern that raises officer suspicion |
| **Hard Red Flag** | A specific phrase or pattern that is almost always disqualifying |
| **Soft Red Flag** | A pattern that raises concern but can be explained |
| **Consular Officer** | US government official authorized to grant or deny visas |
| **OPT** | Optional Practical Training — F-1 student work authorization |
| **H-1B** | US specialty occupation work visa |
| **Overstay** | Remaining in the US beyond authorized stay period |
| **Session** | One complete mock interview from first question to report |
| **Dimension Score** | Score in one of the 5 evaluation categories |
| **Approval Risk Level** | Simulated likelihood of 214(b) refusal based on session performance |

---

*End of Product Requirements Document*

---

**Document Control:**

| Version | Change | Author | Date |
|---|---|---|---|
| 1.0 | Initial draft — complete PRD for all 5 stages | Sr. PM | 2025 |

**Review Required From:**
- Engineering Lead (Architecture sign-off)
- Legal Counsel (Disclaimer language review)
- QA Lead (Verification checklist review)
- At least 2 former visa applicants (User research validation)

**Next Steps:**
1. Engineering review of Stage 1 architecture (1 week)
2. Build Stage 1 MVP question bank (3 days)
3. Set up Ollama + FastAPI + React skeleton (2 days)
4. First internal test session (end of Week 2)
5. Stage 1 verification checklist completion (Week 3)
6. User testing with 5 target persona volunteers (Week 4)
7. Stage 2 planning kickoff (Week 5)

---

*This document is implementation-ready. Every section is designed to be handed directly to an engineering team, a QA team, or a product designer without requiring further clarification for Stage 1 and Stage 2 execution.*
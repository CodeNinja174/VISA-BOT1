import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const RISK_COLORS = {
  LOW_RISK: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', label: '✅ LOW RISK', desc: 'Strong likelihood of approval' },
  MODERATE_RISK: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', label: '⚠️ MODERATE RISK', desc: 'Borderline — some concerns' },
  HIGH_RISK: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800', label: '🔶 HIGH RISK', desc: 'Significant concerns identified' },
  VERY_HIGH_RISK: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-800', label: '🚨 VERY HIGH RISK', desc: 'Major preparation needed' },
}

const RATING_BADGE = {
  strong: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Strong' },
  good: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Good' },
  weak: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⚠️', label: 'Needs Work' },
  needs_work: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⚠️', label: 'Needs Work' },
  red_flag: { bg: 'bg-red-100', text: 'text-red-800', icon: '🚩', label: 'Red Flag' },
}

const PRIORITY_STYLES = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: '🔴', label: 'CRITICAL' },
  important: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🟡', label: 'IMPORTANT' },
  polish: { bg: 'bg-green-50', border: 'border-green-200', icon: '🟢', label: 'POLISH' },
}

/* ── Section A: Interview Summary Card ──────────────────────────────── */

function SummaryCard({ summary, risk }) {
  const riskStyle = RISK_COLORS[summary.risk_level] || RISK_COLORS.MODERATE_RISK
  return (
    <div className={`${riskStyle.bg} ${riskStyle.border} border rounded-xl p-6 space-y-3`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Interview Date</p>
          <p className="font-semibold">{summary.date}</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold">{summary.overall_score}<span className="text-2xl text-gray-400">/100</span></p>
          <p className={`text-sm font-semibold ${riskStyle.text}`}>{riskStyle.label}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-gray-200">
        <div><span className="text-gray-500">Visa Type:</span> <span className="font-medium">{summary.visa_type}</span></div>
        <div><span className="text-gray-500">Profile:</span> <span className="font-medium">{summary.profile_summary}</span></div>
        <div><span className="text-gray-500">Questions Asked:</span> <span className="font-medium">{summary.questions_asked}{summary.follow_ups > 0 ? ` (incl. ${summary.follow_ups} follow-ups)` : ''}</span></div>
        <div><span className="text-gray-500">Red Flags:</span> <span className="font-medium">{summary.red_flags_count}</span></div>
      </div>
    </div>
  )
}

/* ── Section B: Dimension Scores ────────────────────────────────────── */

function DimensionBar({ name, score, max, rating }) {
  const pct = Math.round((score / max) * 100)
  const badge = RATING_BADGE[rating] || RATING_BADGE.weak
  const barColor = rating === 'good' ? 'bg-green-500' : rating === 'weak' ? 'bg-red-400' : 'bg-amber-400'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium capitalize">{name.replace(/_/g, ' ')}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
          {badge.icon} {score}/{max}
        </span>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ── Section C: Per-Question Analysis ───────────────────────────────── */

function QuestionCard({ item, index, total }) {
  const [expanded, setExpanded] = useState(false)
  const badge = RATING_BADGE[item.rating] || RATING_BADGE.weak

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Q{index + 1}/{total}: {item.question_text?.slice(0, 55)}{item.question_text?.length > 55 ? '...' : ''}
          </span>
          {item.is_follow_up && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Follow-up</span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} shrink-0`}>
          {badge.icon} {badge.label}
        </span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-4 text-sm border-t">
          {/* Officer Asked */}
          <div className="pt-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Officer Asked</p>
            <p className="text-gray-800 mt-1 font-medium">"{item.question_text}"</p>
          </div>

          {/* Your Answer */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Your Answer</p>
            <p className="text-gray-800 mt-1 italic">"{item.user_answer}"</p>
          </div>

          {/* Rating */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${badge.bg} ${badge.text} text-xs font-semibold`}>
            {badge.icon} {badge.label.toUpperCase()}
          </div>

          {/* Officer Thinking */}
          {item.officer_thinking && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">💭 What a Real Officer Would Think</p>
              <p className="text-slate-700 mt-1 italic">"{item.officer_thinking}"</p>
            </div>
          )}

          {/* Weakness/Strength Bullets */}
          {item.weakness_bullets?.length > 0 && (
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                {item.rating === 'strong' ? 'Why Your Answer Works' : 'Why Your Answer Was ' + (item.rating === 'red_flag' ? 'Flagged' : 'Weak')}
              </p>
              <ul className="mt-1 space-y-1 text-gray-700">
                {item.weakness_bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Answer */}
          {item.suggested_answer && item.rating !== 'strong' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
              <p className="text-green-800 text-xs font-semibold uppercase tracking-wide">✍️ Suggested Answer</p>
              <p className="text-green-900">"{item.suggested_answer}"</p>
              {item.suggested_why_better?.length > 0 && (
                <div>
                  <p className="text-green-700 text-xs font-semibold uppercase tracking-wide mt-2">Why This Answer Works</p>
                  <ul className="mt-1 space-y-0.5 text-green-800">
                    {item.suggested_why_better.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Red Flags */}
          {item.red_flags?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-xs font-semibold uppercase tracking-wide">🚩 Red Flags</p>
              <ul className="text-red-700 mt-1 space-y-1 list-disc list-inside">
                {item.red_flags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          {/* Dimensions Affected */}
          {item.dimensions_affected?.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold">Dimensions Affected:</span>
              {item.dimensions_affected.map((d, i) => (
                <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full">{d}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Section D: Detailed Red Flags ──────────────────────────────────── */

function RedFlagCard({ flag }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
      <p className="font-semibold text-red-800">
        🚩 RED FLAG #{flag.flag_number}: {flag.title}
      </p>
      <div>
        <p className="text-xs text-red-600 font-semibold uppercase">You said:</p>
        <p className="text-red-700 italic mt-0.5">"{flag.user_said}"</p>
      </div>
      <div>
        <p className="text-xs text-red-600 font-semibold uppercase">Problem:</p>
        <p className="text-red-700 mt-0.5">{flag.problem}</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-700 font-semibold uppercase">Fix:</p>
        <p className="text-green-800 mt-0.5">"{flag.fix}"</p>
      </div>
    </div>
  )
}

/* ── Section E: Approval Probability Analysis ───────────────────────── */

function ApprovalSection({ analysis }) {
  if (!analysis) return null

  return (
    <div className="border-2 border-gray-300 rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-center">Simulated Approval Probability</h2>
      <div className="text-center">
        <p className="text-xl font-bold text-gray-800">{analysis.outcome_label}</p>
        <p className="text-sm text-gray-600 mt-1">{analysis.explanation}</p>
      </div>

      {/* Strengths / Weaknesses / Concerns */}
      <div className="space-y-2 text-sm">
        {analysis.strengths?.map((s, i) => (
          <div key={`s${i}`} className="flex items-center gap-2 text-green-700">
            <span>✅</span><span>{s}</span>
          </div>
        ))}
        {analysis.concerns?.map((c, i) => (
          <div key={`c${i}`} className="flex items-center gap-2 text-amber-700">
            <span>⚠️</span><span>{c}</span>
          </div>
        ))}
        {analysis.weaknesses?.map((w, i) => (
          <div key={`w${i}`} className="flex items-center gap-2 text-red-700">
            <span>❌</span><span>{w}</span>
          </div>
        ))}
      </div>

      {/* Profile Risk Factors */}
      {analysis.profile_risk_factors?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Risk Factors in Your Profile:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {analysis.profile_risk_factors.map((f, i) => (
              <li key={i} className="flex gap-2"><span>•</span><span>{f}</span></li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Suggestions */}
      {analysis.improvement_suggestions?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">What Would Strengthen Your Application:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {analysis.improvement_suggestions.map((s, i) => (
              <li key={i} className="flex gap-2"><span>•</span><span>{s}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/* ── Section F: Tiered Action Plan ──────────────────────────────────── */

function ActionPlanTiered({ items }) {
  if (!items || items.length === 0) return null

  const grouped = { critical: [], important: [], polish: [] }
  items.forEach((item) => {
    const bucket = grouped[item.priority] || grouped.polish
    bucket.push(item.text)
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Before Your Next Practice Session</h2>
      {Object.entries(grouped).map(([priority, texts]) => {
        if (texts.length === 0) return null
        const style = PRIORITY_STYLES[priority]
        return (
          <div key={priority} className={`${style.bg} ${style.border} border rounded-lg p-4 space-y-2`}>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
              {style.icon} {style.label}
            </p>
            <ol className="text-sm space-y-1.5 list-decimal list-inside text-gray-800">
              {texts.map((t, i) => <li key={i}>{t}</li>)}
            </ol>
          </div>
        )
      })}
    </div>
  )
}

/* ── Download Report ────────────────────────────────────────────────── */

function generateTextReport(report) {
  const lines = []
  const hr = '━'.repeat(50)

  lines.push(hr)
  lines.push('US VISA MOCK INTERVIEW — EVALUATION REPORT')
  lines.push(hr)

  const s = report.summary
  if (s) {
    lines.push(`Date: ${s.date}`)
    lines.push(`Visa Type: ${s.visa_type}`)
    lines.push(`Profile: ${s.profile_summary}`)
    lines.push(`Questions Asked: ${s.questions_asked}${s.follow_ups > 0 ? ` (incl. ${s.follow_ups} follow-ups)` : ''}`)
    lines.push(`Red Flags: ${s.red_flags_count}`)
    lines.push(`Overall Score: ${s.overall_score}/100`)
    lines.push(`Risk Level: ${s.risk_level.replace('_', ' ')}`)
  }

  lines.push('')
  lines.push(hr)
  lines.push('DIMENSION SCORES')
  lines.push(hr)
  const dims = report.dimensions || {}
  for (const [key, val] of Object.entries(dims)) {
    const bar = '█'.repeat(Math.round(val.score / val.max * 15)).padEnd(15, '░')
    lines.push(`${key.replace(/_/g, ' ').padEnd(25)} ${bar} ${val.score}/${val.max}`)
  }

  lines.push('')
  lines.push(hr)
  lines.push('PER-QUESTION ANALYSIS')
  lines.push(hr)
  const feedback = report.per_question_feedback || []
  feedback.forEach((item, i) => {
    lines.push('')
    lines.push(`QUESTION ${i + 1} OF ${feedback.length}${item.is_follow_up ? ' (Follow-up)' : ''}`)
    lines.push(`Officer: "${item.question_text}"`)
    lines.push(`You: "${item.user_answer}"`)
    lines.push(`Rating: ${item.rating.toUpperCase()}`)
    if (item.officer_thinking) lines.push(`Officer Thinking: "${item.officer_thinking}"`)
    if (item.weakness_bullets?.length) {
      item.weakness_bullets.forEach(b => lines.push(`  • ${b}`))
    }
    if (item.suggested_answer && item.rating !== 'strong') {
      lines.push(`Suggested: "${item.suggested_answer}"`)
    }
    if (item.suggested_why_better?.length) {
      item.suggested_why_better.forEach(b => lines.push(`  ✓ ${b}`))
    }
  })

  if (report.red_flags_detailed?.length) {
    lines.push('')
    lines.push(hr)
    lines.push(`RED FLAGS DETECTED (${report.red_flags_detailed.length})`)
    lines.push(hr)
    report.red_flags_detailed.forEach(f => {
      lines.push(`#${f.flag_number}: ${f.title}`)
      lines.push(`  You said: "${f.user_said}"`)
      lines.push(`  Problem: ${f.problem}`)
      lines.push(`  Fix: "${f.fix}"`)
      lines.push('')
    })
  }

  const aa = report.approval_analysis
  if (aa) {
    lines.push(hr)
    lines.push('SIMULATED APPROVAL PROBABILITY')
    lines.push(hr)
    lines.push(aa.outcome_label)
    lines.push(aa.explanation)
    aa.strengths?.forEach(s => lines.push(`  ✅ ${s}`))
    aa.concerns?.forEach(c => lines.push(`  ⚠️ ${c}`))
    aa.weaknesses?.forEach(w => lines.push(`  ❌ ${w}`))
    if (aa.profile_risk_factors?.length) {
      lines.push('Profile Risk Factors:')
      aa.profile_risk_factors.forEach(f => lines.push(`  • ${f}`))
    }
  }

  if (report.action_plan_tiered?.length) {
    lines.push('')
    lines.push(hr)
    lines.push('ACTION PLAN')
    lines.push(hr)
    const grouped = { critical: [], important: [], polish: [] }
    report.action_plan_tiered.forEach(i => (grouped[i.priority] || grouped.polish).push(i.text))
    for (const [p, items] of Object.entries(grouped)) {
      if (items.length === 0) continue
      lines.push(`[${p.toUpperCase()}]`)
      items.forEach((t, i) => lines.push(`  ${i + 1}. ${t}`))
    }
  }

  lines.push('')
  lines.push(hr)
  lines.push('DISCLAIMER: This is a simulated assessment. It does not consider your')
  lines.push('actual documents or application. Not legal advice. Consult an attorney.')
  lines.push(hr)

  return lines.join('\n')
}

/* ── Main Report Component ──────────────────────────────────────────── */

export default function Report() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('visa_report')
    if (!stored) {
      navigate('/')
      return
    }
    setReport(JSON.parse(stored))
  }, [navigate])

  if (!report) return null

  const risk = RISK_COLORS[report.approval_risk] || RISK_COLORS.MODERATE_RISK
  const dims = report.dimensions || {}
  const feedback = report.per_question_feedback || []
  const redFlagsDetailed = report.red_flags_detailed || []
  const redFlags = report.red_flags_summary || []
  const actions = report.action_plan || []
  const tieredActions = report.action_plan_tiered || []
  const summary = report.summary
  const approval = report.approval_analysis

  const handleDownload = () => {
    const text = generateTextReport(report)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visa-interview-report-${summary?.date || 'report'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Interview Report</h1>
        <p className="text-gray-500 text-sm">Your simulated B1/B2 visa interview evaluation</p>
      </div>

      {/* Section A: Summary Card */}
      {summary ? (
        <SummaryCard summary={summary} risk={risk} />
      ) : (
        <div className={`${risk.bg} ${risk.border} border rounded-xl p-6 text-center space-y-2`}>
          <p className="text-5xl font-bold">{report.overall_score}<span className="text-2xl text-gray-400">/100</span></p>
          <p className={`text-lg font-semibold ${risk.text}`}>{risk.label}</p>
        </div>
      )}

      {/* Section B: Dimension Scores */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Score Breakdown</h2>
        {Object.entries(dims).map(([key, val]) => (
          <DimensionBar key={key} name={key} score={val.score} max={val.max} rating={val.rating} />
        ))}
      </div>

      {/* Section C: Per-Question Analysis */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Per-Question Analysis</h2>
        <p className="text-sm text-gray-500">Click each question to see the officer's perspective, critique, and suggested answer.</p>
        {feedback.map((item, i) => (
          <QuestionCard key={item.question_id || i} item={item} index={i} total={feedback.length} />
        ))}
      </div>

      {/* Section D: Detailed Red Flags */}
      {redFlagsDetailed.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-red-800">🚩 Red Flags Detected ({redFlagsDetailed.length})</h2>
          {redFlagsDetailed.map((f) => (
            <RedFlagCard key={f.flag_number} flag={f} />
          ))}
        </div>
      ) : redFlags.length > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-red-800">🚩 Red Flags Detected</h2>
          <ul className="space-y-2 text-sm text-red-700">
            {redFlags.map((f, i) => (
              <li key={i} className="flex gap-2"><span>•</span><span>{f}</span></li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Section E: Approval Probability */}
      <ApprovalSection analysis={approval} />

      {/* Section F: Tiered Action Plan */}
      {tieredActions.length > 0 ? (
        <ActionPlanTiered items={tieredActions} />
      ) : actions.length > 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-blue-800">Action Plan</h2>
          <ol className="space-y-2 text-sm text-blue-900 list-decimal list-inside">
            {actions.map((a, i) => <li key={i}>{a}</li>)}
          </ol>
        </div>
      ) : null}

      {/* Disclaimer */}
      <div className="bg-gray-100 border rounded-lg p-4 text-xs text-gray-500 text-center">
        <strong>⚠️ IMPORTANT DISCLAIMER:</strong> This is a simulated assessment based on interview
        performance only. It does not consider your actual documents, financial records, or
        official application. This tool does NOT provide legal advice. Consult a licensed
        immigration attorney for official guidance.
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          📄 Download Report
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('visa_session')
            localStorage.removeItem('visa_answers')
            localStorage.removeItem('visa_report')
            navigate('/')
          }}
          className="flex-1 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition cursor-pointer"
        >
          Practice Again
        </button>
      </div>
    </div>
  )
}

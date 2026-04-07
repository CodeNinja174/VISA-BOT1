import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startSession } from '../api'

const COUNTRIES = [
  'India', 'Nigeria', 'Pakistan', 'Bangladesh', 'Nepal', 'China', 'Mexico',
  'Brazil', 'Philippines', 'Ghana', 'Cameroon', 'Vietnam', 'Indonesia',
  'Egypt', 'Turkey', 'Sri Lanka', 'Other',
]

const PURPOSES = [
  { value: 'tourism', label: 'Tourism' },
  { value: 'family_visit', label: 'Family Visit' },
  { value: 'medical', label: 'Medical Treatment' },
  { value: 'conference', label: 'Conference/Event' },
  { value: 'business_meeting', label: 'Business Meeting' },
  { value: 'other', label: 'Other' },
]

const defaultProfile = {
  visa_type: 'B2',
  citizenship: 'India',
  purpose: ['tourism'],
  employment: 'employed_private',
  prior_refusal: false,
  us_family: false,
  family_status: 'none',
  funding: 'self',
  prior_travel: false,
  monthly_income_usd: '1500-3000',
  planned_days: 14,
}

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(defaultProfile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setProfile((p) => ({ ...p, [field]: val }))
  }

  const togglePurpose = (val) => {
    setProfile((p) => {
      const has = p.purpose.includes(val)
      return {
        ...p,
        purpose: has ? p.purpose.filter((v) => v !== val) : [...p.purpose, val],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await startSession(profile)
      localStorage.setItem(
        'visa_session',
        JSON.stringify({
          session_id: data.session_id,
          questions: data.questions,
          risk_flags: data.risk_flags,
          profile,
        })
      )
      navigate('/briefing')
    } catch (err) {
      setError('Could not start session. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const selectClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-1">Profile Setup</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Tell us about your visa situation so we can personalize your interview.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Visa Type */}
        <div>
          <label className={labelClass}>Visa Type</label>
          <select value={profile.visa_type} onChange={set('visa_type')} className={selectClass}>
            <option value="B1">B1 (Business)</option>
            <option value="B2">B2 (Tourist)</option>
            <option value="B1/B2">B1/B2 (Both)</option>
          </select>
        </div>

        {/* Citizenship */}
        <div>
          <label className={labelClass}>Country of Citizenship</label>
          <select value={profile.citizenship} onChange={set('citizenship')} className={selectClass}>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className={labelClass}>Purpose of Visit (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {PURPOSES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => togglePurpose(p.value)}
                className={`px-3 py-1.5 rounded-full text-sm border transition cursor-pointer ${
                  profile.purpose.includes(p.value)
                    ? 'bg-blue-100 border-blue-400 text-blue-800'
                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Employment */}
        <div>
          <label className={labelClass}>Employment Status</label>
          <select value={profile.employment} onChange={set('employment')} className={selectClass}>
            <option value="employed_private">Employed (Private Sector)</option>
            <option value="employed_government">Employed (Government)</option>
            <option value="self_employed">Self-Employed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </div>

        {/* Prior Refusal */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="prior_refusal"
            checked={profile.prior_refusal}
            onChange={set('prior_refusal')}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="prior_refusal" className="text-sm text-gray-700">
            Have you been previously refused a US visa?
          </label>
        </div>

        {/* US Family */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="us_family"
            checked={profile.us_family}
            onChange={set('us_family')}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="us_family" className="text-sm text-gray-700">
            Do you have family members in the US?
          </label>
        </div>

        {profile.us_family && (
          <div>
            <label className={labelClass}>Family Member's Immigration Status</label>
            <select value={profile.family_status} onChange={set('family_status')} className={selectClass}>
              <option value="us_citizen">US Citizen</option>
              <option value="green_card">Green Card Holder</option>
              <option value="F1_student">Student Visa (F-1)</option>
              <option value="H1B_work">Work Visa (H-1B)</option>
              <option value="tourist_visa">Tourist Visa</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {/* Funding */}
        <div>
          <label className={labelClass}>Who is funding your trip?</label>
          <select value={profile.funding} onChange={set('funding')} className={selectClass}>
            <option value="self">Self-funded</option>
            <option value="sponsor_us">Sponsor in US</option>
            <option value="employer">Employer</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Prior Travel */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="prior_travel"
            checked={profile.prior_travel}
            onChange={set('prior_travel')}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="prior_travel" className="text-sm text-gray-700">
            Have you traveled internationally before?
          </label>
        </div>

        {/* Income */}
        <div>
          <label className={labelClass}>Approximate Monthly Income (USD)</label>
          <select value={profile.monthly_income_usd} onChange={set('monthly_income_usd')} className={selectClass}>
            <option value="<500">Less than $500</option>
            <option value="500-1500">$500 – $1,500</option>
            <option value="1500-3000">$1,500 – $3,000</option>
            <option value="3000-5000">$3,000 – $5,000</option>
            <option value=">5000">More than $5,000</option>
          </select>
        </div>

        {/* Planned Days */}
        <div>
          <label className={labelClass}>Planned Duration of Stay (days)</label>
          <input
            type="number"
            min="1"
            max="180"
            value={profile.planned_days}
            onChange={set('planned_days')}
            className={selectClass}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || profile.purpose.length === 0}
          className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Starting Session...' : 'Continue to Interview'}
        </button>
      </form>
    </div>
  )
}

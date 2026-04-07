import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VOICE_OPTIONS = [
  { value: 'en-US', label: 'US English (default)' },
  { value: 'en-GB', label: 'British English' },
  { value: 'en-AU', label: 'Australian English' },
]

export default function Briefing() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    officerSpeaks: true,
    showQuestionText: true,
    defaultInputMode: 'text',
  })

  const toggleSetting = (key) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }))
  }

  const handleStart = () => {
    localStorage.setItem('visa_interview_settings', JSON.stringify(settings))
    navigate('/interview')
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
        <h1 className="text-2xl font-bold">Pre-Interview Briefing</h1>

        <p className="text-gray-600">
          You are about to begin your mock consular interview. Answer as you would
          in the real interview. The AI will play the role of a US Consular Officer.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <h2 className="font-semibold text-amber-800">Rules</h2>
          <ul className="text-sm text-amber-900 space-y-1 list-disc list-inside">
            <li>Answer in 2–4 sentences unless more detail is required</li>
            <li>Do not volunteer information you were not asked for</li>
            <li>Do not ask the officer questions</li>
            <li>Be specific — names, dates, numbers, locations</li>
          </ul>
        </div>

        {/* Interview Settings */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            ⚙️ Interview Settings
          </h2>

          {/* Officer TTS */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-700">Officer speaks questions aloud</span>
              <p className="text-xs text-gray-400">Uses your browser's text-to-speech</p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('officerSpeaks')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                settings.officerSpeaks ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.officerSpeaks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>

          {/* Show question text */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-700">Show question text on screen</span>
              <p className="text-xs text-gray-400">Disable to practice listening only</p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('showQuestionText')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                settings.showQuestionText ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.showQuestionText ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>

          {/* Default input mode */}
          <div>
            <span className="text-sm font-medium text-gray-700">Your default input mode</span>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, defaultInputMode: 'text' }))}
                className={`px-4 py-1.5 text-sm rounded-full border transition cursor-pointer ${
                  settings.defaultInputMode === 'text'
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                ⌨️ Type
              </button>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, defaultInputMode: 'voice' }))}
                className={`px-4 py-1.5 text-sm rounded-full border transition cursor-pointer ${
                  settings.defaultInputMode === 'voice'
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                🎤 Speak
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Estimated duration: ~8–15 minutes (10–14 questions)
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500">
          <strong>Disclaimer:</strong> This is a simulation for practice purposes only.
          It does not constitute legal advice. This tool does not guarantee any visa
          outcome. Consult a licensed immigration attorney for official guidance.
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition cursor-pointer"
        >
          Begin Interview
        </button>
      </div>
    </div>
  )
}

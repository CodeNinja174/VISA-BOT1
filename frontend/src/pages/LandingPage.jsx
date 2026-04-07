import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="text-6xl">🇺🇸</div>
        <h1 className="text-4xl font-bold tracking-tight">
          Practice Your US Visa Interview Before the Real One
        </h1>
        <p className="text-lg text-gray-600">
          Simulated by AI trained on real B1/B2 consular interview patterns.
          Get instant, specific feedback on every answer.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            ✓ Realistic officer questions
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            ✓ Voice &amp; text input
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            ✓ Officer speaks aloud
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            ✓ Solo &amp; group interviews
          </span>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="mt-4 px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition cursor-pointer text-lg"
        >
          Start Free Practice Session
        </button>

        <p className="text-xs text-gray-400 mt-6">
          This tool is for practice only and does not constitute legal advice.
        </p>
      </div>
    </div>
  )
}

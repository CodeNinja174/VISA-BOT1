import { useNavigate } from 'react-router-dom'

export default function Briefing() {
  const navigate = useNavigate()

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

        <p className="text-sm text-gray-500">
          Estimated duration: ~8–12 minutes (10–12 questions)
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500">
          <strong>Disclaimer:</strong> This is a simulation for practice purposes only.
          It does not constitute legal advice. This tool does not guarantee any visa
          outcome. Consult a licensed immigration attorney for official guidance.
        </div>

        <button
          onClick={() => navigate('/interview')}
          className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition cursor-pointer"
        >
          Begin Interview
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { evaluateSession, submitAnswer } from '../api'

const MAX_TOTAL_QUESTIONS = 16

const COLOR_STYLES = {
  green: { bg: 'bg-green-50', border: 'border-green-300', dot: 'bg-green-500' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-300', dot: 'bg-yellow-500' },
  red: { bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500' },
}

export default function Interview() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [questionQueue, setQuestionQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [conversationHistory, setConversationHistory] = useState([])
  const [followUpCounts, setFollowUpCounts] = useState({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showOpener, setShowOpener] = useState(true)

  // Per-answer feedback
  const [answerFeedback, setAnswerFeedback] = useState([])
  const [activeHint, setActiveHint] = useState(null)
  const hintTimerRef = useRef(null)

  // Voice input state
  const [inputMode, setInputMode] = useState('text')
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const recognitionRef = useRef(null)

  // TTS & display settings (loaded from briefing settings)
  const [officerSpeaks, setOfficerSpeaks] = useState(true)
  const [showQuestionText, setShowQuestionText] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  // Load interview settings from briefing page
  useEffect(() => {
    try {
      const raw = localStorage.getItem('visa_interview_settings')
      if (raw) {
        const s = JSON.parse(raw)
        if (s.officerSpeaks !== undefined) setOfficerSpeaks(s.officerSpeaks)
        if (s.showQuestionText !== undefined) setShowQuestionText(s.showQuestionText)
        if (s.defaultInputMode) setInputMode(s.defaultInputMode)
      }
    } catch {}
  }, [])

  // Check for Speech Recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setVoiceSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      let finalTranscript = ''

      recognition.onresult = (event) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interim = transcript
          }
        }
        const combined = (finalTranscript + interim).slice(0, 500)
        setCurrentAnswer(combined)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognitionRef.current._resetTranscript = () => { finalTranscript = '' }
    }
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }
    }
  }, [])

  // TTS: speak text aloud as the officer
  const speakText = useCallback((text) => {
    if (!officerSpeaks || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = 0.95
    utter.pitch = 0.9
    // Try to pick a male-sounding English voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && /male|david|james|daniel|google us/i.test(v.name)
    ) || voices.find((v) => v.lang.startsWith('en-US'))
    if (preferred) utter.voice = preferred
    utter.onstart = () => setIsSpeaking(true)
    utter.onend = () => setIsSpeaking(false)
    utter.onerror = () => setIsSpeaking(false)
    utteranceRef.current = utter
    window.speechSynthesis.speak(utter)
  }, [officerSpeaks])

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  // Pre-load voices (some browsers need this)
  useEffect(() => {
    window.speechSynthesis?.getVoices()
    window.speechSynthesis?.addEventListener?.('voiceschanged', () => {})
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('visa_session')
    if (!stored) {
      navigate('/profile')
      return
    }
    const s = JSON.parse(stored)
    setSession(s)
    setQuestionQueue([...s.questions])
  }, [navigate])

  // Auto-dismiss hint after 4 seconds
  useEffect(() => {
    if (activeHint) {
      hintTimerRef.current = setTimeout(() => setActiveHint(null), 4000)
      return () => clearTimeout(hintTimerRef.current)
    }
  }, [activeHint])

  // Speak each new question when currentIndex changes (after first question)
  const prevIndexRef = useRef(-1)
  useEffect(() => {
    if (!showOpener && currentIndex > 0 && currentIndex < questionQueue.length && currentIndex !== prevIndexRef.current) {
      speakText(questionQueue[currentIndex].question_text)
    }
    prevIndexRef.current = currentIndex
  }, [currentIndex, showOpener, questionQueue, speakText])

  // Speak opener greeting on first render
  useEffect(() => {
    if (showOpener && session) {
      setTimeout(() => speakText('Good morning. Can I see your passport and appointment confirmation?'), 500)
    }
  }, [showOpener, session, speakText])

  if (!session) return null

  const totalAnswered = answers.length
  const totalQuestions = questionQueue.length
  const isFinished = currentIndex >= totalQuestions

  const handleOpenerContinue = () => {
    setShowOpener(false)
    // Speak the first question after opener
    if (questionQueue.length > 0) {
      setTimeout(() => speakText(questionQueue[0].question_text), 300)
    }
  }

  const startListening = () => {
    if (!recognitionRef.current) return
    recognitionRef.current._resetTranscript()
    setCurrentAnswer('')
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (err) {
      console.error('Failed to start recognition:', err)
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }

  const handleSubmit = async () => {
    if (!currentAnswer.trim() || submitting) return

    // Stop voice recognition if active
    if (isListening) stopListening()
    // Stop TTS if speaking
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)

    const q = questionQueue[currentIndex]
    const answerText = currentAnswer.trim()

    const newAnswer = {
      question_id: q.question_id,
      question_text: q.question_text,
      answer_text: answerText,
    }

    // Build updated state
    const updatedAnswers = [...answers, newAnswer]
    const updatedHistory = [
      ...conversationHistory,
      { role: 'officer', content: q.question_text },
      { role: 'applicant', content: answerText },
    ]

    setSubmitting(true)

    // Call real-time evaluation
    let feedback = null
    try {
      feedback = await submitAnswer(
        session.session_id,
        session.profile,
        { question_id: q.question_id, question_text: q.question_text, category: q.category },
        answerText,
        updatedHistory,
        followUpCounts,
      )
    } catch (err) {
      console.error('Real-time eval failed, continuing without feedback:', err)
    }

    // Update state
    setAnswers(updatedAnswers)
    setConversationHistory(updatedHistory)
    setCurrentAnswer('')

    // Process feedback
    const fb = {
      quality: feedback?.answer_quality || 'weak',
      color: feedback?.color_indicator || 'yellow',
      hint: feedback?.hint_text || null,
      contradiction: feedback?.contradiction_detected || false,
      contradictionDetail: feedback?.contradiction_detail || null,
    }
    setAnswerFeedback((prev) => [...prev, fb])

    // Show hint briefly
    if (fb.hint) {
      setActiveHint(fb.hint)
    }

    // Insert follow-up question if returned and we haven't hit the cap
    let nextQueue = [...questionQueue]
    if (feedback?.follow_up_question && totalQuestions < MAX_TOTAL_QUESTIONS) {
      // Insert follow-up right after current position
      nextQueue.splice(currentIndex + 1, 0, feedback.follow_up_question)
      setQuestionQueue(nextQueue)

      // Track follow-up count for the parent question
      const parentId = q.question_id.replace(/_fu\d+$/, '')
      setFollowUpCounts((prev) => ({
        ...prev,
        [parentId]: (prev[parentId] || 0) + 1,
      }))
    }

    setCurrentIndex(currentIndex + 1)
    setSubmitting(false)

    // Save progress
    localStorage.setItem('visa_answers', JSON.stringify(updatedAnswers))
  }

  const handleFinish = async () => {
    window.speechSynthesis?.cancel()
    setLoading(true)
    try {
      const result = await evaluateSession(
        session.session_id,
        session.profile,
        answers
      )
      localStorage.setItem('visa_report', JSON.stringify(result))
      navigate('/report')
    } catch {
      alert('Evaluation failed. Please ensure the backend is running and try again.')
      setLoading(false)
    }
  }

  const charCount = currentAnswer.length
  const charWarning = charCount > 400

  // Opening warmup screen
  if (showOpener) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white border rounded-xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
              CO
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Consular Officer</span>
              {isSpeaking && (
                <span className="flex items-center gap-1 text-xs text-blue-600">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  Speaking
                </span>
              )}
            </div>
          </div>

          <p className="text-lg font-medium text-gray-800">
            "Good morning. Can I see your passport and appointment confirmation?"
          </p>

          <button
            onClick={handleOpenerContinue}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition cursor-pointer"
          >
            Yes, here you go →
          </button>
        </div>
      </div>
    )
  }

  // All questions answered — show submit screen
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white border rounded-xl p-8 shadow-sm text-center space-y-6">
          {loading ? (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg font-semibold text-gray-700">
                Generating Your Report...
              </p>
              <p className="text-sm text-gray-500">
                The AI is evaluating your answers. This may take 1–3 minutes on CPU.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">
                Interview Complete — {answers.length} questions answered
              </p>
              <p className="text-sm text-gray-500">
                Click below to receive your detailed evaluation report.
              </p>
              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition cursor-pointer"
              >
                Get My Report
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const currentQ = questionQueue[currentIndex]
  const isFollowUp = currentQ.question_id.includes('_fu')

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Question {totalAnswered + 1}
          {totalQuestions > session.questions.length && (
            <span className="text-xs ml-1">(+{totalQuestions - session.questions.length} follow-ups)</span>
          )}
        </span>
        <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((totalAnswered + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Previous answer feedback (color indicator) */}
      {answerFeedback.length > 0 && (() => {
        const lastFb = answerFeedback[answerFeedback.length - 1]
        const style = COLOR_STYLES[lastFb.color] || COLOR_STYLES.yellow
        return (
          <div className={`${style.bg} ${style.border} border rounded-lg px-4 py-2 flex items-center gap-2 text-sm transition-all duration-500`}>
            <span className={`w-2.5 h-2.5 rounded-full ${style.dot} inline-block`} />
            <span className="text-gray-700">
              {lastFb.quality === 'strong' && 'Good answer.'}
              {lastFb.quality === 'weak' && 'Answer could be stronger.'}
              {lastFb.quality === 'red_flag' && 'This may raise a concern.'}
            </span>
            {lastFb.contradiction && (
              <span className="text-red-600 ml-2 font-medium text-xs">
                ⚠ Inconsistency detected
              </span>
            )}
          </div>
        )
      })()}

      {/* Floating hint toast */}
      {activeHint && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 animate-pulse">
          💡 <span className="font-medium">Hint:</span> {activeHint}
        </div>
      )}

      {/* Officer question */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${isSpeaking ? 'bg-blue-600 ring-4 ring-blue-200 animate-pulse' : 'bg-blue-700'}`}>
              CO
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Consular Officer</span>
              {isFollowUp && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  Follow-up
                </span>
              )}
              {isSpeaking && (
                <span className="text-xs text-blue-600 flex items-center gap-1">
                  <span className="w-1 h-3 bg-blue-500 rounded animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-3 bg-blue-500 rounded animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-3 bg-blue-500 rounded animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => speakText(currentQ.question_text)}
              title="Replay question"
              className="p-1.5 text-gray-400 hover:text-blue-600 transition cursor-pointer"
            >
              🔊
            </button>
            <button
              onClick={() => setShowQuestionText((v) => !v)}
              title={showQuestionText ? 'Hide text' : 'Show text'}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition cursor-pointer"
            >
              {showQuestionText ? '👁' : '👁‍🗨'}
            </button>
          </div>
        </div>

        {showQuestionText ? (
          <p className="text-lg font-medium text-gray-800">
            "{currentQ.question_text}"
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Question text hidden — listen to the officer
          </p>
        )}
      </div>

      {/* Answer input */}
      <div className="space-y-3">
        {/* Input mode toggle */}
        {voiceSupported && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Input:</span>
            <button
              onClick={() => { setInputMode('text'); if (isListening) stopListening() }}
              className={`px-3 py-1 text-xs rounded-full border transition cursor-pointer ${
                inputMode === 'text'
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              ⌨️ Type
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`px-3 py-1 text-xs rounded-full border transition cursor-pointer ${
                inputMode === 'voice'
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              🎤 Speak
            </button>
          </div>
        )}

        {/* Voice controls */}
        {inputMode === 'voice' && voiceSupported && (
          <div className="flex items-center gap-3">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={submitting}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition cursor-pointer disabled:opacity-40 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-300'
              }`}
              title={isListening ? 'Stop recording' : 'Start recording'}
            >
              {isListening ? '⏹' : '🎤'}
            </button>
            <span className={`text-sm ${isListening ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
              {isListening ? '🔴 Listening... speak now' : 'Tap mic to start'}
            </span>
          </div>
        )}

        <textarea
          value={currentAnswer}
          onChange={(e) => {
            if (e.target.value.length <= 500) setCurrentAnswer(e.target.value)
          }}
          placeholder={inputMode === 'voice' && voiceSupported
            ? 'Your speech will appear here… you can also edit it'
            : 'Type your answer here...'}
          rows={4}
          disabled={submitting}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />
        <div className="flex items-center justify-between">
          <span className={`text-xs ${charWarning ? 'text-amber-600' : 'text-gray-400'}`}>
            {charCount}/500
            {charWarning && ' — Real interview answers should be brief.'}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!currentAnswer.trim() || submitting}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-40 cursor-pointer flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                Evaluating...
              </>
            ) : (
              'Submit Answer'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

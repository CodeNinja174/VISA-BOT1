import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 600000,
})

export async function startSession(profile) {
  const res = await api.post('/session/start', { profile })
  return res.data
}

export async function evaluateSession(sessionId, profile, answers) {
  const res = await api.post('/session/evaluate', {
    session_id: sessionId,
    profile,
    answers,
  })
  return res.data
}

export async function healthCheck() {
  const res = await api.get('/health')
  return res.data
}

export async function submitAnswer(sessionId, profile, question, answerText, conversationHistory, followUpCounts) {
  const res = await api.post('/session/answer', {
    session_id: sessionId,
    profile,
    question,
    answer_text: answerText,
    conversation_history: conversationHistory,
    follow_up_counts: followUpCounts,
  })
  return res.data
}

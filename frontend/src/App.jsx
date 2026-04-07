import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ProfileSetup from './pages/ProfileSetup'
import Briefing from './pages/Briefing'
import Interview from './pages/Interview'
import Report from './pages/Report'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfileSetup />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </div>
  )
}

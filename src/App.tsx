import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Home from './pages/Home'
import CreateRoom from './pages/CreateRoom'
import AdminRoom from './pages/AdminRoom'
import ParticipantRoom from './pages/ParticipantRoom'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/admin/:roomId" element={<AdminRoom />} />
            <Route path="/room/:roomId" element={<ParticipantRoom />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

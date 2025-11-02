import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AdminRoom from './pages/AdminRoom'
import CreateRoom from './pages/CreateRoom'
import Home from './pages/Home'
import ParticipantRoom from './pages/ParticipantRoom'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
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
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

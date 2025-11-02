import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Home() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [roomCode, setRoomCode] = useState('')
  const [userName, setUserName] = useState('')

  // Load saved name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('userName')
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  const handleContinueToName = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomCode.trim()) {
      setStep(2)
    }
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomCode.trim()) {
      // Save name for future visits
      if (userName.trim()) {
        localStorage.setItem('userName', userName.trim())
      }
      navigate(`/room/${roomCode.trim().toUpperCase()}`)
    }
  }

  const handleCreateRoom = () => {
    navigate('/create')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative transition-all duration-500 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Logo/Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-accent-300 animate-pulse" />
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Realtime Q&A</h1>
        </div>
        <p className="text-white/80 text-lg">
          Real-time questions and answers for your events
        </p>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400">
            {step === 1 ? 'Join a Room' : 'Tell us your name'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? 'Enter the room code to join the session'
              : 'This helps identify you in the Q&A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleContinueToName} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomCode">Room Code</Label>
                <Input
                  id="roomCode"
                  placeholder="ABC-123"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="text-center text-xl font-mono uppercase"
                  maxLength={7}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={!roomCode.trim()}>
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Your Name (optional)</Label>
                <Input
                  id="userName"
                  placeholder="John Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-lg"
                  maxLength={50}
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We only save this in your browser's local storage to make it easier next time.
                  Nothing is stored on our servers.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" size="lg">
                  Join Room
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Create Room Link */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleCreateRoom}
          className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors"
        >
          Or create a new room as administrator
        </button>
      </div>
    </div>
  )
}

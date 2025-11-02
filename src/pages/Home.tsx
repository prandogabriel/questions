import { Sparkles, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Home() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState('')

  const handleCreateRoom = () => {
    navigate('/create')
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.trim().toUpperCase()}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative transition-all duration-500 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-10 w-10 text-accent-300 animate-pulse" />
            <h1 className="text-6xl font-extrabold text-white tracking-tight">Realtime Q&A</h1>
            <Sparkles className="h-10 w-10 text-accent-300 animate-pulse" />
          </div>
          <p className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed">
            Real-time questions and answers for your meetings and events
          </p>
          <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              No login required
            </span>
            <span>•</span>
            <span>Completely free</span>
            <span>•</span>
            <span>Real-time updates</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Room Card */}
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400">
                Create Room
              </CardTitle>
              <CardDescription>Start a new Q&A session as administrator</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateRoom} className="w-full" size="lg">
                Create New Room
              </Button>
            </CardContent>
          </Card>

          {/* Join Room Card */}
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent dark:from-secondary-400 dark:to-primary-400">
                Join Room
              </CardTitle>
              <CardDescription>Join an existing session with the code</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomCode">Room Code</Label>
                  <Input
                    id="roomCode"
                    placeholder="Ex: ABC-123"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="text-center text-lg font-mono uppercase"
                    maxLength={7}
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  disabled={!roomCode.trim()}
                >
                  Join
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

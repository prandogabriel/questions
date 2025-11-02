import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Realtime Q&A</h1>
          <p className="text-white/90 text-lg">
            Perguntas e respostas em tempo real para suas reuniões e eventos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Room Card */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Criar Sala</CardTitle>
              <CardDescription>
                Inicie uma nova sessão de Q&A como administrador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleCreateRoom}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                size="lg"
              >
                Criar Nova Sala
              </Button>
            </CardContent>
          </Card>

          {/* Join Room Card */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Entrar na Sala</CardTitle>
              <CardDescription>
                Participe de uma sessão existente com o código
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomCode">Código da Sala</Label>
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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                  disabled={!roomCode.trim()}
                >
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          <p>Sem necessidade de login • Totalmente gratuito • Em tempo real</p>
        </div>
      </div>
    </div>
  )
}

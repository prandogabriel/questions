import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createRoom } from '@/hooks/useRoom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function CreateRoom() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [roomName, setRoomName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('Você precisa estar autenticado')
      return
    }

    if (!roomName.trim()) {
      setError('Por favor, insira um nome para a sala')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const roomId = await createRoom(roomName.trim(), user.uid)
      navigate(`/admin/${roomId}`)
    } catch (err) {
      console.error('Error creating room:', err)
      setError('Erro ao criar sala. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">Criar Nova Sala</CardTitle>
          <CardDescription>
            Crie uma sala de Q&A para sua reunião ou evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Nome da Sala</Label>
              <Input
                id="roomName"
                placeholder="Ex: Reunião Trimestral Q4"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={100}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="lg"
                disabled={loading || !roomName.trim()}
              >
                {loading ? 'Criando...' : 'Criar Sala'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Voltar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

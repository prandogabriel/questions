import { Check, CheckCheck, Copy, Pin, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import {
  deleteQuestion,
  markQuestionAsAnswered,
  pinQuestion,
  useQuestions,
} from '@/hooks/useQuestions'
import { useRoom } from '@/hooks/useRoom'

export default function AdminRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId || null)
  const { questions, loading: questionsLoading } = useQuestions(roomId || null)
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePin = async (questionId: string, isPinned: boolean) => {
    if (!roomId) return
    try {
      await pinQuestion(roomId, questionId, !isPinned)
    } catch (err) {
      console.error('Error pinning question:', err)
    }
  }

  const handleMarkAnswered = async (questionId: string, isAnswered: boolean) => {
    if (!roomId) return
    try {
      await markQuestionAsAnswered(roomId, questionId, !isAnswered)
    } catch (err) {
      console.error('Error marking question:', err)
    }
  }

  const handleDelete = async (questionId: string) => {
    if (!roomId) return
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return

    try {
      await deleteQuestion(roomId, questionId)
    } catch (err) {
      console.error('Error deleting question:', err)
    }
  }

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando sala...</p>
      </div>
    )
  }

  if (roomError || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{roomError || 'Sala não encontrada'}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user is admin
  if (user?.uid !== room.adminId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Você não é o administrador desta sala.</p>
            <Button onClick={() => navigate(`/room/${roomId}`)} className="w-full">
              Entrar como Participante
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const unansweredQuestions = questions.filter((q) => !q.isAnswered)
  const answeredQuestions = questions.filter((q) => q.isAnswered)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{room.roomName}</h1>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              Sair
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded font-mono text-lg font-bold">
              {roomId}
            </code>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} className="gap-2">
              {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Modo Administrador • {unansweredQuestions.length} perguntas ativas
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Unanswered Questions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Perguntas Pendentes</h2>
          {questionsLoading ? (
            <p className="text-gray-500">Carregando perguntas...</p>
          ) : unansweredQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Nenhuma pergunta pendente ainda.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {unansweredQuestions.map((question) => (
                <Card
                  key={question.id}
                  className={`${question.isPinned ? 'border-indigo-500 border-2 bg-indigo-50' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{question.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Por: {question.author} • {question.votes} votos
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePin(question.id, question.isPinned)}
                          className={question.isPinned ? 'text-indigo-600' : ''}
                        >
                          <Pin className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAnswered(question.id, question.isAnswered)}
                          className="text-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(question.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Answered Questions */}
        {answeredQuestions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Perguntas Respondidas</h2>
            <div className="space-y-3">
              {answeredQuestions.map((question) => (
                <Card key={question.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium line-through">{question.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Por: {question.author} • {question.votes} votos
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAnswered(question.id, question.isAnswered)}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(question.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

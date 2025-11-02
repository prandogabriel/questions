import { ArrowUp, Check, Pin } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { createQuestion, unvoteQuestion, useQuestions, voteQuestion } from '@/hooks/useQuestions'
import { useRoom } from '@/hooks/useRoom'

export default function ParticipantRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId || null)
  const { questions, loading: questionsLoading } = useQuestions(roomId || null)

  const [questionText, setQuestionText] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomId || !questionText.trim()) return

    setSubmitting(true)

    try {
      await createQuestion(roomId, {
        text: questionText.trim(),
        author: authorName.trim() || undefined,
      })

      setQuestionText('')
      setAuthorName('')
      setShowForm(false)
    } catch (err) {
      console.error('Error creating question:', err)
      alert('Erro ao enviar pergunta. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (questionId: string, votedBy: string[]) => {
    if (!roomId || !user) return

    const hasVoted = votedBy.includes(user.uid)

    try {
      if (hasVoted) {
        await unvoteQuestion(roomId, questionId, user.uid)
      } else {
        await voteQuestion(roomId, questionId, user.uid)
      }
    } catch (err) {
      console.error('Error voting:', err)
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

  const unansweredQuestions = questions.filter((q) => !q.isAnswered)
  const answeredQuestions = questions.filter((q) => q.isAnswered)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{room.roomName}</h1>
              <p className="text-sm text-gray-500">{unansweredQuestions.length} perguntas ativas</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Ask Question Button/Form */}
        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            size="lg"
          >
            Fazer uma Pergunta
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nova Pergunta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Sua Pergunta</Label>
                  <Textarea
                    id="question"
                    placeholder="Digite sua pergunta aqui..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={4}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Seu Nome (opcional)</Label>
                  <Input
                    id="author"
                    placeholder="Anônimo"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    maxLength={50}
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500">Deixe em branco para enviar anonimamente</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={submitting || !questionText.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Pergunta'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setQuestionText('')
                      setAuthorName('')
                    }}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Questions List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Perguntas</h2>
          {questionsLoading ? (
            <p className="text-gray-500">Carregando perguntas...</p>
          ) : unansweredQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Nenhuma pergunta ainda. Seja o primeiro a perguntar!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {unansweredQuestions.map((question) => {
                const hasVoted = user && question.votedBy.includes(user.uid)
                return (
                  <Card
                    key={question.id}
                    className={`${question.isPinned ? 'border-indigo-500 border-2 bg-indigo-50' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleVote(question.id, question.votedBy)}
                          disabled={!user}
                          className={`flex flex-col items-center gap-1 min-w-[48px] p-2 rounded-lg transition-colors ${
                            hasVoted
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <ArrowUp className="h-5 w-5" />
                          <span className="text-sm font-bold">{question.votes}</span>
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            {question.isPinned && (
                              <Pin className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-1" />
                            )}
                            <p className="text-gray-900 font-medium">{question.text}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Por: {question.author}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Answered Questions */}
        {answeredQuestions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Perguntas Respondidas
            </h2>
            <div className="space-y-3">
              {answeredQuestions.map((question) => (
                <Card key={question.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 min-w-[48px] p-2 rounded-lg bg-gray-100 text-gray-600">
                        <ArrowUp className="h-5 w-5" />
                        <span className="text-sm font-bold">{question.votes}</span>
                      </div>

                      <div className="flex-1">
                        <p className="text-gray-900 font-medium line-through">{question.text}</p>
                        <p className="text-sm text-gray-500 mt-1">Por: {question.author}</p>
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

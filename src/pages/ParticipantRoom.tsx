import { ArrowUp, Check, Pin } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Load saved name from localStorage when showing form
  const handleShowForm = () => {
    const savedName = localStorage.getItem('userName')
    if (savedName) {
      setAuthorName(savedName)
      setIsAnonymous(false)
    } else {
      setIsAnonymous(true)
    }
    setShowForm(true)
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomId || !questionText.trim()) return

    setSubmitting(true)

    try {
      await createQuestion(roomId, {
        text: questionText.trim(),
        author: isAnonymous ? undefined : authorName.trim() || undefined,
      })

      setQuestionText('')
      // Keep the name for next time, just reset the form
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-primary-200 shadow-lg sticky top-0 z-10 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400">
                {room.roomName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unansweredQuestions.length} perguntas ativas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Ask Question Button/Form */}
        {!showForm ? (
          <Button onClick={handleShowForm} className="w-full" size="lg">
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

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="author">Seu Nome</Label>
                    <Input
                      id="author"
                      placeholder="Anônimo"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      maxLength={50}
                      disabled={submitting || isAnonymous}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={(checked: boolean) => setIsAnonymous(checked)}
                      disabled={submitting}
                    />
                    <Label
                      htmlFor="anonymous"
                      className="text-sm font-normal cursor-pointer text-gray-700 dark:text-gray-300"
                    >
                      Send as anonymous
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={submitting || !questionText.trim()}
                    className="flex-1"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Pergunta'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setQuestionText('')
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
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Perguntas
          </h2>
          {questionsLoading ? (
            <p className="text-gray-500 dark:text-gray-400">Carregando perguntas...</p>
          ) : unansweredQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
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
                    className={`transition-all duration-200 ${question.isPinned ? 'border-primary-500 border-2 bg-primary-50 dark:bg-primary-950 dark:border-primary-400' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleVote(question.id, question.votedBy)}
                          disabled={!user}
                          className={`flex flex-col items-center gap-1 min-w-[48px] p-2 rounded-lg transition-all duration-200 ${
                            hasVoted
                              ? 'bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                          }`}
                        >
                          <ArrowUp className="h-5 w-5" />
                          <span className="text-sm font-bold">{question.votes}</span>
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            {question.isPinned && (
                              <Pin className="h-4 w-4 text-primary-600 flex-shrink-0 mt-1 dark:text-primary-400" />
                            )}
                            <p className="text-gray-900 font-medium dark:text-gray-100">
                              {question.text}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                            Por: {question.author}
                          </p>
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
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              Perguntas Respondidas
            </h2>
            <div className="space-y-3">
              {answeredQuestions.map((question) => (
                <Card key={question.id} className="opacity-60 dark:opacity-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 min-w-[48px] p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        <ArrowUp className="h-5 w-5" />
                        <span className="text-sm font-bold">{question.votes}</span>
                      </div>

                      <div className="flex-1">
                        <p className="text-gray-900 font-medium line-through dark:text-gray-100">
                          {question.text}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                          Por: {question.author}
                        </p>
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

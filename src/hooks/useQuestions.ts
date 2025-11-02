import { useState, useEffect } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Question, CreateQuestionData } from '@/types'

export function useQuestions(roomId: string | null) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId) {
      setLoading(false)
      return
    }

    const questionsRef = collection(db, 'rooms', roomId, 'questions')
    const q = query(questionsRef, orderBy('createdAt', 'desc'))

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const questionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Question[]

        // Sort: pinned first, then by votes
        const sortedQuestions = questionsData.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return b.votes - a.votes
        })

        setQuestions(sortedQuestions)
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching questions:', err)
        setError('Erro ao carregar perguntas')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [roomId])

  return { questions, loading, error }
}

export async function createQuestion(
  roomId: string,
  data: CreateQuestionData
): Promise<void> {
  const questionsRef = collection(db, 'rooms', roomId, 'questions')

  const newQuestion: Omit<Question, 'id'> = {
    text: data.text,
    author: data.author || 'Anônimo',
    votes: 0,
    votedBy: [],
    isPinned: false,
    isAnswered: false,
    createdAt: new Date().toISOString(),
  }

  await addDoc(questionsRef, newQuestion)
}

export async function voteQuestion(
  roomId: string,
  questionId: string,
  userId: string
): Promise<void> {
  const questionRef = doc(db, 'rooms', roomId, 'questions', questionId)

  await updateDoc(questionRef, {
    votes: increment(1),
    votedBy: arrayUnion(userId),
  })
}

export async function unvoteQuestion(
  roomId: string,
  questionId: string,
  userId: string
): Promise<void> {
  const questionRef = doc(db, 'rooms', roomId, 'questions', questionId)

  await updateDoc(questionRef, {
    votes: increment(-1),
    votedBy: arrayRemove(userId),
  })
}

export async function pinQuestion(
  roomId: string,
  questionId: string,
  isPinned: boolean
): Promise<void> {
  const questionRef = doc(db, 'rooms', roomId, 'questions', questionId)

  await updateDoc(questionRef, {
    isPinned,
  })
}

export async function markQuestionAsAnswered(
  roomId: string,
  questionId: string,
  isAnswered: boolean
): Promise<void> {
  const questionRef = doc(db, 'rooms', roomId, 'questions', questionId)

  await updateDoc(questionRef, {
    isAnswered,
  })
}

export async function deleteQuestion(
  roomId: string,
  questionId: string
): Promise<void> {
  const questionRef = doc(db, 'rooms', roomId, 'questions', questionId)
  await deleteDoc(questionRef)
}

import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { generateRoomId } from '@/lib/utils'
import type { Room } from '@/types'

export function useRoom(roomId: string | null) {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId) {
      setLoading(false)
      return
    }

    const roomRef = doc(db, 'rooms', roomId)

    // Real-time listener
    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setRoom({ id: snapshot.id, ...snapshot.data() } as Room)
          setError(null)
        } else {
          setError('Sala não encontrada')
          setRoom(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching room:', err)
        setError('Erro ao carregar sala')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [roomId])

  return { room, loading, error }
}

export async function createRoom(
  roomName: string,
  adminEmail: string,
  adminId?: string
): Promise<string> {
  let roomId = generateRoomId()
  let attempts = 0
  const maxAttempts = 10

  // Try to find a unique room ID
  while (attempts < maxAttempts) {
    const roomRef = doc(db, 'rooms', roomId)
    const roomSnap = await getDoc(roomRef)

    if (!roomSnap.exists()) {
      // Room ID is unique, create the room
      const newRoom: Omit<Room, 'id'> = {
        roomName,
        adminEmail,
        adminId,
        createdAt: new Date().toISOString(),
      }

      await setDoc(roomRef, newRoom)
      return roomId
    }

    // Try a new ID
    roomId = generateRoomId()
    attempts++
  }

  throw new Error('Não foi possível gerar um ID único de sala')
}

export function useAdminRooms(adminEmail: string | null) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!adminEmail) {
      setRooms([])
      setLoading(false)
      return
    }

    // Query by email (primary) since all rooms have adminEmail
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('adminEmail', '==', adminEmail),
      orderBy('createdAt', 'desc'),
      limit(5)
    )

    // Real-time listener for admin's rooms
    const unsubscribe = onSnapshot(
      roomsQuery,
      (snapshot) => {
        const adminRooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Room[]

        setRooms(adminRooms)
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching admin rooms:', err)
        setError('Erro ao carregar salas')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [adminEmail])

  return { rooms, loading, error }
}

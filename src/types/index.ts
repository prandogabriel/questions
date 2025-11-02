export interface Room {
  id: string // Room ID (e.g., "ABC-123")
  roomName: string
  adminId: string // Firebase Auth UID
  createdAt: string // ISO timestamp
}

export interface Question {
  id: string // Auto-generated Firestore ID
  text: string
  author: string // "Anônimo" or user-provided name
  votes: number
  votedBy: string[] // Array of Firebase Auth UIDs
  isPinned: boolean
  isAnswered: boolean
  createdAt: string // ISO timestamp
}

export interface CreateRoomData {
  roomName: string
}

export interface CreateQuestionData {
  text: string
  author?: string // Optional, defaults to "Anônimo"
}

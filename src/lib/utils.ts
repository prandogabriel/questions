import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random room ID (e.g., "ABC-123")
export function generateRoomId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'

  const letterPart = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join('')

  const numberPart = Array.from({ length: 3 }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  ).join('')

  return `${letterPart}-${numberPart}`
}

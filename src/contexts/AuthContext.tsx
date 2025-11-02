import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailLink,
  type User,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  sendMagicLink: (email: string) => Promise<void>
  signInWithMagicLink: (email: string, link: string) => Promise<void>
  isEmailLink: (link: string) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  sendMagicLink: async () => {},
  signInWithMagicLink: async () => {},
  isEmailLink: () => false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is signing in with email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Get email from localStorage
      const email = window.localStorage.getItem('emailForSignIn')
      if (email) {
        // Sign in with email link
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            // Clear email from storage
            window.localStorage.removeItem('emailForSignIn')
            // Clean URL without reload - let React handle the navigation
            window.history.replaceState({}, document.title, '/')
          })
          .catch((error) => {
            console.error('Error signing in with email link:', error)
            // Clean URL even on error
            window.history.replaceState({}, document.title, window.location.pathname)
          })
      }
    } else {
      // Sign in anonymously for participants
      signInAnonymously(auth).catch((error) => {
        console.error('Error signing in anonymously:', error)
      })
    }

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const sendMagicLink = async (email: string) => {
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    }

    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    // Save email to localStorage to complete sign-in on redirect
    window.localStorage.setItem('emailForSignIn', email)
  }

  const signInWithMagicLink = async (email: string, link: string) => {
    await signInWithEmailLink(auth, email, link)
    window.localStorage.removeItem('emailForSignIn')
  }

  const isEmailLink = (link: string) => {
    return isSignInWithEmailLink(auth, link)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sendMagicLink,
        signInWithMagicLink,
        isEmailLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

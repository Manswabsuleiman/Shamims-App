import React, { createContext, useContext } from 'react'
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-expo'

type AuthContextValue = {
  user: { id: string; email: string | null } | null
  userId: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { isSignedIn } = useClerkAuth()
  const { signOut: clerkSignOut } = useClerk()

  const user = isSignedIn && clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
      }
    : null

  // Sign-in itself happens in LoginModal via Clerk's useSignIn.
  // This stub keeps the existing API. It isn't called anywhere now.
  const signIn = async () => 'Use the login sheet to sign in.'

  const signOut = async () => {
    await clerkSignOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.id ?? null,
        loading: !isLoaded,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
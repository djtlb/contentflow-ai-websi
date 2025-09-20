import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, auth } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is admin
  const adminEmails = ['sallykamari61@gmail.com']
  const isAdmin = user?.email ? adminEmails.includes(user.email) : false

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Test Supabase connection first
        const connectionTest = await auth.testConnection()
        if (!connectionTest.connected) {
          console.warn('Supabase connection test failed:', connectionTest.error)
        } else {
          console.log('✅ Supabase connected successfully')
        }

        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          if (session) {
            console.log('User session restored:', session.user?.email)
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
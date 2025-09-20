import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean


  loading: true

  const context 
    throw new E
  

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

      setSession(nu
      setLoading(false)
    }
    // Get initial session
      try {
        setSession(session)
      } catch (error) {

      } finally {
      }


    const {
    } = supa
     

    return () => subscript

    user,
    loading

    <AuthContext.Provider value={value
    </AuthContext.Provi
}

































import { createClient } from '@supabase/supabase-js'

// Get environment variables with the actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://krrawqhjcpqjtsgnexzj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtycmF3cWhqY3BxanRzZ25leHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzAyOTksImV4cCI6MjA3MzcwNjI5OX0.d7dAKKqsbnmVJadvwc09dFeJGND_-TKnH6Q2L5Cp4bA'

// Check if we have valid Supabase credentials
const isValidConfig = supabaseUrl && supabaseAnonKey && 
                     supabaseUrl.includes('.supabase.co') && 
                     supabaseAnonKey.startsWith('eyJ')

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: isValidConfig,
    persistSession: isValidConfig,
    detectSessionInUrl: isValidConfig
  }
})

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    if (!isValidConfig) {
      return { 
        data: null, 
        error: { message: 'Authentication service not configured. Please check Supabase credentials.' } 
      }
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Authentication service unavailable' } }
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (!isValidConfig) {
      return { 
        data: null, 
        error: { message: 'Authentication service not configured. Please check Supabase credentials.' } 
      }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Authentication service unavailable' } }
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    if (!isValidConfig) {
      return { 
        data: null, 
        error: { message: 'OAuth service not configured. Please check Supabase credentials.' } 
      }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'OAuth service unavailable' } }
    }
  },

  // Sign in with GitHub
  signInWithGitHub: async () => {
    if (!isValidConfig) {
      return { 
        data: null, 
        error: { message: 'OAuth service not configured. Please check Supabase credentials.' } 
      }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      })
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'OAuth service unavailable' } }
    }
  },

  // Sign out
  signOut: async () => {
    if (!isValidConfig) {
      return { error: null }
    }
    
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: null }
    }
  },

  // Get current session
  getSession: async () => {
    if (!isValidConfig) {
      return { session: null, error: null }
    }
    
    try {
      const { data: session, error } = await supabase.auth.getSession()
      return { session, error }
    } catch (error) {
      return { session: null, error }
    }
  },

  // Get current user
  getUser: async () => {
    if (!isValidConfig) {
      return { user: null, error: null }
    }
    
    try {
      const { data: user, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      return { user: null, error }
    }
  }
}
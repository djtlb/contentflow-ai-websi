import { createClient } from '@supabase/supabase-js'

// Get environment variables or use demo defaults for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key'

// Create Supabase client with error handling for demo mode
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Check if we're in demo mode (no real Supabase credentials)
const isDemoMode = supabaseUrl === 'https://demo-project.supabase.co' || supabaseAnonKey === 'demo-anon-key'

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    if (isDemoMode) {
      return { 
        data: null, 
        error: { message: 'Demo mode: Authentication not available. Please configure Supabase credentials.' } 
      }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (isDemoMode) {
      return { 
        data: null, 
        error: { message: 'Demo mode: Authentication not available. Please configure Supabase credentials.' } 
      }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    if (isDemoMode) {
      return { 
        data: null, 
        error: { message: 'Demo mode: OAuth not available. Please configure Supabase credentials.' } 
      }
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    return { data, error }
  },

  // Sign in with GitHub
  signInWithGitHub: async () => {
    if (isDemoMode) {
      return { 
        data: null, 
        error: { message: 'Demo mode: OAuth not available. Please configure Supabase credentials.' } 
      }
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    if (isDemoMode) {
      return { error: null }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  getSession: async () => {
    if (isDemoMode) {
      return { session: null, error: null }
    }
    
    const { data: session, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  getUser: async () => {
    if (isDemoMode) {
      return { user: null, error: null }
    }
    
    const { data: user, error } = await supabase.auth.getUser()
    return { user, error }
  }
}
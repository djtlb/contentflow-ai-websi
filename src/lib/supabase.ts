import { createClient } from '@supabase/supabase-js'

// Get environment variables or use demo defaults for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

    autoRefreshToken: tru
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
export co
  signUp: async (email: str
      email,
    })
  }
  

      password,
    return { data, error }

  signInWithGoogle: async () => {
      provider: 'google',
        redi
    })
  },
    return { data, error }
  si

      }
    return { data, error }

  signOut: a
    return { er

  getSession: async () => 
    

  // Sign in with Google
  signInWithGoogle: async () => {
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
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session











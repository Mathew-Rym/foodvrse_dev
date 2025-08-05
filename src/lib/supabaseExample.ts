import { supabase } from './supabaseClient'

// Example signup function
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    console.error('Signup error:', error.message)
    return { error }
  }

  console.log('Signed up:', data)
  return { data, error: null }
}

// Example signin function
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Signin error:', error.message)
    return { error }
  }

  console.log('Signed in:', data)
  return { data, error: null }
}

// Example signin with Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/oauth-callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'email profile',
    }
  })

  if (error) {
    console.error('Google OAuth error:', error.message)
    return { error }
  }

  console.log('Google OAuth initiated:', data)
  return { data, error: null }
}

// Example signout function
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Signout error:', error.message)
    return { error }
  }

  console.log('Signed out successfully')
  return { error: null }
}

// Example function to get user data
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Get user error:', error.message)
    return { error }
  }

  console.log('Current user:', user)
  return { user, error: null }
}

// Example function to get session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Get session error:', error.message)
    return { error }
  }

  console.log('Current session:', session)
  return { session, error: null }
} 
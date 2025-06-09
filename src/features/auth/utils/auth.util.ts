import Cookies from 'js-cookie'
import { SupabaseInstance } from '@/services/supabase.service'
import { Session } from '@supabase/supabase-js'
import { toast } from 'react-toastify'
import { AuthEnum } from '../enum/auth.enum'

export async function signInWithPassword(data: {
  email: string
  password: string
}) {
  const supabase = SupabaseInstance.getSupabase()
  const res = await supabase.auth.signInWithPassword(data)
  return { session: res?.data?.session, error: res?.error }
}

export async function signInWithGoogle() {
  const supabase = SupabaseInstance.getSupabase()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${window?.location?.origin}`,
    },
  })
  if (error) {
    console.log(error)
    toast('Tech tango glitch, Retry, please!', { type: 'error' })
  }
}

export async function signUpWithPassword(payload: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  const supabase = SupabaseInstance.getSupabase()
  const { data, error } = await supabase.auth.signUp({
    email: payload?.email,
    password: payload?.password,
    options: {
      data: {
        first_name: payload?.firstName,
        last_name: payload?.lastName,
      },
    },
  })

  if (error || !data?.user?.identities?.length) {
    throw new Error(error?.message || 'Email already exists')
  }

  return data?.user
}

export async function sendPasswordResetLink(email: string) {
  const supabase = SupabaseInstance.getSupabase()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window?.location?.origin}/auth/update-password`,
  })

  if (error) {
    throw new Error(error?.message || 'Tech tango glitch, Retry, please!')
  }
  return data
}

export async function updatePassword(password: string) {
  const supabase = SupabaseInstance.getSupabase()
  const { data, error } = await supabase.auth.updateUser({ password })
  if (error) {
    throw new Error(error?.message || 'Tech tango glitch, Retry, please!')
  }
  return data?.user
}

export async function signOut() {
  const supabase = SupabaseInstance.getSupabase()
  Cookies.remove(AuthEnum.AUTH_COOKIE_KEY)
  return supabase.auth.signOut()
}

export function getAuthToken() {
  const session = Cookies.get(AuthEnum.AUTH_COOKIE_KEY)
  if (session) {
    const sessionObj = JSON.parse(session) as Session
    if (sessionObj?.access_token) return sessionObj.access_token
  }
}

export function getUserId() {
  const session = Cookies.get(AuthEnum.AUTH_COOKIE_KEY)
  if (session) {
    const sessionObj = JSON.parse(session) as Session
    return sessionObj.user?.user_metadata?.userId
  }
}

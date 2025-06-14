import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { SupabaseInstance } from '@/services/supabase.service'
import { Session } from '@supabase/supabase-js'
import { useAuthStore } from '@/stores/auth.store'
import { AuthEnum } from '../enum/auth.enum'

function useAuth() {
  const supabase = SupabaseInstance.getSupabase()
  const setSession = useAuthStore((state) => state.setSession)

  const getSessionDataForCookie = (session: Session | null) => {
    if (session) {
      const { access_token, user, refresh_token, expires_in, expires_at } =
        session
      const { user_metadata, id, email } = user
      return JSON.stringify({
        access_token,
        user: { user_metadata, id, email },
        refresh_token,
        expires_in,
        expires_at,
      })
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const { session } = data
      const sessionDataForCookie = getSessionDataForCookie(session)
      if (sessionDataForCookie) {
        Cookies.set(AuthEnum.AUTH_COOKIE_KEY, sessionDataForCookie)
        setSession(session)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionDataForCookie = getSessionDataForCookie(session)
      if (sessionDataForCookie) {
        Cookies.set(AuthEnum.AUTH_COOKIE_KEY, sessionDataForCookie)
      }
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])
}

export default useAuth

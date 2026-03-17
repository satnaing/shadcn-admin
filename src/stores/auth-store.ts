import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_INFO = 'user_info'

interface AuthUser {
  user_id: string
  user_key: string
  username: string
  permissions: string[]
  routes: unknown[]
  expire_time?: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const userState = getCookie(USER_INFO)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  const initUser = userState ? JSON.parse(userState) : null

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(USER_INFO, JSON.stringify(user))
          } else {
            removeCookie(USER_INFO)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(USER_INFO)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

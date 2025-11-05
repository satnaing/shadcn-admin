import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { UserResponse } from '@/lib/api/auth'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

interface AuthUser {
  id: number
  email: string
  username: string | null
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  role: string[]
  status: string
  isSuperuser: boolean
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: UserResponse | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    refreshToken: string
    setRefreshToken: (refreshToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    isAuthenticated: () => boolean
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const refreshState = getCookie(REFRESH_TOKEN)
  const initToken = cookieState || ''
  const initRefreshToken = refreshState || ''

  return {
    auth: {
      user: null,
      setUser: (userResponse) => {
        if (!userResponse) {
          set((state) => ({ ...state, auth: { ...state.auth, user: null } }))
          return
        }

        const user: AuthUser = {
          id: userResponse.id,
          email: userResponse.email,
          username: userResponse.username,
          firstName: userResponse.first_name,
          lastName: userResponse.last_name,
          phoneNumber: userResponse.phone_number,
          role: [userResponse.role], // Convert to array for backward compatibility
          status: userResponse.status,
          isSuperuser: userResponse.is_superuser,
        }

        set((state) => ({ ...state, auth: { ...state.auth, user } }))
      },
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      refreshToken: initRefreshToken,
      setRefreshToken: (refreshToken) =>
        set((state) => {
          setCookie(REFRESH_TOKEN, refreshToken)
          return { ...state, auth: { ...state.auth, refreshToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(REFRESH_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, accessToken: '', refreshToken: '' },
          }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(REFRESH_TOKEN)
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: '',
            },
          }
        }),
      isAuthenticated: () => {
        const state = get()
        return !!state.auth.accessToken && !!state.auth.user
      },
    },
  }
})

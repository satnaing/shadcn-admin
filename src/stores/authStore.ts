import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = 'thisisjustarandomstring'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  user: AuthUser | null
  accessToken: string
  setUser: (user: AuthUser | null) => void
  setAccessToken: (accessToken: string) => void
  resetAccessToken: () => void
  reset: () => void
  initializeFromCookie: () => void
  initializeFromCookieSync: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState || ''

  const store = {
    user: null,
    accessToken: initToken,
    setUser: (user: AuthUser | null) => set({ user }),
    setAccessToken: (accessToken: string) => {
      Cookies.set(ACCESS_TOKEN, accessToken, {
        expires: 7,
        path: '/',
        sameSite: 'lax'
      })
      set({ accessToken })
    },
    resetAccessToken: () => {
      Cookies.remove(ACCESS_TOKEN, { path: '/' })
      set({ accessToken: '' })
    },
    reset: () => {
      Cookies.remove(ACCESS_TOKEN, { path: '/' })
      set({ user: null, accessToken: '' })
    },
    initializeFromCookie: async () => {
      const token = Cookies.get(ACCESS_TOKEN)
      if (token && !store.user) {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          const dummyUser = {
            accountNo: "ACC123456",
            email: "user@example.com",
            role: ["user"],
            exp: Date.now() + 24 * 60 * 60 * 1000
          }
          
          set({ user: dummyUser })
        } catch (error) {
          console.error('Failed to initialize user from token:', error)
          Cookies.remove(ACCESS_TOKEN)
          set({ accessToken: '', user: null })
        }
      }
    },
    initializeFromCookieSync: () => {
      const token = Cookies.get(ACCESS_TOKEN)
      if (token && !store.user) {
        try {
          const dummyUser = {
            accountNo: "ACC123456",
            email: "user@example.com",
            role: ["user"],
            exp: Date.now() + 24 * 60 * 60 * 1000
          }
          
          set({ user: dummyUser })
        } catch (error) {
          console.error('Failed to initialize user from token:', error)
          Cookies.remove(ACCESS_TOKEN)
          set({ accessToken: '', user: null })
        }
      }
    }
  }

  // Initialize synchronously if token exists
  if (initToken) {
    store.initializeFromCookieSync()
  }

  return store
})

// export const useAuth = () => useAuthStore((state) => state.auth)

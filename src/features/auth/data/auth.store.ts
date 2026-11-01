import { cookiePersistStorage } from '@/shared/cookie'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthStoreType } from './auth.type'

export const useAuthStore = create(
  persist<AuthStoreType>(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => {
        set({ user })
      },
      setAccessToken: (accessToken) => {
        set({ accessToken })
      },

      clean: () => {
        set({ user: null, accessToken: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookiePersistStorage),
    }
  )
)

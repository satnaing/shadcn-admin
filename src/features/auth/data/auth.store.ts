import { cookiePersistStorage } from '@/shared/cookie'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getPanelByRole, type Role } from '@/config/panels'
import type { AuthStoreType } from './auth.type'

export const useAuthStore = create(
  persist<AuthStoreType>(
    (set) => ({
      user: null,
      accessToken: null,
      panel: null,
      seller_id: null,
      setUser: (user) => {
        const role = (user.role ?? user.roles?.[0]?.name ?? 'admin') as Role
        const panel = user.panel ?? getPanelByRole(role)
        const sellerId = user.seller_id ?? null
        set({
          user: { ...user, role, panel, seller_id: sellerId },
          panel,
          seller_id: sellerId,
        })
      },
      setAccessToken: (accessToken) => {
        set({ accessToken })
      },
      setRole: (role: Role) => {
        const panel = getPanelByRole(role)
        set((state) => {
          if (!state.user) return state
          return {
            user: { ...state.user, role, panel },
            panel,
          }
        })
      },
      clean: () => {
        set({ user: null, accessToken: null, panel: null, seller_id: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookiePersistStorage),
    }
  )
)

import { cookiePersistStorage } from '@/shared/cookie'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getPanelByRole, type Role } from '@/config/panels'
import type { AuthStoreType, AuthUser } from './auth.type'

const defaultDevUser: AuthUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@xshop.az',
  role: 'admin',
  panel: 'admin',
  seller_id: null,
  roles: [{ id: 1, name: 'admin' }],
  status: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const useAuthStore = create(
  persist<AuthStoreType>(
    (set) => ({
      user: defaultDevUser,
      accessToken: 'mock-dev-token',
      panel: 'admin',
      seller_id: null,
      setUser: (user) => {
        const role = (user.role ?? user.roles?.[0]?.name ?? 'admin') as Role
        const panel = user.panel ?? getPanelByRole(role)
        const sellerId =
          user.seller_id ??
          (role === 'seller' || role === 'seller_staff' ? 1 : null)
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
        const sellerId =
          role === 'seller' || role === 'seller_staff' ? 1 : null
        set((state) => {
          const baseUser: AuthUser = state.user ?? defaultDevUser
          const updatedUser: AuthUser = {
            ...baseUser,
            role,
            panel,
            seller_id: sellerId,
            roles: [{ id: 1, name: role }],
          }
          return {
            user: updatedUser,
            panel,
            seller_id: sellerId,
            accessToken: state.accessToken || 'mock-dev-token',
          }
        })
      },
      clean: () => {
        set({ user: null, accessToken: null, panel: null, seller_id: null })
      },
    }),
    {
      name: 'admin2-auth',
      storage: createJSONStorage(() => cookiePersistStorage),
    }
  )
)


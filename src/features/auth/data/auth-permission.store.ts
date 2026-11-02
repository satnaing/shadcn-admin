import { create } from 'zustand'
import type { PermissionStoreType } from './auth.type'

export const usePermissionStore = create<PermissionStoreType>((set, get) => ({
  permissions: [],
  loading: true,
  setPermissions: (perms: string[]) =>
    set({ permissions: perms, loading: false }),

  clearPermissions: () => set({ permissions: [], loading: true }),

  hasPermission: (permission) => get().permissions.includes(permission),

  hasAnyPermission: (permissions) =>
    permissions.some((p) => get().permissions.includes(p)),
}))

import { create } from 'zustand'
import { env } from '@/config/env'
import type { PermissionStoreType } from './auth.type'

/**
 * An empty list means "the server has not said anything yet".
 * Only the mock API treats that as full access (so every screen can be opened
 * while developing); a real backend that returns no rights grants none.
 */
const isMockApi = () => env.VITE_API_MOCK === '1'

export const grants = (
  assigned: string[],
  required: string[],
  allowWhenEmpty: boolean
) =>
  assigned.length > 0
    ? required.some((permission) => assigned.includes(permission))
    : allowWhenEmpty

export const usePermissionStore = create<PermissionStoreType>((set, get) => ({
  permissions: [],
  // Real mode: wait for `auth/me` instead of flashing 403 on a hard refresh.
  loading: !isMockApi(),
  setPermissions: (perms: string[]) =>
    set({ permissions: perms, loading: false }),

  clearPermissions: () => set({ permissions: [], loading: false }),

  hasPermission: (permission) =>
    grants(get().permissions, [permission], isMockApi()),

  hasAnyPermission: (permissions) =>
    grants(get().permissions, permissions, isMockApi()),
}))

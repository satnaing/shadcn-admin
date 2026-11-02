import { useLocation } from '@tanstack/react-router'
import { getPanelByRole, type Panel } from '@/config/panels'
import { useAuthStore } from '@/features/auth/data/auth.store'

export type Scope = Panel

export function useScope(): Scope {
  const location = useLocation()
  const pathname = location.pathname

  if (pathname.startsWith('/seller')) {
    return 'seller'
  }
  if (pathname.startsWith('/courier')) {
    return 'courier'
  }
  if (pathname.startsWith('/supervisor')) {
    return 'supervisor'
  }
  if (pathname.startsWith('/admin')) {
    return 'admin'
  }

  const user = useAuthStore.getState().user
  const userRole = user?.role ?? user?.roles?.[0]?.name
  const userPanel = user?.panel ?? getPanelByRole(userRole)

  return userPanel ?? 'admin'
}

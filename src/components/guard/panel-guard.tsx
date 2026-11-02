import { type ReactNode } from 'react'
import { getPanelByRole, type Panel } from '@/config/panels'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { useAuthStore } from '@/features/auth/data/auth.store'
import { ForbiddenError } from '@/features/errors/forbidden'

type PanelGuardProps = {
  panel: Panel
  children: ReactNode
  fallback?: ReactNode
}

export function PanelGuard({ panel, children, fallback }: PanelGuardProps) {
  const loading = usePermissionStore((s) => s.loading)
  const user = useAuthStore((s) => s.user)

  if (loading) {
    return (
      <div
        className='flex h-full items-center justify-center'
        aria-busy='true'
      />
    )
  }

  const userRole = user?.role ?? user?.roles?.[0]?.name ?? 'admin'
  const currentPanel = user?.panel ?? getPanelByRole(userRole) ?? 'admin'

  if (currentPanel !== panel) {
    return fallback ?? <ForbiddenError />
  }

  return <>{children}</>
}

import { type ReactNode } from 'react'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'

type Props = {
  permission?: string
  permissions?: string[]
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({
  permission,
  permissions,
  children,
  fallback = null,
}: Props) {
  const hasPermission = usePermissionStore((s) => s.hasPermission)

  const isAllowed = permission
    ? hasPermission(permission)
    : permissions
      ? permissions.every((p) => hasPermission(p))
      : true

  if (!isAllowed) return <>{fallback}</>

  return <>{children}</>
}

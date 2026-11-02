import { type ReactNode } from 'react'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'

type PageGuardProps = {
  permission: string
  /**
   * Any one of these is enough. Used where a screen is reachable with either
   * the global or the own-scoped right — a seller holding only
   * `sales.view_own` must still get through.
   */
  anyPermission?: string[]
  children: ReactNode
  fallback?: ReactNode
}

export function PageGuard({
  permission,
  anyPermission,
  children,
  fallback,
}: PageGuardProps) {
  const hasPermission = usePermissionStore((s) => s.hasPermission)
  const loading = usePermissionStore((s) => s.loading)

  // On a hard refresh the permission list arrives with `auth/me`. Until then an
  // empty list is "not known yet", not "denied" — showing 403 in that window
  // makes every reload look like a permissions failure.
  if (loading) {
    return (
      <div className='flex h-full items-center justify-center' aria-busy='true' />
    )
  }

  const isAllowed = anyPermission?.length
    ? anyPermission.some(hasPermission)
    : hasPermission(permission)

  if (!isAllowed) {
    return (
      fallback ?? (
        <div className='flex h-full items-center justify-center text-muted-foreground'>
          403 – Forbidden
        </div>
      )
    )
  }

  return <>{children}</>
}

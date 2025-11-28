import { ReactNode } from 'react'
import { useAuthStore } from '@/stores/auth-store'

// Define team roles with their permissions
export type TeamRole = 'admin' | 'editor' | 'viewer' | 'guest'

export interface TeamPermissionGuardProps {
  children: ReactNode
  allowedRoles: TeamRole[]
}

export function TeamPermissionGuard({ children, allowedRoles }: TeamPermissionGuardProps) {
  const { user } = useAuthStore((state) => state.auth)

  // For demo purposes, we'll assume the user has the 'admin' role by default
  // In a real application, you would get the user's role from the team membership
  const userRole: TeamRole = 'admin'

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>
  }

  // If the user doesn't have permission, you can either show a message or redirect
  return (
    <div className='flex h-full items-center justify-center'>
      <div className='text-center'>
        <h3 className='text-lg font-medium'>Access Denied</h3>
        <p className='text-muted-foreground'>
          You don't have permission to access this feature.
        </p>
      </div>
    </div>
  )
}

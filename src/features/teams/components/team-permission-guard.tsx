import { ReactNode } from 'react'
import { TeamRole } from '../types'
import { ForbiddenError } from '@/features/errors/forbidden'

interface TeamPermissionGuardProps {
  children: ReactNode
  requiredRoles: TeamRole[]
  currentRole: TeamRole
}

export function TeamPermissionGuard({ 
  children, 
  requiredRoles, 
  currentRole 
}: TeamPermissionGuardProps) {
  // Check if current role is in required roles
  const hasPermission = requiredRoles.includes(currentRole)

  if (!hasPermission) {
    return <ForbiddenError /> 
  }

  return <>{children}</>
}

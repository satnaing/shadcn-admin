import type { WithData, WithPagination } from '@/shared/types'

export interface PermissionEntityInterface {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export type PermissionsApiResponse = WithPagination<PermissionEntityInterface[]>
export type SinglePermissionApiResponse = WithData<PermissionEntityInterface>

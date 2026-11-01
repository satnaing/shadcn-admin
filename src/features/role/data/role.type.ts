import type {
  NamedEntityInterface,
  WithData,
  WithPagination,
} from '@/shared/types'

export type RolesApiResponse = WithPagination<RoleEntityInterface[]>
export type SingleRoleApiResponse = WithData<RoleDetailInterface>

export interface RoleEntityInterface {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export interface RoleDetailInterface extends RoleEntityInterface {
  permissions: NamedEntityInterface[]
}

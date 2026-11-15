import { useQuery } from '@tanstack/react-query'
import { useBasicCrudMutations } from '@/hooks/use-basic-crud-mutations'
import type { RoleFormValues } from '../data/role.schema'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { ListQueryParams } from '@/shared/utils/list-query-string'
import { roleKeys, roleService } from '../data/role.service'

const MESSAGES = {
  createError: 'roles:form.createError',
  updateError: 'roles:form.updateError',
  deleteError: 'roles:form.deleteError',
} as const

export const useRoles = () =>
  useQuery({ queryKey: roleKeys.lists(), queryFn: roleService.list })

export const useRolesPage = (params: ListQueryParams) =>
  usePaginatedQuery({ queryKey: [...roleKeys.lists(), 'page', params], queryFn: () => roleService.page(params) })

export const useRoleMutations = () => {
  const { create, update, remove } = useBasicCrudMutations<RoleFormValues>(
    roleKeys,
    roleService,
    MESSAGES
  )

  return { createRole: create, updateRole: update, deleteRole: remove }
}

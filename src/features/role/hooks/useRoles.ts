import { useQuery } from '@tanstack/react-query'
import { useBasicCrudMutations } from '@/hooks/use-basic-crud-mutations'
import type { RoleFormValues } from '../data/role.schema'
import { roleKeys, roleService } from '../data/role.service'

const MESSAGES = {
  createError: 'roles:form.createError',
  updateError: 'roles:form.updateError',
  deleteError: 'roles:form.deleteError',
} as const

export const useRoles = () =>
  useQuery({ queryKey: roleKeys.lists(), queryFn: roleService.list })

export const useRoleMutations = () => {
  const { create, update, remove } = useBasicCrudMutations<RoleFormValues>(
    roleKeys,
    roleService,
    MESSAGES
  )

  return { createRole: create, updateRole: update, deleteRole: remove }
}

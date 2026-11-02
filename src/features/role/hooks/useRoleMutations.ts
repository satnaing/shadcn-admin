import { useBasicCrudMutations } from '@/hooks/use-basic-crud-mutations'
import type { RoleFormValues } from '@/features/role/data/role.schema'
import { roleKeys, roleService } from '@/features/role/data/role.service'

const MESSAGES = {
  createError: 'role:form.createError',
  updateError: 'role:form.updateError',
  deleteError: 'role:form.deleteError',
} as const

export function useRoleMutations() {
  const { create, update, remove } = useBasicCrudMutations<RoleFormValues>(
    roleKeys,
    roleService,
    MESSAGES
  )

  return {
    createRole: create,
    updateRole: update,
    deleteRole: remove,
  }
}

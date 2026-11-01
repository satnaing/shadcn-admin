import { useBasicCrudMutations } from '@/hooks/use-basic-crud-mutations'
import type { PermissionFormValues } from '@/features/permission/data/permission.schema'
import { permissionKeys, permissionService } from '../data/permission.service'

const MESSAGES = {
  createError: 'permission:form.createError',
  updateError: 'permission:form.updateError',
  deleteError: 'permission:form.deleteError',
} as const

export function usePermissionMutations() {
  const { create, update, remove } =
    useBasicCrudMutations<PermissionFormValues>(
      permissionKeys,
      permissionService,
      MESSAGES
    )

  return {
    createPermission: create,
    updatePermission: update,
    deletePermission: remove,
  }
}

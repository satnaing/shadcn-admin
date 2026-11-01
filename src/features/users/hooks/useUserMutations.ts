import { useCrudMutations } from '@/hooks/use-crud-mutations'
import type { CreateUserFormValues, UpdateUserFormValues } from '../data/schema'
import { userKeys, userService } from '../data/user.service'

const MESSAGES = {
  createError: 'users:form.createError',
  updateError: 'users:form.updateError',
  deleteError: 'users:form.deleteError',
  restoreError: 'users:form.restoreError',
  forceDeleteError: 'users:form.forceDeleteError',
} as const

export function useUserMutations() {
  const {
    create: createUser,
    update: updateUser,
    remove: deleteUser,
    restore: restoreUser,
    forceDelete,
  } = useCrudMutations<UpdateUserFormValues>(
    userKeys,
    {
      create: (payload) => userService.create(payload as CreateUserFormValues),
      update: userService.update,
      delete: userService.delete,
      restore: userService.restore,
      forceDelete: userService.forceDelete,
    },
    MESSAGES
  )

  return { createUser, updateUser, deleteUser, restoreUser, forceDelete }
}

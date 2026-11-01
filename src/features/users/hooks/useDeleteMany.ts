import { useBulkDelete } from '@/hooks/use-bulk-delete'
import { userKeys, userService } from '../data/user.service'
import type { UserInterface } from '../data/users.type'

export function useDeleteMany() {
  return useBulkDelete<UserInterface>({
    mutationKey: ['DELETE_USERS_BULK'],
    deleteFn: (id) => userService.delete(id),
    listKeys: userKeys.lists,
    trashKeys: userKeys.trash,
    entityLabel: 'user',
  })
}

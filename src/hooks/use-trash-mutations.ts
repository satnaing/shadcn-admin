import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18next from 'i18next'
import { toast } from 'sonner'

export interface TrashQueryKeys {
  lists: () => readonly unknown[]
  trash: () => readonly unknown[]
}

export interface TrashService {
  restore: (id: string) => Promise<unknown>
  forceDelete: (id: string) => Promise<unknown>
}

export interface TrashMutationMessages {
  restoreError: string
  forceDeleteError: string
}

export function useTrashMutations(
  queryKeys: TrashQueryKeys,
  service: TrashService,
  messages: TrashMutationMessages
) {
  const queryClient = useQueryClient()

  const invalidateLists = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.lists() })

  const invalidateTrash = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.trash() })

  const restore = useMutation({
    mutationFn: (id: string) => service.restore(id),
    onSuccess: () => {
      invalidateLists()
      invalidateTrash()
    },
    onError: () => toast.error(i18next.t(messages.restoreError)),
  })

  const forceDelete = useMutation({
    mutationFn: (id: string) => service.forceDelete(id),
    onSuccess: invalidateTrash,
    onError: () => toast.error(i18next.t(messages.forceDeleteError)),
  })

  return { restore, forceDelete }
}

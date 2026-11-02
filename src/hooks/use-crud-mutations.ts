import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18next from 'i18next'
import { toast } from 'sonner'

export interface CrudQueryKeys {
  lists: () => readonly unknown[]
  trash: () => readonly unknown[]
  detail: (id: string) => readonly unknown[]
}

export interface CrudService<TFormValues> {
  create: (payload: TFormValues) => Promise<unknown>
  update: (id: string, payload: TFormValues) => Promise<unknown>
  delete: (id: string) => Promise<unknown>
  restore: (id: string) => Promise<unknown>
  forceDelete: (id: string) => Promise<unknown>
}

export interface CrudMutationMessages {
  createError: string
  updateError: string
  deleteError: string
  restoreError: string
  forceDeleteError: string
}

export function useCrudMutations<TFormValues>(
  queryKeys: CrudQueryKeys,
  service: CrudService<TFormValues>,
  messages: CrudMutationMessages
) {
  const queryClient = useQueryClient()

  const invalidateLists = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.lists() })

  const invalidateTrash = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.trash() })

  const create = useMutation({
    mutationFn: (payload: TFormValues) => service.create(payload),
    onSuccess: invalidateLists,
    onError: () => toast.error(i18next.t(messages.createError)),
  })

  const update = useMutation({
    mutationFn: ({ id, values }: { id: string; values: TFormValues }) =>
      service.update(id, values),
    onSuccess: (_, variables) => {
      invalidateLists()
      queryClient.invalidateQueries({
        queryKey: queryKeys.detail(variables.id),
      })
    },
    onError: () => toast.error(i18next.t(messages.updateError)),
  })

  const remove = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      invalidateLists()
      invalidateTrash()
    },
    onError: () => toast.error(i18next.t(messages.deleteError)),
  })

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

  return {
    create,
    update,
    remove,
    restore,
    forceDelete,
  }
}

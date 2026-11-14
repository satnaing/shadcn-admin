import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18next from 'i18next'
import { toast } from 'sonner'

export interface BasicCrudQueryKeys {
  lists: () => readonly unknown[]
  detail?: (id: string) => readonly unknown[]
}

export interface BasicCrudService<TFormValues> {
  create: (payload: TFormValues) => Promise<unknown>
  update: (id: string, payload: TFormValues) => Promise<unknown>
  delete: (id: string | number) => Promise<unknown>
}

export interface BasicCrudMutationMessages {
  createError: string
  updateError: string
  deleteError: string
}

export function useBasicCrudMutations<TFormValues>(
  queryKeys: BasicCrudQueryKeys,
  service: BasicCrudService<TFormValues>,
  messages: BasicCrudMutationMessages
) {
  const queryClient = useQueryClient()

  const invalidateLists = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.lists() })

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
      if (queryKeys.detail) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.detail(variables.id),
        })
      }
    },
    onError: () => toast.error(i18next.t(messages.updateError)),
  })

  const remove = useMutation({
    mutationFn: (id: string | number) => service.delete(id),
    onSuccess: invalidateLists,
    onError: () => toast.error(i18next.t(messages.deleteError)),
  })

  return { create, update, remove }
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BulkDeleteError } from '@/shared/helper'
import type { WithPagination } from '@/shared/types'

interface IdentifiableEntity {
  id: number | string
}

interface BulkDeleteConfig {
  mutationKey: readonly string[]
  deleteFn: (id: string) => Promise<unknown>
  listKeys: () => readonly unknown[]
  trashKeys: () => readonly unknown[]
  entityLabel: string
}

export function useBulkDelete<TEntity extends IdentifiableEntity>(
  config: BulkDeleteConfig
) {
  const queryClient = useQueryClient()
  const { mutationKey, deleteFn, listKeys, trashKeys, entityLabel } = config

  return useMutation({
    mutationKey,
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => deleteFn(id)))

      const failed = results
        .map((result, index) =>
          result.status === 'rejected' ? ids[index] : null
        )
        .filter((id): id is string => id !== null)

      if (failed.length > 0) {
        throw new BulkDeleteError(
          `Failed to delete ${failed.length} ${entityLabel}(s)`,
          failed
        )
      }

      return { deleted: ids }
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: listKeys() })

      const snapshots: Array<{
        key: readonly unknown[]
        data: WithPagination<TEntity[]> | undefined
      }> = []

      queryClient
        .getQueryCache()
        .findAll({ queryKey: listKeys() })
        .forEach((query) => {
          const key = query.queryKey as readonly unknown[]
          const previous =
            queryClient.getQueryData<WithPagination<TEntity[]>>(key)
          snapshots.push({ key, data: previous })

          if (!previous?.data) {
            return
          }

          const before = previous.data.length
          const data = previous.data.filter(
            (entity) => !ids.includes(String(entity.id))
          )
          const removed = before - data.length
          const total = Math.max(0, (previous.meta?.total ?? before) - removed)

          queryClient.setQueryData<WithPagination<TEntity[]>>(key, {
            ...previous,
            data,
            meta: {
              ...previous.meta,
              total,
            },
          })
        })

      return { snapshots }
    },
    onError: (_error, _ids, context) => {
      context?.snapshots?.forEach(({ key, data }) => {
        if (data) {
          queryClient.setQueryData(key, data)
        }
      })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: listKeys() })
      await queryClient.invalidateQueries({ queryKey: trashKeys() })
    },
  })
}

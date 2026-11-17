import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { classifiedApi } from '@/api/modules/classified.api'
import { classifiedKeys } from './use-classified'

/** Wraps a mutation: refetch every module query on success and toast (`{{count}}` = rows a bulk write removed). */
function useAction<V>(
  fn: (v: V) => Promise<unknown>,
  toastKey: string,
  count?: (v: V) => number
) {
  const { t } = useTranslation('classified')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: (_res, v) => {
      qc.invalidateQueries({ queryKey: classifiedKeys.all })
      toast.success(t(toastKey, { count: count?.(v) }))
    },
    onError: () => toast.error(t('toast.error')),
  })
}

type WithId<T> = { id: number | string } & T

export function useClassifiedMutations() {
  return {
    setPublished: useAction(
      (v: WithId<{ is_published: boolean }>) =>
        classifiedApi.setPublished(v.id, v.is_published),
      'toast.published'
    ),
    removeProduct: useAction(
      (id: number) => classifiedApi.removeProduct(id),
      'toast.productDeleted'
    ),
    removeProducts: useAction(
      (ids: number[]) => classifiedApi.removeProducts(ids),
      'toast.productsDeleted',
      (ids) => ids.length
    ),
    createPackage: useAction(
      (values: unknown) => classifiedApi.createPackage(values),
      'toast.packageCreated'
    ),
    updatePackage: useAction(
      (v: WithId<{ values: unknown }>) =>
        classifiedApi.updatePackage(v.id, v.values),
      'toast.packageUpdated'
    ),
    removePackage: useAction(
      (id: number) => classifiedApi.removePackage(id),
      'toast.packageDeleted'
    ),
  }
}

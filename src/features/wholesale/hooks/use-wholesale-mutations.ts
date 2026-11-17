import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { wholesaleApi } from '@/api/modules/wholesale.api'
import type { ProductFormValues } from '../data/wholesale.schema'
import type { ProductFlag } from '../data/wholesale.type'
import { wholesaleKeys } from './use-wholesale'

/** Wraps a mutation: refetch every module query on success and toast (`{{count}}` = rows a bulk write removed). */
function useAction<V>(
  fn: (v: V) => Promise<unknown>,
  toastKey: string,
  count?: (v: V) => number
) {
  const { t } = useTranslation('wholesale')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: (_res, v) => {
      qc.invalidateQueries({ queryKey: wholesaleKeys.all })
      toast.success(t(toastKey, { count: count?.(v) }))
    },
    onError: () => toast.error(t('toast.error')),
  })
}

export function useWholesaleMutations() {
  return {
    createProduct: useAction(
      (values: ProductFormValues) => wholesaleApi.createProduct(values),
      'toast.created'
    ),
    updateProduct: useAction(
      (v: { id: number | string; values: ProductFormValues }) =>
        wholesaleApi.updateProduct(v.id, v.values),
      'toast.updated'
    ),
    removeProduct: useAction(
      (id: number) => wholesaleApi.removeProduct(id),
      'toast.deleted'
    ),
    removeProducts: useAction(
      (ids: number[]) => wholesaleApi.removeProducts(ids),
      'toast.bulkDeleted',
      (ids) => ids.length
    ),
    setFlag: useAction(
      (v: { id: number; flag: ProductFlag; value: boolean }) =>
        wholesaleApi.setFlag(v.id, v.flag, v.value),
      'toast.flag'
    ),
  }
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { posApi } from '@/api/modules/pos.api'
import type { AddressFormValues } from '../data/pos.schema'
import type { PosOrderPayload, PosSettings } from '../data/pos.type'
import { posKeys } from './use-pos'

/** Wraps a mutation: refetch every module query on success (stock, orders and lists all change) and toast. */
function useAction<V, R = unknown>(
  fn: (v: V) => Promise<R>,
  toastKey: string | null,
  onDone?: (res: R) => void
) {
  const { t } = useTranslation('pos')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: posKeys.all })
      if (toastKey) toast.success(t(toastKey))
      onDone?.(res)
    },
    onError: () => toast.error(t('toast.error')),
  })
}

export function usePosMutations() {
  return {
    placeOrder: useAction((v: PosOrderPayload) => posApi.placeOrder(v), null),
    setInPos: useAction(
      (v: { ids: number[]; pos: boolean }) => posApi.setInPos(v.ids, v.pos),
      'toast.productsUpdated'
    ),
    createAddress: useAction(
      (v: { customerId: number; values: AddressFormValues }) =>
        posApi.createAddress(v.customerId, v.values),
      'toast.addressSaved'
    ),
    saveSettings: useAction((v: Partial<PosSettings>) => posApi.updateSettings(v), 'toast.saved'),
    // The API returns a (signed) file URL; navigating to it downloads the receipt without leaving the page.
    receipt: useAction(
      (id: number) => posApi.receipt(id),
      null,
      (res) => window.location.assign(res.data.download_url)
    ),
  }
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { courierApi } from '@/api/modules/courier.api'
import type { CourierFormValues } from '../data/courier.schema'
import type { CourierSettings } from '../data/courier.type'
import { courierKeys } from './use-courier'

/** Wraps a mutation: refetch every module query on success (balances change on several screens) and toast. */
function useAction<V>(fn: (v: V) => Promise<unknown>, toastKey: string) {
  const { t } = useTranslation('courier')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: courierKeys.all })
      toast.success(t(toastKey))
    },
    onError: () => toast.error(t('toast.error')),
  })
}

export function useCourierMutations() {
  return {
    create: useAction(
      (v: CourierFormValues) => courierApi.create(v),
      'toast.created'
    ),
    update: useAction(
      (v: { id: number; values: CourierFormValues }) =>
        courierApi.update(v.id, v.values),
      'toast.saved'
    ),
    setBanned: useAction(
      (v: { id: number; banned: boolean }) =>
        courierApi.setBanned(v.id, v.banned),
      'toast.saved'
    ),
    collect: useAction(
      (v: { id: number; amount: number }) => courierApi.collect(v.id, v.amount),
      'toast.collected'
    ),
    pay: useAction(
      (v: { id: number; amount: number }) => courierApi.pay(v.id, v.amount),
      'toast.paid'
    ),
    saveSettings: useAction(
      (v: Partial<CourierSettings>) => courierApi.updateSettings(v),
      'toast.saved'
    ),
    requestCancel: useAction(
      (id: number) => courierApi.requestCancel(id),
      'toast.cancelRequested'
    ),
  }
}

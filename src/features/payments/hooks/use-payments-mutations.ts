import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { type ManualPayload, type PayoutPayload, paymentsApi } from '@/api/modules/payments.api'
import type { PackageKind, PayriffSettings, RechargePayload } from '../data/payments.type'
import { paymentsKeys } from './use-payments'

/** Wraps a mutation: refetch every module query on success and toast. */
function useAction<V, R = unknown>(fn: (v: V) => Promise<R>, toastText: string, onDone?: () => void) {
  const { t } = useTranslation('payments')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentsKeys.all })
      toast.success(toastText)
      onDone?.()
    },
    onError: () => toast.error(t('toast.error')),
  })
}

export function usePaymentsMutations() {
  const { t } = useTranslation('payments')
  const saved = t('toast.saved')

  return {
    saveManual: useAction((v: { id?: number; values: ManualPayload }) =>
      v.id ? paymentsApi.updateManualMethod(v.id, v.values) : paymentsApi.createManualMethod(v.values), saved),
    removeManual: useAction((id: number) => paymentsApi.deleteManualMethod(id), t('toast.deleted')),
    approveWallet: useAction((ids: number[]) => paymentsApi.approveWallet(ids), t('toast.approved')),
    recharge: useAction((v: RechargePayload) => paymentsApi.recharge(v), t('toast.recharged')),
    approvePackage: useAction((v: { kind: PackageKind; id: number }) => paymentsApi.approvePackage(v.kind, v.id), t('toast.approved')),
    savePayout: useAction((v: { id?: number; values: PayoutPayload }) =>
      v.id ? paymentsApi.updatePayoutMethod(v.id, v.values) : paymentsApi.createPayoutMethod(v.values), saved),
    removePayouts: useAction((ids: number[]) => paymentsApi.deletePayoutMethods(ids), t('toast.deleted')),
    savePayriff: useAction((v: Omit<PayriffSettings, 'active'>) => paymentsApi.updatePayriff(v), saved),
    setPayriffActive: useAction((active: boolean) => paymentsApi.setPayriffActive(active), saved),
  }
}

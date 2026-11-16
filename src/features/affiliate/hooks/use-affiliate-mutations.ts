import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { affiliateApi, type PayoutPayload } from '@/api/modules/affiliate.api'
import type {
  AffiliateSettings,
  FormElement,
  PayMethod,
} from '../data/affiliate.type'
import { affiliateKeys } from './use-affiliate'

/** Wraps a mutation: refetch every module query on success (lists, counts, balances) and toast. */
function useAction<V>(fn: (v: V) => Promise<unknown>, toastKey: string) {
  const { t } = useTranslation('affiliate')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: affiliateKeys.all })
      toast.success(t(toastKey))
    },
    onError: () => toast.error(t('toast.error')),
  })
}

export function useAffiliateMutations() {
  return {
    saveSettings: useAction(
      (v: AffiliateSettings) => affiliateApi.updateSettings(v),
      'toast.saved'
    ),
    saveOption: useAction(
      (v: { type: string; values: unknown }) =>
        affiliateApi.updateOption(v.type, v.values),
      'toast.saved'
    ),
    saveForm: useAction(
      (elements: FormElement[]) =>
        affiliateApi.updateRegistrationForm(elements),
      'toast.saved'
    ),
    setApproved: useAction(
      (v: { id: number; approved: boolean }) =>
        affiliateApi.setUserApproved(v.id, v.approved),
      'toast.approvalUpdated'
    ),
    rejectUser: useAction(
      (id: number) => affiliateApi.rejectUser(id),
      'toast.userRejected'
    ),
    payUser: useAction(
      (v: { id: number; payload: PayoutPayload }) =>
        affiliateApi.payUser(v.id, v.payload),
      'toast.paid'
    ),
    payWithdraw: useAction(
      (v: { id: number; method: PayMethod }) =>
        affiliateApi.payWithdraw(v.id, v.method),
      'toast.paid'
    ),
    rejectWithdraw: useAction(
      (id: number) => affiliateApi.rejectWithdraw(id),
      'toast.withdrawRejected'
    ),
  }
}

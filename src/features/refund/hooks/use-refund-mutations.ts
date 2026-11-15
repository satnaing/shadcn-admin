import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { type PayPayload, refundApi } from '@/api/modules/refund.api'
import type { RefundSettings } from '../data/refund.type'
import { refundKeys } from './use-refund'

type WithId<T> = { id: number | string } & T

export function useRefundMutations() {
  const { t } = useTranslation('refund')
  const qc = useQueryClient()
  const onError = () => toast.error(t('toast.error'))
  const done = (key: string) => () => {
    qc.invalidateQueries({ queryKey: refundKeys.all })
    toast.success(t(key))
  }

  return {
    pay: useMutation({
      mutationFn: ({ id, payload }: WithId<{ payload: PayPayload }>) => refundApi.pay(id, payload),
      onSuccess: done('toast.paid'),
      onError,
    }),
    reject: useMutation({
      mutationFn: ({ id, reason }: WithId<{ reason: string }>) => refundApi.reject(id, reason),
      onSuccess: done('toast.rejected'),
      onError,
    }),
    payDispute: useMutation({
      mutationFn: ({ id, payload }: WithId<{ payload: PayPayload }>) => refundApi.payDispute(id, payload),
      onSuccess: done('toast.paid'),
      onError,
    }),
    rejectDispute: useMutation({
      mutationFn: ({ id, reason }: WithId<{ reason: string }>) => refundApi.rejectDispute(id, reason),
      onSuccess: done('toast.rejected'),
      onError,
    }),
    createReason: useMutation({ mutationFn: refundApi.createReason, onSuccess: done('toast.created'), onError }),
    updateReason: useMutation({
      mutationFn: ({ id, values }: WithId<{ values: unknown }>) => refundApi.updateReason(id, values),
      onSuccess: done('toast.updated'),
      onError,
    }),
    removeReason: useMutation({ mutationFn: refundApi.removeReason, onSuccess: done('toast.deleted'), onError }),
    setReasonsActive: useMutation({
      mutationFn: ({ ids, active }: { ids: number[]; active: boolean }) => refundApi.setReasonsActive(ids, active),
      onSuccess: done('toast.updated'),
      onError,
    }),
    setCategoryDays: useMutation({
      mutationFn: ({ id, days }: WithId<{ days: number }>) => refundApi.setCategoryDays(id, days),
      onSuccess: done('toast.updated'),
      onError,
    }),
    bulkCategoryDays: useMutation({
      mutationFn: ({ ids, days }: { ids: number[]; days: number }) => refundApi.bulkCategoryDays(ids, days),
      onSuccess: done('toast.updated'),
      onError,
    }),
    saveSettings: useMutation({
      mutationFn: (values: RefundSettings) => refundApi.updateSettings(values),
      onSuccess: done('toast.updated'),
      onError,
    }),
  }
}

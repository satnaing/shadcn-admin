import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { clubPointApi } from '@/api/modules/club-point.api'
import type { ClubPointSettings, RangePayload } from '../data/club-point.type'
import { clubPointKeys } from './use-club-point'

type Result = { data?: { updated: number } } | undefined

/** Wraps a mutation: refetch every module query on success and toast (`{{count}}` = products changed by a bulk write). */
function useAction<V>(fn: (v: V) => Promise<unknown>, toastKey: string) {
  const { t } = useTranslation('club_point')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: clubPointKeys.all })
      toast.success(t(toastKey, { count: (res as Result)?.data?.updated }))
    },
    onError: () => toast.error(t('toast.error')),
  })
}

export function useClubPointMutations() {
  return {
    saveSettings: useAction(
      (v: ClubPointSettings) => clubPointApi.updateSettings(v),
      'toast.saved'
    ),
    saveProduct: useAction(
      (v: { id: number; point: number }) =>
        clubPointApi.setProductPoint(v.id, v.point),
      'toast.saved'
    ),
    saveRange: useAction(
      (v: RangePayload) => clubPointApi.setRangePoint(v),
      'toast.bulk'
    ),
    saveAll: useAction(
      (point: number) => clubPointApi.setAllPoint(point),
      'toast.bulk'
    ),
  }
}

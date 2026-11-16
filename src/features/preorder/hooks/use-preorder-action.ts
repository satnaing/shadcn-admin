import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { preorderKeys } from './use-preorder'

/** A mutation that refreshes every preorder query and toasts `toastKey` (error toast on failure). */
export function usePreorderAction<V, R = unknown>(
  mutationFn: (v: V) => Promise<R>,
  toastKey: string | null,
  onDone?: (result: R) => void
) {
  const { t } = useTranslation('preorder')
  const qc = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: preorderKeys.all })
      if (toastKey) toast.success(t(toastKey))
      onDone?.(result)
    },
    onError: () => toast.error(t('toast.error')),
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { otpApi } from '@/api/modules/otp.api'
import type { BulkSmsPayload, OtpSettings, TemplateItem } from '../data/otp.type'
import { otpKeys } from './use-otp'

/** Wraps a mutation: refetch every module query on success and toast. */
function useAction<V, R = unknown>(fn: (v: V) => Promise<R>, toastText: (res: R) => string, onDone?: (res: R) => void) {
  const { t } = useTranslation('otp')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: otpKeys.all })
      toast.success(toastText(res))
      onDone?.(res)
    },
    onError: () => toast.error(t('toast.error')),
  })
}

type TemplatePatch = Partial<Pick<TemplateItem, 'body' | 'template_id' | 'active'>>

export function useOtpMutations() {
  const { t } = useTranslation('otp')
  const saved = () => t('toast.saved')

  return {
    saveSettings: useAction((v: Partial<OtpSettings>) => otpApi.updateSettings(v), saved),
    saveGateway: useAction(
      (v: { key: string; credentials: Record<string, string> }) => otpApi.updateGateway(v.key, v.credentials),
      saved
    ),
    setGatewayActive: useAction((v: { key: string; active: boolean }) => otpApi.setGatewayActive(v.key, v.active), saved),
    saveTemplate: useAction((v: { id: number; values: TemplatePatch }) => otpApi.updateTemplate(v.id, v.values), saved),
    sendSms: useAction(
      (v: BulkSmsPayload) => otpApi.sendSms(v),
      (res) => t('toast.sent', { count: res.data.sent })
    ),
  }
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { qrcodeEventApi } from '@/api/modules/qrcode-event.api'
import type { CampaignStatus, DownloadLink, QrListParams, QrSettings } from '../data/qrcode-event.type'
import { qrKeys } from './use-qrcode-event'

type WithId<T> = { id: number | string } & T

/** The API returns a (signed) file URL; navigating to an attachment downloads it without leaving the page. */
function download({ download_url }: DownloadLink) {
  window.location.assign(download_url)
}

export function useQrMutations() {
  const { t } = useTranslation('qrcode_event')
  const qc = useQueryClient()
  const onError = () => toast.error(t('toast.error'))
  const done = (key: string) => () => {
    qc.invalidateQueries({ queryKey: qrKeys.all })
    toast.success(t(key))
  }
  const file = { onSuccess: (res: { data: DownloadLink }) => download(res.data), onError }

  return {
    createCampaign: useMutation({ mutationFn: qrcodeEventApi.createCampaign, onSuccess: done('toast.created'), onError }),
    updateCampaign: useMutation({
      mutationFn: ({ id, values }: WithId<{ values: unknown }>) => qrcodeEventApi.updateCampaign(id, values),
      onSuccess: done('toast.updated'),
      onError,
    }),
    setStatus: useMutation({
      mutationFn: ({ id, status }: WithId<{ status: CampaignStatus }>) => qrcodeEventApi.setCampaignStatus(id, status),
      onSuccess: done('toast.updated'),
      onError,
    }),
    removeCampaign: useMutation({ mutationFn: qrcodeEventApi.removeCampaign, onSuccess: done('toast.deleted'), onError }),
    createPrize: useMutation({
      mutationFn: ({ id, values }: WithId<{ values: unknown }>) => qrcodeEventApi.createPrize(id, values),
      onSuccess: done('toast.created'),
      onError,
    }),
    updatePrize: useMutation({
      mutationFn: ({ id, values }: WithId<{ values: unknown }>) => qrcodeEventApi.updatePrize(id, values),
      onSuccess: done('toast.updated'),
      onError,
    }),
    removePrize: useMutation({ mutationFn: qrcodeEventApi.removePrize, onSuccess: done('toast.deleted'), onError }),
    createBatch: useMutation({ mutationFn: qrcodeEventApi.createBatch, onSuccess: done('toast.batchCreated'), onError }),
    exportBatch: useMutation({
      mutationFn: ({ id, format }: WithId<{ format: 'xlsx' | 'csv' }>) => qrcodeEventApi.exportBatch(id, format),
      ...file,
    }),
    batchQrZip: useMutation({ mutationFn: qrcodeEventApi.batchQrZip, ...file }),
    exportCodes: useMutation({ mutationFn: (p?: QrListParams) => qrcodeEventApi.exportCodes(p), ...file }),
    exportLogs: useMutation({ mutationFn: (p?: QrListParams) => qrcodeEventApi.exportLogs(p), ...file }),
    toggleCode: useMutation({ mutationFn: qrcodeEventApi.toggleCode, onSuccess: done('toast.updated'), onError }),
    claimCode: useMutation({
      mutationFn: ({ id, note }: WithId<{ note: string }>) => qrcodeEventApi.claimCode(id, note),
      onSuccess: done('toast.claimed'),
      onError,
    }),
    saveSettings: useMutation({
      mutationFn: (values: QrSettings) => qrcodeEventApi.updateSettings(values),
      onSuccess: done('toast.updated'),
      onError,
    }),
  }
}

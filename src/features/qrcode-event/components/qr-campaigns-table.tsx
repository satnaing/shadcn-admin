import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { CAMPAIGN_STATUSES, type CampaignListItem, type CampaignStatus } from '../data/qrcode-event.type'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { useQrCampaigns } from '../hooks/use-qrcode-event'
import { useQrCampaignColumns } from './qr-campaigns-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function QrCampaignsTable({ search, navigate }: Props) {
  const { t } = useTranslation('qrcode_event')
  const [target, setTarget] = useState<CampaignListItem | null>(null)
  const { setStatus, removeCampaign } = useQrMutations()
  const onStatus = useCallback(
    (c: CampaignListItem, status: CampaignStatus) => setStatus.mutate({ id: c.id, status }),
    [setStatus]
  )
  const columns = useQrCampaignColumns(onStatus, setTarget)
  const { data } = useQrCampaigns(toServerListParams(search, { filters: ['status'] }))

  const toolbarFilters = useMemo(
    () => [
      {
        columnId: 'status',
        title: t('campaigns.columns.status'),
        mode: 'single' as const,
        options: CAMPAIGN_STATUSES.map((s) => ({ label: t(`campaign.${s}`), value: s })),
      },
    ],
    [t]
  )

  return (
    <>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('campaigns.search')}
        noResultsMessage={t('campaigns.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[{ columnId: 'status', searchKey: 'status', type: 'string' }]}
      />
      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={t('campaigns.deleteTitle')}
        desc={t('campaigns.deleteDesc', { name: target?.name })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeCampaign.isPending}
        handleConfirm={() => target && removeCampaign.mutate(target.id, { onSettled: () => setTarget(null) })}
      />
    </>
  )
}

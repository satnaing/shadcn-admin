import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Skeleton } from '@/components/ui/skeleton'
import { useQrStats } from '../hooks/use-qrcode-event'
import { QrCampaignSelect } from './qr-campaign-select'
import { QrChecksChartCard } from './qr-checks-chart-card'
import { QrPrizeBreakdown } from './qr-prize-breakdown'
import { QrStatsCards } from './qr-stats-cards'

export function QrStatsPage() {
  const { t } = useTranslation('qrcode_event')
  const [campaignId, setCampaignId] = useState<string>()
  const { data, isLoading } = useQrStats(campaignId)
  const stats = data?.data

  return (
    <AdminPageShell
      title={t('stats.title')}
      description={t('stats.description')}
      actions={<QrCampaignSelect value={campaignId} onChange={setCampaignId} />}
    >
      {isLoading || !stats ? (
        <Skeleton className='h-64 w-full' />
      ) : (
        <>
          <QrStatsCards stats={stats} />
          <div className='grid gap-4 lg:grid-cols-2'>
            <QrChecksChartCard data={stats.chart} />
            <QrPrizeBreakdown items={stats.prize_breakdown} />
          </div>
        </>
      )}
    </AdminPageShell>
  )
}

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import type { StatsResponse } from '../data/qrcode-event.type'

const KEYS = ['total', 'checked', 'unused', 'disabled', 'winners', 'winners_revealed', 'claimed', 'pending_prizes'] as const

export function QrStatsCards({ stats }: { stats: StatsResponse }) {
  const { t } = useTranslation('qrcode_event')

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {KEYS.map((key) => (
        <Card key={key}>
          <CardContent className='space-y-1'>
            <p className='text-sm text-muted-foreground'>{t(`stats.${key}`)}</p>
            <p className='text-2xl font-bold'>{stats[key].toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

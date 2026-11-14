import { FileText, Newspaper, Puzzle, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DashboardStat, DashboardStatKey } from '../data/dashboard.type'

const ICONS = {
  pages: FileText,
  blogs: Newspaper,
  modules: Puzzle,
  visits: Users,
} satisfies Record<DashboardStatKey, unknown>

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {stats.map(({ key, value, delta }) => {
        const Icon = ICONS[key]
        const Trend = delta < 0 ? TrendingDown : TrendingUp

        return (
          <Card key={key}>
            <CardContent className='flex items-start justify-between gap-2'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{t(`stats.${key}`)}</p>
                <p className='text-2xl font-bold'>{value.toLocaleString()}</p>
                <p
                  className={cn(
                    'flex items-center gap-1 text-xs',
                    delta < 0 ? 'text-destructive' : 'text-emerald-600'
                  )}
                >
                  <Trend className='size-3' />
                  {t('stats.delta', { value: Math.abs(delta) })}
                </p>
              </div>
              <Icon className='size-5 text-muted-foreground' />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import type { UsageKind, UsageStats } from '../data/ai.type'

/** Request / token cards of AEC "Token Usage" (the translation log adds a translated-strings card). */
export function AiUsageStats({ kind, stats }: { kind: UsageKind; stats?: UsageStats }) {
  const { t } = useTranslation('ai')
  const items: [string, number | undefined][] = [
    ['requests', stats?.requests],
    ['tokens', stats?.tokens],
    ...(kind === 'translation' ? ([['translations', stats?.translations]] as [string, number | undefined][]) : []),
    ['avg', stats?.avg_tokens],
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {items.map(([key, value]) => (
        <Card key={key}>
          <CardContent>
            <p className='text-sm text-muted-foreground'>{t(`usage.stats.${key}`)}</p>
            <p className='text-3xl font-semibold'>{(value ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

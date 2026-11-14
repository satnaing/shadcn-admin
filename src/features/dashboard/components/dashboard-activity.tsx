import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardActivity } from '../data/dashboard.type'

export function DashboardActivityCard({ items }: { items: DashboardActivity[] }) {
  const { t } = useTranslation('dashboard')

  return (
    <Card className='lg:col-span-3'>
      <CardHeader>
        <CardTitle>{t('activity.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>{t('activity.empty')}</p>
        ) : (
          <ul className='space-y-3'>
            {items.map((item) => (
              <li key={item.id} className='flex flex-col text-sm'>
                <span>
                  <strong>{item.actor}</strong> {t(`activity.actions.${item.action}`)}{' '}
                  <strong>{item.target}</strong>
                </span>
                <time className='text-xs text-muted-foreground' dateTime={item.at}>
                  {new Date(item.at).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

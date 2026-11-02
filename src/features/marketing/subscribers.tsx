import { Download } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { SubscribersTable } from './components/subscribers-table'
import type { SubscriberItem } from './data/marketing.type'
import { useSubscribers } from './hooks/useMarketing'
import { useMessagingMutations } from './hooks/useMessagingMutations'

export function SubscribersPage() {
  const { data: subscribers = [], isLoading } = useSubscribers()
  const { deleteSubscriber } = useMessagingMutations()

  const csvHref =
    'data:text/csv;charset=utf-8,' +
    encodeURI(
      ['Email,Tarix,Status']
        .concat(subscribers.map((s: SubscriberItem) => `${s.email},${s.subscribed_at},${s.status}`))
        .join('\n')
    )

  return (
    <>
      <AdminHeader />
      <Main className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Bülleten Abunəçiləri</h1>
            <p className='text-sm text-muted-foreground'>
              Veb-sayt xəbər bülleteninə abunə olmuş istifadəçilər
            </p>
          </div>
          <Button variant='outline' size='sm' asChild disabled={subscribers.length === 0}>
            <a href={csvHref} download='subscribers.csv'>
              <Download className='mr-2 h-4 w-4' /> CSV İxrac
            </a>
          </Button>
        </div>
        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <SubscribersTable
            subscribers={subscribers}
            onDelete={(id) => deleteSubscriber.mutate(id)}
          />
        )}
      </Main>
    </>
  )
}

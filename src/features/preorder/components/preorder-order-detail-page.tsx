import { Link } from '@tanstack/react-router'
import { ArrowLeft, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { useOrder } from '../hooks/use-preorder'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderOrderInfo } from './preorder-order-info'
import { PreorderOrderSteps } from './preorder-order-steps'

export function PreorderOrderDetailPage({ id }: { id: string }) {
  const { t } = useTranslation('preorder')
  const { data } = useOrder(id)
  const { invoice } = usePreorderMutations()
  const order = data?.data

  return (
    <AdminPageShell
      title={
        order ? t('detail.title', { code: order.code }) : t('detail.loading')
      }
      description={t('detail.description')}
      actions={
        <div className='flex gap-2'>
          <Button
            variant='outline'
            disabled={!order || invoice.isPending}
            onClick={() => order && invoice.mutate(order.id)}
          >
            <Download className='me-2 size-4' />
            {t('actions.invoice')}
          </Button>
          <Button asChild variant='outline'>
            <Link to='/admin/preorder/orders'>
              <ArrowLeft className='me-2 size-4' />
              {t('actions.back')}
            </Link>
          </Button>
        </div>
      }
    >
      {order ? (
        <div className='grid gap-4 lg:grid-cols-2'>
          <PreorderOrderInfo order={order} />
          <PreorderOrderSteps order={order} />
        </div>
      ) : (
        <Skeleton className='h-64 w-full' />
      )}
    </AdminPageShell>
  )
}

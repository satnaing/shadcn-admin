import { useState } from 'react'
import { ArrowLeft, Printer, Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from '@tanstack/react-router'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { ManageOrderDialog } from './components/manage-order-dialog'
import { OrderDetailItems } from './components/order-detail-items'
import {
  OrderDetailSummary,
  OrderPriceBreakdown,
} from './components/order-detail-summary'
import { useOrderDetail } from './hooks/useOrders'

export function OrderDetail() {
  const { t } = useTranslation('orders')
  const { id } = useParams({ strict: false })
  const { data, isLoading } = useOrderDetail(id ?? '')
  const [manageOpen, setManageOpen] = useState(false)

  const order = data?.data

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <Main fluid>
          <div className='flex h-64 items-center justify-center text-muted-foreground'>
            {t('loading', 'Yüklənir...')}
          </div>
        </Main>
      </>
    )
  }

  if (!order) {
    return (
      <>
        <AdminHeader />
        <Main fluid className='space-y-4'>
          <Button variant='ghost' asChild>
            <Link to='/admin/orders'>
              <ArrowLeft className='mr-2 size-4' />
              {t('backToOrders', 'Sifarişlərə qayıt')}
            </Link>
          </Button>
          <div className='p-6 text-center text-muted-foreground'>
            {t('orderNotFound', 'Sifariş tapılmadı')}
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/admin/orders'>
                  <ArrowLeft className='mr-1.5 size-4' />
                  {t('backToOrders', 'Geri')}
                </Link>
              </Button>
              <h1 className='text-2xl font-bold tracking-tight'>
                #{order.code}
              </h1>
            </div>
            <p className='text-xs text-muted-foreground pl-2'>
              {t('detail.placedOn', 'Sifariş tarixi')}: {order.date}
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => window.print()}
              className='gap-1.5'
            >
              <Printer className='size-4' />
              {t('detail.printInvoice', 'Faktura Çap Et')}
            </Button>
            <Button
              size='sm'
              onClick={() => setManageOpen(true)}
              className='gap-1.5'
            >
              <Settings2 className='size-4' />
              {t('dialog.title', 'Statusu İdarə Et')}
            </Button>
          </div>
        </div>

        <OrderDetailSummary order={order} />

        <OrderDetailItems items={order.items} />

        <OrderPriceBreakdown order={order} />

        <ManageOrderDialog
          order={order}
          open={manageOpen}
          onOpenChange={setManageOpen}
        />
      </Main>
    </>
  )
}

export default OrderDetail

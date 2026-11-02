import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { ManageOrderDialog } from './components/manage-order-dialog'
import { OrderFilterBar } from './components/order-filter-bar'
import { OrdersTable } from './components/orders-table'
import {
  type OrderFilterParams,
  type OrderItem,
} from './data/orders.type'
import { useOrderMutations, useOrders } from './hooks/useOrders'

export function OrdersInHouse() {
  const { t } = useTranslation('orders')
  const [filters, setFilters] = useState<OrderFilterParams>({
    page: 1,
    per_page: 10,
    seller_id: 'in_house' as unknown as number,
  })
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const [manageOpen, setManageOpen] = useState(false)

  const { data, isLoading } = useOrders(filters)
  const { deleteMutation } = useOrderMutations()

  const orders = data?.data ?? []

  const handleManage = (order: OrderItem) => {
    setSelectedOrder(order)
    setManageOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('confirmDelete', 'Bu sifarişi silmək istədiyinizə əminsiniz?'))) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('inHouseOrders.title', 'Daxili (In-House) Sifarişlər')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('inHouseOrders.subtitle', 'Yalnız daxili mağazaya aid sifarişlər')}
          </p>
        </div>

        <div className='flex flex-col gap-3 rounded-lg border bg-card p-4'>
          <OrderFilterBar
            filters={filters}
            onChange={(f) =>
              setFilters({ ...f, seller_id: 'in_house' as unknown as number })
            }
            onReset={() =>
              setFilters({
                page: 1,
                per_page: 10,
                seller_id: 'in_house' as unknown as number,
              })
            }
          />

          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            onManage={handleManage}
            onDelete={handleDelete}
          />
        </div>

        <ManageOrderDialog
          order={selectedOrder}
          open={manageOpen}
          onOpenChange={setManageOpen}
        />
      </Main>
    </>
  )
}

export default OrdersInHouse

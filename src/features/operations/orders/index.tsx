import { useState } from 'react'
import { type Order } from '@/types/api'
import { useOrders } from '@/hooks/queries/use-orders'
import { useAppStore } from '@/hooks/use-app-store'
import { PageTitle } from '@/components/page-title'
import { OrderDetailsSheet } from '../_components/order-details-sheet'
import { OrderHistoryTable } from '../_components/order-history-table'

export default function OrdersPage() {
  const shopId = useAppStore((state) => state.activeShopId)
  const {
    data: orderData,
    isLoading,
    error,
  } = useOrders({ shopId: shopId || undefined })

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openSheet, setOpenSheet] = useState(false)

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order)
    setOpenSheet(true)
  }

  const orders = orderData?.data || []

  return (
    <div className='space-y-6 p-6'>
      <PageTitle
        title='Order Manager'
        subtitle='View and manage transaction history.'
      />

      {isLoading ? (
        <div className='flex h-32 items-center justify-center text-muted-foreground'>
          Loading orders...
        </div>
      ) : error ? (
        <div className='flex h-32 items-center justify-center text-destructive'>
          Failed to load orders.
        </div>
      ) : (
        <OrderHistoryTable data={orders} onRowClick={handleRowClick} />
      )}

      <OrderDetailsSheet
        open={openSheet}
        onOpenChange={setOpenSheet}
        order={selectedOrder}
      />
    </div>
  )
}

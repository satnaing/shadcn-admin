import { useMemo } from 'react'
import { type Order, OrderStatus } from '@/types/api'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrderCard } from './order-card'
import { PrepTally } from './prep-tally'

interface KanbanBoardProps {
  orders: Order[]
  onStatusChange: (id: string, status: OrderStatus) => void
  onPrintReceipt: (order: Order) => void
  onPrintLabels: (order: Order) => void
  isUpdatingStatusId: string | null
  isPrintingReceiptId: string | null
  isPrintingLabelId: string | null
}

const COLUMNS: { id: string; label: string; statuses: OrderStatus[] }[] = [
  {
    id: 'new',
    label: 'New Orders',
    statuses: [OrderStatus.PENDING, OrderStatus.CONFIRMED],
  },
  { id: 'preparing', label: 'Preparing', statuses: [OrderStatus.PREPARING] },
  { id: 'ready', label: 'Ready for Pickup', statuses: [OrderStatus.READY] },
  { id: 'completed', label: 'Completed', statuses: [OrderStatus.COMPLETED] },
]

export function KanbanBoard({
  orders,
  onStatusChange,
  onPrintReceipt,
  onPrintLabels,
  isUpdatingStatusId,
  isPrintingReceiptId,
  isPrintingLabelId,
}: KanbanBoardProps) {
  // 1. Session Filter (Last 12 hours)
  const activeOrders = useMemo(() => {
    // Session Filter (Last 7 days to ensure data visibility in dev)
    const now = new Date().getTime()
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
    return orders.filter((o) => new Date(o.createdAt).getTime() > sevenDaysAgo)
  }, [orders])

  // 2. Memoized Grouping
  const groupedOrders = useMemo(() => {
    const groups: Record<string, Order[]> = {
      new: [],
      preparing: [],
      ready: [],
      completed: [],
    }

    activeOrders.forEach((order) => {
      const col = COLUMNS.find((c) => c.statuses.includes(order.status))
      if (col) groups[col.id].push(order)
    })

    // Sort active columns oldest first
    ;['new', 'preparing', 'ready'].forEach((id) => {
      groups[id].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    })

    // Sort completed newest first and cap at 10
    groups.completed = groups.completed
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)

    return groups
  }, [activeOrders])

  return (
    <div className='flex h-full min-h-0 flex-1 overflow-x-auto pb-4'>
      <div className='flex h-full min-w-max gap-6 px-6'>
        {COLUMNS.map((col) => {
          const colOrders = groupedOrders[col.id]
          const showTally = col.id === 'new' || col.id === 'preparing'

          return (
            <div
              key={col.id}
              className='flex h-full min-h-0 w-80 flex-col rounded-xl border bg-card/40 p-4 backdrop-blur-sm'
            >
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-sm font-bold tracking-wider text-muted-foreground uppercase'>
                    {col.label}
                  </h3>
                  <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary'>
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {showTally && <PrepTally orders={colOrders} />}

              <ScrollArea className='-mr-2 min-h-0 flex-1 pr-2'>
                <div className='flex flex-col gap-3 pb-4'>
                  {colOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={onStatusChange}
                      onPrintReceipt={onPrintReceipt}
                      onPrintLabels={onPrintLabels}
                      isUpdatingStatus={isUpdatingStatusId === order.id}
                      isPrintingReceipt={isPrintingReceiptId === order.id}
                      isPrintingLabel={isPrintingLabelId === order.id}
                    />
                  ))}
                  {colOrders.length === 0 && (
                    <div className='flex h-32 items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 text-xs font-medium tracking-widest text-muted-foreground/60 uppercase'>
                      Clear
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )
        })}
      </div>
    </div>
  )
}

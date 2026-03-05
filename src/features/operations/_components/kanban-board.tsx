import { type OrderStatus } from '@/types/api'
import { type KdsBoardState, type KdsOrder } from '@/types/kds'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrderCard } from './order-card'
import { PrepTally } from './prep-tally'

interface KanbanBoardProps {
  boardState: KdsBoardState
}

const COLUMNS = [
  { id: 'PLACED', title: 'New Orders', status: 'ORDER_PLACED' as OrderStatus },
  { id: 'CONFIRMED', title: 'Confirmed', status: 'CONFIRMED' as OrderStatus },
  { id: 'PREPARING', title: 'Preparing', status: 'PREPARING' as OrderStatus },
  { id: 'READY', title: 'Ready', status: 'READY' as OrderStatus },
]

export function KanbanBoard({ boardState }: KanbanBoardProps) {
  // We no longer need client-side filtering or grouping, the backend handles this via /kds API
  // and the Socket.io updates keep it fresh.

  return (
    <div className='flex h-full min-h-0 flex-1 overflow-x-auto pb-4'>
      <div className='flex h-full min-w-max gap-6 px-6'>
        {COLUMNS.map((col) => {
          // Direct access from the pre-grouped KdsBoardState
          const columnOrders = boardState[col.status] || []
          const showTally = col.id === 'PENDING' || col.id === 'PREPARING'

          return (
            <div
              key={col.id}
              className='flex h-full min-h-0 w-80 flex-col rounded-xl border bg-card/40 p-4 backdrop-blur-sm'
            >
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='font-semibold tracking-tight'>
                  {col.title}{' '}
                  <span className='ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary'>
                    {columnOrders.length}
                  </span>
                </h3>
              </div>

              {showTally && columnOrders.length > 0 && (
                <div className='mb-4'>
                  <PrepTally orders={columnOrders} />
                </div>
              )}

              <ScrollArea className='min-h-0 flex-1 pr-4'>
                <div className='flex flex-col gap-3 pb-2'>
                  {columnOrders.map((order: KdsOrder) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {columnOrders.length === 0 && (
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

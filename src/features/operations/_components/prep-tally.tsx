import { useMemo } from 'react'
import { type Order } from '@/types/api'
import { Badge } from '@/components/ui/badge'

interface PrepTallyProps {
  orders: Order[]
}

export function PrepTally({ orders }: PrepTallyProps) {
  const tallies = useMemo(() => {
    const map = new Map<string, number>()

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const name = item.name as unknown as string
        const current = map.get(name) || 0
        map.set(name, current + item.quantity)
      })
    })

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [orders])

  if (tallies.length === 0) return null

  return (
    <div className='mb-3 flex flex-col gap-1.5 rounded-lg border border-primary/10 bg-primary/5 p-2'>
      <div className='flex items-center justify-between text-[10px] font-bold tracking-wider text-primary/70 uppercase'>
        <span>Prep Tally</span>
        <span>{orders.length} Orders</span>
      </div>
      <div className='flex flex-wrap gap-1.5'>
        {tallies.map((tally) => (
          <Badge
            key={tally.name}
            variant='secondary'
            className='border-primary/20 bg-background px-2 py-0 text-[11px] font-medium'
          >
            <span className='mr-1 font-bold text-primary'>{tally.count}x</span>
            <span className='max-w-[120px] truncate'>{tally.name}</span>
          </Badge>
        ))}
      </div>
    </div>
  )
}

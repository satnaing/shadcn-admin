import { useMemo } from 'react'
import {
  type KdsOrder,
  type KdsOrderOption,
  type KdsOrderItem,
} from '@/types/kds'
import { Badge } from '@/components/ui/badge'

interface PrepTallyProps {
  orders: KdsOrder[]
}

export function PrepTally({ orders }: PrepTallyProps) {
  const tallies = useMemo(() => {
    const counts: {
      [productName: string]: {
        total: number
        modifiers: { [modifierName: string]: number }
      }
    } = {}

    orders.forEach((order) => {
      order.items?.forEach((item: KdsOrderItem) => {
        const rawProductName = item.productName as unknown
        const name =
          typeof rawProductName === 'string'
            ? rawProductName
            : (rawProductName as Record<string, string>)?.en || 'Product'

        if (!counts[name]) {
          counts[name] = { total: 0, modifiers: {} }
        }
        counts[name].total += item.quantity

        // Aggregate high-impact modifiers (e.g., extra shots, alt milks)
        item.options?.forEach((opt: KdsOrderOption) => {
          const rawOptName = opt.optionName as unknown
          const optName =
            typeof rawOptName === 'string'
              ? rawOptName
              : (rawOptName as Record<string, string>)?.en || 'Option'

          const optQuantity = opt.quantity || 1 // Fallback in case not provided
          const lowerOpt = optName.toLowerCase()

          // Example: Only track specific modifiers or those with quantity > 1
          if (
            optQuantity > 1 ||
            lowerOpt.includes('extra shot') ||
            lowerOpt.includes('almond milk') ||
            lowerOpt.includes('oat milk') ||
            lowerOpt.includes('soy milk') ||
            lowerOpt.includes('decaf')
          ) {
            if (!counts[name].modifiers[optName]) {
              counts[name].modifiers[optName] = 0
            }
            counts[name].modifiers[optName] += optQuantity
          }
        })
      })
    })

    // Convert counts object to a sorted array for rendering
    const productTallies = Object.entries(counts)
      .map(([name, data]) => ({
        name,
        count: data.total,
        modifiers: Object.entries(data.modifiers)
          .map(([modName, modCount]) => ({ name: modName, count: modCount }))
          .sort((a, b) => b.count - a.count),
      }))
      .sort((a, b) => b.count - a.count)

    return productTallies
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

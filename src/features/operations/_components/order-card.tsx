import { useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { type Order, type OrderStatus } from '@/types/api'
import { CheckCircle2, Clock, PlayCircle, Printer, Tag } from 'lucide-react'
import { printLabelViaBluetooth } from '@/utils/label-printer'
import { printReceiptViaBluetooth } from '@/utils/printer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface OrderCardProps {
  order: Order
  onStatusChange: (id: string, status: OrderStatus) => void
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  // Determine time color
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(true)
  const [isPrintingLabel, setIsPrintingLabel] = useState(true)

  const handlePrintReceipt = async () => {
    setIsPrintingReceipt(true)
    try {
      await printReceiptViaBluetooth(order)
    } finally {
      setIsPrintingReceipt(false)
    }
  }

  const handlePrintLabels = async () => {
    setIsPrintingLabel(true)
    try {
      for (const item of order.items) {
        await printLabelViaBluetooth({
          drinkName:
            typeof item.name === 'string' ? item.name : (item.name?.en ?? ''),
          note: item.notes ?? undefined,
          orderCode: `YOK-${order.invoiceCode}`,
          quantity: item.quantity,
        })
      }
    } finally {
      setIsPrintingLabel(false)
    }
  }

  const timeColor = useMemo(() => {
    const created = new Date(order.createdAt)
    const diffMins = (new Date().getTime() - created.getTime()) / 60000

    if (order.status === 'COMPLETED' || order.status === 'READY')
      return 'text-muted-foreground'
    if (diffMins < 5) return 'text-green-600'
    if (diffMins < 10) return 'text-yellow-600'
    return 'text-red-600'
  }, [order.createdAt, order.status])

  const nextAction = () => {
    switch (order.status) {
      case 'PENDING':
      case 'CONFIRMED':
        return {
          label: 'Start',
          icon: PlayCircle,
          next: 'PREPARING' as OrderStatus,
          variant: 'default' as const,
        }
      case 'PREPARING':
        return {
          label: 'Ready',
          icon: CheckCircle2,
          next: 'READY' as OrderStatus,
          variant: 'default' as const,
        }
      case 'READY':
        return {
          label: 'Done',
          icon: CheckCircle2,
          next: 'COMPLETED' as OrderStatus,
          variant: 'outline' as const,
        }
      default:
        return null
    }
  }

  const action = nextAction()

  return (
    <Card className='w-full shrink-0 border-l-4 border-l-primary shadow-sm'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
        <div className='flex flex-col'>
          <span className='text-3xl font-bold'>{order.queueNumber}</span>
          <div
            className={`flex items-center gap-1 text-xs font-medium ${timeColor}`}
          >
            <Clock className='h-3 w-3' />
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
        <Badge variant={order.type === 'DINE_IN' ? 'secondary' : 'outline'}>
          {order.type === 'DINE_IN' ? 'Dine-in' : 'Takeaway'}
        </Badge>
      </CardHeader>

      <CardContent className='py-2'>
        <div className='space-y-3'>
          {order.items.map((item) => (
            <div key={item.id} className='text-sm'>
              <div className='flex justify-between font-medium'>
                <span>
                  {item.quantity}x {item.name}{' '}
                  {item.variant && `(${item.variant})`}
                </span>
              </div>
              {/* Options/Modifiers */}
              {item.options && item.options.length > 0 && (
                <div className='mt-1 ml-4 space-y-0.5 text-xs text-muted-foreground'>
                  {item.options.map((opt, idx) => (
                    <div key={idx} className='flex gap-1'>
                      <span className='font-semibold'>{opt.choice}</span>
                    </div>
                  ))}
                </div>
              )}
              {item.notes && (
                <div className='mt-1 ml-4 text-xs text-orange-600 italic'>
                  "{item.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <Separator className='my-2' />

      <CardFooter className='flex flex-col gap-2 pt-0 pb-3'>
        {/* Print buttons row */}
        <div className='flex w-full gap-2'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={handlePrintReceipt}
            disabled={isPrintingReceipt}
          >
            <Printer className='mr-1.5 h-3.5 w-3.5' />
            {isPrintingReceipt ? '...' : 'Receipt'}
          </Button>
          <Button
            variant='outline'
            className='flex-1'
            onClick={handlePrintLabels}
            disabled={isPrintingLabel}
          >
            <Tag className='mr-1.5 h-3.5 w-3.5' />
            {isPrintingLabel ? '...' : 'Labels'}
          </Button>
        </div>
        {/* Status action */}
        {action ? (
          <Button
            className='w-full'
            variant={action.variant}
            onClick={() => onStatusChange(order.id, action.next)}
          >
            <action.icon className='mr-2 h-4 w-4' />
            {action.label}
          </Button>
        ) : (
          <div className='w-full py-2 text-center text-xs text-muted-foreground'>
            Order Completed
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

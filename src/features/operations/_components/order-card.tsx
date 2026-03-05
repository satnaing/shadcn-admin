import { useMemo, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBadges } from '@/services/badges'
import { type OrderStatus } from '@/types/api'
import { type KdsOrder, type KdsOrderOption } from '@/types/kds'
import {
  Tag,
  Loader2,
  PlayCircle,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react'
import { printLabelViaBluetooth } from '@/utils/label-printer'
import { printReceiptViaBluetooth } from '@/utils/printer'
import { useUpdateOrderStatus } from '@/hooks/queries/use-orders'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface OrderCardProps {
  order: KdsOrder
}

export function OrderCard({ order }: OrderCardProps) {
  const [elapsed, setElapsed] = useState(0)
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(false)
  const [isPrintingLabel, setIsPrintingLabel] = useState(false)

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus()
  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: getBadges,
  })

  useEffect(() => {
    const start = new Date(order.createdAt).getTime()
    const update = () => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [order.createdAt])

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      await updateStatus({ id: order.id, status: newStatus })
    } catch (_e) {
      // Error is handled by the mutation
    }
  }

  const handlePrintReceipt = async () => {
    setIsPrintingReceipt(true)
    try {
      await printReceiptViaBluetooth({
        invoiceCode: order.invoiceCode,
        createdAt: order.createdAt,
        fulfillmentCategory: order.fulfillmentCategory,
        queueNumber: order.queueNumber,
        subtotal: order.subtotal,
        total: order.grandTotal,
        paymentMethodName:
          typeof order.paymentMethodName === 'string'
            ? order.paymentMethodName
            : (order.paymentMethodName as Record<string, string>)?.en,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.subtotal,
          options: item.options?.map((opt) => ({
            name: opt.optionName,
            quantity: opt.quantity,
            unitPrice: opt.unitPrice,
            totalPrice: opt.subtotal,
          })),
          notes: item.instructions,
        })),
      })
    } finally {
      setIsPrintingReceipt(false)
    }
  }

  const handlePrintLabels = async () => {
    setIsPrintingLabel(true)
    try {
      for (const item of order.items) {
        await printLabelViaBluetooth({
          drinkName: item.productName as string,
          note: item.instructions ?? undefined,
          orderCode: `YOK-${order.invoiceCode}`,
          quantity: item.quantity,
        })
      }
    } finally {
      setIsPrintingLabel(false)
    }
  }

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const timeColor = useMemo(() => {
    const mins = elapsed / 60
    if (order.status === 'COMPLETED' || order.status === 'READY')
      return 'text-muted-foreground'
    if (mins < 3) return 'text-green-600'
    if (mins < 7) return 'text-yellow-600'
    return 'text-red-600 font-bold animate-pulse'
  }, [elapsed, order.status])

  const nextAction = () => {
    switch (order.status) {
      case 'ORDER_PLACED':
        return {
          label: 'Confirm',
          icon: PlayCircle,
          next: 'CONFIRMED' as OrderStatus,
          variant: 'default' as const,
        }
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
    <Card className='w-full shrink-0 overflow-hidden border-l-4 border-l-primary shadow-sm transition-shadow hover:shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 px-3 py-2'>
        <div
          className={`flex items-center gap-1.5 font-mono text-sm ${timeColor}`}
        >
          <Clock className='h-3.5 w-3.5' />
          <span>{formatElapsed(elapsed)}</span>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='h-5 px-1.5 text-[10px] uppercase'>
            {order.fulfillmentCategory === 'DINE_IN' ? 'Dine-in' : 'Takeaway'}
          </Badge>
          <Badge className='h-6 min-w-[32px] justify-center bg-primary font-bold text-primary-foreground'>
            {order.queueNumber}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='px-3 py-2'>
        <div className='space-y-1.5'>
          {order.items.map((item) => {
            const rawProductName = item.productName as unknown
            const productName =
              typeof rawProductName === 'string'
                ? rawProductName
                : (rawProductName as Record<string, string>)?.en || 'Product'

            return (
              <div key={item.id} className='text-sm leading-tight'>
                <div className='flex items-start gap-1 pb-0.5'>
                  <span className='mt-0.5 shrink-0 font-bold text-primary'>
                    {item.quantity}x
                  </span>
                  <span className='flex flex-wrap items-center gap-1.5 font-medium'>
                    {productName}
                    {item.badgeIds && item.badgeIds.length > 0 && (
                      <span className='flex flex-wrap gap-1'>
                        {item.badgeIds.map((bid) => {
                          const b = badges?.data?.find((x: any) => x.id === bid)
                          if (!b) return null
                          return (
                            <span
                              key={bid}
                              className='rounded px-1.5 py-0.5 text-[9px] leading-none font-bold'
                              style={{
                                backgroundColor: b.bgColor,
                                color: b.textColor,
                              }}
                            >
                              {b.label.en}
                            </span>
                          )
                        })}
                      </span>
                    )}
                  </span>
                </div>
                {/* Options/Modifiers */}
                {item.options && item.options.length > 0 && (
                  <div className='mb-1 flex flex-wrap gap-1'>
                    {item.options.map((opt: KdsOrderOption, idx: number) => {
                      const rawName = opt.optionName as unknown
                      const name =
                        typeof rawName === 'string'
                          ? rawName
                          : (rawName as Record<string, string>)?.en || 'Option'

                      const nameLower = name.toLowerCase()
                      const isHighImpact =
                        nameLower.includes('extra') ||
                        nameLower.includes('shot')
                      const isIced = nameLower.includes('iced')

                      const optBadge = badges?.data?.find(
                        (x: any) => x.id === opt.badgeId
                      )

                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1 rounded border px-1 py-0 text-[10px] font-bold ${
                            isHighImpact
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : isIced
                                ? 'border-blue-200 bg-blue-50 text-blue-700'
                                : 'border-muted-foreground/20 bg-muted text-muted-foreground'
                          }`}
                        >
                          {name}
                          {optBadge && (
                            <span
                              className='rounded px-1 py-0.5 text-[9px] leading-none'
                              style={{
                                backgroundColor: optBadge.bgColor,
                                color: optBadge.textColor,
                              }}
                            >
                              {optBadge.label.en}
                            </span>
                          )}
                        </span>
                      )
                    })}
                  </div>
                )}
                {item.instructions && (
                  <div className='mb-1 rounded border border-orange-100 bg-orange-50 px-1.5 py-0.5 text-[11px] text-orange-600 italic'>
                    "{item.instructions}"
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className='flex flex-col gap-1.5 px-3 pt-1 pb-3'>
        <div className='flex w-full gap-1'>
          <Button
            variant='outline'
            size='xs'
            className='h-8 flex-1 text-[11px]'
            onClick={handlePrintReceipt}
            disabled={isPrintingReceipt}
          >
            <Printer className='mr-1 h-3 w-3' />
            {isPrintingReceipt ? '...' : 'Receipt'}
          </Button>
          <Button
            variant='outline'
            size='xs'
            className='h-8 flex-1 text-[11px]'
            onClick={handlePrintLabels}
            disabled={isPrintingLabel}
          >
            <Tag className='mr-1 h-3 w-3' />
            {isPrintingLabel ? '...' : 'Labels'}
          </Button>
        </div>
        {action ? (
          <Button
            size='sm'
            className='h-9 w-full text-xs font-bold'
            variant={action.variant}
            onClick={() => handleStatusChange(action.next)}
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <Loader2 className='mr-1.5 h-4 w-4 animate-spin' />
            ) : (
              <action.icon className='mr-1.5 h-4 w-4' />
            )}
            {isUpdatingStatus ? 'Updating...' : action.label}
          </Button>
        ) : (
          <div className='w-full rounded bg-muted/30 py-1 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase'>
            Completed
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

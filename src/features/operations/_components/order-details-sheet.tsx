import { useState } from 'react'
import { format } from 'date-fns'
import { type Order, OrderStatus } from '@/types/api'
import { Printer, RefreshCcw } from 'lucide-react'
import { printReceiptViaBluetooth } from '@/utils/printer'
import { useUpdateOrderStatus } from '@/hooks/queries/use-orders'
import { useAppStore } from '@/hooks/use-app-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface OrderDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export function OrderDetailsSheet({
  open,
  onOpenChange,
  order,
}: OrderDetailsSheetProps) {
  const { activeShopId, shops } = useAppStore()
  const activeShop = shops.find((s) => s.id === activeShopId)
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus()
  const [isPrinting, setIsPrinting] = useState(false)

  if (!order) return null

  const handleReprint = async () => {
    setIsPrinting(true)
    try {
      // 1. Print the receipt on the 80mm receipt printer
      await printReceiptViaBluetooth([
        {
          invoiceCode: order.invoiceCode,
          createdAt: order.createdAt,
          items: order.items,
          fulfillmentCategory: order.fulfillment?.category || 'TAKEAWAY',
          queueNumber: order.queueNumber,
          subtotal: order.pricing?.subtotal,
          discount: `${order.pricing?.discount}`,
          total: order.pricing?.grandTotal,
          paymentMethodName:
            typeof order.paymentMethodName === 'string'
              ? order.paymentMethodName
              : order.paymentMethodName?.en,
          paymentStatus: order.paymentStatus,
        },
      ])

      // // 2. Print a label sticker for every item (quantity = number of copies)
      // for (const item of order.items) {
      //   await printLabelViaBluetooth({
      //     drinkName:
      //       typeof item.name === 'string' ? item.name : (item.name?.en ?? ''),
      //     note: item.notes ?? undefined,
      //     orderCode: `YOK-${order.invoiceCode}`,
      //     quantity: item.quantity,
      //   })
      // }
    } finally {
      setIsPrinting(false)
    }
  }

  const handleStatusChange = (status: OrderStatus) => {
    updateStatus({ id: order.id, status })
    onOpenChange(false) // Close sheet on success or immediately
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col p-4 sm:max-w-md'>
        <SheetHeader className='text-center sm:text-center'>
          <SheetTitle>Digital Receipt</SheetTitle>
          <SheetDescription>
            {activeShop?.name?.en || 'Shop'} •{' '}
            {order.createdAt
              ? (() => {
                  try {
                    return format(
                      new Date(order.createdAt),
                      'MMM d, yyyy h:mm a'
                    )
                  } catch (_e) {
                    return 'Invalid Date'
                  }
                })()
              : 'Unknown Date'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='-mx-6 flex-1 px-6'>
          <div className='space-y-6 pt-4'>
            {/* Header Info */}
            <div className='flex flex-col items-center gap-1'>
              <h3 className='text-2xl font-bold tracking-tight'>
                {order.invoiceCode}
              </h3>
              <Badge variant='outline' className='mt-1'>
                {order.fulfillment?.name?.en ||
                  order.fulfillment?.category ||
                  'N/A'}{' '}
                • {order.paymentStatus || 'UNPAID'}
              </Badge>
              {order.customer?.name && (
                <span className='mt-1 text-sm text-muted-foreground'>
                  Customer: {order.customer.name}
                </span>
              )}
            </div>

            <Separator />

            {/* Items List */}
            <div className='space-y-4'>
              {order.items.map((item) => {
                const rawName = item.name as unknown
                const itemName =
                  typeof rawName === 'string'
                    ? rawName
                    : (rawName as Record<string, string>)?.en || 'Item'

                return (
                  <div key={item.id} className='text-sm'>
                    <div className='flex justify-between font-medium'>
                      <span>
                        {item.quantity}x {itemName}
                      </span>
                      <span>${item.totalPrice.toFixed(2)}</span>
                    </div>
                    {/* Options */}
                    {item.options && item.options.length > 0 && (
                      <div className='mt-0.5 ml-4 space-y-0.5 text-xs text-muted-foreground'>
                        {item.options.map((opt, idx) => {
                          const rawOptName = opt.name as unknown
                          const optName =
                            typeof rawOptName === 'string'
                              ? rawOptName
                              : (rawOptName as Record<string, string>)?.en ||
                                'Option'
                          return (
                            <div key={idx} className='flex justify-between'>
                              <span>
                                + {opt.quantity > 1 ? `${opt.quantity}x ` : ''}
                                {optName}
                              </span>
                              {opt.totalPrice > 0 && (
                                <span>+${opt.totalPrice.toFixed(2)}</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {item.notes && (
                      <div className='ml-4 text-xs text-orange-600 italic'>
                        "{item.notes}"
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <Separator />

            {/* Financials */}
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between text-muted-foreground'>
                <span>Subtotal</span>
                <span>${(order.pricing?.subtotal || 0).toFixed(2)}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Discount</span>
                  <span>-${order.pricing.discount.toFixed(2)}</span>
                </div>
              )}
              {order.pricing?.surcharge > 0 && (
                <div className='flex justify-between text-muted-foreground'>
                  <span>Surcharge</span>
                  <span>+${order.pricing.surcharge.toFixed(2)}</span>
                </div>
              )}
              <div className='flex justify-between border-t pt-2 text-lg font-bold'>
                <span>Total</span>
                <span>${(order.pricing?.grandTotal || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className='rounded-md bg-muted p-3 text-xs'>
              <div className='flex justify-between'>
                <span className='font-medium text-muted-foreground'>
                  Payment Method
                </span>
                <span>{order.paymentMethodName?.en || 'N/A'}</span>
              </div>
              <div className='mt-1 flex justify-between'>
                <span className='font-medium text-muted-foreground'>
                  Status
                </span>
                <span
                  className={
                    order.paymentStatus === 'SUCCESS'
                      ? 'text-green-600'
                      : 'text-amber-600'
                  }
                >
                  {order.paymentStatus || 'UNPAID'}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className='flex-col gap-2 pt-2 sm:flex-row sm:justify-between'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={handleReprint}
            disabled={isPrinting}
          >
            <Printer className='mr-2 h-4 w-4' />
            {isPrinting ? 'Printing...' : 'Reprint All'}
          </Button>
          {order.status === 'COMPLETED' &&
            order.paymentStatus === 'SUCCESS' && (
              <Button
                variant='destructive'
                className='flex-1'
                onClick={() => handleStatusChange(OrderStatus.CANCELLED)}
                disabled={isUpdating}
              >
                <RefreshCcw className='mr-2 h-4 w-4' /> Cancel & Refund
              </Button>
            )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

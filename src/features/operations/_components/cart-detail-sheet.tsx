import { useQuery } from '@tanstack/react-query'
import { getBadges } from '@/services/badges'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type Cart } from '../data/cart-schema'

interface CartDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: Cart | null
}

export function CartDetailSheet({
  open,
  onOpenChange,
  cart,
}: CartDetailSheetProps) {
  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: getBadges,
  })

  if (!cart) return null

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const itemPrice = item.unitPrice
      const optionsPrice =
        item.options?.reduce(
          (optTotal, opt) => optTotal + (opt.price || 0),
          0
        ) || 0
      return total + (itemPrice + optionsPrice) * item.quantity
    }, 0)
  }

  const total = calculateTotal()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex h-full w-full flex-col p-4 sm:max-w-md'>
        <SheetHeader className='pb-4'>
          <SheetTitle>Cart Details</SheetTitle>
          <SheetDescription>
            Viewing active cart for{' '}
            <span className='font-medium text-foreground'>
              {cart.user.fullName || 'Guest'}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-hidden'>
          <ScrollArea className='h-full'>
            <div className='space-y-6 pr-6'>
              {/* User Info Section */}
              <div className='rounded-lg border p-4 text-sm'>
                <h4 className='mb-2 leading-none font-medium'>Customer</h4>
                <div className='grid gap-1 text-muted-foreground'>
                  <div className='flex justify-between'>
                    <span>Name</span>
                    <span className='text-foreground'>
                      {cart.user.fullName || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Phone</span>
                    <span className='font-mono text-foreground'>
                      {cart.user.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className='space-y-4'>
                <h4 className='text-sm leading-none font-medium'>Items</h4>
                {cart.items.map((item) => {
                  const itemOptionsPrice =
                    item.options?.reduce(
                      (sum, opt) => sum + (opt.price || 0),
                      0
                    ) || 0
                  const itemTotal =
                    (item.unitPrice + itemOptionsPrice) * item.quantity

                  return (
                    <div
                      key={item.id}
                      className='flex flex-col space-y-2 rounded-lg border bg-muted/30 p-3'
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <div className='space-y-1'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <Badge
                              variant='outline'
                              className='h-5 min-w-5 justify-center px-1 font-mono text-[10px]'
                            >
                              x{item.quantity}
                            </Badge>
                            <span className='font-medium'>
                              {item.productName}
                            </span>
                            {item.badgeIds && item.badgeIds.length > 0 && (
                              <div className='flex flex-wrap gap-1'>
                                {item.badgeIds.map((bid) => {
                                  const b = badges?.data?.find(
                                    (x: any) => x.id === bid
                                  )
                                  if (!b) return null
                                  return (
                                    <span
                                      key={bid}
                                      className='rounded px-1.5 py-0.5 text-[10px] leading-none font-bold'
                                      style={{
                                        backgroundColor: b.bgColor,
                                        color: b.textColor,
                                      }}
                                    >
                                      {b.label.en}
                                    </span>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                          {item.options && item.options.length > 0 && (
                            <ul className='list-inside list-disc text-xs text-muted-foreground'>
                              {item.options.map((opt, idx) => {
                                const optBadge = badges?.data?.find(
                                  (x: any) => x.id === opt.badgeId
                                )
                                return (
                                  <li key={idx}>
                                    {opt.name}: {opt.value}
                                    {optBadge && (
                                      <span
                                        className='ml-1.5 inline-block rounded px-1.5 py-0.5 text-[9px] leading-none font-bold'
                                        style={{
                                          backgroundColor: optBadge.bgColor,
                                          color: optBadge.textColor,
                                        }}
                                      >
                                        {optBadge.label.en}
                                      </span>
                                    )}
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                          {item.instructions && (
                            <p className='text-xs text-muted-foreground italic'>
                              "{item.instructions}"
                            </p>
                          )}
                        </div>
                        <div className='text-right text-sm font-medium'>
                          {/* Use inline formatter if utils function not found/reliable */}
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(itemTotal)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className='pt-6'>
          <Separator className='mb-4' />
          <div className='flex items-center justify-between'>
            <span className='text-base font-semibold'>Total Estimated</span>
            <span className='text-xl font-bold'>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(total)}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

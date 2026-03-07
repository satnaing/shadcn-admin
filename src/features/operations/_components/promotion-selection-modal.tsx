import { type Promotion, DiscountType } from '@/types/growth'
import { Loader2, Tag } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { usePromotions } from '@/hooks/queries/use-promotions'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PromotionSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (promo: Promotion) => void
}

export function PromotionSelectionModal({
  open,
  onOpenChange,
  onSelect,
}: PromotionSelectionModalProps) {
  const { data: promotionsData, isLoading } = usePromotions()
  const promotions =
    promotionsData?.data?.filter((p) => p.status === 'ACTIVE') || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-base font-bold tracking-tight uppercase'>
            Select Promotion
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4'>
          {isLoading ? (
            <div className='flex h-40 items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-primary opacity-30' />
            </div>
          ) : promotions.length === 0 ? (
            <div className='flex h-40 flex-col items-center justify-center text-center opacity-40'>
              <Tag className='mb-2 h-8 w-8' />
              <p className='text-xs font-bold'>
                No active promotions available.
              </p>
            </div>
          ) : (
            <ScrollArea className='h-[400px] pr-4'>
              <div className='grid gap-3'>
                {promotions.map((promo) => (
                  <button
                    key={promo.id}
                    onClick={() => onSelect(promo)}
                    className='group flex flex-col items-start gap-1 rounded-lg border-2 border-muted p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]'
                  >
                    <div className='flex w-full items-center justify-between'>
                      <span className='text-sm font-bold text-foreground'>
                        {typeof promo.name === 'string'
                          ? promo.name
                          : promo.name.en}
                      </span>
                      <Badge
                        variant='secondary'
                        className='text-[10px] font-bold'
                      >
                        {promo.type === DiscountType.PERCENTAGE
                          ? `${promo.value}% OFF`
                          : `${formatCurrency(Number(promo.value))} OFF`}
                      </Badge>
                    </div>
                    {promo.description && (
                      <p className='line-clamp-2 text-[11px] text-muted-foreground'>
                        {typeof promo.description === 'string'
                          ? promo.description
                          : promo.description.en}
                      </p>
                    )}
                    {promo.maxDiscountAmount && (
                      <span className='mt-1 text-[10px] font-bold text-primary italic'>
                        Max Discount: {formatCurrency(promo.maxDiscountAmount)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

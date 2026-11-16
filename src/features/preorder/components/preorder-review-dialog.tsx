import { PERMISSIONS } from '@/shared/permissions'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useReviewProduct } from '../hooks/use-preorder'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { FlagSwitch } from './preorder-flag-switch'

interface Props {
  id: number | null
  onClose: () => void
}

/** All reviews of one product; each can be published or hidden. */
export function PreorderReviewDialog({ id, onClose }: Props) {
  const { t } = useTranslation('preorder')
  const { data } = useReviewProduct(id ?? undefined)
  const { setReviewPublished } = usePreorderMutations()
  const detail = id ? data?.data : undefined

  return (
    <Dialog open={id !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {detail?.product_name ?? t('reviews.loading')}
          </DialogTitle>
          <DialogDescription>
            {t('reviews.dialogDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] space-y-3 overflow-y-auto pe-1'>
          {detail?.reviews.map((r) => (
            <div
              key={r.id}
              className='flex items-start justify-between gap-4 rounded-md border p-3'
            >
              <div className='space-y-1 text-sm'>
                <div className='flex items-center gap-2 font-medium'>
                  {r.customer_name}
                  <span className='flex items-center gap-0.5 text-xs text-muted-foreground'>
                    <Star className='size-3 fill-amber-400 text-amber-400' />{' '}
                    {r.rating}
                  </span>
                </div>
                <p>{r.comment}</p>
                <p className='text-xs text-muted-foreground'>
                  {r.created_at.slice(0, 10)}
                </p>
              </div>
              <FlagSwitch
                permission={PERMISSIONS.PREORDER.REVIEWS_MANAGE}
                checked={r.is_published}
                label={t('reviews.published')}
                onChange={(value) =>
                  setReviewPublished.mutate({ id: r.id, value })
                }
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { QueryItem } from '../data/preorder.type'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderReplyBox } from './preorder-reply-box'

interface Props {
  item: QueryItem | null
  onClose: () => void
}

/** One product question with its answer box (re-answering overwrites the reply, like AEC). */
export function PreorderQueryDialog({ item, onClose }: Props) {
  const { t } = useTranslation('preorder')
  const { replyQuery } = usePreorderMutations()

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{item?.product_name}</DialogTitle>
          <DialogDescription>{item?.customer_name}</DialogDescription>
        </DialogHeader>
        {item && (
          <>
            <p className='rounded-md border bg-muted/40 p-3 text-sm'>
              {item.question}
            </p>
            <PreorderReplyBox
              key={item.id}
              label={t('queries.yourReply')}
              initial={item.reply ?? ''}
              isPending={replyQuery.isPending}
              onSend={(reply) =>
                replyQuery.mutate(
                  { id: item.id, reply },
                  { onSuccess: onClose }
                )
              }
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PermissionGuard } from '@/components/guard'
import { useConversation } from '../hooks/use-preorder'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderReplyBox } from './preorder-reply-box'

interface Props {
  id: number | null
  onClose: () => void
}

/** Message thread between a customer and the product owner, with an admin reply box. */
export function PreorderConversationDialog({ id, onClose }: Props) {
  const { t } = useTranslation('preorder')
  const { data } = useConversation(id ?? undefined)
  const { replyConversation } = usePreorderMutations()
  const thread = id ? data?.data : undefined

  return (
    <Dialog open={id !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {thread?.title ?? t('conversations.loading')}
          </DialogTitle>
          <DialogDescription>
            {thread
              ? t('conversations.between', {
                  a: thread.sender_name,
                  b: thread.receiver_name,
                })
              : ''}
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[45vh] space-y-3 overflow-y-auto pe-1'>
          {thread?.messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-md border p-3 text-sm ${m.is_admin ? 'bg-primary/5' : ''}`}
            >
              <div className='mb-1 flex justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>{m.sender_name}</span>
                <span>{m.created_at.slice(0, 16).replace('T', ' ')}</span>
              </div>
              {m.message}
            </div>
          ))}
        </div>
        {thread && (
          <PermissionGuard
            permission={PERMISSIONS.PREORDER.CONVERSATIONS_MANAGE}
          >
            <PreorderReplyBox
              label={t('conversations.reply')}
              isPending={replyConversation.isPending}
              onSend={(message) =>
                replyConversation.mutate({ id: thread.id, message })
              }
            />
          </PermissionGuard>
        )}
      </DialogContent>
    </Dialog>
  )
}

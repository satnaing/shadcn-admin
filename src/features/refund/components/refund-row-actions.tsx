import { CreditCard, Eye, MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RefundListItem } from '../data/refund.type'

interface Props {
  refund: RefundListItem
  onOpen: (refund: RefundListItem) => void
}

export function RefundRowActions({ refund, onOpen }: Props) {
  const { t } = useTranslation('refund')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={t('actions.more')}>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onSelect={() => onOpen(refund)}>
          <Eye className='me-2 size-4' />
          {t('actions.details')}
        </DropdownMenuItem>
        {refund.payment_channel === 'offline' && (
          <DropdownMenuItem onSelect={() => onOpen(refund)}>
            <CreditCard className='me-2 size-4' />
            {t('actions.paymentInfo')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { Link } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { Download, Eye, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PermissionGuard } from '@/components/guard'
import type { OrderListItem } from '../data/preorder.type'

interface Props {
  order: OrderListItem
  onInvoice: (order: OrderListItem) => void
  onDelete: (order: OrderListItem) => void
}

/** Row buttons of the orders list: open, download invoice, delete (managers only). */
export function PreorderOrderActions({ order, onInvoice, onDelete }: Props) {
  const { t } = useTranslation('preorder')

  return (
    <div className='flex justify-end gap-1'>
      <Button
        variant='ghost'
        size='icon'
        asChild
        aria-label={t('actions.view')}
      >
        <Link to='/admin/preorder/orders/$id' params={{ id: String(order.id) }}>
          <Eye className='size-4' />
        </Link>
      </Button>
      <Button
        variant='ghost'
        size='icon'
        aria-label={t('actions.invoice')}
        onClick={() => onInvoice(order)}
      >
        <Download className='size-4' />
      </Button>
      <PermissionGuard permission={PERMISSIONS.PREORDER.ORDERS_MANAGE}>
        <Button
          variant='ghost'
          size='icon'
          aria-label={t('actions.delete')}
          onClick={() => onDelete(order)}
        >
          <Trash2 className='size-4' />
        </Button>
      </PermissionGuard>
    </div>
  )
}

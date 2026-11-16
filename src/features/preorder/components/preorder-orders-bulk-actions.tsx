import type { Table } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/permissions'
import { Bell, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { PermissionGuard } from '@/components/guard'
import type { OrderListItem } from '../data/preorder.type'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'

/** Bulk bar for the orders table; built per scope (memoise it) because only delayed lists can send reminders. */
/** Reminder type per delayed list; the other lists have no reminder (AEC `canSendNotification`). */
const REMINDER = {
  delayed_prepayment: 'prepayment',
  delayed_final: 'final',
} as const

export function makeOrdersBulkActions(scope?: string) {
  const reminder = REMINDER[scope as keyof typeof REMINDER]

  return function PreorderOrdersBulkActions({
    table,
  }: {
    table: Table<OrderListItem>
  }) {
    const { t } = useTranslation('preorder')
    const { bulkRemoveOrders, sendReminders } = usePreorderMutations()
    const ids = table
      .getFilteredSelectedRowModel()
      .rows.map((r) => r.original.id)
    const reset = { onSuccess: () => table.resetRowSelection() }

    return (
      <DataTableBulkActions table={table} entityName={t('orders.entity')}>
        <PermissionGuard permission={PERMISSIONS.PREORDER.ORDERS_MANAGE}>
          {reminder && (
            <Button
              size='sm'
              variant='outline'
              disabled={sendReminders.isPending}
              onClick={() =>
                sendReminders.mutate({ ids, type: reminder }, reset)
              }
            >
              <Bell className='me-2 size-4' />
              {t('orders.sendReminder')}
            </Button>
          )}
          <Button
            size='sm'
            variant='destructive'
            disabled={bulkRemoveOrders.isPending}
            onClick={() => bulkRemoveOrders.mutate(ids, reset)}
          >
            <Trash2 className='me-2 size-4' />
            {t('actions.deleteSelected')}
          </Button>
        </PermissionGuard>
      </DataTableBulkActions>
    )
  }
}

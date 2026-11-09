import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { t } = useTranslation('users')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading:
        status === 'active'
          ? t('bulkActions.activating')
          : t('bulkActions.deactivating'),
      success: () => {
        table.resetRowSelection()
        return t(
          status === 'active'
            ? 'bulkActions.activated'
            : 'bulkActions.deactivated',
          { count: selectedUsers.length }
        )
      },
      error:
        status === 'active'
          ? t('bulkActions.errorActivating')
          : t('bulkActions.errorDeactivating'),
    })
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: t('bulkActions.inviting'),
      success: () => {
        table.resetRowSelection()
        return t('bulkActions.invited', { count: selectedUsers.length })
      },
      error: t('bulkActions.errorInviting'),
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName={t('entity')}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
              aria-label={t('bulkActions.invite')}
              title={t('bulkActions.invite')}
            >
              <Mail />
              <span className='sr-only'>{t('bulkActions.invite')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('bulkActions.invite')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label={t('bulkActions.activate')}
              title={t('bulkActions.activate')}
            >
              <UserCheck />
              <span className='sr-only'>{t('bulkActions.activate')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('bulkActions.activate')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label={t('bulkActions.deactivate')}
              title={t('bulkActions.deactivate')}
            >
              <UserX />
              <span className='sr-only'>{t('bulkActions.deactivate')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('bulkActions.deactivate')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('bulkActions.delete')}
              title={t('bulkActions.delete')}
            >
              <Trash2 />
              <span className='sr-only'>{t('bulkActions.delete')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('bulkActions.delete')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}

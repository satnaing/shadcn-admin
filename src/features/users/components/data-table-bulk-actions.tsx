import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { t } = useTranslation()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading:
        status === 'active'
          ? t('users.activating_users')
          : t('users.deactivating_users'),
      success: () => {
        table.resetRowSelection()
        return status === 'active'
          ? t('users.activated_users', { count: selectedUsers.length })
          : t('users.deactivated_users', { count: selectedUsers.length })
      },
      error:
        status === 'active'
          ? t('users.error_activating')
          : t('users.error_deactivating'),
    })
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: t('users.inviting_users'),
      success: () => {
        table.resetRowSelection()
        return t('users.invited_users', { count: selectedUsers.length })
      },
      error: t('users.error_inviting'),
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
              aria-label={t('users.invite_selected')}
              title={t('users.invite_selected')}
            >
              <Mail />
              <span className='sr-only'>{t('users.invite_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.invite_selected')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label={t('users.activate_selected')}
              title={t('users.activate_selected')}
            >
              <UserCheck />
              <span className='sr-only'>{t('users.activate_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.activate_selected')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label={t('users.deactivate_selected')}
              title={t('users.deactivate_selected')}
            >
              <UserX />
              <span className='sr-only'>{t('users.deactivate_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.deactivate_selected')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('users.delete_selected')}
              title={t('users.delete_selected')}
            >
              <Trash2 />
              <span className='sr-only'>{t('users.delete_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.delete_selected')}</p>
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

import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-react'
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
  const { t } = useTranslation('users')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: t(status === 'active' ? 'activatingUsers' : 'deactivatingUsers'),
      success: () => {
        table.resetRowSelection()
        return t(status === 'active' ? 'activatedUsers' : 'deactivatedUsers', { count: selectedUsers.length })
      },
      error: t(status === 'active' ? 'errorActivating' : 'errorDeactivating'),
    })
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: t('invitingUsers'),
      success: () => {
        table.resetRowSelection()
        return t('invitedUsers', { count: selectedUsers.length })
      },
      error: t('errorInviting'),
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
              aria-label={t('inviteSelectedUsers')}
              title={t('inviteSelectedUsers')}
            >
              <Mail />
              <span className='sr-only'>{t('inviteSelectedUsers')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('inviteSelectedUsers')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label={t('activateSelectedUsers')}
              title={t('activateSelectedUsers')}
            >
              <UserCheck />
              <span className='sr-only'>{t('activateSelectedUsers')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('activateSelectedUsers')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label={t('deactivateSelectedUsers')}
              title={t('deactivateSelectedUsers')}
            >
              <UserX />
              <span className='sr-only'>{t('deactivateSelectedUsers')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('deactivateSelectedUsers')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('deleteSelectedUsers')}
              title={t('deleteSelectedUsers')}
            >
              <Trash2 />
              <span className='sr-only'>{t('deleteSelectedUsers')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('deleteSelectedUsers')}</p>
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

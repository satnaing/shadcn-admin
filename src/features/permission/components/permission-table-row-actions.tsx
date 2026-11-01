import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/constant'
import { asyncRequest } from '@/shared/helper'
import { Trash2, UserPen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermissionGuard } from '@/components/guard/permission-guard'
import type { PermissionEntityInterface } from '../data/permission.type'
import { usePermissionMutations } from '../hooks/usePermissionMutations'
import { usePermissionContext } from './permission-provider'

type PermissionTableRowActionsProps = {
  row: Row<PermissionEntityInterface>
}

export function PermissionTableRowActions({
  row,
}: PermissionTableRowActionsProps) {
  const { t } = useTranslation('permission')
  const [open, setOpen] = useState(false)
  const { setOpen: setDialogOpen, setCurrentRow } = usePermissionContext()
  const { deletePermission } = usePermissionMutations()

  const onDeletePermission = async () => {
    await asyncRequest(async () => {
      await deletePermission.mutateAsync(row.original?.id)
      setOpen(false)
    })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>{t('rowActions.openMenu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <PermissionGuard permission={PERMISSIONS.PERMISSIONS.UPDATE}>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setDialogOpen('edit')
              }}
            >
              {t('rowActions.edit')}
              <DropdownMenuShortcut>
                <UserPen size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.PERMISSIONS.DELETE}>
            <DropdownMenuItem
              onClick={() => {
                setOpen(true)
              }}
              className='text-red-500!'
            >
              {t('rowActions.delete')}
              <DropdownMenuShortcut>
                <Trash2 size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        key='permission-delete'
        destructive
        open={open}
        onOpenChange={setOpen}
        handleConfirm={onDeletePermission}
        className='max-w-md'
        title={t('rowActions.deleteTitle', { name: row.original?.name })}
        desc={
          <>
            {t('rowActions.deleteDescription1')}{' '}
            <strong>{row.original?.name}</strong>. <br />
            {t('rowActions.deletePermanentlyDescription2')}
          </>
        }
        confirmText={t('rowActions.deleteConfirm')}
      />
    </>
  )
}

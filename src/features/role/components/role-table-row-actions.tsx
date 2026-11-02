import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/constant'
import { asyncRequest } from '@/shared/helper'
import { Trash2, UserPen } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
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
import type { RoleEntityInterface } from '@/features/role/data/role.type'
import { useRoleMutations } from '@/features/role/hooks/useRoleMutations'
import { useRoleContext } from './role-provider'

type RoleTableRowActionsProps = {
  row: Row<RoleEntityInterface>
}

export function RoleTableRowActions({ row }: RoleTableRowActionsProps) {
  const { t } = useTranslation('role')
  const [open, setOpen] = useState(false)
  const { setOpen: setDialogOpen, setCurrentRow } = useRoleContext()
  const { deleteRole } = useRoleMutations()

  const onDeleteRole = async () => {
    await asyncRequest(async () => {
      await deleteRole.mutateAsync(row.original?.id)
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
          <PermissionGuard permission={PERMISSIONS.ROLES.UPDATE}>
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
          <PermissionGuard permission={PERMISSIONS.ROLES.DELETE}>
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
        key='role-delete'
        destructive
        open={open}
        onOpenChange={setOpen}
        handleConfirm={onDeleteRole}
        className='max-w-md'
        title={t('rowActions.deleteTitle', { name: row.original?.name })}
        desc={
          <Trans
            i18nKey='role:rowActions.deleteDescription1'
            values={{ name: row.original?.name }}
            components={{ strong: <strong />, br: <br /> }}
          >
            You are about to delete a role with the name{' '}
            <strong>{row.original?.name}</strong>. <br />
            {t('rowActions.deleteDescription2')}
          </Trans>
        }
        confirmText={t('rowActions.deleteConfirm')}
      />
    </>
  )
}

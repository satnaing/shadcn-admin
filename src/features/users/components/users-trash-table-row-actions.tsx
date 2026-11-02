import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { asyncRequest } from '@/shared/helper'
import { RotateCcw, Trash2 } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { UserInterface } from '../data/users.type'
import { useUserMutations } from '../hooks/useUserMutations'

type DataTableRowActionsProps = {
  row: Row<UserInterface>
}

export function TrashUsersTableRowActions({ row }: DataTableRowActionsProps) {
  const { t } = useTranslation('users')
  const [openDelete, setOpenDelete] = useState(false)
  const [openRestore, setOpenRestore] = useState(false)

  const { forceDelete, restoreUser } = useUserMutations()

  const onDeleteUserPermanently = async () => {
    await asyncRequest(async () => {
      await forceDelete.mutateAsync(String(row.original?.id))
    })
  }

  const handleRestoreUser = async () => {
    await asyncRequest(async () => {
      await restoreUser.mutateAsync(String(row.original?.id))
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
          <DropdownMenuItem
            onClick={() => {
              setOpenRestore(true)
            }}
          >
            {t('rowActions.restore')}
            <DropdownMenuShortcut>
              <RotateCcw size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenDelete(true)
            }}
            className='text-red-500!'
          >
            {t('rowActions.deletePermanently')}
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        key='user-force-delete'
        destructive
        open={openDelete}
        onOpenChange={setOpenDelete}
        handleConfirm={() => {
          onDeleteUserPermanently()
        }}
        className='max-w-md'
        title={t('rowActions.deletePermanentlyTitle', {
          name: row.original?.name,
        })}
        desc={
          <Trans
            i18nKey='users:rowActions.deletePermanentlyDescription1'
            values={{ name: row.original?.name }}
            components={{ strong: <strong /> }}
          >
            You are about to delete a user with the name{' '}
            <strong>{row.original?.name}</strong>. <br />
            {t('rowActions.deletePermanentlyDescription2')}
          </Trans>
        }
        disabled={forceDelete.isPending}
        confirmText={t('multiDeleteDialog.delete')}
      />

      <ConfirmDialog
        key='user-restore'
        open={openRestore}
        onOpenChange={setOpenRestore}
        handleConfirm={() => {
          handleRestoreUser()
        }}
        className='max-w-md'
        title={t('rowActions.restoreTitle', { name: row.original?.name })}
        desc={
          <Trans
            i18nKey='users:rowActions.restoreDescription'
            values={{ name: row.original?.name }}
            components={{ strong: <strong /> }}
          >
            Are you sure you want to restore{' '}
            <strong>{row.original?.name}</strong>.
          </Trans>
        }
        disabled={restoreUser.isPending}
        confirmText={t('rowActions.restore')}
      />
    </>
  )
}

'use client'

import { useState } from 'react'
import { asyncRequest } from '@/shared/helper'
import { AlertTriangle } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { UserInterface } from '../data/users.type'
import { useUserMutations } from '../hooks/useUserMutations'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: UserInterface
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const { t } = useTranslation('users')
  const [value, setValue] = useState('')

  const { deleteUser } = useUserMutations()

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    asyncRequest(async () => {
      await deleteUser.mutateAsync(String(currentRow.id))
      onOpenChange(false)
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('deleteDialog.title')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            <Trans
              i18nKey='users:deleteDialog.description'
              values={{
                name: currentRow.name,
                roles: currentRow.roles?.map((role) => role.name).join(','),
              }}
              components={{ span: <span className='font-bold' />, br: <br /> }}
            >
              Are you sure you want to delete{' '}
              <span className='font-bold'>{currentRow.name}</span>?
              <br />
              This action will permanently remove the user with the role of{' '}
              <span className='font-bold'>
                {currentRow.roles?.map((role) => role.name).join(',')}
              </span>{' '}
              from the system. This cannot be undone.
            </Trans>
          </p>

          <Label className='my-2'>
            {t('deleteDialog.usernameLabel')}
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('deleteDialog.confirmPlaceholder')}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('deleteDialog.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('deleteDialog.warningDescription')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={
        deleteUser.isPending
          ? t('deleteDialog.deletingText')
          : t('deleteDialog.confirmText')
      }
      destructive
    />
  )
}

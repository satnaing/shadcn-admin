'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { t } = useTranslation('users')

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    onOpenChange(false)
    showSubmittedData(currentRow, t('deleteDialog.submitted'))
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='users-delete-form'
      disabled={value.trim() !== currentRow.username}
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
        <form
          id='users-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('deleteDialog.confirmPrefix')}{' '}
            <span className='font-bold'>{currentRow.username}</span>?
            <br />
            {t('deleteDialog.roleWarningPrefix')}{' '}
            <span className='font-bold'>
              {currentRow.role.toUpperCase()}
            </span>{' '}
            {t('deleteDialog.roleWarningSuffix')}
          </p>

          <Label className='my-2'>
            {t('deleteDialog.usernameLabel')}
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('deleteDialog.usernamePlaceholder')}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('deleteDialog.warning')}</AlertTitle>
            <AlertDescription>
              {t('deleteDialog.warningDesc')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('deleteDialog.delete')}
      destructive
    />
  )
}

'use client'

import { useMemo, useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { asyncRequest } from '@/shared/helper'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { UserInterface } from '../data/users.type'
import { useDeleteMany } from '../hooks/useDeleteMany'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function UsersMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<UserInterface>) {
  const { t } = useTranslation('users')
  const [value, setValue] = useState('')

  const { mutateAsync: onDeleteMany, isPending } = useDeleteMany()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = useMemo(
    () => selectedRows.map((r) => String(r.original?.id)),
    [selectedRows]
  )

  const CONFIRM_WORD = t('multiDeleteDialog.delete').toUpperCase()

  const canConfirm =
    value.trim() === CONFIRM_WORD && selectedIds.length > 0 && !isPending

  const handleDelete = () => {
    if (!canConfirm) {
      toast.error(t('multiDeleteDialog.confirmError', { word: CONFIRM_WORD }))
      return
    }

    onOpenChange(false)

    try {
      asyncRequest(async () => {
        await onDeleteMany(selectedIds)
      })
      table.resetRowSelection()
    } finally {
      setValue('')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('multiDeleteDialog.deleteTitle', { count: selectedRows.length })}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('multiDeleteDialog.warningMessage1')} <br />
            {t('multiDeleteDialog.warningMessage2')}
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>
              {t('multiDeleteDialog.confirmByTyping', { word: CONFIRM_WORD })}
            </span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('multiDeleteDialog.confirmPlaceholder', {
                word: CONFIRM_WORD,
              })}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('multiDeleteDialog.alertTitle')}</AlertTitle>
            <AlertDescription>
              {t('multiDeleteDialog.alertDescription')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={
        isPending
          ? t('multiDeleteDialog.deleting')
          : t('multiDeleteDialog.delete')
      }
      destructive
    />
  )
}

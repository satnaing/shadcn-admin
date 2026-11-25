'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const { t } = useTranslation('users')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(t('multiDelete.confirmError', { word: CONFIRM_WORD }))
      return
    }

    onOpenChange(false)

    toast.promise(sleep(2000), {
      loading: t('multiDelete.deleting'),
      success: () => {
        setValue('')
        table.resetRowSelection()
        return t('multiDelete.deleted', { count: selectedRows.length })
      },
      error: t('multiDelete.error'),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='users-multi-delete-form'
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('multiDelete.title', { count: selectedRows.length })}
        </span>
      }
      desc={
        <form
          id='users-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('multiDelete.desc')} <br />
            {t('multiDelete.cannotUndo')}
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>
              {t('multiDelete.confirmLabel', { word: CONFIRM_WORD })}
            </span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('multiDelete.confirmPlaceholder', {
                word: CONFIRM_WORD,
              })}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('multiDelete.warning')}</AlertTitle>
            <AlertDescription>
              {t('multiDelete.warningDesc')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('multiDelete.delete')}
      destructive
    />
  )
}

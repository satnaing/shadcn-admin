import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
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
  const { t } = useTranslation('users')
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(t('deleteConfirmPrompt', { word: CONFIRM_WORD }))
      return
    }

    onOpenChange(false)

    toast.promise(sleep(2000), {
      loading: t('deletingUsers'),
      success: () => {
        table.resetRowSelection()
        return t('deletedUsers', { count: selectedRows.length })
      },
      error: t('error', { ns: 'common' }),
    })
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
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          {t('deleteUsersTitle', { count: selectedRows.length })}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('deleteUsersDesc')}
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>{t('typeToConfirm', { word: CONFIRM_WORD })}</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('typeToConfirm', { word: CONFIRM_WORD })}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('warning')}</AlertTitle>
            <AlertDescription>
              {t('confirmWarning')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('delete', { ns: 'common' })}
      destructive
    />
  )
}

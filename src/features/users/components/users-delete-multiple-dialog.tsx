'use client'

import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

export interface Props<TData> {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function UsersDeleteMultipleDialog<TData>({
  open,
  onOpenChange,
  table,
}: Props<TData>) {
  const [value, setValue] = useState('')

  const handleDeleteMultiple = () => {
    onOpenChange(false)
    setValue('')
    toast({
      title: 'The following users have been deleted:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {table.getSelectedRowModel().rows.map((row) => (
              <>
                {JSON.stringify(row.getValue('username'), null, 2)}
                <br />
              </>
            ))}
          </code>
        </pre>
      ),
    })
  }

  return (
    <ConfirmDialog
      key='users-delete-multiple'
      open={open}
      disabled={!['Yes', 'yes', 'YES'].includes(value.trim())}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Users
        </span>
      }
      onOpenChange={onOpenChange}
      handleConfirm={handleDeleteMultiple}
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>Are you sure you want to delete ?</p>

          <Label className='my-2'>
            Confirmation:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter yes to confirm deletion.'
              className={'mt-2'}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}

'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { User } from '../data/schema'
import { useDeleteUserMutation } from '../services/deleteUser'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const { mutate: deleteUserMutation } = useDeleteUserMutation()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return
    await deleteUserMutation({ student_id: currentRow.student_id })
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          학생 정보 삭제하기
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            학생 {' '}
            <span className='font-bold'>{currentRow.name}</span>를 정말 삭제하시겠습니까?
            <br />
            이 작업은 수행하면{' '}되돌릴 수 없습니다.<br /><br/>
            
          </p>

          <Label className='my-2'>
            학생 이름
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='삭제하려면 학생 이름을 입력하세요.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>경고!</AlertTitle>
            <AlertDescription>
              이 작업은 되돌릴 수 없으니 신중히 진행해주세요.
            </AlertDescription>
          </Alert>
        </div>
      }
      cancelBtnText='취소'
      confirmText='삭제하기'
      destructive
    />
  )
}

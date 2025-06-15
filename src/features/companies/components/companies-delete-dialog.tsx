'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
// import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Company } from '../data/schema'
import { useDeleteCompanyMutation } from '../services/deleteCompany'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Company
}

export function CompaniesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const [value, setValue] = useState('')

  const { mutate: deleteCompanyMutation, isLoading } =
    useDeleteCompanyMutation()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.company_name) return
    await deleteCompanyMutation({ company_id: currentRow.company_id })
    onOpenChange(false)

    // toast({
    //   title: 'The following user has been deleted:',
    //   description: (
    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
    //       <code className='text-white'>
    //         {JSON.stringify(currentRow, null, 2)}
    //       </code>
    //     </pre>
    //   ),
    // })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.company_name || isLoading}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          회사 삭제
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            회사 <span className='font-bold'>{currentRow.company_name}</span>를
            정말 삭제하시겠습니까? <br />이 작업은 수행하면{' '}
            {/* <span className='font-bold'>{currentRow.role.toUpperCase()}</span>을
            가진 회사가 삭제됩니다. */}
            되돌릴 수 없습니다.
            <br /><br/>
          </p>

          <Label className='my-2'>
            회사이름
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='삭제하려면 회사 이름을 입력하세요.'
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

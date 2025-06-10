// CompaniesActionDialog.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import {
  Company,
  // companySchema,
  companyFormSchema,
  CompanyForm,
  companyFieldMetadata,
  CompanyFormFieldType,
} from '../data/schema'
import { useInsertCompanyMutation } from '../services/insertCompany'
import { useUpdateCompanyMutation } from '../services/updateCompany'
import { CompanyFormField } from './companiesActionField'

interface Props {
  currentRow?: Company
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompaniesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const isEdit = !!currentRow
  const defaultValues = React.useMemo(
    () =>
      isEdit
        ? { ...currentRow, isEdit }
        : {
          ...Object.fromEntries(Object.keys(companyFieldMetadata).map(key => [key, ''])),
            isEdit,
          },
    [currentRow, isEdit]
  )

  const form = useForm<CompanyForm>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  })

  React.useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
    }
  }, [open, defaultValues, form])

  const { mutate: insertCompany, isLoading } = useInsertCompanyMutation()
  const { mutate: updateCompany } = useUpdateCompanyMutation()
  const onSubmit = async (value: CompanyForm) => {
    const { isEdit: _, ...payload } = value
    try {
      if (isEdit && currentRow) {
        await updateCompany({ ...payload, company_id: currentRow.company_id })
      } else {
        await insertCompany(payload)
        form.reset(defaultValues)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? '회사 수정하기' : '회사 추가하기'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? '수정할 정보를 입력하고 ' : '추가할 회사를 작성하고, '}
            저장하기 버튼을 누르세요.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              {Object.entries(companyFieldMetadata).map(([name, metadata]) => (
                <CompanyFormField
                  key={name}
                  name={name as CompanyFormFieldType}
                  label={metadata.label}
                  placeholder={metadata.placeholder}
                  control={form.control}
                />
              ))}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isLoading}>
            {isLoading ? '저장 중...' : '저장하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
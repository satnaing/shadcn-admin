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
            company_name: '',
            hr_manager_name: '',
            hr_manager_phone: '',
            company_address: '',
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
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? 'Edit Company' : 'Add New Company'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
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
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { z } from 'zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Company } from '../data/schema'
import { useInsertCompanyMutation } from '../services/insertCompany';

// formSchema에서 role을 제거
const formSchema = z.object({
  company_name: z.string().min(1, { message: '회사이름을 입력해주세요.' }),
  isEdit: z.boolean(),
})

type CompanyForm = z.infer<typeof formSchema>

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
  const form = useForm<CompanyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          company_name: '',
          isEdit,
        },
  })

  const { mutate: insertCompany, isLoading } = useInsertCompanyMutation()

  const onSubmit = async (value: CompanyForm) => {
    try {

      await insertCompany({ newCompany: { company_name: value.company_name } })

      form.reset()
      // onOpenChange(false)
    } catch (error) {
      // 에러 처리: 이미 insertCompany 내부에서 toast가 처리되므로 이곳에서는 필요 없음
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
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
              <FormField
                control={form.control}
                name='company_name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      회사이름
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='회사 이름 입력'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
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

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
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
import { insertCompany } from '@/features/companies/services/insertCompany'
import { insertJob } from '@/features/users/services/field-training/insertJob'

const formSchemas = {
  company: z.object({
    company_name: z.string().min(1, '회사명은 필수입니다'),
    company_address: z.string().optional(),
    hr_manager_name: z.string().optional(),
    hr_manager_phone: z.string().optional(),
  }),
  job: z.object({
    job_name: z.string().min(1, '직무명은 필수입니다'),
  }),
}

type CompanyFormValues = z.infer<typeof formSchemas.company>
type JobFormValues = z.infer<typeof formSchemas.job>
type FormValues = CompanyFormValues | JobFormValues

const defaultValues = {
  company: {
    company_name: '',
    company_address: '',
    hr_manager_name: '',
    hr_manager_phone: '',
  },
  job: {
    job_name: '',
  },
}

type AddFieldTrainingModalProps = {
  type: 'company' | 'job'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddFieldTrainingModal({
  type,
  open,
  onOpenChange,
  onSuccess,
}: AddFieldTrainingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchemas[type]),
    defaultValues: defaultValues[type],
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)

      if (type === 'company' && 'company_name' in values) {
        await insertCompany(values)
        toast({
          title: '회사 추가 성공',
          description: `${values.company_name} 회사가 추가되었습니다.`,
        })
      } else if (type === 'job' && 'job_name' in values) {
        await insertJob(values)
        toast({
          title: '직무 추가 성공',
          description: `${values.job_name} 직무가 추가되었습니다.`,
        })
      }

      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (_err) {
      toast({
        variant: 'destructive',
        title: `${type === 'company' ? '회사' : '직무'} 추가 실패`,
        description: `${type === 'company' ? '회사' : '직무'}를 추가하는 중 오류가 발생했습니다.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields =
    type === 'company'
      ? [
          {
            name: 'company_name' as const,
            label: '회사 이름',
            placeholder: '회사 이름을 입력하세요',
          },
          {
            name: 'hr_manager_name' as const,
            label: '인사 담당자 이름',
            placeholder: '인사 담당자 이름을 입력하세요',
          },
          {
            name: 'hr_manager_phone' as const,
            label: '인사 담당자 연락처',
            placeholder: '인사 담당자 연락처를 입력하세요',
          },
          {
            name: 'company_address' as const,
            label: '회사 주소',
            placeholder: '회사 주소를 입력하세요',
          },
        ]
      : [
          {
            name: 'job_name' as const,
            label: '직무명',
            placeholder: '직무명을 입력하세요',
          },
        ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {type === 'company' ? '새 회사 추가' : '새 직무 추가'}
          </DialogTitle>
          <DialogDescription>
            {type === 'company'
              ? '새로운 회사 정보를 입력하세요.'
              : '새로운 직무 정보를 입력하세요.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4 py-2'>
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={field.placeholder}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter className='mt-4'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? '추가 중...' : '추가하기'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

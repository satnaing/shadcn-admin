import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { CreateUserFormValues, UpdateUserFormValues } from '../data/schema'

interface UsersMetaFieldsProps {
  form: UseFormReturn<CreateUserFormValues | UpdateUserFormValues>
}

export function UsersMetaFields({ form }: UsersMetaFieldsProps) {
  const { t } = useTranslation('users')

  return (
    <>
      <FormField
        name='name'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('form.fullName')} <span className='text-red-500'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.fullNamePlaceholder')}
                {...field}
                className='w-full'
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name='email'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('form.email')} <span className='text-red-500'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.emailPlaceholder')}
                {...field}
                className='w-full'
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}

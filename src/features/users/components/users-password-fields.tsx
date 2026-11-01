import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { CreateUserFormValues, UpdateUserFormValues } from '../data/schema'

interface UsersPasswordFieldsProps {
  form: UseFormReturn<CreateUserFormValues | UpdateUserFormValues>
  optional?: boolean
}

export function UsersPasswordFields({
  form,
  optional = false,
}: UsersPasswordFieldsProps) {
  const { t } = useTranslation('users')

  return (
    <>
      <FormField
        name='password'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.password')}</FormLabel>
            <FormControl>
              <Input
                type='password'
                autoComplete='new-password'
                placeholder={
                  optional
                    ? t('form.newPasswordPlaceholder')
                    : t('form.passwordPlaceholder')
                }
                {...field}
                className='w-full'
              />
            </FormControl>
            {optional ? (
              <FormDescription>{t('form.passwordOptionalHint')}</FormDescription>
            ) : null}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name='password_confirmation'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.confirmPassword')}</FormLabel>
            <FormControl>
              <Input
                type='password'
                autoComplete='new-password'
                placeholder={t('form.confirmPasswordPlaceholder')}
                {...field}
                className='w-full'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

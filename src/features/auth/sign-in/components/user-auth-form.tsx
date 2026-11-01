import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { asyncRequest } from '@/shared/helper'
import i18next from 'i18next'
import { Loader2, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { useLogin } from '../../hooks/useLogin'

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? i18next.t('auth:form.emailRequired') : undefined,
  }),
  password: z
    .string()
    .min(1, i18next.t('auth:form.passwordRequired'))
    .min(7, i18next.t('auth:form.passwordMinLength')),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  const { mutate, isLoading } = useLogin()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    asyncRequest(async () => {
      await mutate({ email: data.email, password: data.password })
      navigate({ to: redirectTo || '/', replace: true })
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid space-y-4', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login.email')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('login.emailPlaceholder')}
                  {...field}
                  className='h-10 w-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>{t('login.password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('login.passwordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {t('login.signIn')}
        </Button>
      </form>
    </Form>
  )
}

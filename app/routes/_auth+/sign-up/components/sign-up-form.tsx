import type { HTMLAttributes } from 'react'
import { z } from 'zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, useNavigation } from 'react-router'
import { PasswordInput } from '~/components/password-input'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, {
        message: 'Please enter your password',
      })
      .min(7, {
        message: 'Password must be at least 7 characters long',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'submitting'
  const [form, { email, password, confirmPassword }] = useForm<
    z.infer<typeof formSchema>
  >({
    defaultValue: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })

  return (
    <Form
      method='POST'
      {...getFormProps(form)}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div>
        <Label htmlFor={email.id}>Email</Label>
        <Input
          {...getInputProps(email, { type: 'email' })}
          key={email.id}
          placeholder='name@example.com'
        />
        <div id={email.errorId} className='text-sm text-destructive'>
          {email.errors}
        </div>
      </div>

      <div>
        <Label htmlFor={password.id}>Password</Label>
        <PasswordInput
          {...getInputProps(password, { type: 'password' })}
          key={password.id}
          placeholder='********'
        />
      </div>

      <div>
        <Label htmlFor={confirmPassword.id}>Confirm Password</Label>
        <PasswordInput
          {...getInputProps(confirmPassword, { type: 'password' })}
          key={confirmPassword.id}
          placeholder='********'
        />
        <div id={confirmPassword.errorId} className='text-sm text-destructive'>
          {confirmPassword.errors}
        </div>
      </div>

      <Button className='mt-2' disabled={isLoading}>
        Create Account
      </Button>

      <div className='relative my-2'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={isLoading}
        >
          <IconBrandGithub className='h-4 w-4' /> GitHub
        </Button>
        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={isLoading}
        >
          <IconBrandFacebook className='h-4 w-4' /> Facebook
        </Button>
      </div>
    </Form>
  )
}

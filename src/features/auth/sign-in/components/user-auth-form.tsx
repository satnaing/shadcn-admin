import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
import { cn, sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        toast.promise(sleep(2000), {
          loading: 'Signing in...',
          success: () => {
            // Mock successful authentication with expiry computed at success time
            const mockUser = {
              accountNo: 'ACC001',
              email: value.email,
              role: ['user'],
              exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
            }

            // Set user and access token
            auth.setUser(mockUser)
            auth.setAccessToken('mock-access-token')

            // Redirect to the stored location or default to dashboard
            const targetPath = redirectTo || '/'
            navigate({ to: targetPath, replace: true })
            resolve(null)
            return `Welcome back, ${value.email}!`
          },
          error: () => {
            resolve(null)
            return 'Error'
          },
        })
      })
    },
  })

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        form.handleSubmit()
      }}
      className={cn('grid gap-3', className)}
      {...props}
    >
      <form.Field name='email'>
        {(field) => (
          <Field
            className='grid gap-2'
            data-invalid={
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            }
          >
            <FieldLabel>Email</FieldLabel>
            <Input
              placeholder='name@example.com'
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <form.Field name='password'>
        {(field) => (
          <Field
            className='grid gap-2'
            data-invalid={
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            }
          >
            <div className='flex items-center justify-between'>
              <FieldLabel>Password</FieldLabel>
              <Link
                to='/forgot-password'
                className='text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              placeholder='********'
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <Button className='mt-2' disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? <Loader2 className='animate-spin' /> : <LogIn />}
            Sign in
          </Button>
        )}
      </form.Subscribe>

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

      <div className='grid grid-cols-2 gap-2'>
        <Button variant='outline' type='button'>
          <IconGithub className='h-4 w-4' /> GitHub
        </Button>
        <Button variant='outline' type='button'>
          <IconFacebook className='h-4 w-4' /> Facebook
        </Button>
      </div>
    </form>
  )
}

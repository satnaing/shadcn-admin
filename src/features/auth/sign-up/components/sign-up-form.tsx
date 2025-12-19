import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(1, 'Please enter your password')
      .min(7, 'Password must be at least 7 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // eslint-disable-next-line no-console
      console.log(value)
      await new Promise((resolve) => setTimeout(resolve, 3000))
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
            <FieldLabel>Password</FieldLabel>
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

      <form.Field name='confirmPassword'>
        {(field) => (
          <Field
            className='grid gap-2'
            data-invalid={
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            }
          >
            <FieldLabel>Confirm Password</FieldLabel>
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
            Create Account
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
        <Button variant='outline' className='w-full' type='button'>
          <IconGithub className='h-4 w-4' /> GitHub
        </Button>
        <Button variant='outline' className='w-full' type='button'>
          <IconFacebook className='h-4 w-4' /> Facebook
        </Button>
      </div>
    </form>
  )
}

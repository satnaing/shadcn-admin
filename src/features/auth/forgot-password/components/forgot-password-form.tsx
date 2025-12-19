import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn, sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email(),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        toast.promise(sleep(2000), {
          loading: 'Sending email...',
          success: () => {
            navigate({ to: '/otp' })
            resolve(null)
            return `Email sent to ${value.email}`
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
      className={cn('grid gap-2', className)}
      {...props}
    >
      <form.Field name='email'>
        {(field) => {
          return (
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
          )
        }}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button className='mt-2' disabled={!canSubmit || isSubmitting}>
            Continue
            {isSubmitting ? (
              <Loader2 className='animate-spin' />
            ) : (
              <ArrowRight />
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

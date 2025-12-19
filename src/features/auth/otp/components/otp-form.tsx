import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      otp: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      showSubmittedData(value)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      navigate({ to: '/' })
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
      <form.Field name='otp'>
        {(field) => {
          return (
            <Field
              data-invalid={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              }
            >
              <InputOTP
                maxLength={6}
                value={field.state.value}
                onChange={field.handleChange}
                containerClassName="justify-between sm:[&>[data-slot='input-otp-group']>div]:w-12"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )
        }}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          otp: state.values.otp,
        })}
      >
        {({ canSubmit, isSubmitting, otp }) => (
          <Button
            className='mt-2'
            disabled={!canSubmit || isSubmitting || otp.length < 6}
          >
            Verify
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

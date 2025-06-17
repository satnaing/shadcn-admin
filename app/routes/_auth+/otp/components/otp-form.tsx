import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { HTMLAttributes } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '~/components/ui/input-otp'
import { cn } from '~/lib/utils'
import { formSchema, type action } from '../route'

type OtpFormProps = HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const actionData = useActionData<typeof action>()
  const [form, { otp }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: { otp: '' },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })
  const navigation = useNavigation()

  return (
    <Form
      method="POST"
      {...getFormProps(form)}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div className="space-y-1">
        <InputOTP
          name={otp.name}
          maxLength={6}
          containerClassName="justify-center"
          onComplete={(value) => {
            form.update({
              name: otp.name,
              value,
            })
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>

          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button
        className="mt-2"
        disabled={
          otp.value === undefined ||
          otp.value.length < 6 ||
          navigation.state === 'submitting'
        }
      >
        Verify
      </Button>
    </Form>
  )
}

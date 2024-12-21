import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useState, type HTMLAttributes } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'
import { PinInput, PinInputField } from '~/components/pin-input'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
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
  const [disabledBtn, setDisabledBtn] = useState(true)

  return (
    <Form
      method="POST"
      {...getFormProps(form)}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div className="space-y-1">
        <PinInput
          className="flex h-10 justify-between"
          onComplete={(value) => {
            form.update({
              name: otp.name,
              value,
            })
            setDisabledBtn(false)
          }}
          onIncomplete={(value) => {
            form.update({
              name: otp.name,
              value,
            })
            setDisabledBtn(true)
          }}
        >
          {Array.from({ length: 7 }, (_, i) => {
            if (i === 3) return <Separator key={i} orientation="vertical" />
            return (
              <PinInputField
                key={i}
                component={Input}
                className={`${!otp.valid ? 'border-red-500' : ''}`}
              />
            )
          })}
        </PinInput>
        <input type="hidden" name={otp.name} value={otp.value} key={otp.key} />
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button
        className="mt-2"
        disabled={disabledBtn || navigation.state === 'submitting'}
      >
        Verify
      </Button>
    </Form>
  )
}

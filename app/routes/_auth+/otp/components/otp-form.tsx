import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { type HTMLAttributes, useState } from 'react'
import { Form, useNavigation } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { PinInput, PinInputField } from '~/components/pin-input'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'

type OtpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  otp: z.string().min(1, { message: 'Please enter your otp code.' }),
})

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigation = useNavigation()
  const [disabledBtn, setDisabledBtn] = useState(true)

  const [form, { otp }] = useForm({
    defaultValue: { otp: '' },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
    onSubmit: (event, { submission }) => {
      if (submission?.status !== 'success') {
        event.preventDefault()
        return
      }

      toast('You submitted the following values:', {
        description: (
          <pre className="mt-2 rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(submission.value, null, 2)}
            </code>
          </pre>
        ),
      })
    },
  })

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
      <Button
        className="mt-2"
        disabled={disabledBtn || navigation.state === 'submitting'}
      >
        Verify
      </Button>
    </Form>
  )
}

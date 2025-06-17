import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { HTMLAttributes } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import { formSchema, type action } from '../route'

type ForgotFormProps = HTMLAttributes<HTMLFormElement>

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const actionData = useActionData<typeof action>()
  const [form, { email }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: { email: '' },
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
        <Label htmlFor={email.id}>Email</Label>
        <Input
          {...getInputProps(email, { type: 'email' })}
          placeholder="name@example.com"
        />
        <div
          id={email.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {email.errors}
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button className="mt-2" disabled={navigation.state === 'submitting'}>
        Continue
      </Button>
    </Form>
  )
}

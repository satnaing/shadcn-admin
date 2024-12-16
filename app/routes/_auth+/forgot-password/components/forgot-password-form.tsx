import type { HTMLAttributes } from 'react'
import { z } from 'zod'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, useNavigation } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

type ForgotFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
})

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const navigation = useNavigation()

  const [form, { email }] = useForm({
    defaultValue: { email: '' },
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
      <div className='space-y-1'>
        <Label htmlFor={email.id}>Email</Label>
        <Input
          {...getInputProps(email, { type: 'email' })}
          key={email.key}
          placeholder='name@example.com'
        />
        <div id={email.errorId} className='text-sm text-destructive'>
          {email.errors}
        </div>
      </div>

      <Button className='mt-2' disabled={navigation.state === 'submitting'}>
        Continue
      </Button>
    </Form>
  )
}

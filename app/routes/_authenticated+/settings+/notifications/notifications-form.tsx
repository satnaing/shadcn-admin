import { z } from 'zod'
import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, Link } from 'react-router'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Switch } from '~/components/ui/switch'

const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    required_error: 'You need to select a notification type.',
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValue: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

export function NotificationsForm() {
  const [form, fields] = useForm<NotificationsFormValues>({
    defaultValue,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: notificationsFormSchema }),
    onSubmit: (event, { submission }) => {
      console.log(submission?.status)
      event.preventDefault()
      if (submission?.status !== 'success') return
      toast('You submitted the following values:', {
        description: (
          <pre className='mt-2 w-[320px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify(submission.value, null, 2)}
            </code>
          </pre>
        ),
      })
    },
  })

  return (
    <Form method='POST' {...getFormProps(form)} className='space-y-8'>
      <div className='space-y-3 relative'>
        <Label htmlFor={fields.type.id}>Notify me about...</Label>
        <RadioGroup
          key={fields.type.key}
          name={fields.type.name}
          id={fields.type.id}
          defaultValue={fields.type.value}
          className='flex flex-col space-y-1'
        >
          <div className='flex items-center space-x-3 space-y-0'>
            <RadioGroupItem id={`${fields.type.id}-all`} value='all' />
            <Label htmlFor={`${fields.type.id}-all`}>All new messages</Label>
          </div>

          <div className='flex items-center space-x-3 space-y-0'>
            <RadioGroupItem
              id={`${fields.type.id}-mentions`}
              value='mentions'
            />
            <Label htmlFor={`${fields.type.id}-mentions`}>
              Direct messages and mentions
            </Label>
          </div>

          <div className='flex items-center space-x-3 space-y-0'>
            <RadioGroupItem id={`${fields.type.id}-none`} value='none' />
            <Label htmlFor={`${fields.type.id}-none`}>Nothing</Label>
          </div>
        </RadioGroup>
        <div id={fields.type.errorId} className='text-sm text-destructive'>
          {fields.type.errors}
        </div>
      </div>

      <div className='relative'>
        <h3 className='mb-4 text-lg font-medium'>Email Notifications</h3>
        <div className='space-y-4'>
          <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label htmlFor={fields.communication_emails.id}>
                Email notifications
              </Label>
              <div className='text-[0.8rem] text-muted-foreground'>
                Choose the types of emails you want to receive.
              </div>
            </div>
            <Switch
              id={fields.communication_emails.id}
              name={fields.communication_emails.name}
              defaultChecked={fields.communication_emails.value === 'on'}
              key={fields.communication_emails.key}
            />
          </div>

          <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label htmlFor={fields.marketing_emails.id}>
                Marketing emails
              </Label>
              <div className='text-[0.8rem] text-muted-foreground'>
                Receive emails about new products, features, and more.
              </div>
            </div>
            <Switch
              id={fields.marketing_emails.id}
              name={fields.marketing_emails.name}
              defaultChecked={fields.marketing_emails.value === 'on'}
              key={fields.marketing_emails.key}
            />
          </div>

          <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label htmlFor={fields.social_emails.id}>Social emails</Label>
              <div className='text-[0.8rem] text-muted-foreground'>
                Receive emails for friend requests, follows, and more.
              </div>
            </div>
            <Switch
              id={fields.social_emails.id}
              name={fields.social_emails.name}
              defaultChecked={fields.social_emails.value === 'on'}
              key={fields.social_emails.key}
            />
          </div>

          <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label htmlFor={fields.security_emails.id}>Security emails</Label>
              <div className='text-[0.8rem] text-muted-foreground'>
                Receive emails about your account activity and security.
              </div>
            </div>
            <Switch
              id={fields.security_emails.id}
              defaultChecked={fields.security_emails.value === 'on'}
              key={fields.security_emails.key}
              disabled
              aria-readonly
            />
            <input
              type='hidden'
              name={fields.security_emails.name}
              value='on'
            />
          </div>
        </div>
      </div>

      <div className='flex flex-row items-start space-x-3 space-y-0 relative'>
        <Checkbox
          id={fields.mobile.id}
          name={fields.mobile.name}
          defaultChecked={fields.mobile.value === 'on'}
          key={fields.mobile.key}
        />

        <div className='space-y-1 leading-none'>
          <Label htmlFor={fields.mobile.id}>
            Use different settings for my mobile devices
          </Label>
          <div className='text-[0.8rem] text-muted-foreground'>
            You can manage your mobile notifications in the{' '}
            <Link
              to='/settings'
              className='underline decoration-dashed underline-offset-4 hover:decoration-solid'
            >
              mobile settings
            </Link>{' '}
            page.
          </div>
        </div>
      </div>

      <Button type='submit'>Update notifications</Button>
    </Form>
  )
}

import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, Link, useActionData, useNavigation } from 'react-router'
import type { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Switch } from '~/components/ui/switch'
import { notificationsFormSchema, type action } from './route'

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValue: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

export function NotificationsForm() {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm<NotificationsFormValues>({
    lastResult: actionData?.lastResult,
    defaultValue,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: notificationsFormSchema }),
  })
  const navigation = useNavigation()

  return (
    <Form method="POST" {...getFormProps(form)} className="space-y-8">
      <div className="relative space-y-3">
        <Label htmlFor={fields.type.id}>Notify me about...</Label>
        <RadioGroup
          key={fields.type.key}
          name={fields.type.name}
          id={fields.type.id}
          defaultValue={fields.type.value}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem id={`${fields.type.id}-all`} value="all" />
            <Label htmlFor={`${fields.type.id}-all`} className="font-normal">
              All new messages
            </Label>
          </div>

          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem
              id={`${fields.type.id}-mentions`}
              value="mentions"
            />
            <Label
              htmlFor={`${fields.type.id}-mentions`}
              className="font-normal"
            >
              Direct messages and mentions
            </Label>
          </div>

          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem id={`${fields.type.id}-none`} value="none" />
            <Label htmlFor={`${fields.type.id}-none`} className="font-normal">
              Nothing
            </Label>
          </div>
        </RadioGroup>
        <div
          id={fields.type.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.type.errors}
        </div>
      </div>

      <div className="relative">
        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label
                htmlFor={fields.communication_emails.id}
                className="text-base"
              >
                Communication emails
              </Label>
              <div className="text-muted-foreground text-[0.8rem]">
                Receive emails about your account activity.
              </div>
            </div>
            <Switch
              id={fields.communication_emails.id}
              name={fields.communication_emails.name}
              defaultChecked={fields.communication_emails.value === 'on'}
              key={fields.communication_emails.key}
            />
          </div>

          <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={fields.marketing_emails.id} className="text-base">
                Marketing emails
              </Label>
              <div className="text-muted-foreground text-[0.8rem]">
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

          <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={fields.social_emails.id} className="text-base">
                Social emails
              </Label>
              <div className="text-muted-foreground text-[0.8rem]">
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

          <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={fields.security_emails.id} className="text-base">
                Security emails
              </Label>
              <div className="text-muted-foreground text-[0.8rem]">
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
              type="hidden"
              name={fields.security_emails.name}
              value="on"
            />
          </div>
        </div>
      </div>

      <div className="relative flex flex-row items-start space-y-0 space-x-3">
        <Checkbox
          id={fields.mobile.id}
          name={fields.mobile.name}
          defaultChecked={fields.mobile.value === 'on'}
          key={fields.mobile.key}
        />

        <div className="space-y-1 leading-none">
          <Label htmlFor={fields.mobile.id}>
            Use different settings for my mobile devices
          </Label>
          <div className="text-muted-foreground text-[0.8rem]">
            You can manage your mobile notifications in the{' '}
            <Link
              to="/settings"
              className="underline decoration-dashed underline-offset-4 hover:decoration-solid"
            >
              mobile settings
            </Link>{' '}
            page.
          </div>
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update notifications
      </Button>
    </Form>
  )
}

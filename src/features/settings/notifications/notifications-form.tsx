
import { useForm } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { showSubmittedData } from '@/lib/show-submitted-data'

const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    error: iss =>
      iss.input === undefined
        ? 'Please select a notification type.'
        : undefined,
  }),
  mobile: z.boolean(),
  communication_emails: z.boolean(),
  social_emails: z.boolean(),
  marketing_emails: z.boolean(),
  security_emails: z.boolean(),
})

export function NotificationsForm() {
  const form = useForm({
    defaultValues: {
      type: 'all' as 'all' | 'mentions' | 'none',
      mobile: false,
      communication_emails: false,
      marketing_emails: false,
      social_emails: true,
      security_emails: true,
    },
    validators: {
      onSubmit: notificationsFormSchema,
    },
    onSubmit: async (values) => {
      showSubmittedData(values.value)
    },
  })

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-8"
    >
      <form.Field name="type">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid} className="relative space-y-3">
              <FieldLabel>Notify me about...</FieldLabel>
              <RadioGroup
                onValueChange={value => field.handleChange(value as 'all' | 'mentions' | 'none')}
                defaultValue={field.state.value}
                className="flex flex-col gap-2"
              >
                <Field className="flex items-center" orientation="horizontal">
                  <RadioGroupItem value="all" />
                  <FieldLabel className="font-normal">
                    All new messages
                  </FieldLabel>
                </Field>
                <Field className="flex items-center" orientation="horizontal">
                  <RadioGroupItem value="mentions" />
                  <FieldLabel className="font-normal">
                    Direct messages and mentions
                  </FieldLabel>
                </Field>
                <Field className="flex items-center" orientation="horizontal">
                  <RadioGroupItem value="none" />
                  <FieldLabel className="font-normal">Nothing</FieldLabel>
                </Field>
              </RadioGroup>
              {isInvalid && (
                <FieldError
                  errors={field.state.meta.errors?.map(err =>
                    typeof err === 'string' ? { message: err } : err,
                  )}
                />
              )}
            </Field>
          )
        }}
      </form.Field>
      <div className="relative">
        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          <form.Field name="communication_emails">
            {field => (
              <Field className="flex flex-row items-center justify-between rounded-lg border p-4"
                orientation="horizontal">
                <div className="space-y-0.5">
                  <FieldLabel className="text-base">
                    Communication emails
                  </FieldLabel>
                  <FieldDescription>
                    Receive emails about your account activity.
                  </FieldDescription>
                </div>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="marketing_emails">
            {field => (
              <Field className="flex flex-row items-center justify-between rounded-lg border p-4"
                orientation="horizontal">
                <div className="space-y-0.5">
                  <FieldLabel className="text-base">
                    Marketing emails
                  </FieldLabel>
                  <FieldDescription>
                    Receive emails about new products, features, and more.
                  </FieldDescription>
                </div>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="social_emails">
            {field => (
              <Field
                className="flex flex-row items-center justify-between rounded-lg border p-4"
                orientation="horizontal"
              >
                <div className="space-y-0.5">
                  <FieldLabel className="text-base">Social emails</FieldLabel>
                  <FieldDescription>
                    Receive emails for friend requests, follows, and more.
                  </FieldDescription>
                </div>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="security_emails">
            {field => (
              <Field
                className="flex flex-row items-center justify-between rounded-lg border p-4"
                orientation="horizontal"
              >
                <div className="space-y-0.5">
                  <FieldLabel className="text-base">Security emails</FieldLabel>
                  <FieldDescription>
                    Receive emails about your account activity and security.
                  </FieldDescription>
                </div>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                  disabled
                  aria-readonly
                />
              </Field>
            )}
          </form.Field>
        </div>
      </div>
      <form.Field name="mobile">
        {field => (
          <Field className="relative flex flex-row items-start gap-3" orientation="horizontal">
            <Checkbox
              checked={field.state.value}
              onCheckedChange={checked => field.handleChange(checked === true)}
            />
            <div className="space-y-1 leading-none">
              <FieldLabel>
                Use different settings for my mobile devices
              </FieldLabel>
              <FieldDescription>
                You can manage your mobile notifications in the
                {' '}
                <Link
                  to="/settings"
                  className="underline decoration-dashed underline-offset-4 hover:decoration-solid"
                >
                  mobile settings
                </Link>
                {' '}
                page.
              </FieldDescription>
            </div>
          </Field>
        )}
      </form.Field>

      <form.Subscribe
        selector={formState => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            Update notifications
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

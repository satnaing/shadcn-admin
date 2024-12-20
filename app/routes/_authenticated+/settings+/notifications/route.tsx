import { parseWithZod } from '@conform-to/zod'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import ContentSection from '../_layout/components/content-section'
import type { Route } from './+types/route'
import { NotificationsForm } from './notifications-form'

export const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    required_error: 'You need to select a notification type.',
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: notificationsFormSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // Save the form data to the database or API.

  return dataWithSuccess(
    {
      lastResult: submission.reply({ resetForm: true }),
    },
    {
      message: 'Notification settings updated.',
      description: JSON.stringify(submission.value, null, 2),
    },
  )
}

export default function SettingsNotifications() {
  return (
    <ContentSection
      title="Notifications"
      desc="Configure how you receive notifications."
    >
      <NotificationsForm />
    </ContentSection>
  )
}

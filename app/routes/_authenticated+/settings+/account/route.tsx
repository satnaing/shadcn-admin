import { parseWithZod } from '@conform-to/zod/v4'
import { setTimeout } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import ContentSection from '../_layout/components/content-section'
import type { Route } from './+types/route'
import { AccountForm } from './account-form'

export const accountFormSchema = z.object({
  name: z
    .string({ required_error: 'Name must be at least 2 characters.' })
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  language: z.string({
    required_error: 'Please select a language.',
  }),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: accountFormSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // Save the form data to the database or API.
  await setTimeout(1000)

  return dataWithSuccess(
    {
      lastResult: submission.reply({ resetForm: true }),
    },
    {
      message: 'Account settings updated.',
      description: JSON.stringify(submission.value, null, 2),
    },
  )
}

export default function SettingsAccount() {
  return (
    <ContentSection
      title="Account"
      desc="Update your account settings. Set your preferred language and
          timezone."
    >
      <AccountForm />
    </ContentSection>
  )
}

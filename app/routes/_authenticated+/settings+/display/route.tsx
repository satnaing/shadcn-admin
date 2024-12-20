import { parseWithZod } from '@conform-to/zod'
import { setTimeout } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import ContentSection from '../_layout/components/content-section'
import type { Route } from './+types/route'
import { DisplayForm } from './display-form'

export const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: displayFormSchema,
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
      message: 'Display settings updated.',
      description: JSON.stringify(submission.value, null, 2),
    },
  )
}

export default function SettingsDisplay() {
  return (
    <ContentSection
      title="Display"
      desc="Turn items on or off to control what's displayed in the app."
    >
      <DisplayForm />
    </ContentSection>
  )
}

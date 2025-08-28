import { parseWithZod } from '@conform-to/zod/v4'
import { setTimeout } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import ContentSection from '../_layout/components/content-section'
import type { Route } from './+types/route'
import { AppearanceForm } from './appearance-form'

export const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark'], {
    error: 'Please select a theme.',
  }),
  font: z.enum(['inter', 'manrope', 'system'], {
    error: 'Please select a font.',
  }),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: appearanceFormSchema,
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
      message: 'Appearance settings updated.',
      description: JSON.stringify(submission.value, null, 2),
    },
  )
}

export default function SettingsAppearance() {
  return (
    <ContentSection
      title="Appearance"
      desc="Customize the appearance of the app. Automatically switch between day
          and night themes."
    >
      <AppearanceForm />
    </ContentSection>
  )
}

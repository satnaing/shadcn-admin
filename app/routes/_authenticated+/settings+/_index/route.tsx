import { parseWithZod } from '@conform-to/zod/v4'
import { setTimeout } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import ContentSection from '../_layout/components/content-section'
import type { Route } from './+types/route'
import ProfileForm from './profile-form'

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? 'Please select an email to display.'
        : 'Invalid email address',
  }),
  bio: z
    .string()
    .min(4, {
      message: 'Bio must be at least 4 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 160 characters.',
    }),
  urls: z.array(z.url({ message: 'Please enter a valid URL.' })).optional(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: profileFormSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }
  if (submission.value.username !== 'shadcn') {
    return {
      lastResult: submission.reply({
        formErrors: ['Username must be shadcn'],
      }),
    }
  }

  // Save the form data to the database or API.
  await setTimeout(1000)

  return dataWithSuccess(
    {
      lastResult: submission.reply({ resetForm: true }),
    },
    {
      message: 'Profile updated!',
      description: JSON.stringify(submission.value, null, 2),
    },
  )
}

export default function SettingsProfile() {
  return (
    <ContentSection
      title="Profile"
      desc="This is how others will see you on the site."
    >
      <ProfileForm />
    </ContentSection>
  )
}

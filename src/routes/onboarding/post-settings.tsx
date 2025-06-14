import { createFileRoute } from '@tanstack/react-router'
import { PostSettingsStep } from '@/features/onboarding/steps/post-settings-step'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/post-settings')({
  component: () => (
    <OnboardingLayout>
      <PostSettingsStep />
    </OnboardingLayout>
  )
})
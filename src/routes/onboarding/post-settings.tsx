import { createFileRoute } from '@tanstack/react-router'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'
import { PostSettingsStep } from '@/features/onboarding/steps/post-settings-step'

export const Route = createFileRoute('/onboarding/post-settings')({
  component: () => (
    <OnboardingLayout>
      <PostSettingsStep />
    </OnboardingLayout>
  ),
})

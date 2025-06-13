import { createFileRoute } from '@tanstack/react-router'
import { PostSettingsStep } from '@/components/onboarding/steps/post-settings-step'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/post-settings')({
  component: () => (
    <OnboardingLayout>
      <PostSettingsStep />
    </OnboardingLayout>
  )
})
import { createFileRoute } from '@tanstack/react-router'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'
import { LinkedInStep } from '@/features/onboarding/steps/linkedin-step'

export const Route = createFileRoute('/onboarding/linkedin')({
  component: () => (
    <OnboardingLayout>
      <LinkedInStep />
    </OnboardingLayout>
  ),
})

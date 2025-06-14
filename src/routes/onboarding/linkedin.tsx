import { createFileRoute } from '@tanstack/react-router'
import { LinkedInStep } from '@/features/onboarding/steps/linkedin-step'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/linkedin')({
  component: () => (
    <OnboardingLayout>
      <LinkedInStep />
    </OnboardingLayout>
  )
})
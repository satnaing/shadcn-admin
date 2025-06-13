import { createFileRoute } from '@tanstack/react-router'
import { LinkedInStep } from '@/components/onboarding/steps/linkedin-step'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/linkedin')({
  component: () => (
    <OnboardingLayout>
      <LinkedInStep />
    </OnboardingLayout>
  )
})
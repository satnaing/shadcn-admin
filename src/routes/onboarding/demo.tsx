import { createFileRoute } from '@tanstack/react-router'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'
import { DemoStep } from '@/features/onboarding/steps/demo-step'

export const Route = createFileRoute('/onboarding/demo')({
  component: () => (
    <OnboardingLayout>
      <DemoStep />
    </OnboardingLayout>
  ),
})

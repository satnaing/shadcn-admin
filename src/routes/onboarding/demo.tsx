import { createFileRoute } from '@tanstack/react-router'
import { DemoStep } from '@/features/onboarding/steps/demo-step'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/demo')({
  component: () => (
    <OnboardingLayout>
      <DemoStep />
    </OnboardingLayout>
  )
})
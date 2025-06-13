import { createFileRoute } from '@tanstack/react-router'
import { DemoStep } from '@/components/onboarding/steps/demo-step'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/demo')({
  component: () => (
    <OnboardingLayout>
      <DemoStep />
    </OnboardingLayout>
  )
})
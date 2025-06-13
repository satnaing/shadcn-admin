import { createFileRoute } from '@tanstack/react-router'
import { ExtensionStep } from '@/components/onboarding/steps/extension-step'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/extension')({
  component: () => (
    <OnboardingLayout>
      <ExtensionStep />
    </OnboardingLayout>
  )
})
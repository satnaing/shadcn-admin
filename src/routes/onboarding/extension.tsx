import { createFileRoute } from '@tanstack/react-router'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'
import { ExtensionStep } from '@/features/onboarding/steps/extension-step'

export const Route = createFileRoute('/onboarding/extension')({
  component: () => (
    <OnboardingLayout>
      <ExtensionStep />
    </OnboardingLayout>
  ),
})

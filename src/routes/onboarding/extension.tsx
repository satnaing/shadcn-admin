import { createFileRoute } from '@tanstack/react-router'
import { ExtensionStep } from '@/features/onboarding/steps/extension-step'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/extension')({
  component: () => (
    <OnboardingLayout>
      <ExtensionStep />
    </OnboardingLayout>
  )
})
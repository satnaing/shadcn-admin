import { createFileRoute } from '@tanstack/react-router'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'
import { OtherSettingStep } from '@/features/onboarding/steps/other-settings'

export const Route = createFileRoute('/onboarding/other-settings')({
  component: () => (
    <OnboardingLayout>
      <OtherSettingStep />
    </OnboardingLayout>
  )
})
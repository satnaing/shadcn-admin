import { createFileRoute } from '@tanstack/react-router'
import { CommentSettingsStep } from '@/features/onboarding/steps/comment-settings-step'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/comment-settings')({
  component: () => (
    <OnboardingLayout>
      <CommentSettingsStep />
    </OnboardingLayout>
  )
})
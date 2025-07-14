import { createFileRoute } from '@tanstack/react-router'
import { OnboardingLayout } from '@/features/onboarding/onboarding-layout'
import { CommentSettingsStep } from '@/features/onboarding/steps/comment-settings-step'

export const Route = createFileRoute('/onboarding/comment-settings')({
  component: () => (
    <OnboardingLayout>
      <CommentSettingsStep />
    </OnboardingLayout>
  ),
})

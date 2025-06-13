import { createFileRoute } from '@tanstack/react-router'
import { CommentSettingsStep } from '@/components/onboarding/steps/comment-settings-step'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'

export const Route = createFileRoute('/onboarding/comment-settings')({
  component: () => (
    <OnboardingLayout>
      <CommentSettingsStep />
    </OnboardingLayout>
  )
})
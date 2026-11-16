import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { AiPromptsPage, AiRouteGuard } from '@/features/ai'

export const Route = createFileRoute('/_authenticated/admin/ai/prompts')({
  component: function Page() {
    return (
      <AiRouteGuard permission={PERMISSIONS.AI.PROMPTS}>
        <AiPromptsPage />
      </AiRouteGuard>
    )
  },
})

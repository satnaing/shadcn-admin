import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { AiRouteGuard, AiTranslatePage } from '@/features/ai'

export const Route = createFileRoute('/_authenticated/admin/ai/translate')({
  component: function Page() {
    return (
      <AiRouteGuard permission={PERMISSIONS.AI.TRANSLATE}>
        <AiTranslatePage />
      </AiRouteGuard>
    )
  },
})

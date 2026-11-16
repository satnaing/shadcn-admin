import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { AiRouteGuard, AiSettingsPage } from '@/features/ai'

export const Route = createFileRoute('/_authenticated/admin/ai/')({
  component: function Page() {
    return (
      <AiRouteGuard permission={PERMISSIONS.AI.INDEX}>
        <AiSettingsPage />
      </AiRouteGuard>
    )
  },
})

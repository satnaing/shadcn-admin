import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { DashboardPage } from '@/features/dashboard'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: () => (
    <PageGuard permission={PERMISSIONS.DASHBOARD.INDEX}>
      <DashboardPage />
    </PageGuard>
  ),
})

import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { RolesPage } from '@/features/role'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/roles/')({
  component: () => (
    <PageGuard permission={PERMISSIONS.ROLES.INDEX}>
      <RolesPage />
    </PageGuard>
  ),
})

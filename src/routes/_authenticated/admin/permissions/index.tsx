import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { PermissionsPage } from '@/features/permission'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/permissions/')({
  component: () => (
    <PageGuard permission={PERMISSIONS.PERMISSIONS.INDEX}>
      <PermissionsPage />
    </PageGuard>
  ),
})

import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { ModulesPage } from '@/features/modules'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/modules/')({
  component: () => (
    <PageGuard permission={PERMISSIONS.MODULES.INDEX}>
      <ModulesPage />
    </PageGuard>
  ),
})

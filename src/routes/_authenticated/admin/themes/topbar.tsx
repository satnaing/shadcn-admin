import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { TopbarPage } from '@/features/themes/components/topbar-page'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/topbar')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.TOPBAR}>
      <TopbarPage />
    </PageGuard>
  ),
})

import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { HeaderPage } from '@/features/themes/components/header-page'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/header')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.HEADER}>
      <HeaderPage />
    </PageGuard>
  ),
})

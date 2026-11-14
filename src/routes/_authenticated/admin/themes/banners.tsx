import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { BannersPage } from '@/features/themes/components/banners-page'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/banners')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.BANNERS}>
      <BannersPage />
    </PageGuard>
  ),
})

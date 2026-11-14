import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { MenuPage } from '@/features/themes/components/menu-page'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/menu')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.MENU}>
      <MenuPage />
    </PageGuard>
  ),
})

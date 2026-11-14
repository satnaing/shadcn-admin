import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { ThemesPage } from '@/features/themes/components/themes-page'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.INDEX}>
      <ThemesPage />
    </PageGuard>
  ),
})

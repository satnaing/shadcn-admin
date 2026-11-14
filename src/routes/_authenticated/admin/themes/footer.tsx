import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { FooterPage } from '@/features/themes/components/footer-page'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/footer')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.FOOTER}>
      <FooterPage />
    </PageGuard>
  ),
})

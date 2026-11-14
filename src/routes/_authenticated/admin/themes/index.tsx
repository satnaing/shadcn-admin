import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { SectionPlaceholder } from '@/components/admin/section-placeholder'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.INDEX}>
      <SectionPlaceholder titleKey='themesList' />
    </PageGuard>
  ),
})

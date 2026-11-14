import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { SectionPlaceholder } from '@/components/admin/section-placeholder'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/modules/')({
  component: () => (
    <PageGuard permission={PERMISSIONS.MODULES.INDEX}>
      <SectionPlaceholder titleKey='modules' />
    </PageGuard>
  ),
})

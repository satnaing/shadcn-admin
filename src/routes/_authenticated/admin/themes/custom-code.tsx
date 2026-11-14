import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { CustomCodePage } from '@/features/themes/components/custom-code-page'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/custom-code')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.CUSTOM_CODE}>
      <CustomCodePage />
    </PageGuard>
  ),
})

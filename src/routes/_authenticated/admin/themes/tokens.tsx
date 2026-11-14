import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { TokensPage } from '@/features/themes/components/tokens-page'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/themes/tokens')({
  component: () => (
    <PageGuard permission={PERMISSIONS.THEMES.TOKENS}>
      <TokensPage />
    </PageGuard>
  ),
})

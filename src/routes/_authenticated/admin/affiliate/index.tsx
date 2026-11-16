import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { AffiliateConfigPage, AffiliateRouteGuard } from '@/features/affiliate'

export const Route = createFileRoute('/_authenticated/admin/affiliate/')({
  component: function Page() {
    return (
      <AffiliateRouteGuard permission={PERMISSIONS.AFFILIATE.INDEX}>
        <AffiliateConfigPage />
      </AffiliateRouteGuard>
    )
  },
})

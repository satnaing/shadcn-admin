import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { AffiliateFormPage, AffiliateRouteGuard } from '@/features/affiliate'

export const Route = createFileRoute('/_authenticated/admin/affiliate/form')({
  component: function Page() {
    return (
      <AffiliateRouteGuard permission={PERMISSIONS.AFFILIATE.FORM}>
        <AffiliateFormPage />
      </AffiliateRouteGuard>
    )
  },
})

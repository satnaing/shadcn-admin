import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import {
  SellerPackageRouteGuard,
  SellerPackagesPage,
} from '@/features/seller-package'

export const Route = createFileRoute('/_authenticated/admin/seller-package/')({
  component: () => (
    <SellerPackageRouteGuard permission={PERMISSIONS.SELLER_PACKAGE.INDEX}>
      <SellerPackagesPage />
    </SellerPackageRouteGuard>
  ),
})

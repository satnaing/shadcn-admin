import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { PaymentsPayriffPage, PaymentsRouteGuard } from '@/features/payments'

export const Route = createFileRoute('/_authenticated/admin/payments/payriff')({
  component: () => (
    <PaymentsRouteGuard permission={PERMISSIONS.PAYMENTS.PAYRIFF}>
      <PaymentsPayriffPage />
    </PaymentsRouteGuard>
  ),
})

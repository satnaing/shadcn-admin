import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { OtpGatewaysPage, OtpRouteGuard } from '@/features/otp'

export const Route = createFileRoute('/_authenticated/admin/otp/gateways')({
  component: function Page() {
    return (
      <OtpRouteGuard permission={PERMISSIONS.OTP.GATEWAYS}>
        <OtpGatewaysPage />
      </OtpRouteGuard>
    )
  },
})

import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { OtpBulkSmsPage, OtpRouteGuard } from '@/features/otp'

export const Route = createFileRoute('/_authenticated/admin/otp/bulk-sms')({
  component: function Page() {
    return (
      <OtpRouteGuard permission={PERMISSIONS.OTP.BULK_SMS}>
        <OtpBulkSmsPage />
      </OtpRouteGuard>
    )
  },
})

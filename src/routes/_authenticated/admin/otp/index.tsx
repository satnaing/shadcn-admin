import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { OtpSettingsPage, OtpRouteGuard } from '@/features/otp'

export const Route = createFileRoute('/_authenticated/admin/otp/')({
  component: function Page() {
    return (
      <OtpRouteGuard permission={PERMISSIONS.OTP.INDEX}>
        <OtpSettingsPage />
      </OtpRouteGuard>
    )
  },
})

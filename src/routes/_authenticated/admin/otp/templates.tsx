import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { OtpTemplatesPage, OtpRouteGuard } from '@/features/otp'

export const Route = createFileRoute('/_authenticated/admin/otp/templates')({
  validateSearch: createListSearchSchema({}),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <OtpRouteGuard permission={PERMISSIONS.OTP.TEMPLATES}>
        <OtpTemplatesPage search={search} navigate={navigate} />
      </OtpRouteGuard>
    )
  },
})

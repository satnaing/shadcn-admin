import { createFileRoute } from '@tanstack/react-router'
import { QrCampaignsPage, QrRouteGuard } from '@/features/qrcode-event'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/campaigns/')({
  validateSearch: createListSearchSchema(),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.CAMPAIGNS}>
        <QrCampaignsPage search={search} navigate={navigate} />
      </QrRouteGuard>
    )
  },
})

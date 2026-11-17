import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { QrBatchesPage, QrRouteGuard } from '@/features/qrcode-event'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/batches/')({
  validateSearch: createListSearchSchema({
    campaign_id: z.coerce.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.BATCHES}>
        <QrBatchesPage search={search} navigate={navigate} />
      </QrRouteGuard>
    )
  },
})

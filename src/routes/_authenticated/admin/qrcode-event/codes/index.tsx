import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { QrCodesPage, QrRouteGuard } from '@/features/qrcode-event'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/codes/')({
  validateSearch: createListSearchSchema({
    campaign_id: z.coerce.string().optional().catch(undefined),
    batch_id: z.coerce.string().optional().catch(undefined),
    winner: z.string().optional().catch(undefined),
    prize_id: z.coerce.string().optional().catch(undefined),
    date_from: z.string().optional().catch(undefined),
    date_to: z.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.CODES}>
        <QrCodesPage search={search} navigate={navigate} />
      </QrRouteGuard>
    )
  },
})

import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { QrBatchForm, QrRouteGuard } from '@/features/qrcode-event'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/batches/new')({
  validateSearch: createListSearchSchema({
    campaign_id: z.string().optional().catch(undefined),
  }),
  component: function Page() {
    const { campaign_id } = Route.useSearch()

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.BATCHES_CREATE}>
        <QrBatchForm campaignId={campaign_id} />
      </QrRouteGuard>
    )
  },
})

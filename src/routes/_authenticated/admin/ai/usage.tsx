import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { AiRouteGuard, AiUsagePage } from '@/features/ai'

const day = z.string().optional().catch(undefined)

export const Route = createFileRoute('/_authenticated/admin/ai/usage')({
  validateSearch: createListSearchSchema({ kind: z.enum(['content', 'translation']).optional().catch(undefined), from: day, to: day }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <AiRouteGuard permission={PERMISSIONS.AI.USAGE}>
        <AiUsagePage search={search} navigate={navigate} />
      </AiRouteGuard>
    )
  },
})

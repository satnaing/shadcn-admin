import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { PageBuilder } from '@/features/pages'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/pages/$id/builder')({
  component: BuilderRoute,
})

function BuilderRoute() {
  const { id } = Route.useParams()

  return (
    <PageGuard permission={PERMISSIONS.PAGES.BUILDER}>
      <PageBuilder pageId={Number(id)} />
    </PageGuard>
  )
}

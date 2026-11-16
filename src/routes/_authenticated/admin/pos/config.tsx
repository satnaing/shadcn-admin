import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { PosConfigPage, PosRouteGuard } from '@/features/pos'

export const Route = createFileRoute('/_authenticated/admin/pos/config')({
  component: function Page() {
    return (
      <PosRouteGuard permission={PERMISSIONS.POS.CONFIG}>
        <PosConfigPage />
      </PosRouteGuard>
    )
  },
})

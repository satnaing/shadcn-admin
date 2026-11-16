import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { PosRouteGuard, PosTerminalPage } from '@/features/pos'

export const Route = createFileRoute('/_authenticated/admin/pos/')({
  component: function Page() {
    return (
      <PosRouteGuard permission={PERMISSIONS.POS.INDEX}>
        <PosTerminalPage />
      </PosRouteGuard>
    )
  },
})

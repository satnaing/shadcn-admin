import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PanelGuard } from '@/components/guard/panel-guard'

export const Route = createFileRoute('/_authenticated/seller')({
  component: () => (
    <PanelGuard panel='seller'>
      <Outlet />
    </PanelGuard>
  ),
})

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PanelGuard } from '@/components/guard/panel-guard'

export const Route = createFileRoute('/_authenticated/admin')({
  component: () => (
    <PanelGuard panel='admin'>
      <Outlet />
    </PanelGuard>
  ),
})

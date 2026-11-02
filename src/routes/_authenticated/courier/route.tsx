import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PanelGuard } from '@/components/guard/panel-guard'

export const Route = createFileRoute('/_authenticated/courier')({
  component: () => (
    <PanelGuard panel='courier'>
      <Outlet />
    </PanelGuard>
  ),
})

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PanelGuard } from '@/components/guard/panel-guard'
import i18n from '@/shared/i18n'
import { namespaceForPath } from '@/shared/i18n/route-namespaces'

export const Route = createFileRoute('/_authenticated/admin')({
  // Await the section's namespace so no screen paints raw keys (`useSuspense` is off).
  beforeLoad: async ({ location }) => {
    const ns = namespaceForPath(location.pathname)
    if (ns) await i18n.loadNamespaces(ns)
  },
  component: () => (
    <PanelGuard panel='admin'>
      <Outlet />
    </PanelGuard>
  ),
})

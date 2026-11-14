import type { MenuGroupRaw, MenuPanel } from '@/api/menu.types'
import type { Handler } from './helpers'
import { mockModules } from './modules.data'

/** Server behaviour: only enabled modules whose group targets the requested panel. */
export function menuFor(panel: string): MenuGroupRaw[] {
  return mockModules
    .filter((m) => m.enabled && m.admin_menu?.group.panels.includes(panel as MenuPanel))
    .map((m) => ({ module: m.id, ...m.admin_menu! }))
}

const routes: Record<string, Handler> = {
  'GET /admin/menu': ({ query }) => ({ data: menuFor(query.panel ?? 'admin') }),
}

export default routes

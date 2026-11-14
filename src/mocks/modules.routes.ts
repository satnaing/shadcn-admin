import { type Handler, ok } from './helpers'
import { mockModules } from './modules.data'

// Only the toggle lives here (the sidebar menu depends on it); the Modules section extends this file.
const routes: Record<string, Handler> = {
  'GET /admin/modules': () => ({ data: mockModules }),
  'PATCH /admin/modules/:id': ({ params }) => {
    const target = mockModules.find((m) => m.id === params[0])
    if (target && !target.required) target.enabled = !target.enabled
    return { data: target ?? null }
  },
  'DELETE /admin/modules/:id': ok({ message: 'deleted' }),
}

export default routes

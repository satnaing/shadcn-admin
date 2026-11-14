import { useAuthStore } from '@/features/auth/data/auth.store'
import { authMock, currentUserMock } from './auth'
import { type Handler, ok } from './helpers'

export { ok, paginate, single } from './helpers'

/**
 * Feature sections add routes by creating `src/mocks/<section>.routes.ts`
 * (default export `Record<'METHOD /path', Handler>`) — it is picked up here,
 * so parallel work never edits this file. `:param` matches one path segment.
 */
const sectionRoutes = import.meta.glob<{ default: Record<string, Handler> }>(
  './*.routes.ts',
  { eager: true }
)

export const mockRoutes: Record<string, Handler> = {
  'POST /auth/login': ok(authMock),
  'POST /auth/register': ok(authMock),
  'PUT /auth/refresh': ok(authMock),
  'POST /auth/logout': ok(),
  'GET /auth/me': () => currentUserMock(useAuthStore.getState().user?.role),
  ...Object.assign({}, ...Object.values(sectionRoutes).map((m) => m.default)),
}

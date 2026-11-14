import { ALL_PERMISSIONS } from '@/shared/permissions'
import type { Handler } from './helpers'
import { type MockRole, mockRoles } from './roles.data'

type Body = { name?: string; description?: string; permissions?: string[] }
type Ctx = Parameters<Handler>[0] & { body?: unknown }

const known = (names: string[] = []) => names.filter((n) => ALL_PERMISSIONS.includes(n))
const bodyOf = (ctx: Ctx) => (ctx.body ?? {}) as Body
const find = (id: string) => mockRoles.find((r) => String(r.id) === id)

const routes: Record<string, Handler> = {
  'GET /admin/roles': () => ({ data: mockRoles }),
  'GET /admin/roles/:id': ({ params }) => ({ data: find(params[0]) ?? mockRoles[0] }),
  'POST /admin/roles': (ctx: Ctx) => {
    const { name = '', description = '', permissions } = bodyOf(ctx)
    const now = new Date().toISOString()
    const role: MockRole = {
      id: Math.max(0, ...mockRoles.map((r) => r.id)) + 1,
      name,
      description,
      system: false,
      users_count: 0,
      permissions: known(permissions),
      created_at: now,
      updated_at: now,
    }
    mockRoles.push(role)
    return { data: role }
  },
  'PUT /admin/roles/:id': (ctx: Ctx) => {
    const role = find(ctx.params[0])
    const { name, description, permissions } = bodyOf(ctx)
    if (role && !role.system) {
      Object.assign(role, {
        name: name ?? role.name,
        description: description ?? role.description,
        permissions: permissions ? known(permissions) : role.permissions,
        updated_at: new Date().toISOString(),
      })
    }
    return { data: role ?? null }
  },
  'DELETE /admin/roles/:id': ({ params }) => {
    const index = mockRoles.findIndex((r) => String(r.id) === params[0] && !r.system)
    if (index >= 0) mockRoles.splice(index, 1)
    return { message: 'deleted' }
  },
}

export default routes

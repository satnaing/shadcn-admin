import type { Handler } from './helpers'
import { type MockCurrency, mockCurrencies, mockLanguages, mockSettings } from './settings.data'

type Ctx = Parameters<Handler>[0] & { body?: unknown }
type Obj = Record<string, unknown>

const bodyOf = (ctx: Ctx): Obj => (ctx.body ?? {}) as Obj
const byId = <T extends { id: number }>(rows: T[], id: string) =>
  rows.find((r) => String(r.id) === id)

const routes: Record<string, Handler> = {
  'GET /admin/settings/:group': ({ params }) => ({ data: mockSettings[params[0]] ?? {} }),
  'PUT /admin/settings/:group': (ctx: Ctx) => {
    const group = (mockSettings[ctx.params[0]] ??= {})
    Object.assign(group, bodyOf(ctx))
    return { data: group, message: 'saved' }
  },

  'GET /admin/languages': () => ({ data: mockLanguages }),
  'PATCH /admin/languages/:id': (ctx: Ctx) => {
    const lang = byId(mockLanguages, ctx.params[0])
    const { is_active, is_default } = bodyOf(ctx)
    if (!lang) return { data: null }
    if (is_default === true && lang.is_active) {
      mockLanguages.forEach((l) => (l.is_default = l.id === lang.id))
    }
    if (typeof is_active === 'boolean' && !lang.is_default) lang.is_active = is_active
    return { data: lang }
  },

  'GET /admin/currencies': () => ({ data: mockCurrencies }),
  'GET /admin/currencies/all': () => ({ data: mockCurrencies }),
  'POST /admin/currencies': (ctx: Ctx) => {
    const row = {
      ...bodyOf(ctx),
      id: Math.max(0, ...mockCurrencies.map((c) => c.id)) + 1,
      is_default: false,
    } as MockCurrency
    mockCurrencies.push(row)
    return { data: row }
  },
  'PUT /admin/currencies/:id': (ctx: Ctx) => {
    const row = byId(mockCurrencies, ctx.params[0])
    const { is_default, ...values } = bodyOf(ctx)
    if (!row) return { data: null }
    Object.assign(row, values)
    if (is_default === true && row.is_active) {
      mockCurrencies.forEach((c) => (c.is_default = c.id === row.id))
    }
    return { data: row }
  },
  'DELETE /admin/currencies/:id': ({ params }) => {
    const index = mockCurrencies.findIndex((c) => String(c.id) === params[0] && !c.is_default)
    if (index >= 0) mockCurrencies.splice(index, 1)
    return { message: 'deleted' }
  },
}

export default routes

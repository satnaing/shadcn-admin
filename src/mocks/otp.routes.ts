import { maskCredentials, mergeCredentials } from '@/features/otp/data/otp.gateways'
import type { BulkSmsPayload, GatewayKey, OtpSettings, TemplateItem } from '@/features/otp/data/otp.type'
import { seedGateways, seedRecipients, seedSettings, seedTemplates } from './otp.data'
import { createCollection, type Handler, paginate } from './helpers'

const gateways = seedGateways.map((g) => ({ ...g, credentials: { ...g.credentials } }))
const templates = createCollection(seedTemplates)
let settings: OtpSettings = { ...seedSettings }

const P = '/admin/otp'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }
const find = (key: string) => gateways.find((g) => g.key === key)
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) =>
  (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<string, unknown>[]

const routes: Record<string, Handler> = {
  [`GET ${P}/settings`]: () => ({ data: settings }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = { ...settings, ...body<Partial<OtpSettings>>(b) }
    return ok
  },

  [`GET ${P}/gateways`]: () => ({
    data: gateways.map((g) => ({ ...g, credentials: maskCredentials(g.key, g.credentials) })),
  }),
  // static `activation` path first: it must not be read as a gateway key
  [`PUT ${P}/gateways/:key/activation`]: ({ params, body: b }) => {
    const { active } = body<{ active: boolean }>(b)
    // only one provider is active at a time (AEC `updateActivationSettings`)
    gateways.forEach((g) => (g.active = g.key === params[0] ? active : active ? false : g.active))
    return ok
  },
  [`PUT ${P}/gateways/:key`]: ({ params, body: b }) => {
    const gateway = find(params[0])
    if (gateway) {
      gateway.credentials = mergeCredentials(
        params[0] as GatewayKey,
        gateway.credentials,
        body<{ credentials: Record<string, string> }>(b).credentials
      )
    }
    return ok
  },

  [`GET ${P}/templates`]: (ctx) => paginate(rows(() => templates.all()))(ctx),
  [`PUT ${P}/templates/:id`]: ({ params, body: b }) => {
    const patch = body<Partial<TemplateItem>>(b)
    const current = templates.get(params[0])
    // verification / reset / account messages cannot be switched off (AEC hides their switch)
    templates.update(params[0], { ...patch, ...(current?.required ? { active: true } : {}) })
    return ok
  },

  [`GET ${P}/recipients`]: ({ query }) => {
    const needle = (query.q ?? '').trim().toLowerCase()
    return {
      data: seedRecipients.filter((r) => `${r.name} ${r.phone}`.toLowerCase().includes(needle)).slice(0, 20),
    }
  },
  [`POST ${P}/sms`]: ({ body: b }) => ({ ...ok, data: { sent: body<BulkSmsPayload>(b).phones.length } }),
}

export default routes

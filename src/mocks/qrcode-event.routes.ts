import type { StatsResponse } from '@/features/qrcode-event/data/qrcode-event.type'
import { createCollection, type Handler, paginate, type Query } from './helpers'
import {
  type CampaignRow,
  type CodeRow,
  codeString,
  seedBatches,
  seedCampaigns,
  seedChecks,
  seedCodes,
  seedPrizes,
  seedProducts,
  seedSettings,
} from './qrcode-event.data'

const campaigns = createCollection(seedCampaigns)
const prizes = createCollection(seedPrizes)
const batches = createCollection(seedBatches)
const codes = createCollection(seedCodes)
const checks = createCollection(seedChecks)
let settings = { ...seedSettings }

const P = '/admin/qrcode-event'
const body = <T>(b: unknown) => (b ?? {}) as T
const day = (iso: string) => iso.slice(0, 10)
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) => (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<string, unknown>[]
const REVEALED = ['checked', 'claimed']

const withCounts = (c: CampaignRow) => {
  const own = codes.all().filter((x) => x.campaign_id === c.id)
  return {
    ...c,
    prizes_count: prizes.all().filter((p) => p.campaign_id === c.id).length,
    codes_count: own.length,
    checked_count: own.filter((x) => REVEALED.includes(x.status)).length,
    claimed_count: own.filter((x) => x.status === 'claimed').length,
  }
}

const inRange = (iso: string, q: Query) =>
  (!q.date_from || day(iso) >= q.date_from) && (!q.date_to || day(iso) <= q.date_to)

const filterCodes = (q: Query) =>
  codes.all().filter(
    (c) =>
      (!q.campaign_id || String(c.campaign_id) === q.campaign_id) &&
      (!q.batch_id || String(c.batch_id) === q.batch_id) &&
      (!q.status || c.status === q.status) &&
      (!q.prize_id || String(c.prize_id) === q.prize_id) &&
      (q.winner !== '1' || c.prize_id !== null) &&
      (q.winner !== '0' || c.prize_id === null) &&
      inRange(c.created_at, q)
  )

const filterLogs = (q: Query) =>
  checks.all().filter(
    (c) =>
      (!q.campaign_id || String(c.campaign_id) === q.campaign_id) &&
      (!q.result || c.result === q.result) &&
      (!q.ip || c.ip === q.ip) &&
      inRange(c.created_at, q)
  )

const csvLink = (name: string, rows: Record<string, unknown>[]) => {
  const head = Object.keys(rows[0] ?? { id: '' })
  const lines = [head.join(','), ...rows.map((r) => head.map((h) => JSON.stringify(r[h] ?? '')).join(','))]
  // blob: because browsers block top-level navigation to data: URLs; the real API returns a signed https URL
  const download_url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
  return { data: { download_url, filename: `${name}.csv` } }
}

const stats: Handler = ({ query }) => {
  const own = codes.all().filter((c) => !query.campaign_id || String(c.campaign_id) === query.campaign_id)
  const count = (fn: (c: CodeRow) => boolean) => own.filter(fn).length
  const winnersRevealed = count((c) => c.prize_id !== null && REVEALED.includes(c.status))
  const claimed = count((c) => c.status === 'claimed')
  const logs = checks.all().filter((c) => !query.campaign_id || String(c.campaign_id) === query.campaign_id)
  const days = new Map<string, { total: number; wins: number }>()
  for (const c of [...logs].sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    const d = days.get(day(c.created_at)) ?? { total: 0, wins: 0 }
    days.set(day(c.created_at), { total: d.total + 1, wins: d.wins + (c.result === 'win' ? 1 : 0) })
  }
  const data: StatsResponse = {
    total: own.length,
    checked: count((c) => REVEALED.includes(c.status)),
    unused: count((c) => c.status === 'unused'),
    disabled: count((c) => c.status === 'disabled'),
    winners: count((c) => c.prize_id !== null),
    winners_revealed: winnersRevealed,
    claimed,
    pending_prizes: winnersRevealed - claimed,
    prize_breakdown: prizes
      .all()
      .filter((p) => !query.campaign_id || String(p.campaign_id) === query.campaign_id)
      .map((p) => ({
        prize_id: p.id, title: p.title, type: p.type, quantity: p.quantity,
        revealed_count: own.filter((c) => c.prize_id === p.id && REVEALED.includes(c.status)).length,
        delivered_count: own.filter((c) => c.prize_id === p.id && c.status === 'claimed').length,
      })),
    chart: [...days].map(([d, v]) => ({ day: d, ...v })),
  }
  return { data }
}

const generateBatch: Handler = ({ body: b }) => {
  const v = body<{ campaign_id: number; quantity: number; prize_allocation: Record<string, number>; product_id: number | null; note: string }>(b)
  const campaign = campaigns.get(v.campaign_id)
  const allocation = Object.entries(v.prize_allocation ?? {}).filter(([, n]) => n > 0)
  const winners = allocation.reduce((sum, [, n]) => sum + n, 0)
  const batch = batches.create(
    {
      campaign_id: v.campaign_id, campaign_name: campaign?.name ?? '', quantity: v.quantity, winner_quantity: winners,
      product_id: v.product_id, note: v.note ?? '', created_by_name: 'Admin', created_at: new Date().toISOString(),
    },
    'start'
  )
  // shortcut: the mock materialises at most 40 rows per batch (real API generates all of `quantity`).
  const slots = allocation.flatMap(([id, n]) => Array(n).fill(Number(id)) as number[])
  for (let i = 0; i < Math.min(v.quantity, 40); i++) {
    const prize = prizes.get(slots[i] ?? -1)
    codes.create({
      campaign_id: v.campaign_id, campaign_name: campaign?.name ?? '', batch_id: batch.id,
      prize_id: prize?.id ?? null, prize_title: prize?.title ?? null,
      code: codeString(campaign?.code_prefix ?? null, batch.id * 1000 + i), status: 'unused', user_name: null,
      checked_at: null, claimed_at: null, created_at: batch.created_at, claim_note: '', claimed_by_name: null, ip: null, user_agent: null,
    }, 'start')
    if (prize) prizes.update(prize.id, { allocated_count: prize.allocated_count + 1 })
  }
  return { message: 'ok', data: batch }
}

const toggleCode: Handler = ({ params }) => {
  const c = codes.get(params[0])
  if (c) codes.update(c.id, { status: c.status === 'disabled' ? (c.checked_at ? 'checked' : 'unused') : 'disabled' })
  return { message: 'ok' }
}

const claimCode: Handler = ({ params, body: b }) => {
  const c = codes.get(params[0])
  if (c && c.prize_id !== null && c.status !== 'claimed') {
    codes.update(c.id, {
      status: 'claimed', claimed_at: new Date().toISOString(), claimed_by_name: 'Admin',
      claim_note: body<{ claim_note?: string }>(b).claim_note ?? '',
    })
    const prize = prizes.get(c.prize_id)
    if (prize) prizes.update(prize.id, { claimed_count: prize.claimed_count + 1 })
  }
  return { message: 'ok' }
}

const removeCampaign: Handler = ({ params }) => {
  const id = Number(params[0])
  for (const [col, key] of [[prizes, 'campaign_id'], [codes, 'campaign_id'], [batches, 'campaign_id'], [checks, 'campaign_id']] as const) {
    for (const row of [...col.all()]) if ((row as { campaign_id: number | null })[key] === id) col.remove(row.id)
  }
  campaigns.remove(id)
  return { message: 'ok' }
}

const routes: Record<string, Handler> = {
  [`GET ${P}/stats`]: stats,
  [`GET ${P}/products`]: () => ({ data: seedProducts }),
  [`GET ${P}/campaigns`]: (ctx) => paginate(() => campaigns.all().filter((c) => !ctx.query.status || c.status === ctx.query.status).map(withCounts))(ctx),
  [`GET ${P}/campaigns/:id`]: ({ params }) => ({ data: withCounts(campaigns.get(params[0]) ?? campaigns.all()[0]) }),
  [`POST ${P}/campaigns`]: ({ body: b }) => {
    const v = body<Omit<CampaignRow, 'id'>>(b)
    const row = campaigns.create({ ...v, slug: v.slug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), starts_at: v.starts_at || null, ends_at: v.ends_at || null, code_prefix: v.code_prefix || null }, 'start')
    return { message: 'ok', data: withCounts(row) }
  },
  [`PUT ${P}/campaigns/:id`]: ({ params, body: b }) => {
    const v = body<Partial<CampaignRow>>(b)
    campaigns.update(params[0], { ...v, starts_at: v.starts_at || null, ends_at: v.ends_at || null, code_prefix: v.code_prefix || null })
    return { message: 'ok' }
  },
  [`PATCH ${P}/campaigns/:id/status`]: ({ params, body: b }) => {
    campaigns.update(params[0], { status: body<{ status: CampaignRow['status'] }>(b).status })
    return { message: 'ok' }
  },
  [`DELETE ${P}/campaigns/:id`]: removeCampaign,
  [`GET ${P}/campaigns/:id/prizes`]: ({ params }) => ({ data: prizes.all().filter((p) => String(p.campaign_id) === params[0]).sort((a, b) => a.sort_order - b.sort_order).map((p) => ({ ...p })) }),
  [`POST ${P}/campaigns/:id/prizes`]: ({ params, body: b }) => ({
    message: 'ok',
    data: prizes.create({ ...body<Record<string, never>>(b), campaign_id: Number(params[0]), allocated_count: 0, claimed_count: 0 } as never),
  }),
  [`PUT ${P}/prizes/:id`]: ({ params, body: b }) => {
    prizes.update(params[0], body(b))
    return { message: 'ok' }
  },
  [`DELETE ${P}/prizes/:id`]: ({ params }) => {
    prizes.remove(params[0])
    return { message: 'ok' }
  },
  [`GET ${P}/batches`]: (ctx) => paginate(rows(() => batches.all().filter((b) => !ctx.query.campaign_id || String(b.campaign_id) === ctx.query.campaign_id)))(ctx),
  [`POST ${P}/batches`]: generateBatch,
  [`GET ${P}/batches/:id/export`]: ({ params, query }) =>
    csvLink(`batch-${params[0]}-${query.format ?? 'csv'}`, codes.all().filter((c) => String(c.batch_id) === params[0]).map((c) => ({ code: c.code, prize: c.prize_title, status: c.status }))),
  [`GET ${P}/batches/:id/qr-zip`]: ({ params }) =>
    csvLink(`batch-${params[0]}-qr-links`, codes.all().filter((c) => String(c.batch_id) === params[0]).map((c) => ({ code: c.code, url: `https://allixwork.test/qr/${c.code}` }))),
  [`GET ${P}/codes`]: (ctx) => {
    const needle = (ctx.query.search ?? '').toUpperCase()
    return paginate(rows(() => filterCodes(ctx.query).filter((c) => !needle || c.code.includes(needle))))(ctx)
  },
  [`GET ${P}/codes/export`]: ({ query }) => csvLink('codes', filterCodes(query).map((c) => ({ code: c.code, campaign: c.campaign_name, status: c.status, prize: c.prize_title }))),
  [`GET ${P}/codes/:id`]: ({ params }) => {
    const code = codes.get(params[0]) ?? codes.all()[0]
    return { data: { ...code, checks: checks.all().filter((c) => c.qr_code_id === code.id).slice(0, 50) } }
  },
  [`PATCH ${P}/codes/:id/toggle`]: toggleCode,
  [`POST ${P}/codes/:id/claim`]: claimCode,
  [`GET ${P}/logs`]: (ctx) => {
    const needle = (ctx.query.search ?? '').toUpperCase()
    return paginate(rows(() => filterLogs(ctx.query).filter((c) => !needle || c.code_input.toUpperCase().includes(needle))))(ctx)
  },
  [`GET ${P}/logs/export`]: ({ query }) => csvLink('logs', filterLogs(query).map((c) => ({ code: c.code_input, result: c.result, ip: c.ip, at: c.created_at }))),
  [`GET ${P}/settings`]: () => ({ data: settings }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = { ...settings, ...body(b) }
    return { message: 'ok' }
  },
}

export default routes

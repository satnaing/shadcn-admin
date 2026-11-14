import type { Handler } from './helpers'
import { mockModules } from './modules.data'

const day = (offset: number) => {
  const d = new Date(Date.UTC(2026, 10, 14))
  d.setUTCDate(d.getUTCDate() - offset)
  return d.toISOString().slice(5, 10)
}

const visits = Array.from({ length: 30 }, (_, i) => {
  const n = 29 - i
  const base = 420 + ((n * 37) % 160) + (n % 7 === 0 ? 120 : 0)
  return { date: day(n), visits: base, pageviews: Math.round(base * 2.4) }
})

const activity = [
  ['Aysel', 'published', 'About us', 1],
  ['Rauf', 'updated', 'Header menu', 3],
  ['Nigar', 'created', 'Black Friday banner', 5],
  ['Aysel', 'activated', 'theme-xshop', 26],
  ['Elvin', 'updated', 'SEO settings', 30],
  ['Rauf', 'created', 'Spring collection (blog)', 52],
  ['Nigar', 'deleted', 'Old landing page', 70],
  ['Elvin', 'published', 'Contact us', 96],
].map(([actor, action, target, hours], id) => ({
  id: id + 1,
  actor,
  action,
  target,
  at: new Date(Date.UTC(2026, 10, 14, 8) - Number(hours) * 3_600_000).toISOString(),
}))

const total = visits.reduce((sum, v) => sum + v.visits, 0)

const routes: Record<string, Handler> = {
  'GET /admin/dashboard': () => ({
    data: {
      stats: [
        { key: 'pages', value: 14, delta: 7.1 },
        { key: 'blogs', value: 38, delta: 12.5 },
        { key: 'modules', value: mockModules.filter((m) => m.enabled).length, delta: 0 },
        { key: 'visits', value: total, delta: -3.2 },
      ],
      visits,
      activity,
    },
  }),
}

export default routes

import axios from 'axios'
import { describe, expect, it } from 'vitest'
import { installMockAdapter } from '@/config/mock-adapter'
import { createCollection, paginate } from './helpers'

type Row = { id: number; name: string; rank: number }
const seed: Row[] = [
  { id: 1, name: 'Alpha', rank: 3 },
  { id: 2, name: 'Beta', rank: 1 },
  { id: 3, name: 'Gamma', rank: 2 },
]
const list = (rows: Row[], query: Record<string, string>) =>
  paginate(rows as unknown as Record<string, unknown>[])({ params: [], query }) as {
    data: Row[]
    meta: { total: number; last_page: number; current_page: number }
  }

describe('createCollection', () => {
  it('keeps writes: create, update, remove, reorder', () => {
    const col = createCollection(seed)
    const created = col.create({ name: 'Delta', rank: 9 }, 'start')
    expect(created.id).toBe(4)
    expect(col.all()[0].name).toBe('Delta')
    col.update(2, { name: 'Beta2' })
    expect(col.get(2)?.name).toBe('Beta2')
    expect(col.remove(1)).toBe(true)
    expect(col.get(1)).toBeUndefined()
    col.reorder([3, 2, 4])
    expect(col.all().map((r) => r.id)).toEqual([3, 2, 4])
    expect(seed).toHaveLength(3)
  })
})

describe('paginate server params', () => {
  it('filters by q over every string field', () => {
    expect(list(seed, { q: 'amm' }).data.map((r) => r.id)).toEqual([3])
    expect(list(seed, { q: 'zzz' }).meta.total).toBe(0)
  })

  it('sorts asc by field and desc by -field', () => {
    expect(list(seed, { sort: 'rank' }).data.map((r) => r.id)).toEqual([2, 3, 1])
    expect(list(seed, { sort: '-rank' }).data.map((r) => r.id)).toEqual([1, 3, 2])
  })

  it('pages with per_page', () => {
    const page2 = list(seed, { page: '2', per_page: '2', sort: 'id' })
    expect(page2.data.map((r) => r.id)).toEqual([3])
    expect(page2.meta).toMatchObject({ total: 3, last_page: 2, current_page: 2 })
  })
})

describe('mock adapter', () => {
  it('hands the JSON body to the handler and later GETs see the write', async () => {
    installMockAdapter(axios)
    const client = axios.create()
    installMockAdapter(client)
    const created = await client.post('/admin/blog-categories', {
      status: true,
      translations: {
        en: { name: 'Zeta cat', slug: 'zeta' },
        az: { name: '', slug: '' }, ru: { name: '', slug: '' }, tr: { name: '', slug: '' },
      },
    })
    expect(created.data.message).toBe('created')
    const found = await client.get('/admin/blog-categories?q=zeta')
    expect(found.data.data).toHaveLength(1)
  })
})

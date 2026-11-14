import { describe, expect, it } from 'vitest'
import { mockRoutes } from '@/mocks'
import { paginate } from './helpers'

type Body = { data?: unknown; meta?: unknown }
const call = (key: string) => mockRoutes[key]({ params: [], query: {} }) as Body

describe('mock routes', () => {
  it('never double-wrap `{ data: { data } }`', () => {
    const wrapped = Object.keys(mockRoutes)
      .filter((k) => k.startsWith('GET ') && !k.includes(':'))
      .filter((k) => {
        const { data } = call(k)
        return typeof data === 'object' && data !== null && !Array.isArray(data) && 'data' in data
      })
    expect(wrapped).toEqual([])
  })

  it('paginate returns one envelope with rows + meta', () => {
    const body = paginate([{ id: 1 }, { id: 2 }, { id: 3 }])({ params: [], query: { per_page: '2' } }) as Body & { data: unknown[] }
    expect(body.data).toHaveLength(2)
    expect(body.meta).toMatchObject({ total: 3, last_page: 2, per_page: 2 })
  })

  it('auth mocks exist (login, register, refresh, me)', () => {
    for (const key of ['POST /auth/login', 'POST /auth/register', 'PUT /auth/refresh', 'GET /auth/me']) {
      expect(mockRoutes[key]).toBeTypeOf('function')
    }
  })
})

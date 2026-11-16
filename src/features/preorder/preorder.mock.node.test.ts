import { mockRoutes } from '@/mocks'
import { describe, expect, it } from 'vitest'
import { productDefaults } from './data/preorder.schema'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row; meta?: { total: number } }
const P = '/admin/preorder'
const get = (
  path: string,
  query: Record<string, string> = {},
  params: string[] = []
) => mockRoutes[`GET ${P}${path}`]({ params, query }) as Body
const write = (
  method: string,
  path: string,
  body?: unknown,
  params: string[] = []
) =>
  mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body }) as {
    message: string
    data?: Row
  }
const all = { per_page: '1000' }
type Steps = Record<string, string>

describe('preorder orders mock', () => {
  it('lists are `{data, meta}` with 10+ rows and server-side q/page/sort', () => {
    expect(get('/orders').meta?.total).toBeGreaterThanOrEqual(10)
    expect(get('/orders', { page: '2', per_page: '5' }).data).toHaveLength(5)
    const first = get('/orders', all).data[0]
    expect(
      get('/orders', { q: String(first.code), ...all }).data.length
    ).toBeLessThan(get('/orders', all).data.length)
  })

  it('scope and stage filters agree with the counts endpoint', () => {
    const inhouse = get('/orders', { scope: 'inhouse', ...all }).data
    expect(inhouse.length).toBeGreaterThan(0)
    expect(inhouse.every((o) => o.owner_type === 'admin')).toBe(true)
    const counts = get('/orders/counts', { scope: 'inhouse' })
      .data as unknown as Record<string, number>
    expect(counts.all).toBe(inhouse.length)
    const requested = get('/orders', {
      scope: 'inhouse',
      stage: 'requested',
      ...all,
    }).data
    expect(requested.length).toBe(counts.requested)
    expect(
      requested.every((o) => (o.steps as Steps).request === 'pending')
    ).toBe(true)
  })

  it('delayed lists contain only orders stuck for more than a day', () => {
    const prepayment = get('/orders', {
      scope: 'delayed_prepayment',
      ...all,
    }).data
    expect(prepayment.length).toBeGreaterThan(0)
    expect(
      prepayment.every(
        (o) =>
          (o.steps as Steps).request === 'accepted' &&
          (o.steps as Steps).prepayment === 'none'
      )
    ).toBe(true)
    const final = get('/orders', { scope: 'delayed_final', ...all }).data
    expect(final.every((o) => (o.steps as Steps).final === 'none')).toBe(true)
  })

  it('a step cannot be set before the previous one is accepted; accepting writes the timeline', () => {
    const order = get('/orders', { stage: 'requested', ...all }).data[0]
    const id = [String(order.id)]
    expect(
      write('PUT', '/orders/:id/steps/:step', { status: 'accepted' }, [
        ...id,
        'final',
      ]).message
    ).toBe('previous_step_required')
    write(
      'PUT',
      '/orders/:id/steps/:step',
      { status: 'accepted', note: 'ok' },
      [...id, 'request']
    )
    const detail = get('/orders/:id', {}, id).data
    expect((detail.steps as Steps).request).toBe('accepted')
    expect((detail.step_notes as Steps).request).toBe('ok')
    expect((detail.step_at as Steps).request).toBeTruthy()
  })

  it('delivering a seller order books the seller commission; in-house orders do not', () => {
    const before = get('/commissions', all).data.length
    const seller = get('/orders', {
      scope: 'seller',
      stage: 'in_shipping',
      ...all,
    }).data[0]
    write('PUT', '/orders/:id/steps/:step', { status: 'accepted' }, [
      String(seller.id),
      'delivery',
    ])
    const after = get('/commissions', all).data
    expect(after.length).toBe(before + 1)
    expect(after[0].order_code).toBe(seller.code)
    const inhouse = get('/orders', {
      scope: 'inhouse',
      stage: 'in_shipping',
      ...all,
    }).data[0]
    if (inhouse)
      write('PUT', '/orders/:id/steps/:step', { status: 'accepted' }, [
        String(inhouse.id),
        'delivery',
      ])
    expect(get('/commissions', all).data.length).toBe(before + 1)
  })

  it('delete and bulk delete remove orders; reminders respect the notification switch', () => {
    const [a, b, c] = get('/orders', all).data
    const total = get('/orders', all).data.length
    write('DELETE', '/orders/:id', undefined, [String(a.id)])
    write('POST', '/orders/bulk-delete', { ids: [b.id, c.id] })
    expect(get('/orders', all).data.length).toBe(total - 3)
    const sent = write('POST', '/orders/reminders', {
      ids: [1, 2],
      type: 'prepayment',
    })
    expect(['ok', 'disabled']).toContain(sent.message)
  })
})

describe('preorder products mock', () => {
  it('filters by owner and state; flags and approval write through', () => {
    const seller = get('/products', { owner: 'seller', ...all }).data
    expect(seller.length).toBeGreaterThan(0)
    expect(seller.every((p) => p.owner_type === 'seller')).toBe(true)
    const target = get('/products', { state: 'unpublished', ...all }).data[0]
    write(
      'PATCH',
      '/products/:id/flags',
      { flag: 'is_published', value: true },
      [String(target.id)]
    )
    expect(
      get('/products', { state: 'published', ...all }).data.some(
        (p) => p.id === target.id
      )
    ).toBe(true)
    write('PATCH', '/products/:id/flags', { flag: 'approval', value: false }, [
      String(target.id),
    ])
    expect(
      get('/products', all).data.find((p) => p.id === target.id)?.approval
    ).toBe('pending')
  })

  it('creates, updates and deletes a product; the list shows the derived terms', () => {
    const values = {
      ...productDefaults,
      name: 'Zebra Preorder XYZ',
      category_id: 1,
      unit_price: 100,
      prepayment: { enabled: true, type: 'percent', amount: 25 },
    }
    const created = write('POST', '/products', values)
    const id = String(created.data!.id)
    const row = get('/products', { q: 'Zebra Preorder XYZ', ...all }).data[0]
    expect([row.is_prepayment, row.prepayment_amount, row.owner_type]).toEqual([
      true,
      25,
      'admin',
    ])
    write('PUT', '/products/:id', { ...values, name: 'Zebra Renamed XYZ' }, [
      id,
    ])
    expect(get('/products/:id', {}, [id]).data.name).toBe('Zebra Renamed XYZ')
    write('DELETE', '/products/:id', undefined, [id])
    expect(
      get('/products', { q: 'Zebra Renamed XYZ', ...all }).data
    ).toHaveLength(0)
  })

  it('bulk delete removes the selected products', () => {
    const [a, b] = get('/products', all).data
    write('POST', '/products/bulk-delete', { ids: [a.id, b.id] })
    const ids = get('/products', all).data.map((p) => p.id)
    expect(ids).not.toContain(a.id)
    expect(ids).not.toContain(b.id)
  })
})

describe('conversations, queries, reviews mock', () => {
  it('a reply is appended to the thread and a delete removes the conversation', () => {
    const c = get('/conversations', all).data[0]
    write(
      'POST',
      '/conversations/:id/reply',
      { message: 'Hello from admin XYZ' },
      [String(c.id)]
    )
    const thread = get('/conversations/:id', {}, [String(c.id)]).data
    const messages = thread.messages as Row[]
    const last = messages[messages.length - 1]
    expect([last.message, last.is_admin]).toEqual([
      'Hello from admin XYZ',
      true,
    ])
    write('DELETE', '/conversations/:id', undefined, [String(c.id)])
    expect(get('/conversations', all).data.some((x) => x.id === c.id)).toBe(
      false
    )
  })

  it('answering a query moves it from "pending" to "replied"', () => {
    const pending = get('/queries', { state: 'pending', ...all }).data
    expect(pending.length).toBeGreaterThan(0)
    write('PUT', '/queries/:id', { reply: 'Answer XYZ' }, [
      String(pending[0].id),
    ])
    expect(
      get('/queries', { state: 'pending', ...all }).data.some(
        (q) => q.id === pending[0].id
      )
    ).toBe(false)
    expect(
      get('/queries', { state: 'replied', ...all }).data.find(
        (q) => q.id === pending[0].id
      )?.reply
    ).toBe('Answer XYZ')
  })

  it('reviews group by product, open clears "new", hiding updates the review', () => {
    const products = get('/reviews', all).data
    expect(products.length).toBeGreaterThan(0)
    const withNew = products.find((p) => p.has_new)!
    const detail = get('/reviews/products/:id', {}, [String(withNew.id)]).data
    expect((detail.reviews as Row[]).length).toBe(withNew.reviews_count)
    expect(
      get('/reviews', all).data.find((p) => p.id === withNew.id)?.has_new
    ).toBe(false)
    const review = (detail.reviews as Row[])[0]
    write(
      'PATCH',
      '/reviews/:id/status',
      { is_published: !review.is_published },
      [String(review.id)]
    )
    const after = get('/reviews/products/:id', {}, [String(withNew.id)]).data
      .reviews as Row[]
    expect(after[0].is_published).toBe(!review.is_published)
  })
})

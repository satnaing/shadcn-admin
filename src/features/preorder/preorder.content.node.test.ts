import { mockRoutes } from '@/mocks'
import { describe, expect, it } from 'vitest'

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

describe('faqs, notification types, settings mock', () => {
  const t = (q: string, a = q) => ({
    az: { question: q, answer: a },
    en: { question: '', answer: '' },
    tr: { question: '', answer: '' },
    ru: { question: '', answer: '' },
  })

  it('creates, edits, toggles and deletes a FAQ; the list shows the Azerbaijani text', () => {
    const created = write('POST', '/faqs', { translations: t('Sual XYZ') })
    const id = String(created.data!.id)
    expect(get('/faqs', { q: 'Sual XYZ', ...all }).data[0].question).toBe(
      'Sual XYZ'
    )
    write('PUT', '/faqs/:id', { translations: t('Yenilənmiş XYZ') }, [id])
    expect(get('/faqs', { q: 'Yenilənmiş XYZ', ...all }).data).toHaveLength(1)
    write('PATCH', '/faqs/:id/status', { is_active: false }, [id])
    expect(
      get('/faqs', { q: 'Yenilənmiş XYZ', ...all }).data[0].is_active
    ).toBe(false)
    write('DELETE', '/faqs/:id', undefined, [id])
    expect(get('/faqs', { q: 'Yenilənmiş XYZ', ...all }).data).toHaveLength(0)
  })

  it('notification types filter by audience, edit and switch off', () => {
    const customer = get('/notification-types', {
      user_type: 'customer',
      ...all,
    }).data
    expect(customer.length).toBeGreaterThan(0)
    expect(customer.every((n) => n.user_type === 'customer')).toBe(true)
    const target = customer[0]
    write(
      'PUT',
      '/notification-types/:id',
      {
        image: 'x.png',
        translations: {
          az: { name: 'Ad XYZ', default_text: 'Mətn' },
          en: { name: '', default_text: '' },
          tr: { name: '', default_text: '' },
          ru: { name: '', default_text: '' },
        },
      },
      [String(target.id)]
    )
    write('PATCH', '/notification-types/:id', { is_active: false }, [
      String(target.id),
    ])
    const row = get('/notification-types', { q: 'Ad XYZ', ...all }).data[0]
    expect([row.name, row.is_active]).toEqual(['Ad XYZ', false])
  })

  it('a switched-off reminder type sends nothing', () => {
    const type = get('/notification-types', {
      q: 'preorder_prepayment_reminder_customer',
      ...all,
    }).data[0]
    write('PATCH', '/notification-types/:id', { is_active: false }, [
      String(type.id),
    ])
    const res = write('POST', '/orders/reminders', {
      ids: [1, 2],
      type: 'prepayment',
    })
    expect(res.message).toBe('disabled')
    write('PATCH', '/notification-types/:id', { is_active: true }, [
      String(type.id),
    ])
    expect(
      write('POST', '/orders/reminders', { ids: [1, 2], type: 'prepayment' })
        .message
    ).toBe('ok')
  })

  it('saves and returns the settings', () => {
    write('PUT', '/settings', {
      seller_commission: 15,
      allow_seller_products: false,
    })
    expect(get('/settings').data).toMatchObject({
      seller_commission: 15,
      allow_seller_products: false,
    })
  })

  it('dashboard counters are consistent with the orders lists', () => {
    const stats = get('/dashboard').data as unknown as Record<
      string,
      number | number[]
    >
    expect(stats.monthly_sales).toHaveLength(12)
    expect(stats.delivered).toBe(
      get('/orders', { stage: 'delivered', ...all }).data.length
    )
    expect(
      get('/dashboard/top-products', { owner: 'all' }).data.length
    ).toBeLessThanOrEqual(5)
  })
})

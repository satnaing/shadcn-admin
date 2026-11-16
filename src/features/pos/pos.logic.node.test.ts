import { describe, expect, it } from 'vitest'
import { addToCart, cartTotals, removeLine, setQuantity } from './data/pos-cart'
import { buildOrderPayload, checkoutBlocker } from './data/pos-payload'
import { addressSchema, guestSchema, printWidthSchema } from './data/pos.schema'
import type { PosStockItem } from './data/pos.type'

const stock = (over: Partial<PosStockItem> = {}): PosStockItem => ({
  id: 1,
  product_id: 1,
  name: 'Phone case',
  variant: '',
  price: 10,
  tax: 1.8,
  stock_qty: 3,
  min_qty: 1,
  digital: false,
  barcode: null,
  category_id: 1,
  brand_id: null,
  image: null,
  ...over,
})

describe('cart rules (AEC PosUtility::addToCart)', () => {
  it('starts at the minimum quantity and refuses a product that cannot cover it', () => {
    expect(addToCart([], stock({ min_qty: 2 })).lines[0].quantity).toBe(2)
    expect(addToCart([], stock({ min_qty: 2, stock_qty: 1 }))).toMatchObject({
      lines: [],
      error: 'minStock',
    })
    expect(
      addToCart([], stock({ stock_qty: 0, digital: true })).lines
    ).toHaveLength(1)
  })

  it('adding the same item bumps the quantity up to the stock, digital items only once', () => {
    let { lines } = addToCart([], stock())
    for (let i = 0; i < 2; i++) lines = addToCart(lines, stock()).lines
    expect(lines[0].quantity).toBe(3)
    expect(addToCart(lines, stock()).error).toBe('noMoreStock')
    const digital = stock({ digital: true })
    expect(addToCart(addToCart([], digital).lines, digital).error).toBe(
      'alreadyInCart'
    )
  })

  it('setQuantity honours stock and minimum; removeLine drops the row', () => {
    const { lines } = addToCart([], stock({ min_qty: 2 }))
    expect(setQuantity(lines, 1, 9).error).toBe('noMoreStock')
    expect(setQuantity(lines, 1, 1).lines[0].quantity).toBe(2)
    expect(setQuantity(lines, 1, 3).lines[0].quantity).toBe(3)
    expect(removeLine(lines, 1)).toEqual([])
  })
})

describe('cart totals', () => {
  it('sums price, tax and shipping, then subtracts the discount', () => {
    const { lines } = addToCart([], stock())
    const bumped = setQuantity(lines, 1, 2).lines
    expect(cartTotals(bumped, 5, 3)).toEqual({
      subtotal: 20,
      tax: 3.6,
      shipping: 5,
      discount: 3,
      total: 25.6,
    })
  })

  it('never lets the discount push the total below zero (AEC allowed it)', () => {
    const { lines } = addToCart([], stock())
    expect(cartTotals(lines, 0, 999)).toMatchObject({
      discount: 11.8,
      total: 0,
    })
    expect(cartTotals(lines, 0, -5).discount).toBe(0)
  })
})

describe('order payload', () => {
  const base = {
    source: 'registered' as const,
    customerId: 7,
    addressId: 70,
    guest: { name: 'G', phone: '1', email: '', address: 'x' },
    lines: addToCart([], stock()).lines,
    shipping: 2,
    discount: 1,
    paymentType: 'cash' as const,
    offline: { method: 'Bank', amount: 1, trx_id: '', proof: null },
  }

  it('registered customers ship to a saved address, everybody else to the typed info', () => {
    expect(buildOrderPayload(base)).toMatchObject({
      customer_id: 7,
      address_id: 70,
      guest: null,
      offline: null,
    })
    expect(buildOrderPayload({ ...base, source: 'whatsapp' })).toMatchObject({
      order_source: 'whatsapp',
      customer_id: null,
      address_id: null,
      guest: base.guest,
    })
    expect(
      buildOrderPayload({ ...base, paymentType: 'offline_payment' }).offline
    ).toEqual(base.offline)
    expect(buildOrderPayload(base).items).toEqual([
      { stock_id: 1, quantity: 1 },
    ])
  })

  it('blocks empty carts and registered orders without customer or address', () => {
    expect(checkoutBlocker({ ...base, lines: [] })).toBe('emptyCart')
    expect(checkoutBlocker({ ...base, addressId: null })).toBe('noCustomer')
    expect(
      checkoutBlocker({
        ...base,
        source: 'facebook',
        customerId: null,
        addressId: null,
      })
    ).toBeNull()
  })
})

describe('schemas fix AEC gaps', () => {
  it('guest info needs a name, an address and a phone or an e-mail', () => {
    const ok = { name: 'A', phone: '', email: 'a@b.co', address: 'x' }
    expect(guestSchema.safeParse(ok).success).toBe(true)
    expect(
      guestSchema.safeParse({ ...ok, email: '', phone: '5' }).success
    ).toBe(true)
    const none = guestSchema.safeParse({ ...ok, email: '' })
    expect(none.success).toBe(false)
    expect(none.error?.issues[0]).toMatchObject({
      path: ['phone'],
      message: 'pos:validation.phoneOrEmail',
    })
    expect(guestSchema.safeParse({ ...ok, email: 'nope' }).success).toBe(false)
  })

  it('a saved address needs the whole region chain', () => {
    const ok = {
      address: 'x',
      country_id: 1,
      state_id: 1,
      city_id: 1,
      postal_code: '',
      phone: '5',
    }
    expect(addressSchema.safeParse(ok).success).toBe(true)
    expect(addressSchema.safeParse({ ...ok, city_id: 0 }).success).toBe(false)
  })

  it('printer width is a whole number of millimetres, not any text', () => {
    expect(printWidthSchema.safeParse({ print_width: 80 }).success).toBe(true)
    expect(printWidthSchema.safeParse({ print_width: 8 }).success).toBe(false)
    expect(printWidthSchema.safeParse({ print_width: 80.5 }).success).toBe(
      false
    )
    expect(printWidthSchema.safeParse({ print_width: 'wide' }).success).toBe(
      false
    )
  })
})

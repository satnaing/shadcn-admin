import type {
  PosCartLine,
  PosGuestInfo,
  PosOfflinePayment,
  PosOrderPayload,
  PosOrderSource,
  PosPaymentType,
} from './pos.type'

interface Input {
  source: PosOrderSource
  customerId: number | null
  addressId: number | null
  guest: PosGuestInfo
  lines: PosCartLine[]
  shipping: number
  discount: number
  paymentType: PosPaymentType
  offline: PosOfflinePayment | null
}

/** A registered customer ships to a saved address, everybody else to the typed info. */
export function buildOrderPayload(i: Input): PosOrderPayload {
  const registered = i.source === 'registered'
  return {
    order_source: i.source,
    customer_id: registered ? i.customerId : null,
    address_id: registered ? i.addressId : null,
    guest: registered ? null : i.guest,
    items: i.lines.map((l) => ({ stock_id: l.stock.id, quantity: l.quantity })),
    shipping_cost: i.shipping,
    discount: i.discount,
    payment_type: i.paymentType,
    offline: i.paymentType === 'offline_payment' ? i.offline : null,
  }
}

/** Why the order cannot be placed yet (i18n key under `pos:checkout.*`), or null when it can. */
export function checkoutBlocker(i: Pick<Input, 'source' | 'customerId' | 'addressId' | 'lines'>) {
  if (i.lines.length === 0) return 'emptyCart'
  if (i.source === 'registered' && (!i.customerId || !i.addressId)) return 'noCustomer'
  return null
}

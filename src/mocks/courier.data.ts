import type {
  CourierDetail,
  CourierLookups,
  CourierSettings,
  DeliveryItem,
  DeliveryStatus,
  PaymentType,
  SettlementItem,
} from '@/features/courier/data/courier.type'

const DAY = 86_400_000
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString()

export const seedSettings: CourierSettings = {
  payment_type: 'commission',
  salary: 600,
  commission: 2.5,
  mail_notification: true,
  otp_notification: false,
  pickup_latitude: '40.4093',
  pickup_longitude: '49.8671',
}

export const seedLookups: CourierLookups = {
  countries: [
    { id: 1, name: 'Azərbaycan', parent_id: null },
    { id: 2, name: 'Türkiyə', parent_id: null },
  ],
  states: [
    { id: 1, name: 'Bakı', parent_id: 1 },
    { id: 2, name: 'Abşeron', parent_id: 1 },
    { id: 3, name: 'İstanbul', parent_id: 2 },
    { id: 4, name: 'Ankara', parent_id: 2 },
  ],
  cities: [
    { id: 1, name: 'Nəsimi', parent_id: 1 },
    { id: 2, name: 'Yasamal', parent_id: 1 },
    { id: 3, name: 'Xırdalan', parent_id: 2 },
    { id: 4, name: 'Sumqayıt', parent_id: 2 },
    { id: 5, name: 'Kadıköy', parent_id: 3 },
    { id: 6, name: 'Üsküdar', parent_id: 3 },
    { id: 7, name: 'Çankaya', parent_id: 4 },
    { id: 8, name: 'Keçiören', parent_id: 4 },
  ],
}

const NAMES = [
  'Rauf Məmmədov',
  'Elnur Quliyev',
  'Tural Əliyev',
  'Kamran Hüseynov',
  'Orxan Babayev',
  'Samir Nəbiyev',
  'Cavid Rzayev',
  'Ruslan Əsgərov',
  'Fuad İsmayılov',
  'Ilqar Səfərov',
  'Zaur Həsənli',
  'Nicat Qasımov',
]

/** `password` stays in the mock store only; the list/detail handlers strip it. */
export const seedCouriers: Array<CourierDetail & { password: string }> =
  NAMES.map((name, i) => {
    const state = seedLookups.states[i % 2]
    const city = seedLookups.cities.find((c) => c.parent_id === state.id)!
    return {
      id: i + 1,
      name,
      email: `courier${i + 1}@allixwork.test`,
      phone: `+99450${String(1000000 + i * 31337).slice(0, 7)}`,
      banned: i === 1,
      total_earning: i % 4 === 3 ? 0 : 35 + i * 12.5,
      total_collection: i % 3 === 2 ? 0 : 120 + i * 47.25,
      created_at: ago(90 - i * 5),
      avatar: null,
      address: `${10 + i} Nizami küç.`,
      country_id: 1,
      state_id: state.id,
      city_id: city.id,
      password: 'secret1',
    }
  })

const settlements = (base: number, step: number): SettlementItem[] =>
  Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    courier_name: NAMES[i % NAMES.length],
    amount: base + i * step,
    created_at: ago(i * 2 + 1),
  }))
export const seedPayments = settlements(40, 7.5)
export const seedCollections = settlements(100, 22)

export type MockDelivery = DeliveryItem & {
  courier_name: string
  cancel_requested_at: string | null
}

const STATUSES: DeliveryStatus[] = [
  'pending',
  'confirmed',
  'picked_up',
  'on_the_way',
  'delivered',
  'cancelled',
]
const CUSTOMERS = [
  'Aynur Cəfərova',
  'Vüsal İbrahimov',
  'Nigar Əliyeva',
  'Rəşad Məmmədov',
  'Sevinc Babayeva',
  'Kənan Əhmədov',
]

export const seedDeliveries: MockDelivery[] = Array.from(
  { length: 24 },
  (_, i) => {
    const delivery_status = STATUSES[i % STATUSES.length]
    const open =
      delivery_status !== 'cancelled' && delivery_status !== 'delivered'
    const cancel_request = i % 4 === 3 && open
    return {
      id: i + 1,
      order_code: `20261${1200 + i}`,
      customer_name: CUSTOMERS[i % CUSTOMERS.length],
      address: `${i + 3} Rəsul Rza küç., Bakı`,
      payment_type: (i % 3 === 0
        ? 'prepaid'
        : 'cash_on_delivery') as PaymentType,
      grand_total: Math.round((25 + i * 13.4) * 100) / 100,
      delivery_status,
      cancel_request,
      assigned_at: ago(i % 9),
      courier_name: NAMES[i % NAMES.length],
      cancel_requested_at: cancel_request ? ago(i % 5) : null,
    }
  }
)

/** Delivered orders of the signed-in courier (AEC delivery history). */
export const seedHistory = Array.from({ length: 16 }, (_, i) => {
  const cod = i % 3 !== 0
  return {
    id: i + 1,
    order_code: `20261${1100 + i}`,
    payment_type: (cod ? 'cash_on_delivery' : 'prepaid') as PaymentType,
    collection: cod ? Math.round((40 + i * 11.2) * 100) / 100 : 0,
    earning: seedSettings.commission,
    created_at: ago(i + 1),
  }
})

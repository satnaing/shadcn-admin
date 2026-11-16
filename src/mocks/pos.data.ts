import type {
  PosAddress,
  PosCustomer,
  PosLookups,
  PosOrderItem,
  PosOrderSource,
  PosPaymentType,
  PosSettings,
} from '@/features/pos/data/pos.type'

const DAY = 86_400_000
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString()

export const seedSettings: PosSettings = { seller_activation: true, print_width: 80 }

export const seedLookups: PosLookups = {
  categories: [
    { id: 1, name: 'Electronics', depth: 0 },
    { id: 2, name: 'Phones', depth: 1 },
    { id: 3, name: 'Accessories', depth: 1 },
    { id: 4, name: 'Clothing', depth: 0 },
    { id: 5, name: 'Shoes', depth: 1 },
    { id: 6, name: 'Home', depth: 0 },
    { id: 7, name: 'Books', depth: 0 },
  ],
  brands: [
    { id: 1, name: 'Nova' },
    { id: 2, name: 'Kiwi' },
    { id: 3, name: 'Atlas' },
    { id: 4, name: 'Zeta' },
  ],
  sellers: [
    { id: 11, name: 'Baku Tech' },
    { id: 12, name: 'Fashion House' },
    { id: 13, name: 'Kitab Dünyası' },
  ],
  countries: [
    { id: 1, name: 'Azərbaycan', parent_id: null },
    { id: 2, name: 'Türkiyə', parent_id: null },
  ],
  states: [
    { id: 1, name: 'Bakı', parent_id: 1 },
    { id: 2, name: 'Abşeron', parent_id: 1 },
    { id: 3, name: 'İstanbul', parent_id: 2 },
  ],
  cities: [
    { id: 1, name: 'Nəsimi', parent_id: 1 },
    { id: 2, name: 'Yasamal', parent_id: 1 },
    { id: 3, name: 'Xırdalan', parent_id: 2 },
    { id: 4, name: 'Kadıköy', parent_id: 3 },
  ],
}

const NAMES = [
  'Smartphone X1', 'Wireless earbuds', 'Phone case', 'USB-C cable', 'Power bank',
  'T-shirt', 'Denim jacket', 'Running shoes', 'Leather boots', 'Desk lamp',
  'Coffee mug', 'Notebook set', 'Novel', 'Cookbook', 'Smart watch',
  'Tablet 10"', 'Screen protector', 'Hoodie', 'Sneakers', 'Table clock',
  'Bluetooth speaker', 'Backpack', 'Sunglasses', 'Wall shelf', 'Pen set',
  'Atlas of the world', 'E-book bundle', 'Charging dock',
]
const CATEGORY_OF = [2, 3, 3, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 1, 1, 3, 4, 5, 6, 1, 4, 4, 6, 7, 7, 7, 3]

export interface MockPosProduct {
  id: number
  name: string
  category_id: number
  brand_id: number | null
  /** User id of the owning seller; null = inhouse. */
  seller_id: number | null
  unit_price: number
  tax_percent: number
  min_qty: number
  digital: boolean
  barcode: string
  rating: number
  pos: boolean
}

export interface MockStock {
  id: number
  product_id: number
  variant: string
  qty: number
}

// The first 20 products are on the terminal, the rest can be imported from the products screen.
export const seedProducts: MockPosProduct[] = NAMES.map((name, i) => ({
  id: i + 1,
  name,
  category_id: CATEGORY_OF[i],
  brand_id: i % 5 === 4 ? null : (i % 4) + 1,
  seller_id: i % 4 === 3 ? 11 + (i % 3) : null,
  unit_price: Math.round((8 + ((i * 37) % 90) + (i % 3) * 0.5) * 100) / 100,
  tax_percent: i % 2 === 0 ? 18 : 0,
  min_qty: i === 4 ? 2 : 1,
  digital: i === 26,
  barcode: `869000000${String(100 + i)}`,
  rating: Math.round((3 + ((i * 7) % 20) / 10) * 10) / 10,
  pos: i < 20,
}))

/** Every third product has two variants; some stocks are empty or low on purpose. */
export const seedStocks: MockStock[] = seedProducts.flatMap((p) => {
  const variants = p.id % 3 === 0 ? ['Black', 'White'] : ['']
  return variants.map((variant, v) => ({
    id: p.id * 10 + v,
    product_id: p.id,
    variant,
    qty: p.id === 7 || (p.id === 9 && v === 1) ? 0 : p.id === 5 ? 1 : 3 + ((p.id * 5 + v * 3) % 40),
  }))
})

const FIRST = ['Rauf', 'Elnur', 'Tural', 'Leyla', 'Aysel', 'Nigar', 'Kamran', 'Orxan', 'Sevda', 'Cavid', 'Günel', 'Murad']
export const seedCustomers: PosCustomer[] = FIRST.map((name, i) => ({
  id: 101 + i,
  name: `${name} Məmmədov`,
  phone: `5010000${String(100 + i * 7)}`,
  email: `${name.toLowerCase()}@mail.test`,
}))

export const seedAddresses: (PosAddress & { customer_id: number })[] = seedCustomers
  .slice(0, 8)
  .flatMap((c, i) =>
    [0, 1].slice(0, i % 3 === 0 ? 1 : 2).map((n) => ({
      id: c.id * 10 + n,
      customer_id: c.id,
      address: `${12 + n * 5} Nizami küç.`,
      country: 'Azərbaycan',
      state: 'Bakı',
      city: n === 0 ? 'Nəsimi' : 'Yasamal',
      postal_code: `AZ10${i}${n}`,
      phone: c.phone,
    }))
  )

const SOURCES: PosOrderSource[] = ['walkin', 'registered', 'facebook', 'whatsapp']
const PAYMENTS: PosPaymentType[] = ['cash', 'cash', 'cash_on_delivery', 'offline_payment']

export const seedOrders: PosOrderItem[] = Array.from({ length: 24 }, (_, i) => {
  const payment_type = PAYMENTS[i % 4]
  const source = SOURCES[i % 4]
  return {
    id: i + 1,
    code: `20261${String(100 + i)}-1${String(10 + i)}0${i % 10}`,
    date: ago(24 - i),
    customer: source === 'registered' ? `${FIRST[i % 12]} Məmmədov` : 'Guest',
    source,
    items_count: 1 + (i % 4),
    grand_total: Math.round((25 + i * 13.7) * 100) / 100,
    payment_type,
    payment_status: payment_type === 'cash_on_delivery' ? 'unpaid' : 'paid',
    operator: i % 5 === 4 ? 'Seller staff' : 'Admin',
  }
})

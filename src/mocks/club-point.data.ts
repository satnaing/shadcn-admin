import type {
  ClubPointSettings,
  EarningDetail,
  ProductPointItem,
} from '@/features/club-point/data/club-point.type'

const DAY = 86_400_000
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString()

/** Points per unit of the store currency are 100 → 100 points are worth one currency unit. */
export const seedSettings: ClubPointSettings = { convert_rate: 100 }

const CUSTOMERS = [
  'Kənan Əhmədov',
  'Samirə Quliyeva',
  'Elçin Həsənov',
  'Nigar Əliyeva',
  'Rəşad Məmmədov',
  'Aynur Cəfərova',
  'Vüsal İbrahimov',
  'Sevinc Babayeva',
]

const OWNERS = ['Admin', 'TechZone', 'Moda House', 'Home Plus']

const PRODUCTS: Array<[string, number]> = [
  ['Apple iPhone 16 Pro 256GB', 2699],
  ['Samsung Galaxy S24 Ultra 512GB', 2549],
  ['Dyson V15 Detect tozsoran', 1599],
  ['Sony WH-1000XM5 qulaqlıq', 549],
  ['Nike Air Max 270 krossovka', 289],
  ['Xiaomi Robot Vacuum S10', 699],
  ['Philips Airfryer XXL', 399],
  ['Logitech MX Master 3S', 169],
  ['Kitab: Atomic Habits', 24],
  ['JBL Charge 5 dinamik', 259],
  ['Adidas Ultraboost kostyum', 119],
  ['Lego Technic 42143', 199],
  ['Canon EOS R50 kit', 1199],
  ['Tefal Ingenio qazan dəsti', 89],
  ['Bosch qazma dəsti 18V', 149],
  ['Garmin Forerunner 265', 449],
]

export const seedProducts: ProductPointItem[] = PRODUCTS.map(
  ([name, unit_price], i) => ({
    id: i + 1,
    name,
    owner: OWNERS[i % OWNERS.length],
    unit_price,
    earn_point: i % 5 === 4 ? 0 : Math.round(unit_price / 10),
  })
)

/** Orders: `deleted` rows exercise the "Order not found / User not found" cases AEC prints. */
export const seedEarnings: EarningDetail[] = Array.from(
  { length: 22 },
  (_, i) => {
    const lineCount = 1 + (i % 3)
    const lines = Array.from({ length: lineCount }, (_l, j) => {
      const product =
        i % 11 === 10 && j === 0
          ? null
          : seedProducts[(i + j * 3) % seedProducts.length]
      return {
        id: i * 10 + j + 1,
        product_name: product?.name ?? null,
        points: (product?.earn_point ?? 40) * (1 + ((i + j) % 2)),
        created_at: ago(i + 1),
      }
    })
    return {
      id: i + 1,
      order_code: i === 19 ? null : `20261${String(1100 + i)}`,
      customer_name: i === 17 ? null : CUSTOMERS[i % CUSTOMERS.length],
      points: lines.reduce((sum, l) => sum + l.points, 0),
      convert_status: i % 3 === 0 ? 'converted' : 'pending',
      created_at: ago(i + 1),
      lines,
    }
  }
)

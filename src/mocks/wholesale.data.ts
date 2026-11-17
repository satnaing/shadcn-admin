import type { ProductFormValues } from '@/features/wholesale/data/wholesale.schema'
import type {
  NamedOption,
  Owner,
  WholesaleLookups,
} from '@/features/wholesale/data/wholesale.type'

const DAY = 86_400_000
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString()

/** Self-contained placeholder picture (no network): a coloured tile with the first letter. */
const tile = (letter: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='96' height='96' fill='hsl(${hue} 55% 60%)'/><text x='48' y='62' font-size='44' text-anchor='middle' fill='white' font-family='sans-serif'>${letter}</text></svg>`
  )}`

export const OWNERS: (NamedOption & { type: Owner })[] = [
  { id: 1, name: 'xShop', type: 'admin' },
  { id: 12, name: 'TechZone', type: 'seller' },
  { id: 13, name: 'Moda House', type: 'seller' },
  { id: 14, name: 'Home Plus', type: 'seller' },
]

const named = (names: string[]): NamedOption[] =>
  names.map((name, i) => ({ id: i + 1, name }))

export const seedLookups: Omit<WholesaleLookups, 'sellers'> = {
  categories: named([
    'Office supplies',
    'Electronics',
    'Clothing',
    'Home & kitchen',
    'Groceries',
    'Packaging',
    'Cleaning',
    'Toys',
  ]),
  brands: named(['Generic', 'Xerox', 'Samsung', 'Nike', 'Bosch']),
  units: named(['pc', 'kg', 'box', 'pack', 'm']),
}

const NAMES = [
  'A4 paper, 500 sheets (box of 5)',
  'Ballpoint pens, blue (pack of 50)',
  'USB-C charging cable 1 m (bulk 100)',
  'Cotton T-shirt, plain white',
  'Kitchen towels (pack of 12)',
  'Cardboard shipping boxes 40x30x20',
  'Dish soap 5 L canister',
  'Wooden building blocks set',
  'Wireless mouse, office line',
  'Rice, long grain 25 kg',
  'Bubble wrap roll 50 m',
  'Disposable gloves (box of 100)',
  'LED bulbs E27 10 W (carton of 40)',
  'Hand towels, microfibre',
  'Notebook A5, ruled (pack of 20)',
  'Plastic storage bins 30 L',
  'Sunflower oil 5 L (case of 4)',
  'Safety vests, reflective',
  'Power strip 5 sockets',
  'Stuffed toy bears, 30 cm',
]

export interface WholesaleRow {
  id: number
  owner_id: number
  owner_type: Owner
  owner_name: string
  num_of_sale: number
  rating: number
  is_approved: boolean
  created_at: string
  form: ProductFormValues
}

const tiersFor = (price: number, i: number) => {
  const step = 10 + (i % 3) * 5
  return [
    { min_qty: 5, max_qty: step - 1, price: +(price * 0.92).toFixed(2) },
    { min_qty: step, max_qty: step * 3, price: +(price * 0.85).toFixed(2) },
    {
      min_qty: step * 3 + 1,
      max_qty: step * 10,
      price: +(price * 0.78).toFixed(2),
    },
  ]
}

export const seedProducts: WholesaleRow[] = NAMES.map((name, i) => {
  const owner = OWNERS[i % 4 === 0 ? 0 : (i % 3) + 1]
  const price = +(4 + ((i * 7) % 40) + 0.5).toFixed(2)
  const category = (i % seedLookups.categories.length) + 1

  return {
    id: i + 1,
    owner_id: owner.id,
    owner_type: owner.type,
    owner_name: owner.name,
    num_of_sale: (i * 13) % 90,
    rating: +(3 + ((i * 3) % 20) / 10).toFixed(1),
    is_approved: owner.type === 'admin' || i % 4 !== 1,
    created_at: ago(i + 1),
    form: {
      name,
      brand_id: (i % 5) + 1,
      unit_id: (i % 5) + 1,
      min_qty: 5,
      tags: 'wholesale, bulk',
      barcode: `590${String(1000 + i)}`,
      sku: `WS-${100 + i}`,
      thumbnail: tile(name[0].toUpperCase(), (i * 41) % 360),
      video_provider: 'none',
      video_link: '',
      description: `${name}. Sold in bulk with quantity price bands.`,
      unit_price: price,
      current_stock: i % 7 === 3 ? 2 : 40 + i * 25,
      low_stock_quantity: 5,
      stock_visibility: 'quantity',
      tiers: tiersFor(price, i),
      discount_type: 'flat',
      discount: 0,
      discount_start: '',
      discount_end: '',
      category_ids: [category],
      category_id: category,
      shipping_type: i % 2 ? 'flat' : 'free',
      shipping_cost: i % 2 ? 3 : 0,
      est_shipping_days: 3,
      is_quantity_multiplied: false,
      cash_on_delivery: true,
      is_featured: i % 5 === 0,
      is_todays_deal: i % 6 === 0,
      is_published: i % 7 !== 5,
      meta_title: '',
      meta_description: '',
      meta_image: '',
    },
  }
})

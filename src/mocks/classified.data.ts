import type {
  ClassifiedPackage,
  ClassifiedProduct,
} from '@/features/classified/data/classified.type'

const DAY = 86_400_000
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString()

/** Self-contained placeholder picture (no network): a coloured tile with the first letter. */
const tile = (letter: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='96' height='96' fill='hsl(${hue} 55% 60%)'/><text x='48' y='62' font-size='44' text-anchor='middle' fill='white' font-family='sans-serif'>${letter}</text></svg>`
  )}`

const OWNERS = [
  'Kənan Əhmədov',
  'Samirə Quliyeva',
  'TechZone',
  'Moda House',
  'Elçin Həsənov',
  'Nigar Əliyeva',
  'Home Plus',
  'Rəşad Məmmədov',
]

const NAMES = [
  'iPhone 13 128GB, istifadə olunmuş',
  'Samsung Galaxy S21',
  'Dəri divan dəsti',
  'Velosiped Trek 29"',
  'Noutbuk Lenovo ThinkPad T14',
  'Uşaq arabası',
  'Yataq dəsti (160x200)',
  'PlayStation 5 + 2 pult',
  'Kofe maşını DeLonghi',
  'Qış gödəkçəsi, M ölçü',
  'Monitor Dell 27"',
  'Kitab rəfi, palıd',
  'Fotoaparat Canon 90D',
  'Elektrik skuteri',
  'Paltaryuyan maşın Bosch',
  'Gitara Yamaha F310',
  'Stol tennisi masası',
  'Qulaqlıq Sony WH-1000XM4',
  'Mətbəx dəsti',
  'Planşet iPad Air',
  'Qaz sobası',
  'Dağ ayaqqabısı, 42',
]

export const seedProducts: ClassifiedProduct[] = NAMES.map((name, i) => ({
  id: i + 1,
  name,
  thumbnail: tile(name[0].toUpperCase(), (i * 37) % 360),
  owner: OWNERS[i % OWNERS.length],
  is_active: i % 6 !== 4,
  is_published: i % 3 !== 2,
  created_at: ago(i + 1),
}))

const pack = (
  id: number,
  names: [string, string, string, string],
  amount: number,
  product_upload: number,
  hue: number
): ClassifiedPackage => ({
  id,
  name: names[0],
  translations: { az: names[0], en: names[1], tr: names[2], ru: names[3] },
  amount,
  product_upload,
  logo: tile(names[0][0], hue),
})

export const seedPackages: ClassifiedPackage[] = [
  pack(1, ['Pulsuz', 'Free', 'Ücretsiz', 'Бесплатный'], 0, 3, 200),
  pack(2, ['Başlanğıc', 'Starter', 'Başlangıç', 'Старт'], 9.9, 10, 30),
  pack(3, ['Standart', 'Standard', 'Standart', 'Стандарт'], 24.9, 30, 140),
  pack(4, ['Premium', 'Premium', 'Premium', 'Премиум'], 59, 100, 280),
]

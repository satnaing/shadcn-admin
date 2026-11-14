import type {
  PageDetail,
  PageRevision,
  PageRow,
  PageSection,
  PageTemplate,
} from '@/features/pages/data/pages.type'

const T = (az: string, en: string, tr: string, ru: string) => ({ az, en, tr, ru })
const sec = (id: string, component: string, payload: Record<string, unknown> = {}, hidden = false): PageSection => ({
  id,
  component,
  hidden,
  payload,
})

const SOURCE_PRODUCTS = { type: 'category', ids: '12,14' }

const homeSections = (): PageSection[] => [
  sec('h1', 'HeroSlider', {
    banners: [
      { title: T('Sağlamlıq həftəsi', 'Wellness week', 'Sağlık haftası', 'Неделя здоровья'), image: '', link: '/c/health', bgColor: '#e0f2fe' },
      { title: T('Yeni gələnlər', 'New arrivals', 'Yeni gelenler', 'Новинки'), image: '', link: '/new', bgColor: '#fef3c7' },
    ],
    deal: { type: 'deal', ids: '3' },
  }),
  sec('h2', 'CategoryGrid', {
    title: T('Kateqoriyalar', 'Shop by category', 'Kategoriler', 'Категории'),
    viewAllText: T('Hamısına bax', 'View all', 'Tümünü gör', 'Смотреть все'),
    viewAllLink: '/categories',
    campaigns: { type: 'category', ids: '' },
  }),
  sec('h3', 'FlashDealSection', {
    title: T('Flash kampaniya', 'Flash deals', 'Flaş fırsatlar', 'Флеш-акции'),
    countdownHours: 5,
    countdownMinutes: 30,
    countdownSeconds: 0,
    products: SOURCE_PRODUCTS,
  }),
  sec('h4', 'OurProductsSection', { title: T('Məhsullarımız', 'Our products', 'Ürünlerimiz', 'Наши товары'), products: SOURCE_PRODUCTS }),
  sec('h5', 'RemovedLegacyBanner', { note: 'component no longer in the active theme' }),
  sec('h6', 'NewsletterSection', { title: T('Xəbərlər', 'Newsletter', 'Bülten', 'Рассылка'), buttonText: T('Abunə ol', 'Subscribe', 'Abone ol', 'Подписаться') }, true),
]

const NAMES: Array<[string, string, string[]]> = [
  ['Ana səhifə', 'home', ['az', 'en', 'tr', 'ru']],
  ['Haqqımızda', 'about-us', ['az', 'en', 'tr']],
  ['Xidmətlər', 'services', ['az', 'en']],
  ['Əlaqə', 'contact-us', ['az', 'en', 'tr', 'ru']],
  ['Qiymətlər', 'pricing', ['az']],
  ['Tez-tez verilən suallar', 'faq', ['az', 'en']],
  ['İstifadə şərtləri', 'terms', ['az', 'en', 'tr', 'ru']],
  ['Məxfilik siyasəti', 'privacy', ['az', 'en', 'tr', 'ru']],
  ['Çatdırılma', 'delivery', ['az', 'ru']],
  ['Qaytarma', 'returns', ['az', 'en']],
  ['Karyera', 'careers', ['az']],
  ['Tərəfdaşlar', 'partners', ['az', 'en', 'tr']],
  ['Mətbuat', 'press', ['az']],
  ['Dəstək', 'support', ['az', 'en', 'tr', 'ru']],
]

const sectionsFor = (index: number): PageSection[] => {
  if (index === 0) return homeSections()
  if (index === 1) return [sec('a1', 'PromoBillboard', { title: T('Biz kimik', 'Who we are', 'Biz kimiz', 'Кто мы'), tone: 'brand' }), sec('a2', 'TrioLifestyleBanners', { items: [] })]
  if (index === 3) return [sec('c1', 'PremiumPicksSavingsSection', { title: 'raw json section', topRate: 4.8 })]
  return []
}

export const pageDetails: PageDetail[] = NAMES.map(([title, slug], index) => ({
  id: index + 1,
  title: T(title, title, title, title),
  slug: T(slug, slug, slug, slug),
  status: index % 4 === 2 || index === 4 ? 'draft' : 'published',
  is_homepage: index === 0,
  publish_at: null,
  header_variant: 'default',
  footer_variant: 'default',
  seo: { title: T(title, title, title, title), description: T('', '', '', ''), canonical: '' },
  sections: sectionsFor(index),
  updated_at: `2026-11-${String(14 - (index % 9)).padStart(2, '0')}T10:${String(10 + index).padStart(2, '0')}:00Z`,
}))

const langsById = new Map(NAMES.map(([, , langs], index) => [index + 1, langs]))
const langsOf = (detail: PageDetail): string[] => langsById.get(detail.id) ?? ['az']

export const toRow = (detail: PageDetail): PageRow => ({
  id: detail.id,
  title: detail.title.az,
  slug: detail.slug.az,
  status: detail.status,
  is_homepage: detail.is_homepage,
  translations: langsOf(detail),
  sections_count: detail.sections.length,
  updated_at: detail.updated_at,
})

export const pageTemplates: PageTemplate[] = [
  { id: 1, name: 'Landing', description: 'Hero + categories + newsletter', sections: [{ component: 'HeroSlider', payload: {} }, { component: 'CategoryGrid', payload: {} }, { component: 'NewsletterSection', payload: {} }] },
  { id: 2, name: 'Promo page', description: 'Billboard + banners', sections: [{ component: 'PromoBillboard', payload: {} }, { component: 'TrioLifestyleBanners', payload: {} }] },
]

export const revisionsFor = (pageId: number): PageRevision[] =>
  [4, 3, 2, 1].map((n) => ({
    id: pageId * 10 + n,
    author: n % 2 ? 'Admin' : 'Editor',
    created_at: `2026-11-1${n}T09:${10 + n}:00Z`,
    sections_count: n + 1,
    note: n === 1 ? 'Initial import' : '',
  }))

import type {
  FieldTab,
  PayloadSchema,
  SchemaNode,
  SectionCatalogItem,
} from '@/features/pages/data/pages.type'

const L = (title: string, extra: Partial<SchemaNode> = {}): SchemaNode => ({
  type: 'string',
  title,
  'x-localized': true,
  ...extra,
})
const S = (title: string, extra: Partial<SchemaNode> = {}): SchemaNode => ({ type: 'string', title, ...extra })
const link = (title = 'Link'): SchemaNode => S(title, { format: 'link' })
const image = (title = 'Image'): SchemaNode => S(title, { format: 'image' })
const source = (title = 'Data source'): SchemaNode => ({ type: 'object', title, format: 'source' })
const list = (title: string, props: Record<string, SchemaNode>): SchemaNode => ({
  type: 'array',
  title,
  items: { type: 'object', properties: props },
})
const style: Record<string, SchemaNode> = {
  background: S('Background', { format: 'color', 'x-tab': 'style' as FieldTab }),
  paddingY: S('Vertical spacing', { enum: ['none', 'sm', 'md', 'lg'], default: 'md', 'x-tab': 'style' as FieldTab }),
  fullWidth: { type: 'boolean', title: 'Full width', 'x-tab': 'style' as FieldTab },
}
const schema = (properties: Record<string, SchemaNode>): PayloadSchema => ({
  type: 'object',
  properties: { ...properties, ...style },
})
const item = (theme: string, category: string, component: string, title: string, payload?: PayloadSchema): SectionCatalogItem => ({
  component,
  category,
  title,
  theme,
  payload_schema: payload,
})

const X = 'theme-xshop'
const H = 'theme-senseihost'

export const xshopCatalog: SectionCatalogItem[] = [
  item(X, 'Hero', 'HeroSlider', 'Healthcare & Wellness Hero Slider', schema({
    banners: list('Banners', { title: L('Title'), image: image(), link: link(), bgColor: S('Background', { format: 'color' }) }),
    deal: source('Deal'),
  })),
  item(X, 'Hero', 'BeautyHeroSlider', 'Beauty & Lifestyle Hero Slider', schema({
    slides: list('Slides', { title: L('Title'), subtitle: L('Subtitle'), image: image(), cta: L('Button'), link: link() }),
    rightBanners: list('Right banners', { image: image(), link: link() }),
  })),
  item(X, 'Deals', 'FlashDealSection', 'Flash Deals Slider with Countdown', schema({
    title: L('Title'),
    subtitle: L('Subtitle', { format: 'textarea' }),
    countdownHours: { type: 'integer', title: 'Hours' },
    countdownMinutes: { type: 'integer', title: 'Minutes' },
    countdownSeconds: { type: 'integer', title: 'Seconds' },
    products: source('Products'),
  })),
  item(X, 'Deals', 'PremiumPicksSavingsSection', 'Premium Picks with 10% Savings'),
  item(X, 'Products', 'OurProductsSection', 'Our Products (tab filtered carousel)', schema({
    title: L('Title'),
    filterTabs: { type: 'array', title: 'Filter tabs', items: { type: 'string', 'x-localized': true } },
    products: source('Products'),
  })),
  item(X, 'Products', 'TopSellingProducts', 'Top Selling Products', schema({
    title: L('Title'),
    defaultCategory: S('Default category'),
    products: source('Products'),
  })),
  item(X, 'Products', 'WholesaleB2BWeekly', 'Wholesale & Bulk Supply Specials', schema({
    leftCards: list('Cards', { title: L('Title'), image: image(), link: link() }),
    billboard: { type: 'object', title: 'Billboard', properties: { title: L('Title'), image: image(), link: link() } },
  })),
  item(X, 'Categories', 'CategoryGrid', 'Shop by Category Slider', schema({
    title: L('Title'),
    subtitle: L('Subtitle'),
    viewAllText: L('View all text'),
    viewAllLink: link('View all link'),
    campaigns: source('Categories'),
  })),
  item(X, 'Banners', 'TrioLifestyleBanners', 'Bento Trio Lifestyle Banners', schema({
    items: list('Banners', { title: L('Title'), image: image(), link: link() }),
  })),
  item(X, 'Banners', 'PromoBanners', 'Triple Promo Banners', schema({ items: list('Banners', { image: image(), link: link() }) })),
  item(X, 'Banners', 'PromoBillboard', 'Full Width Promotional Billboard', schema({
    title: L('Title'),
    image: image(),
    link: link(),
    tone: S('Tone', { enum: ['light', 'dark', 'brand'], default: 'brand' }),
  })),
  item(X, 'Content', 'NewsletterSection', 'Newsletter', schema({
    title: L('Title'),
    subtitle: L('Subtitle', { format: 'textarea' }),
    placeholder: L('Placeholder'),
    buttonText: L('Button text'),
  })),
]

export const senseihostCatalog: SectionCatalogItem[] = [
  item(H, 'Home', 'HeroBento', 'Hero bento', schema({ headline: L('Headline'), sub: L('Subtitle', { format: 'textarea' }), ctaLabel: L('Button'), ctaLink: link(), image: image() })),
  item(H, 'Home', 'DomainSearchPanel', 'Domain search panel', schema({ placeholder: L('Placeholder'), defaultTld: S('Default TLD', { enum: ['.az', '.com', '.net', '.org'], default: '.az' }) })),
  item(H, 'Home', 'TldPriceStrip', 'TLD price strip', schema({ tlds: list('TLDs', { name: S('TLD'), price: { type: 'number', title: 'Price' } }) })),
  item(H, 'Home', 'ServicesShowcase', 'Services showcase', schema({ title: L('Title'), items: list('Services', { icon: S('Icon'), title: L('Title'), link: link() }) })),
  item(H, 'Home', 'FeatureStrip', 'Feature strip', schema({ items: list('Features', { title: L('Title'), text: L('Text', { format: 'textarea' }) }) })),
  item(H, 'Home', 'PromoBand', 'Promo band', schema({ title: L('Title'), text: L('Text'), cta: L('Button'), link: link() })),
  item(H, 'Home', 'PopularPlans', 'Popular plans', schema({ title: L('Title'), plans: source('Plans') })),
  item(H, 'Home', 'WhyUs', 'Why us', schema({ title: L('Title'), items: list('Reasons', { title: L('Title'), text: L('Text') }) })),
  item(H, 'Shared', 'SupportCta', 'Support CTA', schema({ title: L('Title'), buttonLabel: L('Button'), link: link() })),
  item(H, 'VPS', 'VpsPlans', 'VPS plans', schema({ title: L('Title'), plans: source('Plans') })),
  item(H, 'Hosting', 'HostingTools', 'Hosting tools'),
]

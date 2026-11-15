/** Field shapes come from admin2/docs/front-analysis.md §4 (derived from the two fronts' code). */
export type I18n = Record<string, string>

export interface LinkValue {
  label: I18n
  href: string
}

export interface ThemeSummary {
  id: string
  name: string
  origin: string
  version: string
  description: string
  active: boolean
  sections: number
  token_policy: 'free' | 'locked'
  variants: string[]
}

export interface ThemeCompatibility {
  page: string
  component: string
}

export interface TopbarSettings {
  enabled: boolean
  style: 'dark' | 'light'
  support: { text: I18n; phone: string }
  languages: { code: string; label: string; flag: string }[]
  defaultLanguage: string
  currencies: { code: string; symbol: string; label: string }[]
  defaultCurrency: string
  promoAlert: { enabled: boolean; category: I18n; discount: I18n; period: I18n }
  utilityLinks: (LinkValue & { icon: string })[]
  ticketLink: LinkValue
  campaignsButton: LinkValue
}

export interface HeaderSettings {
  variant: string
  sticky: boolean
  logo: { light: string; dark: string; band: string; text: string; href: string }
  search: { placeholder: I18n }
  account: { label: I18n; actionText: I18n }
  support: { label: I18n; phone: string }
  chat: { label: I18n; href: string; onlineText: I18n }
  categoriesButtonText: I18n
  show: Record<'search' | 'cart' | 'wishlist' | 'login' | 'register' | 'themeToggle', boolean>
  menuId: string
  mobileTabBar: { label: I18n; icon: string; href: string }[]
}

export interface FooterSettings {
  variant: string
  brand: { name: I18n; description: I18n; logo: string }
  socials: { network: string; href: string }[]
  appDownload: {
    enabled: boolean
    title: I18n
    googlePlay: { title: I18n; subtitle: I18n; href: string }
    appStore: { title: I18n; subtitle: I18n; href: string }
  }
  columns: { title: I18n; source: 'manual' | 'menu'; menuId: string; links: LinkValue[] }[]
  contact: { title: I18n; address: I18n; phone: string; email: string; fax: string }
  paymentMethods: { enabled: boolean; items: { code: string; label: string }[] }
  pills: LinkValue[]
  bottomBar: { copyright: I18n; links: LinkValue[] }
  showScrollTop: boolean
}

export interface TokenSettings {
  theme: string
  locked_tokens: string[]
  colors: Record<string, string>
  fonts: Record<'display' | 'heading' | 'price' | 'body', string>
  radius: string
  shadow: string
  spacing: { section: string; container: string }
}

export interface CustomCodeSettings {
  head: string
  bodyStart: string
  bodyEnd: string
  audit: { by: string; at: string } | null
}

export type MenuLocation = 'header' | 'footer' | 'mobile' | 'tools'
export type MenuNodeType = 'link' | 'dropdown' | 'mega-categories' | 'mega-bento'

export interface MenuNode {
  id: string
  label: I18n
  href: string
  icon: string
  description: I18n
  badge: { text: I18n; tone: 'lime' | 'primary-hover' | 'accent' } | null
  highlight: boolean
  type: MenuNodeType
  deal: { badge: I18n; text: I18n } | null
  source: 'manual' | 'catalog_categories'
  visibleIn: 'both' | 'desktop' | 'mobile'
  enabled: boolean
  children: MenuNode[]
}

export interface MenuSet {
  location: MenuLocation
  items: MenuNode[]
}

export type BannerGroup = 'hero-slider' | 'promo-banners' | 'trio' | 'dual' | 'brand-logos'
export type BannerTone = 'sage' | 'blush' | 'sky' | 'lavender' | 'amber'

/** xshop `HeroSlider.deal`. */
export interface BannerDeal {
  eyebrow: I18n
  vendor: string
  product_id: string
  stockLeft: number
  stockTotal: number
}

/** senseihost `heroDeal` (weekend countdown). */
export interface BannerHeroDeal {
  icon: string
  percent: number
  priceUsd: number
  oldPriceUsd: number
  endsAt: string
}

export interface Banner {
  id: number
  group: BannerGroup
  image: string
  alt: string
  badge: I18n
  tag: I18n
  eyebrow: I18n
  title: I18n
  subtitle: I18n
  description: I18n
  ctaText: I18n
  ctaLink: string
  bgColor: string
  tone: BannerTone | ''
  price: string
  originalPrice: string
  percent: number
  features: { icon: string; text: I18n }[]
  perks: I18n[]
  deal: BannerDeal
  heroDeal: BannerHeroDeal
  order: number
  enabled: boolean
  starts_at: string
  ends_at: string
  locales: string[]
}

export type BannerDraft = Omit<Banner, 'id' | 'order'>

export interface BannerGroupSettings {
  group: BannerGroup
  autoplay: boolean
  interval: number
  loop: boolean
  pauseOnHover: boolean
}

import type {
  Banner,
  BannerGroupSettings,
  CustomCodeSettings,
  FooterSettings,
  HeaderSettings,
  I18n,
  MenuNode,
  MenuSet,
  ThemeCompatibility,
  ThemeSummary,
  TokenSettings,
  TopbarSettings,
} from '@/features/themes/data/themes.type'
import { makeNode } from '@/features/themes/data/menu-tree'

const t4 = (az: string, en: string, tr = en, ru = en): I18n => ({ az, en, tr, ru })

export const mockThemes: ThemeSummary[] = [
  { id: 'theme-xshop', name: 'xShop', origin: 'theme-xshop', version: '1.4.0', description: 'Bento marketplace theme: 62 sections, free colour tokens.', active: true, sections: 62, token_policy: 'free' },
  { id: 'theme-senseihost', name: 'SenseiHost', origin: 'theme-senseihost', version: '0.9.2', description: 'Hosting storefront theme: 91 sections, locked brand palette.', active: false, sections: 91, token_policy: 'locked' },
]

export const mockCompatibility: Record<string, ThemeCompatibility[]> = {
  'theme-xshop': [],
  'theme-senseihost': [
    { page: 'Home', component: 'FlashDealSection' },
    { page: 'Home', component: 'BeautyHeroSlider' },
    { page: 'About', component: 'BrandLogoStrip' },
  ],
}

const link = (az: string, en: string, href: string) => ({ label: t4(az, en), href })

export const mockTopbar: TopbarSettings = {
  enabled: true,
  style: 'dark',
  support: { text: t4('Dəstək 24/7', 'Support 24/7', 'Destek 7/24', 'Поддержка 24/7'), phone: '+994 12 000 00 00' },
  languages: [
    { code: 'az', label: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ],
  defaultLanguage: 'az',
  currencies: [
    { code: 'AZN', symbol: '₼', label: 'Manat' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
  ],
  defaultCurrency: 'AZN',
  promoAlert: { enabled: true, category: t4('Elektronika', 'Electronics'), discount: t4('30% endirim', '30% off'), period: t4('bu həftə', 'this week') },
  utilityLinks: [
    { ...link('Satıcı ol', 'Become a seller', '/seller'), icon: '' },
    { ...link('Sifariş izlə', 'Track order', '/track'), icon: '' },
    { ...link('Kömək', 'Help', '/help'), icon: '' },
  ],
  ticketLink: link('Bilet aç', 'Open ticket', '/support'),
  campaignsButton: link('Kampaniyalar', 'Campaigns', '/campaigns'),
}

export const mockHeader: HeaderSettings = {
  variant: 'default',
  variants: ['default'],
  sticky: true,
  logo: { light: '', dark: '', band: '', text: 'xShop', href: '/' },
  search: { placeholder: t4('Məhsul axtar…', 'Search products…') },
  account: { label: t4('Hesabım', 'My account'), actionText: t4('Daxil ol', 'Sign in') },
  support: { label: t4('24/7 Dəstək', '24/7 Support'), phone: '+994 12 000 00 00' },
  chat: { label: t4('WhatsApp', 'WhatsApp'), href: 'https://wa.me/994120000000', onlineText: t4('Onlayn', 'Online') },
  categoriesButtonText: t4('Kateqoriyalar', 'Categories'),
  show: { search: true, cart: true, wishlist: true, login: true, register: true, themeToggle: false },
  menuId: 'header',
}

export const mockFooter: FooterSettings = {
  variant: 'default',
  variants: ['default'],
  brand: { name: t4('xShop', 'xShop'), description: t4('Etibarlı onlayn bazar.', 'A trusted online marketplace.'), logo: '' },
  socials: [
    { network: 'facebook', href: 'https://facebook.com/xshop' },
    { network: 'instagram', href: 'https://instagram.com/xshop' },
    { network: 'linkedin', href: 'https://linkedin.com/company/xshop' },
  ],
  appDownload: {
    enabled: true,
    title: t4('Tətbiqi yüklə', 'Get the app'),
    googlePlay: { title: t4('Google Play', 'Google Play'), subtitle: t4('Yüklə', 'Get it on'), href: '#' },
    appStore: { title: t4('App Store', 'App Store'), subtitle: t4('Yüklə', 'Download on'), href: '#' },
  },
  columns: [
    { title: t4('Şirkət', 'Company'), source: 'manual', menuId: '', links: [link('Haqqımızda', 'About us', '/about'), link('Əlaqə', 'Contact', '/contact')] },
    { title: t4('Kömək', 'Help'), source: 'manual', menuId: '', links: [link('FAQ', 'FAQ', '/faq'), link('Çatdırılma', 'Delivery', '/delivery')] },
    { title: t4('Menyu', 'Menu'), source: 'menu', menuId: 'footer', links: [] },
  ],
  contact: { title: t4('Əlaqə', 'Contact'), address: t4('Bakı, Azərbaycan', 'Baku, Azerbaijan'), phone: '+994 12 000 00 00', email: 'info@xshop.az', fax: '' },
  paymentMethods: { enabled: true, items: ['visa', 'mastercard', 'payriff'] },
  pills: [link('Qaydalar', 'Terms', '/terms'), link('Məxfilik', 'Privacy', '/privacy')],
  bottomBar: { copyright: t4('© 2026 xShop. Bütün hüquqlar qorunur.', '© 2026 xShop. All rights reserved.'), links: [link('Sayt xəritəsi', 'Sitemap', '/sitemap')] },
  showScrollTop: true,
}

export const mockTokens: TokenSettings = {
  theme: 'theme-xshop',
  locked_tokens: [],
  colors: {
    primary: '#7C3AED', 'primary-hover': '#4C1D95', accent: '#F59E0B', surface: '#F6F1FD',
    bg: '#FAF9FC', heading: '#1F1B2E', text: '#3F3A52', muted: '#6B6680', border: '#E4DDF3',
    dark: '#1E1B2E', inverse: '#FFFFFF',
  },
  fonts: { display: 'Poppins', heading: 'Montserrat', price: 'Quicksand', body: 'Inter' },
  radius: '12px',
  shadow: '0 8px 24px rgba(76, 29, 149, 0.12)',
  spacing: { section: '64px', container: '1280px' },
}

export const mockCustomCode: CustomCodeSettings = {
  head: '<!-- analytics snippet -->\n<script async src="https://example.com/a.js"></script>',
  bodyStart: '',
  bodyEnd: '',
  audit: { by: 'admin@xshop.az', at: '2026-11-12 18:40' },
}

const node = (id: string, az: string, en: string, href: string, extra: Partial<MenuNode> = {}): MenuNode => ({
  ...makeNode(id),
  label: t4(az, en),
  href,
  ...extra,
})

export const mockMenus: MenuSet[] = [
  {
    location: 'header',
    items: [
      node('n1', 'Ana səhifə', 'Home', '/'),
      node('n2', 'Kateqoriyalar', 'Categories', '', {
        type: 'mega-categories',
        children: [
          node('n3', 'Elektronika', 'Electronics', '/c/electronics', { icon: '📱', children: [node('n4', 'Telefonlar', 'Phones', '/c/phones')] }),
          node('n5', 'Geyim', 'Fashion', '/c/fashion', { icon: '👗' }),
          node('n6', 'Ev', 'Home', '/c/home', { icon: '🏠' }),
        ],
      }),
      node('n7', 'Endirimlər', 'Deals', '/deals', {
        type: 'mega-bento',
        badge: { text: t4('Yeni', 'New'), tone: 'lime' },
        deal: { badge: t4('Həftənin təklifi', 'Deal of the week'), text: t4('50%-dək endirim', 'Up to 50% off') },
        children: [node('n8', 'Flash deal', 'Flash deals', '/deals/flash'), node('n9', 'Kuponlar', 'Coupons', '/deals/coupons')],
      }),
      node('n10', 'Satıcılar', 'Sellers', '/sellers', { highlight: true }),
      node('n11', 'Blog', 'Blog', '/blog'),
    ],
  },
  {
    location: 'footer',
    items: [node('f1', 'Haqqımızda', 'About us', '/about'), node('f2', 'Əlaqə', 'Contact', '/contact'), node('f3', 'FAQ', 'FAQ', '/faq')],
  },
  { location: 'mobile', items: [node('m1', 'Ana səhifə', 'Home', '/'), node('m2', 'Kateqoriyalar', 'Categories', '/c')] },
  { location: 'tools', items: [node('t1', 'Alətlər', 'Tools', '', { children: [node('t2', 'Müqayisə', 'Compare', '/compare')] })] },
]

const GROUPS = ['hero-slider', 'promo-banners', 'trio', 'dual', 'brand-logos'] as const
const TONES = ['sage', 'blush', 'sky', 'lavender', 'amber', 'sage'] as const

export const mockBanners: Banner[] = Array.from({ length: 14 }, (_, index) => {
  const group = GROUPS[index % GROUPS.length]
  return {
    id: index + 1,
    group,
    image: '',
    alt: `Banner ${index + 1}`,
    badge: t4('Yeni', 'New'),
    tag: t4('Kampaniya', 'Campaign'),
    eyebrow: t4('Məhdud təklif', 'Limited offer'),
    title: t4(`Başlıq ${index + 1}`, `Headline ${index + 1}`),
    subtitle: t4('Alt başlıq', 'Subtitle'),
    description: t4('Qısa təsvir', 'Short description'),
    ctaText: t4('İndi al', 'Shop now'),
    ctaLink: `/campaign/${index + 1}`,
    bgColor: index % 2 === 0 ? '#F6F1FD' : '',
    tone: TONES[index % TONES.length],
    price: index % 3 === 0 ? '49.00' : '',
    originalPrice: index % 3 === 0 ? '79.00' : '',
    order: Math.floor(index / GROUPS.length) * 10 + (index % GROUPS.length) + 1,
    enabled: index % 5 !== 4,
    starts_at: index % 4 === 0 ? '2026-11-20T00:00' : '',
    ends_at: index % 4 === 0 ? '2026-12-01T00:00' : '',
    locales: index % 6 === 5 ? ['az', 'en'] : ['az', 'en', 'tr', 'ru'],
  }
})

export const mockGroupSettings: Record<string, BannerGroupSettings> = Object.fromEntries(
  GROUPS.map((group) => [group, { group, autoplay: group === 'hero-slider', interval: 5500, loop: true, pauseOnHover: true }])
)

export const mockTokensLocked: TokenSettings = {
  theme: 'theme-senseihost',
  locked_tokens: ['primary', 'accent', 'primary-light', 'dark', 'dark-deep', 'lime', 'surface', 'bg', 'inverse'],
  colors: {
    primary: '#5B21B6', accent: '#7C3AED', 'primary-light': '#EDE9FE', dark: '#1E1B4B', 'dark-deep': '#0F0A2E',
    lime: '#BEF264', surface: '#FFFFFF', bg: '#FBF8EF', border: '#E5E0D0', heading: '#1E1B4B', text: '#3B3659',
    muted: '#6B6680', inverse: '#FFFFFF',
  },
  fonts: { display: 'Manrope', heading: 'Manrope', price: 'Manrope', body: 'Inter' },
  radius: '16px',
  shadow: '0 6px 20px rgba(30, 27, 75, 0.1)',
  spacing: { section: '72px', container: '1200px' },
}

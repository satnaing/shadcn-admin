import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import type { BannerDeal, BannerDraft, BannerHeroDeal } from './themes.type'

export const BANNER_GROUPS = ['hero-slider', 'promo-banners', 'trio', 'dual', 'brand-logos'] as const

export const emptyDeal = (): BannerDeal => ({ eyebrow: {}, vendor: '', product_id: '', stockLeft: 0, stockTotal: 0 })
export const emptyHeroDeal = (): BannerHeroDeal => ({ icon: '', percent: 0, priceUsd: 0, oldPriceUsd: 0, endsAt: '' })

export const emptyBanner = (group: BannerDraft['group']): BannerDraft => ({
  group,
  image: '',
  alt: '',
  badge: {},
  tag: {},
  eyebrow: {},
  title: {},
  subtitle: {},
  description: {},
  ctaText: {},
  ctaLink: '',
  bgColor: '',
  tone: '',
  price: '',
  originalPrice: '',
  percent: 0,
  features: [],
  perks: [],
  deal: emptyDeal(),
  heroDeal: emptyHeroDeal(),
  enabled: true,
  starts_at: '',
  ends_at: '',
  locales: [...FALLBACK_FORM_LOCALES],
})

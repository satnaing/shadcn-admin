import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import type { BannerDraft } from './themes.type'

export const BANNER_GROUPS = ['hero-slider', 'promo-banners', 'trio', 'dual', 'brand-logos'] as const

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
  enabled: true,
  starts_at: '',
  ends_at: '',
  locales: [...FALLBACK_FORM_LOCALES],
})

export interface MockLanguage {
  id: number
  code: string
  name: string
  native_name: string
  is_active: boolean
  is_default: boolean
}

export interface MockCurrency {
  id: number
  code: string
  name: string
  symbol: string
  exchange_rate: number
  is_default: boolean
  is_active: boolean
  decimal_places: number
  position: 'before' | 'after'
}

export const mockLanguages: MockLanguage[] = [
  { id: 1, code: 'az', name: 'Azerbaijani', native_name: 'Azərbaycan', is_active: true, is_default: true },
  { id: 2, code: 'ru', name: 'Russian', native_name: 'Русский', is_active: true, is_default: false },
  { id: 3, code: 'tr', name: 'Turkish', native_name: 'Türkçe', is_active: true, is_default: false },
  { id: 4, code: 'ka', name: 'Georgian', native_name: 'ქართული', is_active: false, is_default: false },
  { id: 5, code: 'en', name: 'English', native_name: 'English', is_active: true, is_default: false },
]

const cur = (
  id: number,
  code: string,
  name: string,
  symbol: string,
  exchange_rate: number,
  is_active = true,
  position: 'before' | 'after' = 'before'
): MockCurrency => ({
  id,
  code,
  name,
  symbol,
  exchange_rate,
  is_active,
  position,
  is_default: code === 'AZN',
  decimal_places: 2,
})

export const mockCurrencies: MockCurrency[] = [
  cur(1, 'AZN', 'Azerbaijani manat', '₼', 1, true, 'after'),
  cur(2, 'USD', 'US dollar', '$', 0.5882),
  cur(3, 'EUR', 'Euro', '€', 0.5421),
  cur(4, 'TRY', 'Turkish lira', '₺', 20.35),
  cur(5, 'RUB', 'Russian ruble', '₽', 54.1, true, 'after'),
  cur(6, 'GEL', 'Georgian lari', '₾', 1.6),
  cur(7, 'GBP', 'Pound sterling', '£', 0.4631),
  cur(8, 'CNY', 'Chinese yuan', '¥', 4.26, false),
  cur(9, 'AED', 'UAE dirham', 'د.إ', 2.16, false, 'after'),
  cur(10, 'KZT', 'Kazakhstani tenge', '₸', 296.5, false, 'after'),
  cur(11, 'UAH', 'Ukrainian hryvnia', '₴', 24.3, false),
  cur(12, 'CHF', 'Swiss franc', 'Fr', 0.5189, false),
]

export const mockSettings: Record<string, Record<string, string | number | boolean>> = {
  general: {
    site_name: 'Allixwork',
    tagline: 'Build, sell and grow',
    admin_email: 'admin@allixwork.test',
    timezone: 'Asia/Baku',
    date_format: 'DD.MM.YYYY',
    maintenance_mode: false,
  },
  seo: {
    meta_title: 'Allixwork — website & marketplace builder',
    meta_description: 'Pages, blogs, themes and modules in one place.',
    canonical_base: 'https://allixwork.test',
    og_image: '',
    robots_index: true,
    sitemap_enabled: true,
  },
  email: {
    driver: 'smtp',
    host: 'smtp.mailtrap.test',
    port: 587,
    username: 'allixwork',
    password: '',
    encryption: 'tls',
    from_address: 'no-reply@allixwork.test',
    from_name: 'Allixwork',
  },
  notifications: {
    notify_address: 'team@allixwork.test',
    new_user_email: true,
    form_submission_email: true,
    new_comment_email: false,
    module_update_notice: true,
    digest_frequency: 'weekly',
  },
}

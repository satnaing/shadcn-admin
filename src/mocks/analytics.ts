import type {
  AnalyticsOverview,
  ConversionsApiConfig,
  CustomScriptsConfig,
  FacebookCatalogConfig,
  Ga4ReportEvent,
  GlobalSeoConfig,
  GoogleAnalyticsConfig,
  GoogleTagManagerConfig,
  MerchantCenterConfig,
  MetaPixelConfig,
  SitemapConfig,
} from '@/features/analytics/data/analytics.type'

export const mockAnalyticsOverview: AnalyticsOverview = {
  ga4_enabled: true,
  gtm_enabled: true,
  pixel_enabled: true,
  capi_enabled: false,
  gmc_enabled: true,
  fb_catalog_enabled: true,
  sitemap_last_generated: '2026-11-02 04:00',
  total_events_today: 4320,
  pageviews_today: 18450,
}

export const mockGa4Config: GoogleAnalyticsConfig = {
  enabled: true,
  measurement_id: 'G-XSHOPAZ2026',
  enhanced_ecommerce: true,
  debug_mode: false,
}

export const mockGa4Reports: Ga4ReportEvent[] = [
  { id: '1', event_name: 'purchase', category: 'ecommerce', value: 249.99, timestamp: '14:32:05', device: 'Mobile (iOS)', country: 'Azərbaycan' },
  { id: '2', event_name: 'add_to_cart', category: 'ecommerce', value: 89.0, timestamp: '14:31:40', device: 'Desktop (Chrome)', country: 'Azərbaycan' },
  { id: '3', event_name: 'view_item', category: 'engagement', timestamp: '14:31:12', device: 'Mobile (Android)', country: 'Azərbaycan' },
  { id: '4', event_name: 'page_view', category: 'engagement', timestamp: '14:30:58', device: 'Desktop (Windows)', country: 'Türkiyə' },
  { id: '5', event_name: 'begin_checkout', category: 'ecommerce', value: 120.0, timestamp: '14:28:19', device: 'Mobile (iOS)', country: 'Azərbaycan' },
]

export const mockGtmConfig: GoogleTagManagerConfig = {
  enabled: true,
  container_id: 'GTM-XSHOP99',
}

export const mockMetaPixelConfig: MetaPixelConfig = {
  enabled: true,
  pixel_id: '891029384756102',
  track_page_view: true,
  track_add_to_cart: true,
  track_initiate_checkout: true,
  track_purchase: true,
  track_search: true,
}

export const mockCapiConfig: ConversionsApiConfig = {
  enabled: false,
  dataset_id: '891029384756102',
  access_token: '',
  test_event_code: '',
}

export const mockGmcConfig: MerchantCenterConfig = {
  enabled: true,
  merchant_id: '502918274',
  target_country: 'AZ',
  target_currency: 'AZN',
  include_out_of_stock: false,
  feed_url: 'https://xshop.az/feeds/google-merchant.xml',
  last_synced_at: '2026-11-02 03:30',
  total_products_synced: 1420,
}

export const mockFbCatalogConfig: FacebookCatalogConfig = {
  enabled: true,
  catalog_id: '102938475619283',
  feed_url: 'https://xshop.az/feeds/facebook-catalog.csv',
  feed_format: 'csv',
  last_synced_at: '2026-11-02 03:45',
  total_products_synced: 1420,
}

export const mockCustomScriptsConfig: CustomScriptsConfig = {
  header_scripts: '<!-- Hotjar Tracking Code -->\n<script>(function(h,o,t,j,a,r){...})(window,document);</script>',
  body_scripts: '<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XSHOP99"></iframe></noscript>',
  footer_scripts: '<!-- Tawk.to Live Chat -->\n<script type="text/javascript">var Tawk_API=Tawk_API||{};</script>',
}

export const mockSitemapConfig: SitemapConfig = {
  auto_generate: true,
  frequency: 'daily',
  include_products: true,
  include_categories: true,
  include_brands: true,
  include_pages: true,
  sitemap_url: 'https://xshop.az/sitemap.xml',
  last_generated_at: '2026-11-02 04:00',
  urls_count: 2840,
}

export const mockGlobalSeoConfig: GlobalSeoConfig = {
  meta_title: 'xShop — Azərbaycanın Onlayn Alış-Veriş Mərkəzi',
  meta_description: 'Minlərlə çeşid məhsul, zəmanətli satıcılar və sürətli ünvana çatdırılma.',
  meta_keywords: 'xshop, e-commerce, onlayn magazalar, baki, alis-veris, elektronika',
  canonical_url: 'https://xshop.az',
  og_image: 'https://xshop.az/og-cover.jpg',
  twitter_card_type: 'summary_large_image',
}

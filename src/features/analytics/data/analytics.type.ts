export interface AnalyticsOverview {
  ga4_enabled: boolean
  gtm_enabled: boolean
  pixel_enabled: boolean
  capi_enabled: boolean
  gmc_enabled: boolean
  fb_catalog_enabled: boolean
  sitemap_last_generated: string
  total_events_today: number
  pageviews_today: number
}

export interface GoogleAnalyticsConfig {
  enabled: boolean
  measurement_id: string
  enhanced_ecommerce: boolean
  debug_mode: boolean
}

export interface Ga4ReportEvent {
  id: string
  event_name: string
  category: string
  value?: number
  timestamp: string
  device: string
  country: string
}

export interface GoogleTagManagerConfig {
  enabled: boolean
  container_id: string
}

export interface MetaPixelConfig {
  enabled: boolean
  pixel_id: string
  track_page_view: boolean
  track_add_to_cart: boolean
  track_initiate_checkout: boolean
  track_purchase: boolean
  track_search: boolean
}

export interface ConversionsApiConfig {
  enabled: boolean
  dataset_id: string
  access_token: string
  test_event_code?: string
}

export interface MerchantCenterConfig {
  enabled: boolean
  merchant_id: string
  target_country: string
  target_currency: string
  include_out_of_stock: boolean
  feed_url: string
  last_synced_at?: string
  total_products_synced: number
}

export interface FacebookCatalogConfig {
  enabled: boolean
  catalog_id: string
  feed_url: string
  feed_format: 'xml' | 'csv'
  last_synced_at?: string
  total_products_synced: number
}

export interface CustomScriptsConfig {
  header_scripts: string
  body_scripts: string
  footer_scripts: string
}

export interface SitemapConfig {
  auto_generate: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  include_products: boolean
  include_categories: boolean
  include_brands: boolean
  include_pages: boolean
  sitemap_url: string
  last_generated_at: string
  urls_count: number
}

export interface GlobalSeoConfig {
  meta_title: string
  meta_description: string
  meta_keywords: string
  canonical_url: string
  og_image: string
  twitter_card_type: 'summary' | 'summary_large_image'
}

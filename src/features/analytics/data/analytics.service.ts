import { api } from '@/config/api'
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
} from './analytics.type'

export const analyticsService = {
  getOverview: () => api.get<AnalyticsOverview>('/admin/analytics/overview'),

  getGa4: () => api.get<GoogleAnalyticsConfig>('/admin/analytics/google'),
  saveGa4: (d: GoogleAnalyticsConfig) => api.post('/admin/analytics/google', d),
  getGa4Reports: () => api.get<Ga4ReportEvent[]>('/admin/analytics/google-reports'),

  getGtm: () => api.get<GoogleTagManagerConfig>('/admin/analytics/gtm'),
  saveGtm: (d: GoogleTagManagerConfig) => api.post('/admin/analytics/gtm', d),

  getPixel: () => api.get<MetaPixelConfig>('/admin/analytics/pixel'),
  savePixel: (d: MetaPixelConfig) => api.post('/admin/analytics/pixel', d),

  getCapi: () => api.get<ConversionsApiConfig>('/admin/analytics/conversions-api'),
  saveCapi: (d: ConversionsApiConfig) => api.post('/admin/analytics/conversions-api', d),

  getGmc: () => api.get<MerchantCenterConfig>('/admin/analytics/gmc'),
  saveGmc: (d: MerchantCenterConfig) => api.post('/admin/analytics/gmc', d),
  generateGmcFeed: () => api.post('/admin/analytics/gmc/feed/generate'),

  getFbCatalog: () => api.get<FacebookCatalogConfig>('/admin/analytics/facebook-catalogue'),
  saveFbCatalog: (d: FacebookCatalogConfig) => api.post('/admin/analytics/facebook-catalogue', d),
  generateFbCatalogFeed: () => api.post('/admin/analytics/facebook-catalogue/feed/generate'),

  getCustomScripts: () => api.get<CustomScriptsConfig>('/admin/analytics/custom-scripts'),
  saveCustomScripts: (d: CustomScriptsConfig) => api.post('/admin/analytics/custom-scripts', d),

  getSitemap: () => api.get<SitemapConfig>('/admin/analytics/sitemap'),
  saveSitemap: (d: SitemapConfig) => api.post('/admin/analytics/sitemap', d),
  generateSitemap: () => api.post('/admin/analytics/sitemap/generate'),

  getGlobalSeo: () => api.get<GlobalSeoConfig>('/admin/analytics/seo'),
  saveGlobalSeo: (d: GlobalSeoConfig) => api.post('/admin/analytics/seo', d),
}

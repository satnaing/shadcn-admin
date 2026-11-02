import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { analyticsService } from '../data/analytics.service'
import type {
  ConversionsApiConfig,
  CustomScriptsConfig,
  FacebookCatalogConfig,
  GlobalSeoConfig,
  GoogleAnalyticsConfig,
  GoogleTagManagerConfig,
  MerchantCenterConfig,
  MetaPixelConfig,
  SitemapConfig,
} from '../data/analytics.type'

export function useAnalyticsMutations() {
  const qc = useQueryClient()

  const saveGa4 = useMutation({
    mutationFn: (d: GoogleAnalyticsConfig) => analyticsService.saveGa4(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-ga4'] }); toast.success('GA4 ayarları saxlanıldı') },
  })
  const saveGtm = useMutation({
    mutationFn: (d: GoogleTagManagerConfig) => analyticsService.saveGtm(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-gtm'] }); toast.success('GTM ayarları saxlanıldı') },
  })
  const savePixel = useMutation({
    mutationFn: (d: MetaPixelConfig) => analyticsService.savePixel(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-pixel'] }); toast.success('Meta Pixel saxlanıldı') },
  })
  const saveCapi = useMutation({
    mutationFn: (d: ConversionsApiConfig) => analyticsService.saveCapi(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-capi'] }); toast.success('Conversion API saxlanıldı') },
  })
  const saveGmc = useMutation({
    mutationFn: (d: MerchantCenterConfig) => analyticsService.saveGmc(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-gmc'] }); toast.success('GMC ayarları saxlanıldı') },
  })
  const generateGmcFeed = useMutation({
    mutationFn: analyticsService.generateGmcFeed,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-gmc'] }); toast.success('GMC Feed yeniləndi') },
  })
  const saveFbCatalog = useMutation({
    mutationFn: (d: FacebookCatalogConfig) => analyticsService.saveFbCatalog(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-fb-catalog'] }); toast.success('Facebook kataloq ayarları saxlanıldı') },
  })
  const generateFbCatalogFeed = useMutation({
    mutationFn: analyticsService.generateFbCatalogFeed,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-fb-catalog'] }); toast.success('Facebook Feed yeniləndi') },
  })
  const saveCustomScripts = useMutation({
    mutationFn: (d: CustomScriptsConfig) => analyticsService.saveCustomScripts(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-custom-scripts'] }); toast.success('Skriptlər saxlanıldı') },
  })
  const saveSitemap = useMutation({
    mutationFn: (d: SitemapConfig) => analyticsService.saveSitemap(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-sitemap'] }); toast.success('Sitemap ayarları saxlanıldı') },
  })
  const generateSitemap = useMutation({
    mutationFn: analyticsService.generateSitemap,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-sitemap'] }); toast.success('Sitemap.xml yenidən yaradıldı') },
  })
  const saveGlobalSeo = useMutation({
    mutationFn: (d: GlobalSeoConfig) => analyticsService.saveGlobalSeo(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['analytics-seo'] }); toast.success('Qlobal SEO saxlanıldı') },
  })

  return { saveGa4, saveGtm, savePixel, saveCapi, saveGmc, generateGmcFeed, saveFbCatalog, generateFbCatalogFeed, saveCustomScripts, saveSitemap, generateSitemap, saveGlobalSeo }
}

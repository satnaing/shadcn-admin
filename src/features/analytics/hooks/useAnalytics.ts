import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../data/analytics.service'

export const useAnalyticsOverview = () =>
  useQuery({ queryKey: ['analytics-overview'], queryFn: analyticsService.getOverview })

export const useGa4Config = () =>
  useQuery({ queryKey: ['analytics-ga4'], queryFn: analyticsService.getGa4 })

export const useGa4Reports = () =>
  useQuery({ queryKey: ['analytics-ga4-reports'], queryFn: analyticsService.getGa4Reports })

export const useGtmConfig = () =>
  useQuery({ queryKey: ['analytics-gtm'], queryFn: analyticsService.getGtm })

export const usePixelConfig = () =>
  useQuery({ queryKey: ['analytics-pixel'], queryFn: analyticsService.getPixel })

export const useCapiConfig = () =>
  useQuery({ queryKey: ['analytics-capi'], queryFn: analyticsService.getCapi })

export const useGmcConfig = () =>
  useQuery({ queryKey: ['analytics-gmc'], queryFn: analyticsService.getGmc })

export const useFbCatalogConfig = () =>
  useQuery({ queryKey: ['analytics-fb-catalog'], queryFn: analyticsService.getFbCatalog })

export const useCustomScriptsConfig = () =>
  useQuery({ queryKey: ['analytics-custom-scripts'], queryFn: analyticsService.getCustomScripts })

export const useSitemapConfig = () =>
  useQuery({ queryKey: ['analytics-sitemap'], queryFn: analyticsService.getSitemap })

export const useGlobalSeoConfig = () =>
  useQuery({ queryKey: ['analytics-seo'], queryFn: analyticsService.getGlobalSeo })

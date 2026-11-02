import { useQuery } from '@tanstack/react-query'
import { marketingService } from '../data/marketing.service'

export const useMarketingSummary = () =>
  useQuery({ queryKey: ['marketing-summary'], queryFn: marketingService.getSummary })

export const usePopups = () =>
  useQuery({ queryKey: ['marketing-popups'], queryFn: marketingService.getPopups })

export const useAlerts = () =>
  useQuery({ queryKey: ['marketing-alerts'], queryFn: marketingService.getAlerts })

export const useSaleAlerts = () =>
  useQuery({ queryKey: ['marketing-sale-alerts'], queryFn: marketingService.getSaleAlerts })

export const useEmailTemplates = () =>
  useQuery({ queryKey: ['marketing-email-templates'], queryFn: marketingService.getEmailTemplates })

export const useBlogs = () =>
  useQuery({ queryKey: ['marketing-blogs'], queryFn: marketingService.getBlogs })

export const useBlogCategories = () =>
  useQuery({ queryKey: ['marketing-blog-categories'], queryFn: marketingService.getBlogCategories })

export const useNewsletters = () =>
  useQuery({ queryKey: ['marketing-newsletters'], queryFn: marketingService.getNewsletters })

export const useNotificationTypes = () =>
  useQuery({ queryKey: ['marketing-notification-types'], queryFn: marketingService.getNotificationTypes })

export const useNotificationHistory = () =>
  useQuery({ queryKey: ['marketing-notification-history'], queryFn: marketingService.getNotificationHistory })

export const useNotificationSettings = () =>
  useQuery({ queryKey: ['marketing-notification-settings'], queryFn: marketingService.getNotificationSettings })

export const useSubscribers = () =>
  useQuery({ queryKey: ['marketing-subscribers'], queryFn: marketingService.getSubscribers })

export const useVisitorSettings = () =>
  useQuery({ queryKey: ['marketing-visitors'], queryFn: marketingService.getVisitorSettings })

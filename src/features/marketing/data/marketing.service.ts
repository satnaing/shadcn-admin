import { api } from '@/config/api'
import type {
  BlogCategory,
  BlogPost,
  CustomAlert,
  DynamicPopup,
  EmailTemplate,
  MarketingSummary,
  NewsletterCampaign,
  NotificationHistoryItem,
  NotificationSettings,
  NotificationTypeItem,
  SaleAlert,
  SubscriberItem,
  VisitorSimulatorSettings,
} from './marketing.type'

export const marketingService = {
  getSummary: () => api.get<MarketingSummary>('/admin/marketing/summary'),

  getPopups: () => api.get<DynamicPopup[]>('/admin/marketing/popups'),
  savePopup: (d: Partial<DynamicPopup>) =>
    d.id ? api.put<DynamicPopup>(`/admin/marketing/popups/${d.id}`, d) : api.post<DynamicPopup>('/admin/marketing/popups', d),
  deletePopup: (id: number) => api.delete(`/admin/marketing/popups/${id}`),

  getAlerts: () => api.get<CustomAlert[]>('/admin/marketing/alerts'),
  saveAlert: (d: Partial<CustomAlert>) =>
    d.id ? api.put<CustomAlert>(`/admin/marketing/alerts/${d.id}`, d) : api.post<CustomAlert>('/admin/marketing/alerts', d),
  deleteAlert: (id: number) => api.delete(`/admin/marketing/alerts/${id}`),

  getSaleAlerts: () => api.get<SaleAlert[]>('/admin/marketing/sale-alerts'),
  saveSaleAlert: (d: Partial<SaleAlert>) =>
    d.id ? api.put<SaleAlert>(`/admin/marketing/sale-alerts/${d.id}`, d) : api.post<SaleAlert>('/admin/marketing/sale-alerts', d),
  deleteSaleAlert: (id: number) => api.delete(`/admin/marketing/sale-alerts/${id}`),

  getEmailTemplates: () => api.get<EmailTemplate[]>('/admin/marketing/email-templates'),
  saveEmailTemplate: (d: Partial<EmailTemplate>) => api.put<EmailTemplate>(`/admin/marketing/email-templates/${d.id}`, d),

  getBlogs: () => api.get<BlogPost[]>('/admin/marketing/blogs'),
  saveBlog: (d: Partial<BlogPost>) =>
    d.id ? api.put<BlogPost>(`/admin/marketing/blogs/${d.id}`, d) : api.post<BlogPost>('/admin/marketing/blogs', d),
  deleteBlog: (id: number) => api.delete(`/admin/marketing/blogs/${id}`),

  getBlogCategories: () => api.get<BlogCategory[]>('/admin/marketing/blog-categories'),
  saveBlogCategory: (d: Partial<BlogCategory>) =>
    d.id ? api.put<BlogCategory>(`/admin/marketing/blog-categories/${d.id}`, d) : api.post<BlogCategory>('/admin/marketing/blog-categories', d),
  deleteBlogCategory: (id: number) => api.delete(`/admin/marketing/blog-categories/${id}`),

  getNewsletters: () => api.get<NewsletterCampaign[]>('/admin/marketing/newsletters'),
  sendNewsletter: (d: { subject: string; content: string }) => api.post('/admin/marketing/newsletters', d),

  getNotificationTypes: () => api.get<NotificationTypeItem[]>('/admin/marketing/notifications/types'),
  saveNotificationType: (d: Partial<NotificationTypeItem>) => api.put(`/admin/marketing/notifications/types/${d.id}`, d),

  getNotificationHistory: () => api.get<NotificationHistoryItem[]>('/admin/marketing/notifications/history'),
  sendNotification: (d: { title: string; message: string; target: string }) => api.post('/admin/marketing/notifications/send', d),
  getNotificationSettings: () => api.get<NotificationSettings>('/admin/marketing/notifications/settings'),
  saveNotificationSettings: (d: Partial<NotificationSettings>) => api.post('/admin/marketing/notifications/settings', d),

  getSubscribers: () => api.get<SubscriberItem[]>('/admin/marketing/subscribers'),
  deleteSubscriber: (id: number) => api.delete(`/admin/marketing/subscribers/${id}`),

  sendSms: (d: { recipients: string[]; message: string }) => api.post('/admin/marketing/sms/send', d),

  getVisitorSettings: () => api.get<VisitorSimulatorSettings>('/admin/marketing/visitors'),
  saveVisitorSettings: (d: Partial<VisitorSimulatorSettings>) => api.post('/admin/marketing/visitors', d),
}

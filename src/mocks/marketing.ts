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
} from '@/features/marketing/data/marketing.type'

export const mockMarketingSummary: MarketingSummary = {
  subscribers_count: 3840,
  newsletters_sent: 48,
  sms_sent: 12500,
  active_popups: 3,
  active_alerts: 2,
  blogs_count: 14,
}

export const mockPopups: DynamicPopup[] = [
  {
    id: 1,
    title: 'Yeni İstifadəçi Kuponu - 15%',
    trigger_type: 'on_load',
    trigger_value: 0,
    status: true,
    action_url: '/promotions/coupons',
    content: 'İlk alış-verişinizdə 15% endirim əldə etmək üçün qeydiyyatdan keçin!',
  },
  {
    id: 2,
    title: 'Çıxışda Təklif - Pulsuz Çatdırılma',
    trigger_type: 'exit_intent',
    trigger_value: 0,
    status: true,
    action_url: '/cart',
    content: 'Getməzdən əvvəl səbətinizdəki sifarişə pulsuz çatdırılma qazanın!',
  },
  {
    id: 3,
    title: 'Gecikmə ilə Flash Deal Xəbəri',
    trigger_type: 'delay',
    trigger_value: 10,
    status: false,
    action_url: '/flash-deals',
    content: 'Günün xüsusi endirimli məhsullarına nəzər salın.',
  },
]

export const mockAlerts: CustomAlert[] = [
  {
    id: 1,
    title: 'Novruz Kampaniyası Başladı!',
    message: 'Bütün elektronika məhsullarına 20%-dək xüsusi bayram endirimi.',
    type: 'success',
    position: 'top_banner',
    status: true,
    link_url: '/category/electronics',
    link_text: 'Məhsullara Bax',
  },
  {
    id: 2,
    title: 'Texniki Təmir Bildirişi',
    message: '05 Noyabr gecə saat 03:00-da serverlərdə qısa müddətli təmir aparılacaq.',
    type: 'warning',
    position: 'bottom_banner',
    status: true,
  },
]

export const mockSaleAlerts: SaleAlert[] = [
  {
    id: 1,
    product_name: 'Apple iPhone 15 Pro Max 256GB',
    product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
    location: 'Bakı, Nəsimi',
    time_ago: '2 dəqiqə əvvəl',
    status: true,
  },
  {
    id: 2,
    product_name: 'Sony WH-1000XM5 Qulaqlıq',
    product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    location: 'Sumqayıt',
    time_ago: '8 dəqiqə əvvəl',
    status: true,
  },
]

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 1,
    identifier: 'order_confirmation',
    name: 'Sifariş Təsdiqi',
    subject: 'Sifarişiniz qəbul olundu: [[order_code]]',
    body: 'Hörmətli [[customer_name]], sifarişiniz uğurla rəsmiləşdirildi. Məbləğ: [[amount]].',
    variables: ['[[customer_name]]', '[[order_code]]', '[[amount]]', '[[delivery_address]]'],
    status: true,
  },
  {
    id: 2,
    identifier: 'welcome_email',
    name: 'Xoşgəldin Məktubu',
    subject: 'xShop ailəsinə xoş gəldiniz!',
    body: 'Hörmətli [[customer_name]], qeydiyyatdan keçdiyiniz üçün təşəkkür edirik.',
    variables: ['[[customer_name]]', '[[site_name]]'],
    status: true,
  },
  {
    id: 3,
    identifier: 'password_reset',
    name: 'Şifrə Yenilənməsi',
    subject: 'Şifrə bərpası üçün təlimat',
    body: 'Şifrənizi sıfırlamaq üçün linkə daxil olun: [[reset_link]].',
    variables: ['[[customer_name]]', '[[reset_link]]'],
    status: true,
  },
]

export const mockBlogCategories: BlogCategory[] = [
  { id: 1, name: 'Texnologiya', slug: 'technology', posts_count: 6, status: true },
  { id: 2, name: 'Dəb və Geyim', slug: 'fashion', posts_count: 4, status: true },
  { id: 3, name: 'Məsləhətlər', slug: 'tips', posts_count: 4, status: true },
]

export const mockBlogs: BlogPost[] = [
  {
    id: 1,
    title: '2026-cı ilin Ən Yaxşı Smartfonları',
    slug: 'best-smartphones-2026',
    category_id: 1,
    category_name: 'Texnologiya',
    banner: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
    short_description: 'Bu il texnologiya bazarında flaqman modellərin ətraflı icmalı və müqayisəsi.',
    views: 1420,
    status: true,
    created_at: '2026-10-25',
  },
  {
    id: 2,
    title: 'Onlayn Alış-verişdə Təhlükəsizlik Qaydaları',
    slug: 'online-shopping-safety',
    category_id: 3,
    category_name: 'Məsləhətlər',
    banner: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
    short_description: 'Kart məlumatlarınızı qorumaq üçün bilməli olduğunuz 5 qızıl qayda.',
    views: 890,
    status: true,
    created_at: '2026-10-28',
  },
]

export const mockNewsletters: NewsletterCampaign[] = [
  {
    id: 1,
    subject: 'Həftəsonu xüsusi 30% endirim kampaniyası',
    recipients_count: 3840,
    sent_at: '2026-10-31 14:00',
    status: 'sent',
  },
  {
    id: 2,
    subject: 'Yeni gələn payız-qış kolleksiyası artıq satışda!',
    recipients_count: 3720,
    sent_at: '2026-10-20 10:30',
    status: 'sent',
  },
]

export const mockNotificationTypes: NotificationTypeItem[] = [
  { id: 1, identifier: 'order_placed', name: 'Yeni Sifariş Yaradıldı', email_channel: true, sms_channel: true, push_channel: true, system_channel: true },
  { id: 2, identifier: 'order_shipped', name: 'Sifariş Çatdırılmaya Verildi', email_channel: true, sms_channel: true, push_channel: true, system_channel: true },
  { id: 3, identifier: 'order_delivered', name: 'Sifariş Təhvil Verildi', email_channel: true, sms_channel: false, push_channel: true, system_channel: true },
  { id: 4, identifier: 'payout_processed', name: 'Satıcı Ödənişi Həyata Keçirildi', email_channel: true, sms_channel: false, push_channel: false, system_channel: true },
  { id: 5, identifier: 'seller_registered', name: 'Yeni Satıcı Müraciəti', email_channel: true, sms_channel: false, push_channel: true, system_channel: true },
]

export const mockNotificationHistory: NotificationHistoryItem[] = [
  {
    id: 1,
    title: 'Gecə Endirimi Başladı!',
    message: 'Yalnız bu gecə saat 00:00-dək seçilmiş məhsullara 20% əlavə endirim.',
    target_audience: 'customers',
    channel: 'push',
    sent_at: '2026-11-01 20:00',
    recipient_count: 2450,
  },
  {
    id: 2,
    title: 'Satıcılar üçün Komissiya Kampaniyası',
    message: 'Noyabr ayı ərzində elektronika kateqoriyasında 0% komissiya.',
    target_audience: 'sellers',
    channel: 'system',
    sent_at: '2026-10-30 11:15',
    recipient_count: 140,
  },
]

export const mockNotificationSettings: NotificationSettings = {
  firebase_enabled: true,
  firebase_server_key: 'AAAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  firebase_sender_id: '849201948572',
  onesignal_enabled: false,
  onesignal_app_id: '',
  onesignal_api_key: '',
}

export const mockSubscribers: SubscriberItem[] = [
  { id: 1, email: 'murad.aliyev@example.com', subscribed_at: '2026-10-15', status: true },
  { id: 2, email: 'gunel.taghizade@example.com', subscribed_at: '2026-10-20', status: true },
  { id: 3, email: 'rashad.mammadov@example.com', subscribed_at: '2026-10-22', status: true },
  { id: 4, email: 'leyla.kerimova@example.com', subscribed_at: '2026-10-28', status: true },
]

export const mockVisitorSettings: VisitorSimulatorSettings = {
  enabled: true,
  min_visitors: 12,
  max_visitors: 48,
  multiplier: 1.5,
}

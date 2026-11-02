export interface MarketingSummary {
  subscribers_count: number
  newsletters_sent: number
  sms_sent: number
  active_popups: number
  active_alerts: number
  blogs_count: number
}

export interface DynamicPopup {
  id: number
  title: string
  trigger_type: 'on_load' | 'exit_intent' | 'delay' | 'scroll'
  trigger_value: number
  status: boolean
  start_date?: string
  end_date?: string
  image?: string
  content?: string
  action_url?: string
}

export interface CustomAlert {
  id: number
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'danger'
  position: 'top_banner' | 'bottom_banner' | 'floating'
  status: boolean
  link_url?: string
  link_text?: string
}

export interface SaleAlert {
  id: number
  product_name: string
  product_image: string
  location: string
  time_ago: string
  status: boolean
}

export interface EmailTemplate {
  id: number
  identifier: string
  name: string
  subject: string
  body: string
  variables: string[]
  status: boolean
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  category_name: string
  category_id: number
  banner?: string
  short_description: string
  content?: string
  status: boolean
  views: number
  created_at: string
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
  posts_count: number
  status: boolean
}

export interface NewsletterCampaign {
  id: number
  subject: string
  recipients_count: number
  sent_at: string
  status: 'sent' | 'scheduled' | 'draft'
}

export interface NotificationTypeItem {
  id: number
  identifier: string
  name: string
  email_channel: boolean
  sms_channel: boolean
  push_channel: boolean
  system_channel: boolean
}

export interface NotificationHistoryItem {
  id: number
  title: string
  message: string
  target_audience: 'all' | 'customers' | 'sellers'
  channel: 'push' | 'system'
  sent_at: string
  recipient_count: number
}

export interface NotificationSettings {
  firebase_enabled: boolean
  firebase_server_key: string
  firebase_sender_id: string
  onesignal_enabled: boolean
  onesignal_app_id: string
  onesignal_api_key: string
}

export interface SubscriberItem {
  id: number
  email: string
  subscribed_at: string
  status: boolean
}

export interface VisitorSimulatorSettings {
  enabled: boolean
  min_visitors: number
  max_visitors: number
  multiplier: number
}

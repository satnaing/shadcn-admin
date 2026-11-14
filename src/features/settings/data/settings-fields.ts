import type { FieldDef, SettingsGroup } from './settings.type'

export const SETTINGS_FIELDS: Record<SettingsGroup, FieldDef[]> = {
  general: [
    { name: 'site_name', type: 'text', required: true },
    { name: 'tagline', type: 'text' },
    { name: 'admin_email', type: 'email', required: true },
    { name: 'timezone', type: 'select', options: ['Asia/Baku', 'Europe/Istanbul', 'Europe/Moscow', 'Asia/Tbilisi', 'UTC'] },
    { name: 'date_format', type: 'select', options: ['DD.MM.YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'] },
    { name: 'maintenance_mode', type: 'switch' },
  ],
  seo: [
    { name: 'meta_title', type: 'text', required: true },
    { name: 'meta_description', type: 'textarea' },
    { name: 'canonical_base', type: 'url' },
    { name: 'og_image', type: 'url' },
    { name: 'robots_index', type: 'switch' },
    { name: 'sitemap_enabled', type: 'switch' },
  ],
  email: [
    { name: 'driver', type: 'select', options: ['smtp', 'log'] },
    { name: 'host', type: 'text' },
    { name: 'port', type: 'number' },
    { name: 'username', type: 'text' },
    { name: 'password', type: 'password' },
    { name: 'encryption', type: 'select', options: ['tls', 'ssl', 'none'] },
    { name: 'from_address', type: 'email', required: true },
    { name: 'from_name', type: 'text', required: true },
  ],
  notifications: [
    { name: 'notify_address', type: 'email' },
    { name: 'new_user_email', type: 'switch' },
    { name: 'form_submission_email', type: 'switch' },
    { name: 'new_comment_email', type: 'switch' },
    { name: 'module_update_notice', type: 'switch' },
    { name: 'digest_frequency', type: 'select', options: ['off', 'daily', 'weekly'] },
  ],
}

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import all locale files
import enCommon from './locales/en/common.json'
import enSidebar from './locales/en/sidebar.json'
import enDashboard from './locales/en/dashboard.json'
import enAuth from './locales/en/auth.json'
import enSettings from './locales/en/settings.json'
import enErrors from './locales/en/errors.json'
import enTasks from './locales/en/tasks.json'
import enUsers from './locales/en/users.json'
import enApps from './locales/en/apps.json'
import enChats from './locales/en/chats.json'

import zhCommon from './locales/zh/common.json'
import zhSidebar from './locales/zh/sidebar.json'
import zhDashboard from './locales/zh/dashboard.json'
import zhAuth from './locales/zh/auth.json'
import zhSettings from './locales/zh/settings.json'
import zhErrors from './locales/zh/errors.json'
import zhTasks from './locales/zh/tasks.json'
import zhUsers from './locales/zh/users.json'
import zhApps from './locales/zh/apps.json'
import zhChats from './locales/zh/chats.json'

export const defaultNS = 'common'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      sidebar: enSidebar,
      dashboard: enDashboard,
      auth: enAuth,
      settings: enSettings,
      errors: enErrors,
      tasks: enTasks,
      users: enUsers,
      apps: enApps,
      chats: enChats,
    },
    zh: {
      common: zhCommon,
      sidebar: zhSidebar,
      dashboard: zhDashboard,
      auth: zhAuth,
      settings: zhSettings,
      errors: zhErrors,
      tasks: zhTasks,
      users: zhUsers,
      apps: zhApps,
      chats: zhChats,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false, // React already escapes
  },
})

export default i18n

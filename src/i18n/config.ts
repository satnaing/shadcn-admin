export const DEFAULT_LANGUAGE = 'zh-CN'

export const LANGUAGE_STORAGE_KEY = 'meetwise-language'

export const supportedLanguages = [
  { code: 'zh-CN', label: '简体中文', short: '中文' },
  { code: 'en-US', label: 'English', short: 'EN' },
] as const

export type LanguageCode = (typeof supportedLanguages)[number]['code']

export const namespaces = [
  'common',
  'layout',
  'auth',
  'dashboard',
  'errors',
  'settings',
  'dataTable',
  'tasks',
  'users',
  'chats',
  'apps',
] as const

export type Namespace = (typeof namespaces)[number]

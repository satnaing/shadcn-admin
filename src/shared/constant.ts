import { env } from '@/config/env'

export enum ModeEnum {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const APP_NAME = 'Allixwork'
export const APP_VERSION = '2.0.0'

export const LIMIT = 10

export const MODE = env.VITE_BASE_NODE_ENV
export const BASE_URL = env.VITE_BASE_URL

export const locales = ['az', 'ru', 'tr', 'en']

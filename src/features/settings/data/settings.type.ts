export type SettingsGroup = 'general' | 'seo' | 'email' | 'notifications'

export type SettingsValue = string | number | boolean
export type GroupValues = Record<string, SettingsValue>

export type FieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'textarea'
  | 'number'
  | 'password'
  | 'switch'
  | 'select'

export interface FieldDef {
  name: string
  type: FieldType
  required?: boolean
  /** `select` only; labels live in `settings:<group>.options.<value>`. */
  options?: string[]
}

export interface Language {
  id: number
  /** lower-case code; Georgian is `ka` (shown as GE) */
  code: string
  name: string
  native_name: string
  is_active: boolean
  is_default: boolean
}

export type LanguagePatch = Partial<Pick<Language, 'is_active' | 'is_default'>>

export interface Currency {
  id: number
  code: string
  name: string
  symbol: string
  exchange_rate: number
  is_default: boolean
  is_active: boolean
  decimal_places: number
  position: 'before' | 'after'
}

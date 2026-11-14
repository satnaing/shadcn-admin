import type { FieldTab, PayloadSchema, SchemaNode } from './pages.type'

export type Widget =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'switch'
  | 'select'
  | 'image'
  | 'link'
  | 'color'
  | 'list'
  | 'source'
  | 'group'

export interface FieldDef {
  key: string
  label: string
  widget: Widget
  tab: FieldTab
  localized: boolean
  node: SchemaNode
}

export function widgetOf(node: SchemaNode): Widget {
  if (node.format === 'source') return 'source'
  if (node.type === 'array') return 'list'
  if (node.type === 'object') return 'group'
  if (node.type === 'boolean') return 'switch'
  if (node.type === 'number' || node.type === 'integer') return 'number'
  if (node.enum?.length) return 'select'
  return node.format ?? 'text'
}

const toDef = (key: string, node: SchemaNode): FieldDef => ({
  key,
  label: node.title ?? key,
  widget: widgetOf(node),
  tab: node['x-tab'] ?? (node.format === 'source' ? 'source' : 'content'),
  localized: node['x-localized'] === true,
  node,
})

export function fieldsOf(properties: Record<string, SchemaNode> = {}): FieldDef[] {
  return Object.entries(properties).map(([key, node]) => toDef(key, node))
}

export function fieldsForTab(schema: PayloadSchema, tab: FieldTab): FieldDef[] {
  return fieldsOf(schema.properties).filter((field) => field.tab === tab)
}

export function emptyValue(node: SchemaNode): unknown {
  if (node.default !== undefined) return node.default
  if (node.format === 'source') return { type: 'manual', ids: '' }
  if (node['x-localized']) return {}
  if (node.type === 'array') return []
  if (node.type === 'object') return defaultsOf(node.properties)
  if (node.type === 'boolean') return false
  if (node.type === 'number' || node.type === 'integer') return 0
  return ''
}

export function defaultsOf(properties: Record<string, SchemaNode> = {}): Record<string, unknown> {
  return Object.fromEntries(Object.entries(properties).map(([key, node]) => [key, emptyValue(node)]))
}

/** Localized text lives as `{ az, en, … }`; any other value passes through. */
export function readText(value: unknown, lang: string): string {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    const text = (value as Record<string, unknown>)[lang]
    return typeof text === 'string' ? text : ''
  }
  return ''
}

export function writeText(value: unknown, lang: string, text: string): Record<string, string> {
  const base = typeof value === 'object' && value !== null ? (value as Record<string, string>) : {}
  return { ...base, [lang]: text }
}

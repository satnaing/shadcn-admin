import { defaultsOf } from './payload-schema'
import type { SectionCatalogItem } from './pages.type'

export const PALETTE_PREFIX = 'palette:'

export const newSectionOf = (item: SectionCatalogItem) => ({
  component: item.component,
  hidden: false,
  payload: defaultsOf(item.payload_schema?.properties),
})

import type { ModuleRaw } from '@/api/menu.types'

/** `GET /admin/modules` row: `module.json` + install/update state. */
export interface ModuleItem extends Omit<ModuleRaw, 'admin_menu'> {
  installed: boolean
  update_available?: string
}

export interface UploadStep {
  key: 'size' | 'manifest' | 'compatibility' | 'signature'
  ok: boolean
}

export interface UploadResult {
  installed: boolean
  module_id: string | null
  steps: UploadStep[]
}

export interface ModuleChange {
  id: string
  enabled: boolean
}

/** Server-side filter of the module grid: free text + saved-state filter. */
export interface ModuleListParams {
  [key: string]: string | undefined
  q?: string
  filter?: 'active' | 'inactive' | 'notInstalled'
}

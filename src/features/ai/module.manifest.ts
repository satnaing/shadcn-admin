import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the AI module: AEC core "AI" (Gemini content generation) and the addon
 * `ai_translate` in one module. admin2 reads it through `mocks/modules.data.ts`.
 */
export const aiManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'ai',
  name: 'AI',
  description: 'Gemini settings, prompt templates, token usage and AI translation of language strings',
  version: '1.0.0',
  icon: 'Sparkles',
  required: false,
  requires: ['settings'],
  admin_menu: {
    group: { key: 'ai', icon: 'Sparkles', order: 190, panels: ['admin'] },
    items: [
      { key: 'aiSettings', route: '/admin/ai', order: 1, permission: 'ai.index' },
      { key: 'aiPrompts', route: '/admin/ai/prompts', order: 2, permission: 'ai.prompts' },
      { key: 'aiUsage', route: '/admin/ai/usage', order: 3, permission: 'ai.usage' },
      { key: 'aiTranslate', route: '/admin/ai/translate', order: 4, permission: 'ai.translate' },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.AI` (`shared/permissions.ts`). */
export const aiPermissions = [
  'ai.index',
  'ai.settings_manage',
  'ai.prompts',
  'ai.prompts_manage',
  'ai.usage',
  'ai.translate',
] as const

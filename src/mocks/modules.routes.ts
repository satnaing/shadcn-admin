import type { ModuleChange, ModuleItem, UploadResult } from '@/api/modules.types'
import type { Handler } from './helpers'
import { mockModules } from './modules.data'
import { availableUpdates, extraModules } from './modules.extra'

type Mutable = { id: string; enabled: boolean; required: boolean; version: string }

const all = (): ModuleItem[] => [
  ...mockModules.map((m) => ({
    id: m.id, name: m.name, description: m.description, version: m.version, icon: m.icon,
    required: m.required, enabled: m.enabled, requires: m.requires,
    installed: true, update_available: availableUpdates[m.id],
  })),
  ...extraModules.map((m) => ({ ...m, update_available: availableUpdates[m.id] })),
]

const find = (id: string): Mutable | undefined =>
  mockModules.find((m) => m.id === id) ?? extraModules.find((m) => m.id === id)

const setEnabled = (id: string, enabled: boolean) => {
  const target = find(id)
  if (target && !target.required) target.enabled = enabled
}

const remove = (id: string) => {
  for (const list of [mockModules, extraModules]) {
    const at = list.findIndex((m) => m.id === id && !m.required)
    if (at >= 0) list.splice(at, 1)
  }
}

const MAX_BYTES = 20 * 1024 * 1024

const upload: Handler = ({ body }) => {
  const file = body instanceof FormData ? body.get('file') : null
  const name = file instanceof File ? file.name : 'module.zip'
  const size = file instanceof File ? file.size : 0
  const id = name.replace(/\.zip$/i, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  const steps: UploadResult['steps'] = [
    { key: 'size', ok: size <= MAX_BYTES },
    { key: 'manifest', ok: !name.includes('broken') },
    { key: 'compatibility', ok: !name.includes('old') },
    { key: 'signature', ok: !name.includes('unsigned') },
  ]
  const installed = steps.every((s) => s.ok)
  if (installed && !find(id)) {
    extraModules.push({
      id, name: id, description: 'Uploaded module (installed disabled)', icon: 'Puzzle',
      required: false, enabled: false, requires: [], installed: true, version: '1.0.0',
    })
  }
  return { data: { installed, module_id: installed ? id : null, steps } satisfies UploadResult }
}

const routes: Record<string, Handler> = {
  'GET /admin/modules': () => ({ data: all() }),
  'POST /admin/modules/upload': upload,
  'POST /admin/modules/batch': ({ body }) => {
    const changes = (body as { changes?: ModuleChange[] } | undefined)?.changes ?? []
    for (const c of changes) setEnabled(c.id, c.enabled)
    return { message: 'saved' }
  },
  'PATCH /admin/modules/:id': ({ params, body }) => {
    const enabled = (body as { enabled?: boolean } | undefined)?.enabled
    const target = find(params[0])
    setEnabled(params[0], enabled ?? !target?.enabled)
    return { data: target ?? null }
  },
  'POST /admin/modules/:id/update': ({ params }) => {
    const target = find(params[0])
    if (target && availableUpdates[params[0]]) target.version = availableUpdates[params[0]]
    delete availableUpdates[params[0]]
    return { message: 'updated' }
  },
  'DELETE /admin/modules/:id': ({ params }) => {
    remove(params[0])
    return { message: 'deleted' }
  },
}

export default routes

import { useQuery } from '@tanstack/react-query'
import { modulesApi } from '@/api/modules.api'
import type { ModuleItem } from '@/api/modules.types'

/** Installed AND enabled? Unknown id (module not installed) → false. */
export const isModuleEnabled = (modules: Pick<ModuleItem, 'id' | 'enabled' | 'installed'>[], id: string) =>
  modules.some((m) => m.id === id && m.enabled && m.installed)

/**
 * `undefined` while loading, then true/false. Key starts with `MODULES`, so every module
 * toggle/delete (which invalidates that prefix) re-evaluates the guard immediately.
 */
export function useModuleEnabled(id: string): boolean | undefined {
  const { data } = useQuery({
    queryKey: ['MODULES', 'enabled'],
    queryFn: () => modulesApi.list(),
    staleTime: 30_000,
  })

  return data ? isModuleEnabled(data.data, id) : undefined
}

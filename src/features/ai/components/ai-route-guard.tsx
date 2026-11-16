import type { ReactNode } from 'react'
import { ModuleGuard, PageGuard } from '@/components/guard'

/** Every route of the module: module must be enabled, then the screen permission applies. */
export function AiRouteGuard({ permission, children }: { permission: string; children: ReactNode }) {
  return (
    <ModuleGuard module='ai'>
      <PageGuard permission={permission}>{children}</PageGuard>
    </ModuleGuard>
  )
}

import type { ReactNode } from 'react'
import { ModuleGuard, PageGuard } from '@/components/guard'

interface Props {
  permission: string
  children: ReactNode
}

/** Every route of the module: module must be enabled, then the screen permission applies. */
export function PreorderRouteGuard({ permission, children }: Props) {
  return (
    <ModuleGuard module='preorder'>
      <PageGuard permission={permission}>{children}</PageGuard>
    </ModuleGuard>
  )
}

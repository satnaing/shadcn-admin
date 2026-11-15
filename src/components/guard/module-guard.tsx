import type { ReactNode } from 'react'
import { useModuleEnabled } from '@/hooks/use-module-enabled'
import { NotFoundError } from '@/features/errors/not-found-error'

interface ModuleGuardProps {
  /** Module id from `module.json` (e.g. `qrcode-event`). */
  module: string
  children: ReactNode
}

/**
 * Route-level switch for module screens: a disabled / not installed module's URLs render 404
 * (its sidebar group is already gone). Wrap it around `PageGuard` in every module route.
 */
export function ModuleGuard({ module, children }: ModuleGuardProps) {
  const enabled = useModuleEnabled(module)

  if (enabled === undefined) {
    return <div className='flex h-full items-center justify-center' aria-busy='true' />
  }

  return enabled ? <>{children}</> : <NotFoundError />
}

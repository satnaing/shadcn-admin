import type { ReactNode } from 'react'
import { Main } from '@/components/layout/main'
import { AdminHeader } from './admin-header'

interface AdminPageShellProps {
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
}

export function AdminPageShell({
  title,
  description,
  actions,
  children,
}: AdminPageShellProps) {
  return (
    <>
      <AdminHeader />

      <Main fluid className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            <p className='text-muted-foreground'>{description}</p>
          </div>
          {actions}
        </div>
        {children}
      </Main>
    </>
  )
}

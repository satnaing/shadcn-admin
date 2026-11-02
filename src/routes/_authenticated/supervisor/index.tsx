import { createFileRoute } from '@tanstack/react-router'
import { AdminPageShell } from '@/components/admin/admin-page-shell'

export const Route = createFileRoute('/_authenticated/supervisor/')({
  component: () => (
    <AdminPageShell
      title='Supervisor Dashboard'
      description='Reseller and vendor management portal'
    >
      <div className='flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground'>
        Supervisor Dashboard (Faza C: 38-supervisor)
      </div>
    </AdminPageShell>
  ),
})

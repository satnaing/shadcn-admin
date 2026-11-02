import { createFileRoute } from '@tanstack/react-router'
import { AdminPageShell } from '@/components/admin/admin-page-shell'

export const Route = createFileRoute('/_authenticated/courier/')({
  component: () => (
    <AdminPageShell
      title='Courier Dashboard'
      description='Delivery management portal'
    >
      <div className='flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground'>
        Courier Dashboard (Faza C: 37-courier)
      </div>
    </AdminPageShell>
  ),
})

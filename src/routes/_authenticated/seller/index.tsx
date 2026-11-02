import { createFileRoute } from '@tanstack/react-router'
import { AdminPageShell } from '@/components/admin/admin-page-shell'

export const Route = createFileRoute('/_authenticated/seller/')({
  component: () => (
    <AdminPageShell
      title='Seller Dashboard'
      description='Vendor portal management'
    >
      <div className='flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground'>
        Seller Dashboard (Faza C: 30-vendor-foundation)
      </div>
    </AdminPageShell>
  ),
})

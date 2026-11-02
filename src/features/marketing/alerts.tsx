import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { AlertDialog } from './components/alert-dialog'
import { AlertsTable } from './components/alerts-table'
import type { CustomAlert } from './data/marketing.type'
import { useAlerts } from './hooks/useMarketing'
import { useMarketingMutations } from './hooks/useMarketingMutations'

export function AlertsPage() {
  const { data: alerts = [], isLoading } = useAlerts()
  const { saveAlert, deleteAlert } = useMarketingMutations()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<CustomAlert | null>(null)

  const handleEdit = (a: CustomAlert) => {
    setSelectedAlert(a)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedAlert(null)
    setDialogOpen(true)
  }

  return (
    <>
      <AdminHeader />
      <Main className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Xüsusi Sayt Bildirişləri</h1>
            <p className='text-sm text-muted-foreground'>
              Saytın üst və alt hissələrində xüsusi bildiriş zolaqları
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className='mr-2 h-4 w-4' /> Yeni Bildiriş
          </Button>
        </div>
        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <AlertsTable
            alerts={alerts}
            onEdit={handleEdit}
            onToggle={(a) => saveAlert.mutate({ id: a.id, status: !a.status })}
            onDelete={(id) => deleteAlert.mutate(id)}
          />
        )}

        <AlertDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={selectedAlert}
          onSubmit={(d) => saveAlert.mutate(d)}
        />
      </Main>
    </>
  )
}

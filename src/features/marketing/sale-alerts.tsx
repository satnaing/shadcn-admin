import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { SaleAlertDialog } from './components/sale-alert-dialog'
import { SaleAlertsTable } from './components/sale-alerts-table'
import type { SaleAlert } from './data/marketing.type'
import { useSaleAlerts } from './hooks/useMarketing'
import { useMarketingMutations } from './hooks/useMarketingMutations'

export function SaleAlertsPage() {
  const { data: alerts = [], isLoading } = useSaleAlerts()
  const { saveSaleAlert } = useMarketingMutations()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<SaleAlert | null>(null)

  const handleEdit = (a: SaleAlert) => {
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
            <h1 className='text-2xl font-bold tracking-tight'>Satış Xəbərdarlığı Pop-up</h1>
            <p className='text-sm text-muted-foreground'>
              Canlı alış-veriş bildirişləri ilə sosial təsdiq yaradın
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className='mr-2 h-4 w-4' /> Yeni Satış Bildirişi
          </Button>
        </div>
        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <SaleAlertsTable
            alerts={alerts}
            onEdit={handleEdit}
            onToggle={(a) => saveSaleAlert.mutate({ id: a.id, status: !a.status })}
            onDelete={() => {}}
          />
        )}

        <SaleAlertDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={selectedAlert}
          onSubmit={(d) => saveSaleAlert.mutate(d)}
        />
      </Main>
    </>
  )
}

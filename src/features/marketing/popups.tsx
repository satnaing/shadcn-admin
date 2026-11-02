import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { PopupDialog } from './components/popup-dialog'
import { PopupsTable } from './components/popups-table'
import type { DynamicPopup } from './data/marketing.type'
import { usePopups } from './hooks/useMarketing'
import { useMarketingMutations } from './hooks/useMarketingMutations'

export function PopupsPage() {
  const { data: popups = [], isLoading } = usePopups()
  const { savePopup, deletePopup } = useMarketingMutations()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPopup, setSelectedPopup] = useState<DynamicPopup | null>(null)

  const handleEdit = (p: DynamicPopup) => {
    setSelectedPopup(p)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedPopup(null)
    setDialogOpen(true)
  }

  return (
    <>
      <AdminHeader />
      <Main className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dinamik Pop-uplar</h1>
            <p className='text-sm text-muted-foreground'>
              Səhifə daxili xüsusi pəncərələr və təkliflər
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className='mr-2 h-4 w-4' /> Yeni Pop-up
          </Button>
        </div>
        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <PopupsTable
            popups={popups}
            onEdit={handleEdit}
            onToggle={(p) => savePopup.mutate({ id: p.id, status: !p.status })}
            onDelete={(id) => deletePopup.mutate(id)}
          />
        )}

        <PopupDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={selectedPopup}
          onSubmit={(d) => savePopup.mutate(d)}
        />
      </Main>
    </>
  )
}

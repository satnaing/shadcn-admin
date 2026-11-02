import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UnitDialog } from './components/unit-dialog'
import type { UnitFormData, UnitItem } from './data/units.type'
import { useUnitMutations, useUnits } from './hooks/useUnits'

export function UnitsPage() {
  const { t } = useTranslation('catalog')
  const { data: unitsData, isLoading } = useUnits()
  const units = unitsData?.data ?? []
  const { createUnit, updateUnit, deleteUnit } = useUnitMutations()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<UnitItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleOpenCreate = () => {
    setSelectedUnit(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (unit: UnitItem) => {
    setSelectedUnit(unit)
    setDialogOpen(true)
  }

  const handleSubmit = async (formData: UnitFormData) => {
    if (selectedUnit) {
      await updateUnit({ id: selectedUnit.id, data: formData })
    } else {
      await createUnit(formData)
    }
  }

  return (
    <AdminPageShell
      title={t('units.title')}
      description={t('units.description')}
      actions={
        <Button onClick={handleOpenCreate} className='gap-2'>
          <Plus className='h-4 w-4' />
          <span>{t('units.addNew')}</span>
        </Button>
      }
    >
      <div className='rounded-lg border bg-card shadow-xs'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16'>#</TableHead>
              <TableHead>{t('units.name')}</TableHead>
              <TableHead className='text-right'>{t('units.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className='h-32 text-center text-muted-foreground'>
                  Yüklənir...
                </TableCell>
              </TableRow>
            ) : units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='h-32 text-center text-muted-foreground'>
                  Ölçü vahidi tapılmadı.
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit, idx) => (
                <TableRow key={unit.id}>
                  <TableCell className='text-muted-foreground'>{idx + 1}</TableCell>
                  <TableCell className='font-medium'>{unit.name}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(unit)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:text-destructive'
                        onClick={() => setDeleteId(unit.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UnitDialog
        key={dialogOpen ? (selectedUnit?.id ?? 'create') : 'closed'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedUnit}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('deleteConfirm.title')}
        desc={t('deleteConfirm.description')}
        confirmText={t('deleteConfirm.confirm')}
        cancelBtnText={t('deleteConfirm.cancel')}
        handleConfirm={async () => {
          if (deleteId) {
            await deleteUnit(deleteId)
            setDeleteId(null)
          }
        }}
      />
    </AdminPageShell>
  )
}

export default UnitsPage
